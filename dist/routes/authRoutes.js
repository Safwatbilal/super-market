"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/refresh-token', authController_1.refreshToken);
router.get('/me', authMiddleware_1.protect, authController_1.getMe);
router.put('/update-password', authMiddleware_1.protect, authController_1.updatePassword);
router.put('/update-profile', authMiddleware_1.protect, authController_1.updateProfile);
router.get('/supermarkets/nearby', authMiddleware_1.protect, authController_1.getNearbySupermarkets);
router.get('/admin-only', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome Admin!'
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map