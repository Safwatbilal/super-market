// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );
};

// Generate Refresh Token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: '30d' } as jwt.SignOptions
  );
};

// Register Customer
export const registerCustomer = async (req: Request, res: Response) => {
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
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number already registered'
      });
    }

    // Create customer
    const user = await User.create({
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
  } catch (error: any) {
    console.error('Register Customer Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Register Supermarket Owner
export const registerSupermarketOwner = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      supermarketName, 
      longitude, 
      latitude, 
      address,
      businessLicense,
      description ,
      image_url,

    } = req.body;

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
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number already registered'
      });
    }

    // Create supermarket owner
    const user = await User.create({
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
  } catch (error: any) {
    console.error('Register Supermarket Owner Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Login (works for both user types)
export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    // Find user by email or phone
    const user = await User.findOne({
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
    const userData: any = {
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
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current user
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData: any = {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// Update password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    const user = await User.findById(req.user?.id).select('+password');
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, phone } = req.body;

    // Update common fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Update supermarket specific fields
    if (user.userType === 'supermarket_owner') {
      const { supermarketName, longitude, latitude, address, description } = req.body;
      
      if (supermarketName) user.supermarketName = supermarketName;
      if (description) user.description = description;
      
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh-secret'
    ) as { id: string };

    const newToken = generateToken(decoded.id);

    res.status(200).json({
      success: true,
      data: { token: newToken }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: error.message
    });
  }
};

// Get nearby supermarkets (for customers)
export const getNearbySupermarkets = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const supermarkets = await User.find({
      userType: 'supermarket_owner',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
          },
          $maxDistance: parseInt(maxDistance as string)
        }
      }
    }).select('-password');

    res.status(200).json({
      success: true,
      count: supermarkets.length,
      data: { supermarkets }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby supermarkets',
      error: error.message
    });
  }
};