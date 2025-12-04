import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upsertVariant,
  deleteVariant,
  getShopProducts,
  getProductStatistics
} from '../controllers/product.controller.js';
import { verifyToken, isShop } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/statistics', getProductStatistics); // Uses sp_get_product_statistics
router.get('/:id', getProductById);

// Shop routes (protected)
router.get('/shop/my-products', verifyToken, isShop, getShopProducts);
router.post('/', verifyToken, isShop, createProduct);
router.put('/:id', verifyToken, isShop, updateProduct);
router.delete('/:id', verifyToken, isShop, deleteProduct);

// Variant routes (protected - Shop only)
router.post('/:id/variants', verifyToken, isShop, upsertVariant);
router.put('/:id/variants', verifyToken, isShop, upsertVariant);
router.delete('/:id/variants/:variantId', verifyToken, isShop, deleteVariant);

export default router;
