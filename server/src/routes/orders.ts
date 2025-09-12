import express from 'express';
import { 
  getOrders, 
  getOrder, 
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(authorize('admin', 'staff', 'readonly'));

router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id/status', authorize('admin', 'staff'), validateOrder, updateOrderStatus);

export default router;