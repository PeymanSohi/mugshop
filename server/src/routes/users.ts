import express from 'express';
import { 
  getUsers, 
  getUser, 
  updateUser, 
  toggleUserStatus,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication and admin/staff role
router.use(authenticate);
router.use(authorize('admin', 'staff'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', validateUser, updateUser);
router.patch('/:id/toggle-status', authorize('admin'), toggleUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;