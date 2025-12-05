import { Router } from 'express';
import { getCustomerStatistics, getCustomerProfile } from '../controllers/customer.controller.js';
import { verifyToken, isCustomer } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected routes - Customer only
router.get('/profile', verifyToken, isCustomer, getCustomerProfile);
router.get('/statistics', verifyToken, isCustomer, getCustomerStatistics);

export default router;
