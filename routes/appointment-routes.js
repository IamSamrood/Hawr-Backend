import { Router } from "express";
import Appointment from "../models/appointment.js";

const router = Router();

router.post('/book-appointment', async (req, res) => {
    try  {
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
});

export default router;