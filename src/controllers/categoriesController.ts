import { Request, Response } from 'express';
import Category from '../models/categories';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const { name, status } = req.query;

    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    const skip = (page - 1) * pageSize;

    const categories = await Category.find(filter)
      .skip(skip)
      .limit(pageSize);

    const totalCategories = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalCategories / pageSize);

    res.status(200).json({
      success: true,
      count: categories.length,
      page,
      pageSize,
      totalPages,
      totalCategories,
      data: { categories }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { category }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, image_url, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      image_url,
      status: status !== undefined ? status : true
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, image_url, status } = req.body;

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
      category.name = name;
    }

    if (image_url !== undefined) category.image_url = image_url;
    if (status !== undefined) category.status = status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};