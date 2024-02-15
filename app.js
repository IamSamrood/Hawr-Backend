import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './db/db.js';
import Email from './models/email.js';


const app = express();
app.use(cors());
app.use(bodyParser.json());

config();
connectDB();

app.get('/', (req, res) => {
    console.log('/get');
})

app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if the email already exists in the database
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already subscribed' });
        }

        // Create a new Email document
        const newEmail = new Email({ email });


        // Save the new email to the database
        await newEmail.save();

        res.status(201).json({ message: 'Email subscription successful' });
    } catch (error) {
        console.error('Error subscribing email:', error);
        res.status(500).json({ error: error });
    }
});




app.listen(3000, () => {
    console.log('Listening to 3000!!');
});
