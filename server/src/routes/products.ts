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
import { auditLogger } from '../middleware/audit.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes with audit logging
router.post('/', authenticate, authorize('admin', 'staff'), auditLogger('CREATE', 'PRODUCT'), validateProduct, createProduct);
router.put('/:id', authenticate, authorize('admin', 'staff'), auditLogger('UPDATE', 'PRODUCT'), validateProduct, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), auditLogger('DELETE', 'PRODUCT'), deleteProduct);
router.patch('/:id/toggle-status', authenticate, authorize('admin', 'staff'), auditLogger('TOGGLE_STATUS', 'PRODUCT'), toggleProductStatus);

export default router;