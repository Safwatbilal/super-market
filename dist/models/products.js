"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const sizeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Size name is required'],
        trim: true
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required for size'],
        min: [0, 'Weight must be positive']
    },
    price: {
        type: Number,
        required: [true, 'Price is required for size'],
        min: [0, 'Price must be positive']
    }
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    image_url: {
        type: String,
        trim: true
    },
    weight: {
        type: Number,
        min: [0, 'Weight must be positive']
    },
    currency: {
        type: String,
        enum: {
            values: ['USD', 'SAR', 'SYP'],
            message: 'Currency must be USD, SAR, or SYP'
        },
        required: [true, 'Currency is required']
    },
    price: {
        type: Number,
        min: [0, 'Price must be positive']
    },
    sizes: {
        type: [sizeSchema],
        default: undefined
    },
    status: {
        type: String,
        enum: {
            values: ['published', 'unpublished'],
            message: 'Status must be published or unpublished'
        },
        default: 'published'
    },
    is_featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Validation: يجب أن يكون هناك إما سعر أساسي أو أحجام متعددة
productSchema.pre('validate', function (next) {
    if (!this.sizes || this.sizes.length === 0) {
        // إذا لم يكن هناك أحجام، يجب توفير السعر والوزن الأساسي
        if (this.price === undefined || this.price === null) {
            return next(new Error('Price is required when sizes are not provided'));
        }
        if (this.weight === undefined || this.weight === null) {
            return next(new Error('Weight is required when sizes are not provided'));
        }
    }
    else {
        // إذا كان هناك أحجام، يمكن تجاهل السعر والوزن الأساسي
        // التحقق من أن كل حجم لديه سعر ووزن
        for (const size of this.sizes) {
            if (!size.name || !size.weight || !size.price) {
                return next(new Error('Each size must have name, weight, and price'));
            }
        }
    }
    next();
});
// Index للبحث والفلترة
productSchema.index({ name: 'text' });
productSchema.index({ category_id: 1 });
productSchema.index({ status: 1 });
productSchema.index({ is_featured: 1 });
productSchema.index({ currency: 1 });
exports.default = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=products.js.map