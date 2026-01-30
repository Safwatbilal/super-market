"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categories_1 = __importDefault(require("../models/categories"));
const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { name, status } = req.query;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (status !== undefined) {
            filter.status = status === 'true';
        }
        const skip = (page - 1) * pageSize;
        const categories = await categories_1.default.find(filter)
            .skip(skip)
            .limit(pageSize);
        const totalCategories = await categories_1.default.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await categories_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, image_url, status } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }
        const existingCategory = await categories_1.default.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }
        const category = await categories_1.default.create({
            name,
            image_url,
            status: status !== undefined ? status : true
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { name, image_url, status } = req.body;
        const category = await categories_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        if (name && name !== category.name) {
            const existingCategory = await categories_1.default.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
            category.name = name;
        }
        if (image_url !== undefined)
            category.image_url = image_url;
        if (status !== undefined)
            category.status = status;
        await category.save();
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { category }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await categories_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoriesController.js.map