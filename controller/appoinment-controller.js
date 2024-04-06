import Appointment from "../models/appointment.js";



export const bookAppointment = async (req, res) => {
    try {
        // Extract appointment data from req.body
        const { name, email, date, time, department, doctor } = req.body;

        // Create a new instance of the Appointment model
        const appointment = new Appointment({
            name,
            email,
            date,
            time,
            department,
            doctor
        });

        // Save the appointment to the database
        await appointment.save();

        // Respond with success message
        res.status(201).json({ message: 'Appointment Submitted', appointment });

    } catch (error) {
        console.error('Error Creating Appointment', error);
        res.status(500).json({ error: error });
    }
}
export const appointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the appointment by ID
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Update the status
        appointment.status = status;

        // Save the updated appointment
        await appointment.save();

        res.status(200).json({ message: 'Appointment status updated', appointment });

    } catch (error) {
        console.error('Error updating appointment status', error);
        res.status(500).json({ error: 'Error updating appointment status' });
    }
}


export const bookedAppointments = async (req, res) => {

    try {
        const { doctor, date } = req.params;

        const appointments = await Appointment.find({
            date,
            doctor,
            status: { $ne: "pending" }
        }, 'time');

        res.status(200).json({ appointment: appointments });

    } catch (error) {
        console.error('Error updating appointment status', error);
        res.status(500).json({ error: 'Error updating appointment status' });
    }
}

export const getAppointments = async (req, res) => {
    try {

        let appointments = await Appointment.find();
        res.status(200).json({ appointments: appointments });
    } catch (error) {
        console.error('Error getting appointments', error);
        res.status(500).json({ error: 'Error getting appointments' });
    }
}

