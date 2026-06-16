    console.log('--- emailService.js loaded and executing ---'); // ✅ NEW: Verification log

    const nodemailer = require('nodemailer');
    require('dotenv').config({ path: '../.env' }); // Load .env from parent directory for server.js, assuming .env is in form-server/

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true, // show debug output
        logger: true // log to console
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    const sendEmail = async (to, subject, text, html) => {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                text: text,
                html: html
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${to}`);
        } catch (error) {
            console.error(`Error sending email to ${to}:`, error);
            throw new Error('Failed to send email.');
        }
    };

    module.exports = sendEmail;
    