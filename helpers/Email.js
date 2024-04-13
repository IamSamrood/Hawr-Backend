import nodemailer from 'nodemailer';
import generateEmail, {appointmentRequest, appointmentStatus} from '../helpers/template.js';

// Function to send email
export async function sendEmail(data, type) {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Generate the HTML content for the email
    let emailHtml;
    let mailOptions;

    if (type == 'request') {
        emailHtml = appointmentRequest(data);
        // Email message options
        mailOptions = {
            from: data.email,
            to: 'muhammedresvan@gmail.com',
            subject: 'Appointment Request',
            html: emailHtml,
        };
    } else if (type == 'status') {
        emailHtml = appointmentStatus(data);
        // Email message options
        mailOptions = {
            from: 'muhammedresvan@gmail.com',
            to: data.email,
            subject: 'Appointment Status Changed',
            html: emailHtml,
        };
    } else {
        emailHtml = generateEmail(data);
        mailOptions = {
            from: data.email,
            to: 'muhammedresvan@gmail.com',
            subject: 'Enquiry Email',
            html: emailHtml,
        };
    }




    

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
