import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getShopReviews
} from '../controllers/review.controller.js';
import { verifyToken, isCustomer, isShop } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getReviews);

// Customer routes
router.get('/my-reviews', verifyToken, isCustomer, getMyReviews);
router.post('/', verifyToken, isCustomer, createReview);
router.put('/:id', verifyToken, isCustomer, updateReview);
router.delete('/:id', verifyToken, deleteReview); // Customer or Admin

// Shop routes
router.get('/shop/reviews', verifyToken, isShop, getShopReviews);

export default router;
