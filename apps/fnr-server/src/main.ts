/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';
import itemsRouter from './routes/items';
import { requestLogger } from './middleware/logger';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
      items: '/api/items',
    },
  });
});

// Routes
app.use('/api/items', itemsRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log('Server is ready to accept requests');
});

server.on('error', console.error);
