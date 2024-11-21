import express, { Router } from 'express';
import postRoutes from './post';
import deleteRoutes from './delete';

const router: Router = express.Router();

router.use(postRoutes);
router.use(deleteRoutes);

export default router;
