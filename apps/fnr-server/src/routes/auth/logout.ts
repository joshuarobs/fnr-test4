import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', (req, res) => {
  // Destroy the session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
