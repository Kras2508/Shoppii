import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getPaymentMethods,
  calculateOrderPreview
} from '../controllers/order.controller.js';
import { verifyToken, isCustomer, isShopOrAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/payment-methods', getPaymentMethods);

// Protected routes
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);

// Customer only
router.post('/preview', verifyToken, isCustomer, calculateOrderPreview);
router.post('/', verifyToken, isCustomer, createOrder);
router.put('/:id/cancel', verifyToken, isCustomer, cancelOrder);

// Shop or Admin
router.put('/:id/status', verifyToken, isShopOrAdmin, updateOrderStatus);

export default router;
