import { Router } from 'express';
import {
  getShops,
  getShopById,
  getShopDashboard,
  updateShopProfile,
  getShopRevenueReport
} from '../controllers/shop.controller.js';
import { verifyToken, isShop } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getShops);
router.get('/:id', getShopById);

// Shop owner routes (protected)
router.get('/my/dashboard', verifyToken, isShop, getShopDashboard);
router.put('/my/profile', verifyToken, isShop, updateShopProfile);
router.get('/my/revenue-report', verifyToken, isShop, getShopRevenueReport);

export default router;
