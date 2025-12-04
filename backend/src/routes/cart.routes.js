import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import { verifyToken, isCustomer } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and Customer role
router.use(verifyToken, isCustomer);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;
