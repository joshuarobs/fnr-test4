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
// In production, serve the frontend application
if (process.env.NODE_ENV === 'production') {
  console.log('🌐 Setting up production routes');

  const frontendPath = path.join(__dirname, '../fnr-app');
  console.log(`📂 Frontend path: ${frontendPath}`);

  // Serve static files with caching
  app.use(
    express.static(frontendPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true,
    })
  );

  // Serve index.html for all non-API routes to support client-side routing
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }

    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at ${indexPath}`);
      next(new Error('Frontend index.html not found'));
    }
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

// Handle API 404s
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Simple error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
  }
);

// Enhanced server startup
const server = app.listen(SERVER_CONFIG.port, () => {
  const serverUrl = getServerBaseUrl();
  console.log('🚀 Server startup complete');
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: SERVER_CONFIG.port,
    BASE_URL: serverUrl,
    CURRENT_DIR: __dirname,
  });
  console.log(`📡 API endpoint: ${serverUrl}/api`);
  console.log(`🌐 Frontend endpoint: ${serverUrl}/`);
  console.log('✅ Server is ready to accept requests');
});

// Enhanced error handling
server.on('error', (error: Error) => {
  console.error('❌ Server error:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1); // Exit on critical errors
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM signal');
  server.close(() => {
    console.log('👋 Server shutdown complete');
    process.exit(0);
  });
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught exception:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
