import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getAllShops,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  deleteProduct,
  getAllReviews,
  deleteReview,
  getDashboardStats
} from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require Admin authentication
router.use(verifyToken, isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', toggleUserStatus);

// Shops management
router.get('/shops', getAllShops);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products management
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

// Reviews management
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
