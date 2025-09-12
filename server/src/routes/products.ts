import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleProductStatus
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', authenticate, authorize('admin', 'staff'), validateProduct, createProduct);
router.put('/:id', authenticate, authorize('admin', 'staff'), validateProduct, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
router.patch('/:id/toggle-status', authenticate, authorize('admin', 'staff'), toggleProductStatus);

export default router;