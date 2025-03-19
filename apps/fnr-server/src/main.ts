/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
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
  // Serve static files from frontend build directory
  // Based on the deployment structure, main.js and fnr-app are at the same level in dist
  const frontendPath = path.join(__dirname, './fnr-app');
  const assetsPath = path.join(__dirname, './fnr-app/assets');

  // Check if frontend directory exists
  try {
    if (!fs.existsSync(frontendPath)) {
      console.error(`Frontend directory not found at: ${frontendPath}`);
    } else {
      console.log(`Frontend directory found at: ${frontendPath}`);

      // List files in the frontend directory to help with debugging
      const files = fs.readdirSync(frontendPath);
      console.log(`Frontend directory contents: ${files.join(', ')}`);

      // Check if assets directory exists
      if (fs.existsSync(assetsPath)) {
        console.log(`Assets directory found at: ${assetsPath}`);
        const assetFiles = fs.readdirSync(assetsPath);
        console.log(`Assets directory contents: ${assetFiles.join(', ')}`);
      } else {
        console.warn(`Assets directory not found at: ${assetsPath}`);
      }
    }
  } catch (error) {
    console.error(`Error checking frontend directories: ${error}`);
  }

  // Serve the main frontend files
  app.use(express.static(frontendPath));
  console.log(`Serving frontend from: ${frontendPath}`);

  // Add a specific route for assets with longer cache time
  app.use(
    '/assets',
    express.static(assetsPath, {
      maxAge: '7d', // Cache assets for 7 days
      fallthrough: false, // Return 404 if asset not found
    })
  );
  console.log(`Serving assets from: ${assetsPath}`);
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
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    // Serve index.html for all other routes
    res.sendFile(path.join(__dirname, './fnr-app/index.html'));
  });
}

const server = app.listen(SERVER_CONFIG.port, () => {
  console.log(`Listening at ${getServerBaseUrl()}/api`);
  console.log('Server is ready to accept requests');
});

server.on('error', console.error);
