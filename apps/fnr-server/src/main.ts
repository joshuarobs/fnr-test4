import express from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
try {
  dotenv.config();
  console.log('Environment variables loaded successfully');
  console.log('NODE_ENV:', process.env.NODE_ENV);
} catch (error) {
  console.error('Error loading environment variables:', error);
  console.log('Continuing with default environment settings');
  // Set default NODE_ENV if not set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    console.log('NODE_ENV defaulted to:', process.env.NODE_ENV);
  }
}

import * as fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import session from 'express-session';
import claimsRouter from './routes/claims/index';
import usersRouter from './routes/users/index';
import staffRouter from './routes/staff/index';
import suppliersRouter from './routes/suppliers/index';
import authRouter from './routes/auth/index';
import activitiesRouter from './routes/activities/index';
import passport from './config/passport';
import { requestLogger } from './middleware/logger';
import { SERVER_CONFIG, getServerBaseUrl } from './config';

export const app: express.Application = express();

// Middleware
// CORS configuration
app.use(
  cors({
    // In production, we're serving frontend from same origin
    origin:
      process.env.NODE_ENV === 'production'
        ? true // Allow same origin requests
        : ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests
// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// In production, serve the frontend build files
if (process.env.NODE_ENV === 'production') {
  // Define paths for frontend files
  const frontendPath = path.join(__dirname, './fnr-app');
  const assetsPath = path.join(__dirname, './fnr-app/assets');
  const indexPath = path.join(frontendPath, 'index.html');

  // Verify frontend directory structure
  try {
    // Create directories if they don't exist
    if (!fs.existsSync(frontendPath)) {
      fs.mkdirSync(frontendPath, { recursive: true });
    }
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath, { recursive: true });
    }
    console.log(`✅ Frontend directories created/verified`);

    // List frontend files for debugging
    const files = fs.readdirSync(frontendPath);
    console.log(`📂 Frontend directory contents: ${files.join(', ')}`);

    // Check index.html with detailed error
    if (!fs.existsSync(indexPath)) {
      throw new Error(
        `index.html not found at: ${indexPath}. Please ensure the frontend build was successful.`
      );
    }
    console.log(`✅ index.html found at: ${indexPath}`);

    // Check assets directory with contents
    const assetFiles = fs.readdirSync(assetsPath);
    console.log(`📂 Assets directory contents: ${assetFiles.join(', ')}`);
    if (assetFiles.length === 0) {
      console.warn('⚠️ Warning: Assets directory is empty');
    }

    // Log environment and paths
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      frontendPath,
      assetsPath,
      indexPath,
      currentDir: __dirname,
    });

    // Enhanced static middleware with better caching and compression
    const staticOptions = {
      maxAge: '1h',
      index: false,
      fallthrough: true,
      etag: true,
      lastModified: true,
    };

    const assetOptions = {
      ...staticOptions,
      maxAge: '7d',
      immutable: true,
    };

    // Serve static files with enhanced logging
    app.use('/', (req, res, next) => {
      const startTime = Date.now();
      console.log(`📝 Static request for: ${req.path}`);

      express.static(frontendPath, staticOptions)(req, res, (err) => {
        if (err) {
          console.error(`❌ Error serving static file: ${req.path}`, err);
          return next(err);
        }

        const duration = Date.now() - startTime;
        console.log(`✅ Served ${req.path} in ${duration}ms`);
        next();
      });
    });

    // Serve assets with dedicated error handling
    app.use('/assets', (req, res, next) => {
      const startTime = Date.now();
      console.log(`📝 Asset request for: ${req.path}`);

      express.static(assetsPath, assetOptions)(req, res, (err) => {
        if (err) {
          console.error(`❌ Error serving asset: ${req.path}`, err);
          return next(err);
        }

        const duration = Date.now() - startTime;
        console.log(`✅ Served asset ${req.path} in ${duration}ms`);
        next();
      });
    });

    // Enhanced error handling for static files
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err) {
          console.error(`❌ Static file error:`, {
            path: req.path,
            error: err.message,
            code: err.code,
            stack:
              process.env.NODE_ENV === 'development' ? err.stack : undefined,
          });

          if (err.code === 'ENOENT') {
            if (req.path.startsWith('/assets/')) {
              return res.status(404).json({
                error: 'Asset not found',
                path: req.path,
                message: 'The requested asset could not be found on the server',
              });
            }

            // For non-asset paths, try serving index.html for SPA routing
            console.log(`🔄 Serving index.html for path: ${req.path}`);
            return res.sendFile(indexPath, (sendErr) => {
              if (sendErr) {
                console.error(`❌ Error serving index.html:`, sendErr);
                return res.status(500).json({
                  error: 'Server Error',
                  message: 'Failed to serve the application',
                });
              }
            });
          }

          return res.status(500).json({
            error: 'Server Error',
            message:
              process.env.NODE_ENV === 'development'
                ? err.message
                : 'Internal server error',
          });
        }
        next();
      }
    );

    console.log(`🌐 Static file serving configured successfully`);
  } catch (error) {
    console.error(`❌ Critical error setting up frontend serving:`, error);
    throw error; // Stop server if frontend serving setup fails
  }
}

// Session and Passport setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // TODO: Move to environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
    name: 'fnr.sid', // Custom session cookie name
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Basic error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
);

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to fnr-server!',
    endpoints: {
      claims: '/api/claims',
      users: '/api/users',
      staff: '/api/staff',
      suppliers: '/api/suppliers',
    },
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/users', usersRouter);
app.use('/api/staff', staffRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/activities', activitiesRouter);

// Add catch-all route for client-side routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        method: req.method,
      });
    }

    // Serve index.html for all other routes
    const indexPath = path.join(__dirname, './fnr-app/index.html');

    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ index.html not found at: ${indexPath}`);
      return res.status(500).json({
        error: 'Frontend not properly deployed',
        details: 'index.html is missing',
      });
    }

    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`❌ Error serving index.html: ${err}`);
        next(err);
      } else {
        console.log(`📄 Served index.html for: ${req.path}`);
      }
    });
  });

  // Error handler for sendFile errors
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(`❌ Error serving file: ${err}`);
      res.status(500).json({
        error: 'Error serving frontend file',
        path: req.path,
        details:
          process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  );
}

const server = app.listen(SERVER_CONFIG.port, () => {
  console.log(`Listening at ${getServerBaseUrl()}/api`);
  console.log('Server is ready to accept requests');
});

server.on('error', console.error);
