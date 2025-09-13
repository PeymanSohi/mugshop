import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';
import rateLimit from 'express-rate-limit';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, name, email, password, phone, country, dateOfBirth, gender } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Validate input
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: 'نام، نام خانوادگی، ایمیل، شماره تلفن و رمز عبور الزامی است' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'فرمت ایمیل نامعتبر است' });
    }

    // Phone validation - must be exactly 11 digits starting with 09
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'شماره تلفن باید ۱۱ رقم باشد و با ۰۹ شروع شود (مثال: ۰۹۱۲۰۳۱۸۱۲۰)' });
    }

    // Normalize phone number
    let normalizedPhone = phone.replace(/^\+98/, '0');
    if (!normalizedPhone.startsWith('0')) {
      normalizedPhone = '0' + normalizedPhone;
    }

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است' });
    }

    const existingUserByPhone = await User.findOne({ phone: normalizedPhone });
    if (existingUserByPhone) {
      return res.status(400).json({ message: 'کاربری با این شماره تلفن قبلاً ثبت‌نام کرده است' });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      name: name || `${firstName} ${lastName}`.trim(), // Use provided name or construct from firstName/lastName
      email,
      password,
      phone: normalizedPhone,
      country,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      role: 'customer', // Default role for registered users
      isActive: true
    });

    await user.save();

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      sessionId: Date.now().toString()
    };
    const options: SignOptions = { 
      expiresIn: '24h', // Longer token expiration for customers
      issuer: 'mugshop',
      audience: 'mugshop-app'
    };
    const token = jwt.sign(payload, secret, options);

    // Log successful registration
    console.log(`New user registered: ${user._id} (${user.email}) from IP: ${clientIP}`);

    res.status(201).json({
      message: 'ثبت‌نام موفقیت‌آمیز',
      token,
      expiresIn: '24h',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
        createdAt: user.createdAt,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { loginField, password } = req.body; // loginField can be email or phone
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Validate input
    if (!loginField || !password) {
      return res.status(400).json({ message: 'شماره تلفن/ایمیل و رمز عبور الزامی است' });
    }

    // Determine if loginField is email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+98|0)?9\d{9}$/; // Iranian phone number format
    
    let user;
    let loginType;
    
    if (emailRegex.test(loginField)) {
      // Login with email
      loginType = 'email';
      user = await User.findOne({ email: loginField, isActive: true });
    } else if (phoneRegex.test(loginField)) {
      // Login with phone number
      loginType = 'phone';
      // Normalize phone number (remove +98, add 0 if needed)
      let normalizedPhone = loginField.replace(/^\+98/, '0');
      if (!normalizedPhone.startsWith('0')) {
        normalizedPhone = '0' + normalizedPhone;
      }
      user = await User.findOne({ phone: normalizedPhone, isActive: true });
    } else {
      return res.status(400).json({ message: 'فرمت شماره تلفن یا ایمیل نامعتبر است' });
    }

    if (!user) {
      // Log failed attempt
      console.log(`Failed login attempt for ${loginType}: ${loginField} from IP: ${clientIP}`);
      return res.status(401).json({ message: 'شماره تلفن/ایمیل یا رمز عبور اشتباه است' });
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

    // Reset failed login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    user.lastLoginIP = clientIP;
    await user.save();

    // Generate JWT with appropriate expiration based on role
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      sessionId: Date.now().toString() // Add session ID for tracking
    };
    const options: SignOptions = { 
      expiresIn: user.role === 'customer' ? '24h' : '4h', // Longer token for customers
      issuer: user.role === 'customer' ? 'mugshop' : 'mugshop-admin',
      audience: user.role === 'customer' ? 'mugshop-app' : 'mugshop-admin-panel'
    };
    const token = jwt.sign(payload, secret, options);

    // Log successful login
    console.log(`Successful login for user: ${user._id} (${user.email}) with role: ${user.role} from IP: ${clientIP}`);

    res.json({
      message: 'ورود موفقیت‌آمیز',
      token,
      expiresIn: user.role === 'customer' ? '24h' : '4h',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        addresses: user.addresses
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
    const { firstName, lastName, phone, country, dateOfBirth, gender } = req.body;
    
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (country !== undefined) updateData.country = country;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    if (gender !== undefined) updateData.gender = gender;
    
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ message: 'پروفایل با موفقیت به‌روزرسانی شد', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی پروفایل' });
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