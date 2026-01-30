"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace-db';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
        console.log(`📦 Database: ${mongoose_1.default.connection.name}`);
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