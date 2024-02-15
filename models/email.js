import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }
}, {
    timestamps: true 
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
