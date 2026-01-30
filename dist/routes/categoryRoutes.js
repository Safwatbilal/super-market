"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoriesController_1 = require("../controllers/categoriesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protect, categoriesController_1.getAllCategories);
router.get('/:id', authMiddleware_1.protect, categoriesController_1.getCategoryById);
router.post('/', authMiddleware_1.protect, categoriesController_1.createCategory);
router.put('/:id', authMiddleware_1.protect, categoriesController_1.updateCategory);
router.delete('/:id', authMiddleware_1.protect, categoriesController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map