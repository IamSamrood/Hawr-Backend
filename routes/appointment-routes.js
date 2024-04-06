import { Router } from "express";
import { appointmentStatus, bookAppointment, bookedAppointments, getAppointments } from "../controller/appoinment-controller.js";

const router = Router();

router.post('/book-appointment', bookAppointment);


router.put('/:id/status', appointmentStatus);

router.get('/booked-appointments/:doctor/:date', bookedAppointments);

router.get('/get-appointments', getAppointments);

export default router;