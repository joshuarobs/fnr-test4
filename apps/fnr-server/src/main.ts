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
  const frontendPath = path.join(__dirname, './fnr-app');
  const indexPath = path.join(frontendPath, 'index.html');
  const assetsPath = path.join(frontendPath, 'assets');

  // Verify frontend directory exists
  if (!fs.existsSync(frontendPath)) {
    console.error(`❌ Frontend directory not found at: ${frontendPath}`);
    process.exit(1);
  }

  // Log frontend directory structure
  console.log('🌐 Serving frontend from:', frontendPath);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    frontendPath,
    indexPath,
    assetsPath,
    currentDir: __dirname,
  });

  // Serve assets with aggressive caching
  app.use(
    '/assets',
    express.static(assetsPath, {
      maxAge: '31536000000', // 1 year
      immutable: true,
      etag: true,
      lastModified: true,
    })
  );

  // Serve other static files with standard caching
  app.use(
    express.static(frontendPath, {
      maxAge: '7d',
      index: false, // Don't serve index.html automatically
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // No caching for HTML files
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );

  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }

    console.log(`📝 Static request for: ${req.path}`);

    // Serve index.html
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`❌ Error serving index.html for ${req.path}:`, err);
        res.status(500).send('Error loading application');
      } else {
        console.log(`📄 Served index.html for: ${req.path}`);
      }
    });
  });
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
