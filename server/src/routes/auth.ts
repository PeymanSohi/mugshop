import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { message: 'تعداد تلاش‌های ورود بیش از حد مجاز. لطفاً ۱۵ دقیقه بعد تلاش کنید.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/login', loginLimiter, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;