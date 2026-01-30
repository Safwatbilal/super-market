"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // ✅ استخدم MONGO_URI من environment variables
        const mongoURI = process.env.MONGO_URI;
        // ✅ تحقق إنو الـ URI موجود
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        console.log('🔄 Connecting to MongoDB...');
        // ✅ اتصل بدون options (Mongoose 6+ ما بتحتاج options)
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
        console.log(`📦 Database: ${mongoose_1.default.connection.name}`);
        console.log(`🌐 Host: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};
// Handle disconnection
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});
// Handle reconnection
mongoose_1.default.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});
// Handle connection error
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error);
});
exports.default = connectDB;
//# sourceMappingURL=database.js.map