// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: '30d' } as jwt.SignOptions
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      userType,
      full_name,
      email, 
      phone, 
      password,
      confirm_password,
      supermarket_name,
      longitude, 
      latitude, 
      address,
      business_license,
      description,
      image_url
    } = req.body;

    if (!userType || !['customer', 'supermarket_owner'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user type is required (customer or supermarket_owner)'
      });
    }

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required'
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (userType === 'supermarket_owner') {
      if (!supermarket_name) {
        return res.status(400).json({
          success: false,
          message: 'Supermarket name is required for supermarket owners'
        });
      }

      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          message: 'Location coordinates are required for supermarket owners'
        });
      }
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number already registered'
      });
    }

    const userData: any = {
      userType,
      name: full_name,
      email,
      phone,
      password
    };

    if (userType === 'supermarket_owner') {
      userData.supermarketName = supermarket_name;
      userData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address
      };
      userData.image_url = image_url;
      userData.businessLicense = business_license;
      userData.description = description;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    const responseData: any = {
      id: user._id,
      userType: user.userType,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified
    };

    if (user.userType === 'supermarket_owner') {
      responseData.supermarketName = user.supermarketName;
      responseData.location = user.location;
      responseData.businessLicense = user.businessLicense;
      responseData.description = user.description;
      responseData.image_url = user.image_url;
    }

    res.status(201).json({
      success: true,
      message: `${userType === 'customer' ? 'Customer' : 'Supermarket owner'} registered successfully`,
      data: {
        user: responseData,
        token,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    const userData: any = {
      id: user._id,
      userType: user.userType,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified
    };

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
      userData.image_url = user.image_url;
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

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (user.userType === 'supermarket_owner') {
      const { supermarketName, longitude, latitude, address, description, image_url } = req.body;
      
      if (supermarketName) user.supermarketName = supermarketName;
      if (description) user.description = description;
      if (image_url) user.image_url = image_url;
      
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