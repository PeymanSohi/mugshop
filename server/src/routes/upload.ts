import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);
router.use(authorize('admin', 'staff'));

router.post('/image', uploadSingle, uploadImage);
router.post('/images', uploadMultiple, uploadMultipleImages);

export default router;