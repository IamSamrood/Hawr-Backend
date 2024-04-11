import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profilePic: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female',],
    },
})
const User = mongoose.model("User", userSchema);
export default User