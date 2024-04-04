import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

// Route to add a new product
router.post('/', async (req, res) => {
    try {
        // Extract product details from request body
        const { name, sizes, description, images, code, price, category, offer } = req.body;

        // Create new product data object with required fields
        const newProductData = {
            name,
            sizes,
            description,
            images,
            code,
            price,
            category,
            actualPrice: price
        };

        // Add offer to new product data if it exists in the request body
        if (offer !== undefined) {
            newProductData.offer = offer;
            newProductData.price = price - price * offer / 100;
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
});

router.post('/get-products', async (req, res) => {
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

        // Availability filter
        const availability = req.body.availability || [];

        // Price range filter
        const minPrice = parseFloat(req.body.price[0]) || 0;
        const maxPrice = parseFloat(req.body.price[1]) || Number.MAX_SAFE_INTEGER;

        // Sorting
        let sort = {};
        const sortBy = req.body.sortBy || '';
        if (sortBy === 'priceLowToHigh') {
            sort = { price: 1 };
        } else if (sortBy === 'priceHighToLow') {
            sort = { price: -1 };
        }

        // Building query
        const query = {};
        if (searchQuery) {
            query.name = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search
        }

        if (categories.length > 0) {
            query.category = { $in: categories }; // Filter by categories
        }

        query.price = { $gte: minPrice, $lte: maxPrice };

        // Filter by sizes
        if (sizes.length > 0 ) {
            query.sizes = { $elemMatch: { name: { $in: sizes } } };
           
            if (availability.length == 1 && availability.includes('Available')) {
               
                query.sizes['$elemMatch']['quantity'] = {
                    $gt: 0
                }
            } else if (availability.length == 1 && availability.includes('Unavailable')) {
                query.sizes['$elemMatch']['quantity'] = {
                    $eq: 0
                }
            }
        } else if (availability.length == 1 && availability.includes('Available')) {
            query.sizes = { $elemMatch: { quantity: { $gt: 0 } } };
        } else if (availability.length == 1 && availability.includes('Unavailable')) {
            query.sizes = { $elemMatch: { quantity: { $eq: 0 } } };
        }

        

        

        // Fetching products with pagination, search, and filters
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category');
        const totalProducts = await Product.countDocuments(query);

        // Sending response
        res.status(200).json({
            products,
            currentPage: page,
            total: totalProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Route to get unique product sizes
router.get('/unique-sizes', async (req, res) => {
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
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



export default router;
