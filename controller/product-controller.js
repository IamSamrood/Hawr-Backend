import Product from "../models/product.js";
import mongoose from 'mongoose';

export const addProduct = async (req, res) => {
    try {
        // Extract product details from request body
        const { name, sizes, description, images, code, category, offer } = req.body;

        // Create new product data object with required fields
        const newProductData = {
            name,
            sizes,
            description,
            images,
            code,
            category,
        };

        // Add offer to new product data if it exists in the request body
        if (offer !== undefined) {
            newProductData.offer = offer;
            newProductData.sizes = sizes.map(size => ({
                ...size,
                actualPrice: size.price,
                price: size.price - (size.price * offer / 100),
            }));
        }

        // Create new product
        const newProduct = new Product(newProductData);

        // Save product to database
        await newProduct.save();

        // Send success response
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

        if (categories.length > 0) {
            query.category = { $in: categories.map(category => new mongoose.Types.ObjectId(category)) }; // Filter by categories
        }

        query.sizes = {
            $elemMatch: {
                price: { $gte: minPrice, $lte: maxPrice }
            }
        };

        // Filter by sizes
        if (sizes.length > 0) {
            query.sizes = { $elemMatch: { name: { $in: sizes } } };
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
        const aggregatePipeline = [
            { $match: query },
            { $unwind: "$sizes" },
            {
                $group: {
                    _id: "$_id",
                    product: { $first: "$$ROOT" }, // Include all fields from the product document
                    quantitySum: { $sum: "$sizes.quantity" } // Calculate sum of quantities
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
                        $mergeObjects: ["$product", { category: { $arrayElemAt: ["$product.category", 0] } }]
                    }
                }
            }
        ];

      
      

        // Fetching products with pagination, search, and filters using aggregation
        const products = await Product.aggregate(aggregatePipeline);

        

        // Sending response
        res.status(200).json({
            products: products,
            currentPage: page,
            total: products.length // Total count is the count of fetched products
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