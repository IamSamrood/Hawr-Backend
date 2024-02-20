import mongoose from 'mongoose';

const hawrEmails = new mongoose.Schema({
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

const HawrEmail = mongoose.model('HawrEmail', hawrEmails);

export default HawrEmail;
