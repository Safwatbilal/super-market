import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory
} from '../controllers/productscontroller';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (يمكن الوصول لها بدون تسجيل دخول)
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);

// Protected routes (تحتاج تسجيل دخول)
router.get('/', protect, getAllProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;