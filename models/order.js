import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchema = new Schema({
    apartment: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
});

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    items: [{ }],
    address: {
        type: addressSchema,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cashOnDelivery', 'razorpay'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    totalAmount: {
        type: Number
    },
    totalDiscount: {
        type:Number
    },
    razorpayPaymentId: {
        type: String
    },
    razorpayOrderId: {
        type: String
    },
    deliveryStatus: {
        type: String,
        enum: ['Placed', 'Packed', 'Shipped', 'Out for the delivery', 'Delivered'],
    },
    
    // Other fields you may want to include
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
