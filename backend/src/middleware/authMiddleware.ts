import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a more specific type if you have one
    }
  }
}

// Middleware to verify JWT token and admin role
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Safely check for token in cookies or Authorization header
  const authHeader = req.headers['authorization'];
  const token = req.cookies?.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided. Please log in first.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded;

    // Check for admin role
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};