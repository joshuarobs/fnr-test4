import express, { Router } from 'express';
import deleteRoutes from './delete';

const router: Router = express.Router();

router.use(deleteRoutes);

export default router;
