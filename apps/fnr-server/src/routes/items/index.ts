import express, { Router } from 'express';
import postRoutes from './post';
import patchRoutes from './patch';
import deleteRoutes from './delete';

const router: Router = express.Router();

router.use(postRoutes);
router.use(patchRoutes);
router.use(deleteRoutes);

export default router;
