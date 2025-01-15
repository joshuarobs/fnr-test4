import express, { Router } from 'express';
import loginRouter from './login';
import logoutRouter from './logout';

const router: Router = express.Router();

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
