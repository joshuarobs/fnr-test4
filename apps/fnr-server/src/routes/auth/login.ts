import express from 'express';
import passport from '../../config/passport';

const router: express.Router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Return token (using user ID as token for now)
      res.json({
        token: user.id.toString(),
      });
    });
  })(req, res, next);
});

export default router;
