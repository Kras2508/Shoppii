import { Router } from 'express';
import {
  getVouchers,
  getVoucherById,
  applyVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from '../controllers/voucher.controller.js';
import { verifyToken, isAdmin, isCustomer } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getVouchers);
router.get('/:id', getVoucherById);

// Customer route
router.post('/apply', verifyToken, isCustomer, applyVoucher);

// Admin routes
router.post('/', verifyToken, isAdmin, createVoucher);
router.put('/:id', verifyToken, isAdmin, updateVoucher);
router.delete('/:id', verifyToken, isAdmin, deleteVoucher);

export default router;
