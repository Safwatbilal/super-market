// src/routes/authRoutes.ts
import express from 'express';
import {
  registerCustomer,
  registerSupermarketOwner,
  login,
  getMe,
  updatePassword,
  updateProfile,
  refreshToken,
  getNearbySupermarkets
} from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Authentication Routes
router.post('/register/customer', registerCustomer);
router.post('/register/supermarket', registerSupermarketOwner);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected User Routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

// Supermarket Routes
router.get('/supermarkets/nearby', protect, getNearbySupermarkets);

// Admin Routes
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome Admin!'
  });
});

export default router;