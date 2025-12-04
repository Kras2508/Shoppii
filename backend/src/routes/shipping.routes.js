import { Router } from 'express';
import {
  getShippingMethods,
  getShippingById,
  createShipping,
  updateShipping,
  deleteShipping
} from '../controllers/shipping.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getShippingMethods);
router.get('/:id', getShippingById);

// Admin routes
router.post('/', verifyToken, isAdmin, createShipping);
router.put('/:id', verifyToken, isAdmin, updateShipping);
router.delete('/:id', verifyToken, isAdmin, deleteShipping);

export default router;
