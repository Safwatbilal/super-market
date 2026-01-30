import { Request, Response } from 'express';
import Products from '../models/products';
import Category from '../models/categories';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const { 
      name, 
      status, 
      category_id, 
      is_featured, 
      currency,
      min_price,
      max_price 
    } = req.query;

    const filter: any = {};

    // Filter by name (case-insensitive search)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by category
    if (category_id) {
      filter.category_id = category_id;
    }

    // Filter by featured products
    if (is_featured !== undefined) {
      filter.is_featured = is_featured === 'true';
    }

    // Filter by currency
    if (currency) {
      filter.currency = currency;
    }

    // Filter by price range
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) {
        filter.price.$gte = parseFloat(min_price as string);
      }
      if (max_price) {
        filter.price.$lte = parseFloat(max_price as string);
      }
    }

    const skip = (page - 1) * pageSize;

    const products = await Products.find(filter)
      .populate('category_id', 'name image_url')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      page,
      pageSize,
      totalPages,
      totalProducts,
      data: { products }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id)
      .populate('category_id', 'name image_url');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      category_id, 
      image_url, 
      weight, 
      currency, 
      price, 
      sizes,
      status,
      is_featured 
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: 'Currency is required'
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Validate pricing structure
    if (!sizes || sizes.length === 0) {
      // If no sizes, require basic price and weight
      if (!price || !weight) {
        return res.status(400).json({
          success: false,
          message: 'Price and weight are required when sizes are not provided'
        });
      }
    }

    const product = await Products.create({
      name,
      category_id,
      image_url,
      weight,
      currency,
      price,
      sizes,
      status: status || 'published',
      is_featured: is_featured || false
    });

    // Populate category before sending response
    await product.populate('category_id', 'name image_url');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      category_id, 
      image_url, 
      weight, 
      currency, 
      price, 
      sizes,
      status,
      is_featured 
    } = req.body;

    const product = await Products.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if new category exists
    if (category_id && category_id !== product.category_id.toString()) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      product.category_id = category_id;
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (image_url !== undefined) product.image_url = image_url;
    if (weight !== undefined) product.weight = weight;
    if (currency !== undefined) product.currency = currency;
    if (price !== undefined) product.price = price;
    if (sizes !== undefined) product.sizes = sizes;
    if (status !== undefined) product.status = status;
    if (is_featured !== undefined) product.is_featured = is_featured;

    await product.save();
    await product.populate('category_id', 'name image_url');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get featured products only
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const products = await Products.find({ 
      is_featured: true, 
      status: 'published' 
    })
      .populate('category_id', 'name image_url')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalProducts = await Products.countDocuments({ 
      is_featured: true, 
      status: 'published' 
    });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      page,
      pageSize,
      totalPages,
      totalProducts,
      data: { products }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    // Check if category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const products = await Products.find({ 
      category_id: categoryId,
      status: 'published'
    })
      .populate('category_id', 'name image_url')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalProducts = await Products.countDocuments({ 
      category_id: categoryId,
      status: 'published'
    });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      page,
      pageSize,
      totalPages,
      totalProducts,
      data: { products }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};