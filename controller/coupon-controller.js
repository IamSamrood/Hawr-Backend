import Coupon from '../models/coupon.js';



export const addCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();

        // Send success response
        res.status(201).json({ message: 'Category created successfully', coupon });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getAllCoupon = async (req, res) => {
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
        const coupons = await Coupon.find(query).skip(skip).limit(limit);
        const totalCoupons = await Coupon.countDocuments(query);

        // Sending response
        res.status(200).json({
            coupons,
            currentPage: page,
            total: totalCoupons
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const { id } = req.user;

        const coupon = await Coupon.findOne(code);

        const isUsed = coupon.users.get(id);

        if (isUsed) {
            return res.status(409).json({ message: 'Coupon Already Used' });
        }

        coupon.users.set(id, true);

        const updateCoupon = await Coupon.findOneAndUpdate(
            code, 
            { users: coupon.users }, 
            { new: true } // Options: return the modified document
        );

        res.status(200).json({ message: 'Coupon Applied Successfully' });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const checkCouponValid = async (req, res) => {
    try {
        const { code } = req.body;
        const { id } = req.user;

        const coupon = await Coupon.findOne(code);

        if (!coupon) {
            return res.status(200).json({ message: 'Coupon Not Found', coupon:'' });
        }

        const isUsed = coupon.users.get(id);

        if (isUsed) {
            return res.status(409).json({ message: 'Coupon Already Used', coupon:'' });
        }

        res.status(200).json({ message: 'Coupon Found', coupon });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}