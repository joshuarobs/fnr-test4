import express from 'express';
import passport from '../../config/passport';

const router: express.Router = express.Router();

router.post('/', (req, res, next) => {
  console.log('[Auth] Login attempt for email:', req.body.email);

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('[Auth] Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      console.log(
        '[Auth] Authentication failed:',
        info?.message || 'Invalid credentials'
      );
      return res
        .status(401)
        .json({ error: info?.message || 'Invalid credentials' });
    }

    console.log('[Auth] User authenticated successfully:', user.id);

    req.logIn(user, (err) => {
      if (err) {
        console.error('[Auth] Session creation error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('[Auth] Session created successfully');
      console.log('[Auth] Session ID:', req.sessionID);
      console.log('[Auth] Cookie Settings:', {
        secure: req.secure,
        sameSite: req.session?.cookie?.sameSite,
        domain: req.session?.cookie?.domain,
        path: req.session?.cookie?.path,
      });

      // Return success response with session cookie
      res.json({ success: true });
    });
  })(req, res, next);
});

export default router;
