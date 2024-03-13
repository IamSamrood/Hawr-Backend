import { Router } from "express";
import { sendEmail } from "../helpers/Email.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        let content = req.body;


        let EmailSend = await sendEmail(content);

        res.status(201).json({ message: 'Message send successfully' });

    } catch (error) {
        console.error('Error Sending Message:', error);
        res.status(500).json({ error: error });
    }
});

export default router;