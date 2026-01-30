// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace-db';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
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