import { Request, Response, NextFunction } from 'express';

// Extend Request type to include user information
declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
      staff?: {
        employeeId: string;
      };
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};
