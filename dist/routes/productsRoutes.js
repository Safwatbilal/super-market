"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productscontroller_1 = require("../controllers/productscontroller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes (يمكن الوصول لها بدون تسجيل دخول)
router.get('/featured', productscontroller_1.getFeaturedProducts);
router.get('/category/:categoryId', productscontroller_1.getProductsByCategory);
// Protected routes (تحتاج تسجيل دخول)
router.get('/', authMiddleware_1.protect, productscontroller_1.getAllProducts);
router.get('/:id', authMiddleware_1.protect, productscontroller_1.getProductById);
router.post('/', authMiddleware_1.protect, productscontroller_1.createProduct);
router.put('/:id', authMiddleware_1.protect, productscontroller_1.updateProduct);
router.delete('/:id', authMiddleware_1.protect, productscontroller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productsRoutes.js.map