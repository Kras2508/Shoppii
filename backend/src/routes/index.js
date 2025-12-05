import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import shopRoutes from './shop.routes.js';
import categoryRoutes from './category.routes.js';
import shippingRoutes from './shipping.routes.js';
import voucherRoutes from './voucher.routes.js';
import adminRoutes from './admin.routes.js';
import customerRoutes from './customer.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/shops', shopRoutes);
router.use('/categories', categoryRoutes);
router.use('/shipping', shippingRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Shoppii API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
