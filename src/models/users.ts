// src/models/users.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
//
export interface IUser extends Document {
  userType: 'customer' | 'supermarket_owner';
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  
  // Supermarket owner specific fields
  supermarketName?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  businessLicense?: string;
  description?: string;
  image_url?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    userType: {
      type: String,
      enum: ['customer', 'supermarket_owner'],
      required: [true, 'User type is required'],
      default: 'customer'
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    image_url: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Supermarket owner specific fields
    supermarketName: {
      type: String,
      required: function(this: IUser) {
        return this.userType === 'supermarket_owner';
      },
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: function(this: IUser) {
          return this.userType === 'supermarket_owner';
        }
      },
      coordinates: {
        type: [Number],
        required: function(this: IUser) {
          return this.userType === 'supermarket_owner';
        }
      },
      address: {
        type: String,
        trim: true
      }
    },
    businessLicense: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export default mongoose.model<IUser>('User', userSchema);