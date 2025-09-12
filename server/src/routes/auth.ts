import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getProfile, updateProfile, logout, refreshToken } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { auditLogger, getAuditLogs, clearAuditLogs } from '../middleware/audit.js';

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
router.post('/logout', authenticate, auditLogger('LOGOUT', 'AUTH'), logout);
router.post('/refresh', authenticate, auditLogger('REFRESH_TOKEN', 'AUTH'), refreshToken);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, auditLogger('UPDATE_PROFILE', 'USER'), updateProfile);

// Audit logging endpoints (admin only)
router.get('/audit', authenticate, authorize('admin'), getAuditLogs);
router.delete('/audit', authenticate, authorize('admin'), clearAuditLogs);

export default router;