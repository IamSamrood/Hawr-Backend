import Category from "../models/category.js";
import Product from "../models/product.js";

export const getCategories = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search parameter
        const searchQuery = req.query.search || '';

        // Building query
        const query = {};
        if (searchQuery) {
            query.name = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search
        }

        // Fetching categories with pagination and search
        const categories = await Category.find(query).skip(skip).limit(limit);
        const totalCategories = await Category.countDocuments(query);

        // Sending response
        res.status(200).json({
            categories,
            currentPage: page,
            total: totalCategories
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
export const getAllCategories = async (req, res) => {
    try {

        // Fetching categories with pagination and search
        const categories = await Category.find();

        // Sending response
        res.status(200).json({
            categories,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
export const addCategory = async (req, res) => {
    try {
        // Extract category details from request body
        const { category, image } = req.body;


        // Create new category
        const newCategory = new Category({
            category,
            image
        });

        // Save category to database
        await newCategory.save();

        // Send success response
        res.status(201).json({ message: 'Category created successfully', category: req.body });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { image, category } = req.body;

        // Find the category by ID
        let categoryExist = await Category.findById(categoryId);

        // Check if category exists
        if (!categoryExist) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update category fields
        categoryExist.category = category;
        categoryExist.image = image;

        // Save updated category to database
        await categoryExist.save();

        // Send success response
        res.status(200).json({ message: 'Category updated successfully', categoryExist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
export const getCategoriesByProduct = async (req, res) => {
    try {
        const categoriesWithCount = await Product.aggregate([
            // Group products by category
            { $group: { _id: '$category', count: { $sum: 1 } } },
            // Lookup category details based on category ID
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            // Unwind the category array
            { $unwind: '$category' },
            // Project to include only necessary fields
            { $project: { _id: '$category._id', name: '$category.category', count: 1 } },
        ]);

        res.status(200).json({ categories: categoriesWithCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
