import express, { Router } from 'express';
import getRoutes from './get';
import postRoutes from './post';
import deleteRoutes from './delete';

const router: Router = express.Router();

// Combine all routes
router.use(getRoutes);
router.use(postRoutes);
router.use(deleteRoutes);

export default router;
