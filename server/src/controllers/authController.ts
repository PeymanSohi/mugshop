import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';
import rateLimit from 'express-rate-limit';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'فرمت ایمیل نامعتبر است' });
    }

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      // Log failed attempt
      console.log(`Failed login attempt for email: ${email} from IP: ${clientIP}`);
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // Check if account is locked
    if (user.isLocked) {
      console.log(`Login attempt for locked account: ${user._id} from IP: ${clientIP}`);
      return res.status(423).json({ 
        message: 'حساب کاربری به دلیل تلاش‌های ناموفق قفل شده است. لطفاً بعداً تلاش کنید.' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      console.log(`Failed login attempt for user: ${user._id} from IP: ${clientIP}`);
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // Check if user has admin privileges
    if (!['admin', 'staff', 'readonly'].includes(user.role)) {
      console.log(`Unauthorized access attempt for user: ${user._id} with role: ${user.role} from IP: ${clientIP}`);
      return res.status(403).json({ message: 'دسترسی به پنل مدیریت ممنوع است' });
    }

    // Reset failed login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    user.lastLoginIP = clientIP;
    await user.save();

    // Generate JWT with shorter expiration for admin
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      sessionId: Date.now().toString() // Add session ID for tracking
    };
    const options: SignOptions = { 
      expiresIn: '4h', // Shorter token expiration for admin
      issuer: 'mugshop-admin',
      audience: 'mugshop-admin-panel'
    };
    const token = jwt.sign(payload, secret, options);

    // Log successful login
    console.log(`Successful admin login for user: ${user._id} (${user.email}) from IP: ${clientIP}`);

    res.json({
      message: 'ورود موفقیت‌آمیز',
      token,
      expiresIn: '4h',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ message: 'پروفایل با موفقیت به‌روزرسانی شد', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // Log logout event
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    console.log(`Admin logout for user: ${req.user?.id} from IP: ${clientIP}`);
    
    // In a production environment, you might want to blacklist the token
    // For now, we'll just return success as the client will discard the token
    res.json({ message: 'خروج موفقیت‌آمیز' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }

    // Generate new JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      sessionId: Date.now().toString()
    };
    const options: SignOptions = { 
      expiresIn: '4h',
      issuer: 'mugshop-admin',
      audience: 'mugshop-admin-panel'
    };
    const token = jwt.sign(payload, secret, options);

    res.json({
      message: 'توکن با موفقیت به‌روزرسانی شد',
      token,
      expiresIn: '4h'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};