import mongoose, { Document, Schema } from 'mongoose';

export interface ISize {
  name: string; // مثال: Small, Medium, Large
  weight: number; // الوزن بالكيلو
  price: number; // السعر
}

export interface IProduct extends Document {
  name: string;
  category_id: mongoose.Types.ObjectId;
  image_url?: string;
  weight?: number; // الوزن الأساسي (إذا لم يكن هناك أحجام متعددة)
  currency: 'USD' | 'SAR' | 'SYP'; // دولار، ريال سعودي، ليرة سورية
  price?: number; // السعر الأساسي (إذا لم يكن هناك أحجام متعددة)
  sizes?: ISize[]; // الأحجام المتعددة مع أسعارها
  status: 'published' | 'unpublished';
  is_featured: boolean; // منتج مميز
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema = new Schema<ISize>(
  {
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
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters']
    },
    category_id: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true
  }
);

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
  } else {
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

export default mongoose.model<IProduct>('Product', productSchema);