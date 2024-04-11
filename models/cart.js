// models/cart.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Assuming you have a Product model
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        size: {
            type: String,
        },
        price: {
            type:Number
        },
        actualPrice: {
            type:Number
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
