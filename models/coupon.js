import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    offer: {
        type: Number,
        required: true
    },
    users: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
