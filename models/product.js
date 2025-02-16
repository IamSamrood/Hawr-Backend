import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    offer: {
        type: Number,
        default:0,
    },
    price: {
        type: Number,
        default: false
    },
    duration: {
        type: String,
        default: false
    },
    schedule: {
        type: String,
        default: false
    },
    ageGroup: {
        type: String,
        default: false
    },
    topicsCovered: {
        type: [String],
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
