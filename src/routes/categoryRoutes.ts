import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/',protect, getAllCategories);
router.get('/:id',protect, getCategoryById);
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;