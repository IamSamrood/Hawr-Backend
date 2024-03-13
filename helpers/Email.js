import nodemailer from 'nodemailer';
import generateEmail from '../helpers/template.js';

// Function to send email
export async function sendEmail(data) {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    // Generate the HTML content for the email
    const emailHtml = generateEmail(data);

    // Email message options
    const mailOptions = {
        from: data.email,
        to: 'contact@gnanaprakasam.com',
        subject: 'Enquiry Email',
        html: emailHtml,
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info.response;
    } catch (error) {
        return error;
        console.error('Error:', error);
    }
}
