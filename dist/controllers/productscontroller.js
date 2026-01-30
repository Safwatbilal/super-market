"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategory = exports.getFeaturedProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const products_1 = __importDefault(require("../models/products"));
const categories_1 = __importDefault(require("../models/categories"));
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { name, status, category_id, is_featured, currency, min_price, max_price } = req.query;
        const filter = {};
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
                filter.price.$gte = parseFloat(min_price);
            }
            if (max_price) {
                filter.price.$lte = parseFloat(max_price);
            }
        }
        const skip = (page - 1) * pageSize;
        const products = await products_1.default.find(filter)
            .populate('category_id', 'name image_url')
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });
        const totalProducts = await products_1.default.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await products_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, category_id, image_url, weight, currency, price, sizes, status, is_featured } = req.body;
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
        const categoryExists = await categories_1.default.findById(category_id);
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
        const product = await products_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { name, category_id, image_url, weight, currency, price, sizes, status, is_featured } = req.body;
        const product = await products_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        // Check if new category exists
        if (category_id && category_id !== product.category_id.toString()) {
            const categoryExists = await categories_1.default.findById(category_id);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            product.category_id = category_id;
        }
        // Update fields
        if (name !== undefined)
            product.name = name;
        if (image_url !== undefined)
            product.image_url = image_url;
        if (weight !== undefined)
            product.weight = weight;
        if (currency !== undefined)
            product.currency = currency;
        if (price !== undefined)
            product.price = price;
        if (sizes !== undefined)
            product.sizes = sizes;
        if (status !== undefined)
            product.status = status;
        if (is_featured !== undefined)
            product.is_featured = is_featured;
        await product.save();
        await product.populate('category_id', 'name image_url');
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await products_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};
exports.deleteProduct = deleteProduct;
// Get featured products only
const getFeaturedProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const products = await products_1.default.find({
            is_featured: true,
            status: 'published'
        })
            .populate('category_id', 'name image_url')
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });
        const totalProducts = await products_1.default.countDocuments({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        // Check if category exists
        const categoryExists = await categories_1.default.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const products = await products_1.default.find({
            category_id: categoryId,
            status: 'published'
        })
            .populate('category_id', 'name image_url')
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });
        const totalProducts = await products_1.default.countDocuments({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};
exports.getProductsByCategory = getProductsByCategory;
//# sourceMappingURL=productscontroller.js.map