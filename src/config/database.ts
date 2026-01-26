// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // ✅ استخدم MONGO_URI من environment variables
    const mongoURI = process.env.MONGO_URI;
    
    // ✅ تحقق إنو الـ URI موجود
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');

    // ✅ اتصل بدون options (Mongoose 6+ ما بتحتاج options)
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Handle reconnection
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Handle connection error
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

export default connectDB;