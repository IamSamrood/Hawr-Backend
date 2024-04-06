import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
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
})
const User = mongoose.model("User", userSchema);
export default User