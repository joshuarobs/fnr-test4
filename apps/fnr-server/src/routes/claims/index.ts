import express, { Router } from 'express';
import getRoutes from './get';
import postRoutes from './post';
import deleteRoutes from './delete';
import patchRoutes from './patch';

const router: Router = express.Router();

// Combine all routes
router.use(getRoutes);
router.use(postRoutes);
router.use(deleteRoutes);
router.use(patchRoutes);

export default router;
