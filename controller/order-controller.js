import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Razorpay from "razorpay";
import crypto from 'crypto';
import Coupon from "../models/coupon.js";


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
            street, paymentMethod, coupon
        } = req.body;

        const cart = await Cart.findOne({ userId: id })
                                .populate('items.productId');
        // Extracting complete product data from the cart
        const items = cart.items.map(cartItem => {
            return {
                productId: cartItem.productId._id,
                name: cartItem.productId.name,
                price: cartItem.price,
                actualPrice: cartItem.actualPrice,
                images: cartItem.productId.images,
                code: cartItem.productId.code,
                quantity: cartItem.quantity,
                size: cartItem.size
            };
        });


            
        // Calculate the total amount
        const totalAmount = cart.items.reduce((total, item) => {
            // Add the price of the item to the total
            return total + (item.price * item.quantity);
        }, 0);


        // Calculate the total discount
        const discount = cart.items.reduce((total, item) => {

            // Calculate the discount for the item and add it to the total
            return total + ((item.actualPrice - item.price) * item.quantity);
        }, 0);


        

        let orederObject = {
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
            totalDiscount: discount,
              
        }

        if (paymentMethod == 'cashOnDelivery') {
            orederObject.deliveryStatus = 'Placed';
        }

        if (coupon) {
            let getCoupon = await Coupon.findOne({ code: coupon });
            
            if (getCoupon) {

                let coupondis = totalAmount * getCoupon.offer / 100;

                orederObject.totalAmount = totalAmount - coupondis;
                orederObject.couponDiscount = coupondis;
                orederObject.coupon = getCoupon.code;

            }

        }

        const order = new Order(orederObject);

        const savedOrder = await order.save();


        let orderObj = {};

        if (paymentMethod === 'razorpay') {
            // If order is saved successfully, create an order in Razorpay
             orderObj = await razorpay.orders.create({
                amount: totalAmount * 100, // Assuming you have a function to calculate order amount
                currency: 'INR', // Change to your currency
                receipt: savedOrder._id.toString() // Use order ID as receipt ID
            });
        } else {
            orderObj.id = savedOrder._id;

            const deleteCart = await Cart.findOneAndDelete({ userId: id });

            const myCoupon = await Coupon.findOne({ code: coupon });

            myCoupon.users.set(id, true);

            await myCoupon.save();
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
            coupon
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

        const myCoupon = await Coupon.findOne({ code: coupon });

        myCoupon.users.set(id, true);

        await myCoupon.save();


        res.json({
            msg: 'success',
        });
    } catch (error) {
        res.status(500).json({msg: error});
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

