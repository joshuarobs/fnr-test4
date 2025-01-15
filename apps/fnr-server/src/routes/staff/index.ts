import express, { Router } from 'express';
import getRouter from './get';
import updateRouter from './update';
import { isAuthenticated } from '../../middleware/auth';

const router: Router = express.Router();

router.use('/', isAuthenticated, getRouter);
router.use('/', isAuthenticated, updateRouter);

export default router;
