import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!token) {
      console.log(`Unauthorized access attempt - no token from IP: ${clientIP}`);
      return res.status(401).json({ message: 'دسترسی غیرمجاز - توکن یافت نشد' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret, {
      issuer: 'mugshop-admin',
      audience: 'mugshop-admin-panel'
    }) as any;
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      console.log(`Unauthorized access attempt - user not found or inactive: ${decoded.id} from IP: ${clientIP}`);
      return res.status(401).json({ message: 'دسترسی غیرمجاز - کاربر یافت نشد' });
    }

    // Check if account is locked
    if (user.isLocked) {
      console.log(`Unauthorized access attempt - account locked: ${user._id} from IP: ${clientIP}`);
      return res.status(423).json({ message: 'حساب کاربری قفل شده است' });
    }

    // Verify session ID for additional security
    if (decoded.sessionId && user.lastLogin) {
      const tokenAge = Date.now() - parseInt(decoded.sessionId);
      const maxAge = 4 * 60 * 60 * 1000; // 4 hours
      if (tokenAge > maxAge) {
        console.log(`Unauthorized access attempt - token too old: ${user._id} from IP: ${clientIP}`);
        return res.status(401).json({ message: 'دسترسی غیرمجاز - توکن منقضی شده است' });
      }
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    console.log(`Unauthorized access attempt - invalid token from IP: ${clientIP}`, error);
    res.status(401).json({ message: 'دسترسی غیرمجاز - توکن نامعتبر' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'دسترسی ممنوع - سطح دسترسی کافی نیست' });
    }

    next();
  };
};