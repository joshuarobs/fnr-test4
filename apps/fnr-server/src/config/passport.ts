import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from '../lib/prisma';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await prisma.baseUser.findUnique({
          where: { email },
          include: {
            staff: true,
          },
        });

        // Check if user exists and is active
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        if (user.isDeleted) {
          return done(null, false, { message: 'Account has been deleted' });
        }

        if (!user.isActive) {
          return done(null, false, { message: 'Account is inactive' });
        }

        // Check if password matches (trim to handle any whitespace)
        if (user.password.trim() !== password.trim()) {
          console.log('Password mismatch:', {
            provided: password,
            stored: user.password,
          });
          return done(null, false, { message: 'Invalid password' });
        }

        // Update last login time
        await prisma.baseUser.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.baseUser.findUnique({
      where: { id },
      include: {
        staff: true,
      },
    });

    if (!user || user.isDeleted || !user.isActive) {
      return done(null, false);
    }

    const { password: _, ...userWithoutPassword } = user;
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});

export default passport;
