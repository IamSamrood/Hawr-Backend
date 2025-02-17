import Order from "../models/order.js";
import Razorpay from "razorpay";
import crypto from 'crypto';
import Product from "../models/product.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        // const { id } = req.user;
        const {
            apartment, city,
            company, country,
            email, firstName,
            lastName, note,
            phone, pincode,
            street, paymentMethod,
            productId
        } = req.body;

        const item = await Product.findById(productId)
        // Calculate the total amount
        const total = item.price

        // Calculate the Gst
        const gst = total * 18 / 100;

        console.log("🚀 ~ createOrder ~ total + gst + 50:", total + gst + 50)
        const totalAmount = (total + gst).toFixed(2) ;
        // const totalAmount = Math.round((total + gst + 50)) * 100;

        let orderObject = {
            name: firstName,
            email: email,
            item,
            address: {
                apartment,
                city,
                company,
                country,
                email,
                firstName,
                lastName,
                note,
                phone,
                pincode,
                street,
            },
            paymentMethod,
            note,
            totalAmount,
            // totalDiscount: discount,
        }

        if (paymentMethod == 'cashOnDelivery') {
            orderObject.deliveryStatus = 'Placed';
        }

        const order = new Order(orderObject);
        const savedOrder = await order.save();

        let orderObj = {};

        if (paymentMethod === 'razorpay') {
            console.log("🚀 ~ createOrder ~ paymentMethod:", paymentMethod)
            // If order is saved successfully, create an order in Razorpay
            orderObj = await razorpay.orders.create({
                amount: savedOrder?.totalAmount * 100, // Assuming you have a function to calculate order amount
                currency: 'INR', // Change to your currency
                receipt: savedOrder._id.toString() // Use order ID as receipt ID
            });
        } else {
            orderObj.id = savedOrder._id;
        }

        res.status(201).json({
            order: savedOrder,
            orderObjId: orderObj.id,
            amount: orderObj.amount,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

export const paymentSuccess = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        const order = await Order.findByIdAndUpdate(orderId,
            {
                status: 'completed',
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                deliveryStatus: 'Placed'
            }, { new: true });

            res.json({
            msg: 'success',
        });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

export const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const orderId = req.query.id;

        const order = await Order.findById(orderId);

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const getAllOrders = async (req, res) => {
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
        const orders = await Order.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalOrders = await Order.countDocuments(query);

        // Sending response
        res.status(200).json({
            orders,
            currentPage: page,
            total: totalOrders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {

        let id = req.params.id;

        let order = await Order.findByIdAndUpdate(id, {
            deliveryStatus: req.body.status
        });

        res.status(201).json({
            order,
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

