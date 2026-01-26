"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearbySupermarkets = exports.refreshToken = exports.updateProfile = exports.updatePassword = exports.getMe = exports.login = exports.registerSupermarketOwner = exports.registerCustomer = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
// Generate JWT Token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRE || '7d' });
};
// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '30d' });
};
// Register Customer
const registerCustomer = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Check if user exists
        const existingUser = await users_1.default.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number already registered'
            });
        }
        // Create customer
        const user = await users_1.default.create({
            userType: 'customer',
            name,
            email,
            phone,
            password
        });
        const token = generateToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            data: {
                user: {
                    id: user._id,
                    userType: user.userType,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    isVerified: user.isVerified
                },
                token,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Register Customer Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};
exports.registerCustomer = registerCustomer;
// Register Supermarket Owner
const registerSupermarketOwner = async (req, res) => {
    try {
        const { name, email, phone, password, supermarketName, longitude, latitude, address, businessLicense, description, image_url, } = req.body;
        // Validate required fields
        if (!name || !email || !phone || !password || !supermarketName) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone, password, and supermarket name are required'
            });
        }
        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates (longitude and latitude) are required'
            });
        }
        // Check if user exists
        const existingUser = await users_1.default.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number already registered'
            });
        }
        // Create supermarket owner
        const user = await users_1.default.create({
            userType: 'supermarket_owner',
            name,
            email,
            phone,
            password,
            supermarketName,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                address
            },
            image_url,
            businessLicense,
            description
        });
        const token = generateToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Supermarket owner registered successfully',
            data: {
                user: {
                    id: user._id,
                    userType: user.userType,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    supermarketName: user.supermarketName,
                    location: user.location,
                    businessLicense: user.businessLicense,
                    description: user.description,
                    role: user.role,
                    isVerified: user.isVerified,
                    image_url: user.image_url,
                },
                token,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Register Supermarket Owner Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};
exports.registerSupermarketOwner = registerSupermarketOwner;
// Login (works for both user types)
const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/phone and password are required'
            });
        }
        // Find user by email or phone
        const user = await users_1.default.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }
        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const token = generateToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        // Prepare user data based on user type
        const userData = {
            id: user._id,
            userType: user.userType,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified
        };
        // Add supermarket specific data if applicable
        if (user.userType === 'supermarket_owner') {
            userData.supermarketName = user.supermarketName;
            userData.location = user.location;
            userData.businessLicense = user.businessLicense;
            userData.description = user.description;
            userData.image_url = user.image_url;
        }
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
                token,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};
exports.login = login;
// Get current user
const getMe = async (req, res) => {
    try {
        const user = await users_1.default.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const userData = {
            id: user._id,
            userType: user.userType,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive
        };
        if (user.userType === 'supermarket_owner') {
            userData.supermarketName = user.supermarketName;
            userData.location = user.location;
            userData.businessLicense = user.businessLicense;
            userData.description = user.description;
        }
        res.status(200).json({
            success: true,
            data: { user: userData }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};
exports.getMe = getMe;
// Update password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required'
            });
        }
        const user = await users_1.default.findById(req.user?.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};
exports.updatePassword = updatePassword;
// Update profile
const updateProfile = async (req, res) => {
    try {
        const user = await users_1.default.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const { name, phone } = req.body;
        // Update common fields
        if (name)
            user.name = name;
        if (phone)
            user.phone = phone;
        // Update supermarket specific fields
        if (user.userType === 'supermarket_owner') {
            const { supermarketName, longitude, latitude, address, description } = req.body;
            if (supermarketName)
                user.supermarketName = supermarketName;
            if (description)
                user.description = description;
            if (longitude && latitude) {
                user.location = {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    address: address || user.location?.address
                };
            }
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
        const newToken = generateToken(decoded.id);
        res.status(200).json({
            success: true,
            data: { token: newToken }
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
            error: error.message
        });
    }
};
exports.refreshToken = refreshToken;
// Get nearby supermarkets (for customers)
const getNearbySupermarkets = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query;
        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Longitude and latitude are required'
            });
        }
        const supermarkets = await users_1.default.find({
            userType: 'supermarket_owner',
            isActive: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).select('-password');
        res.status(200).json({
            success: true,
            count: supermarkets.length,
            data: { supermarkets }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nearby supermarkets',
            error: error.message
        });
    }
};
exports.getNearbySupermarkets = getNearbySupermarkets;
//# sourceMappingURL=authController.js.map