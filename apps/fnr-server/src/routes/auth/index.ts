import express, { Router } from 'express';
import loginRouter from './login';
import logoutRouter from './logout';

const router: Router = express.Router();

// Add a root route handler for diagnostics
router.get('/', (req, res) => {
  res.json({ message: 'Auth endpoint is accessible' });
});

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
