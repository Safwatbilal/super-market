// src/routes/authRoutes.ts
import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  updateProfile,
  refreshToken,
  getNearbySupermarkets
} from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

router.get('/supermarkets/nearby', protect, getNearbySupermarkets);

router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome Admin!'
  });
});

export default router;