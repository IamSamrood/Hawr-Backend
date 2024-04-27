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
            quantity: Number,
            price: Number,
            actualPrice: Number
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
    offer: {
        type: Number,
        default:0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;