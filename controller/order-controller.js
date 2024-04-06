import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Razorpay from "razorpay";
import crypto from 'crypto';


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createOrder = async (req, res) => {
    try {
        const { id } = req.user;
        const {
            apartment, city,
            company, country,
            email, firstName,
            lastName, note,
            phone, pincode,
            street, paymentMethod
        } = req.body;

        const cart = await Cart.findOne({ userId: id })
                                .populate('items.productId');
        // Extracting complete product data from the cart
        const items = cart.items.map(cartItem => ({
            productId: cartItem.productId._id,
            name: cartItem.productId.name,
            price: cartItem.productId.price,
            actualPrice: cartItem.productId.actualPrice,
            images: cartItem.productId.images,
            code: cartItem.productId.code,
            quantity: cartItem.quantity,
            size: cartItem.size
        }));
        

            
        // Calculate the total amount
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);

        // Calculate the total amount
        const discount = cart.items.reduce((total, item) => {
            return total + ((item.productId.actualPrice - item.productId.price) * item.quantity);
        }, 0);

        

        const order = new Order({
            userId: id,
            items,
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
            totalDiscount: discount
        });

        const savedOrder = await order.save();


        let orderObj;

        if (paymentMethod === 'razorpay') {
            // If order is saved successfully, create an order in Razorpay
             orderObj = await razorpay.orders.create({
                amount: totalAmount * 100, // Assuming you have a function to calculate order amount
                currency: 'INR', // Change to your currency
                receipt: savedOrder._id.toString() // Use order ID as receipt ID
            });
        }
        
        
        res.status(201).json({
            order: savedOrder,
            orderObjId: orderObj.id,
            amount:orderObj.amount,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

export const paymentSuccess = async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;


        const { id } = req.user;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        const order = await Order.findByIdAndUpdate(orderCreationId,
            {
                status: 'completed',
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                deliveryStatus:'Placed'
            }, { new: true });
        
        const cart = await Cart.findOneAndDelete({ userId: id });


        res.json({
            msg: 'success',
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

export const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id;  
        
        const orders = await Order.find({ userId });



        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

