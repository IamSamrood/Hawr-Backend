import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    sizes: {
        type: [{
            name: String,
            quantity: Number
        }],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    images: {
        type: [String],
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
        required: true,
        default:0,
    },
    actualPrice: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;