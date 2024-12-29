import express, { Router } from 'express';
import getRouter from './get';
import updateRouter from './update';

const router: Router = express.Router();

router.use('/', getRouter);
router.use('/', updateRouter);

export default router;
