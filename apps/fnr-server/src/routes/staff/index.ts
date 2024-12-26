import express, { Router } from 'express';
import getRouter from './get';

const router: Router = express.Router();

router.use('/', getRouter);

export default router;
