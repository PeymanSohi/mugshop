import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز - توکن یافت نشد' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز - کاربر یافت نشد' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
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