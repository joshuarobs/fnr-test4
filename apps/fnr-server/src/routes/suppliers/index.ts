import express, { Router } from 'express';
import getRoutes from './get';

const router: Router = express.Router();

// Combine all routes
router.use(getRoutes);

export default router;
