import mongoose from "mongoose";


const { Schema } = mongoose;

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^\S+@\S+$/i 
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'pending'
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
