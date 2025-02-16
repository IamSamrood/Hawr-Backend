import Product from "../models/product.js";
import mongoose from 'mongoose';

export const addProduct = async (req, res) => {
    try {
        const { name, price, description, images, duration, schedule, topicsCovered, ageGroup } = req.body;
        const newProductData = { name, price, description, images, duration, schedule, topicsCovered, ageGroup };

        const newProduct = new Product(newProductData);
        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getProducts = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        console.log("🚀 ~ getProducts ~ page:", page)
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search parameter
        const searchQuery = req.body.search || '';

        // Category filter
        const categories = req.body.category || [];

        // Size filter
        const sizes = req.body.size || [];

        // Price range filter
        const minPrice = parseFloat(req.body.price?.[0]) || 0;
        const maxPrice = parseFloat(req.body.price?.[1]) || Number.MAX_SAFE_INTEGER;

        // Sorting
        let sort = { 'product.name': 1 }; // Default sort by name
        const sortBy = req.body.sortBy || '';

        if (sortBy === 'priceLowToHigh') {
            sort = { 'product.sizes.price': 1, 'product.name': 1 };
        } else if (sortBy === 'priceHighToLow') {
            sort = { 'product.sizes.price': -1, 'product.name': 1 };
        }

        // Building initial match query
        const query = {};

        if (searchQuery) {
            query.name = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search
        }

        let availQuery = {}

        // Check availability and adjust query accordingly
        if (req.body.availability && req.body.availability.length === 1) {
            const availability = req.body.availability[0];
            if (availability.toLowerCase() === 'available') {
                availQuery['quantitySum'] = { $gt: 0 }; // Filter based on sum of quantities
            } else if (availability.toLowerCase() === 'unavailable') {
                availQuery['quantitySum'] = { $eq: 0 }; // Filter based on sum of quantities
            }
        }

        // Aggregate pipeline for summing quantities in sizes array
        console.log("🚀 ~ getProducts ~ query:", query)
        const aggregatePipeline = [
            { $match: query },
            
            {
                $group: {
                    _id: "$_id",
                    product: { $first: "$$ROOT" }, // Include all fields from the product document
                }
            },
            { $match: availQuery }, // Filter based on sum of quantities
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "categories", // Name of the category collection 
                    localField: "product.category", // Field in the current collection 
                    foreignField: "_id", // Field in the category collection
                    as: "product.category" // Name for the joined field 
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$product"]
                    }
                }
            }
        ];

        // Aggregate pipeline for summing quantities in sizes array
        const aggregatePipelineCount = [
            { $match: query },
            {
                $group: {
                    _id: "$_id",
                    product: { $first: "$$ROOT" }, // Include all fields from the product document
                }
            },
            { $match: availQuery }, // Filter based on sum of quantities
            { $sort: sort },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$product"]
                    }
                }
            }
        ];

        // Fetching products with pagination, search, and filters using aggregation
        const products = await Product.aggregate(aggregatePipeline);
        const productsCount = await Product.aggregate(aggregatePipelineCount);

        // Sending response
        res.status(200).json({
            products: products,
            currentPage: page,
            total: productsCount.length // Total count is the count of fetched products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getUniqueProductSizes = async (req, res) => {
    try {
        // Aggregate pipeline to get unique product sizes
        const uniqueSizes = await Product.aggregate([
            {
                $unwind: "$sizes" // Unwind the sizes array
            },
            {
                $group: {
                    _id: "$sizes.name",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    size: "$_id",
                    count: 1
                }
            }
        ]);


        // Send the unique sizes as the response
        res.status(200).json({
            uniqueSizes,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getProductById = async (req, res) => {
    try {
        // Extract the product ID from the request parameters
        const productId = req.params.productId;

        // Fetch the product from the database by its ID
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If the product exists, return it as a response
        res.status(200).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateProduct = async (req, res) => {
    try {
        // Extract product details from request body
        const { productId, name, description, images, duration, schedule, topicsCovered, ageGroup, price } = req.body;
        console.log("🚀 ~ updateProduct ~ price:", price)

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product data with new values
        product.name = name;
        product.price = price;
        product.description = description;
        product.images = images;
        product.duration = duration;
        product.schedule = schedule;
        product.topicsCovered = topicsCovered;
        product.ageGroup = ageGroup;

        // Save the updated product to the database
        await product.save();

        // Send success response
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        console.log("🚀 ~ deleteProduct ~ productId:", productId)
        await Product.deleteOne({ _id: productId });
        // Send success response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
