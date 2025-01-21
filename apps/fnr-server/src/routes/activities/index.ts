import express, { Router } from 'express';
import getRoutes from './get';

const router: Router = express.Router();

// Apply routes
router.use(getRoutes);

export default router;
