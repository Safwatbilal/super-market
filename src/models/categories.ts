import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image_url?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    image_url: {
      type: String,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICategory>('Category', categorySchema);