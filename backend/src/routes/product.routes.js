import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/statistics', getProductStatistics); // Uses sp_get_product_statistics
router.get('/:id', getProductById);

// Upload route
router.post('/upload', verifyToken, isShop, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: { url: imageUrl, filename: req.file.filename }
  });
});

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
