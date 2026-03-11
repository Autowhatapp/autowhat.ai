const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse the incoming JSON payload from the frontend
        const data = JSON.parse(event.body);
        const {
            first_name,
            last_name,
            work_email,
            job_title,
            company,
            region,
            message,
            privacy_consent,
            marketing_updates
        } = data;

        // Ensure required fields are present
        if (!first_name || !last_name || !work_email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        // Configure Nodemailer Transporter
        // IMPORTANT: You MUST set these environment variables in your Netlify Dashboard
        // Settings -> Environment Variables
        // SMTP_HOST, SMTP_PORT. SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com', // fallback to gmail
            port: process.env.SMTP_PORT || 465, // usually 465 for SSL or 587 for TLS
            secure: process.env.SMTP_PORT == 465, 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // The Email Content to be sent to YOU
        const mailOptions = {
            from: `"Autowhat AI Website" <${process.env.SMTP_USER}>`,
            to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER, // Who receives the notification
            replyTo: work_email,
            subject: `New Contact Inquiry from ${first_name} ${last_name} (${company})`,
            html: `
                <h2>New Website Inquiry</h2>
                <p><strong>Name:</strong> ${first_name} ${last_name}</p>
                <p><strong>Email:</strong> ${work_email}</p>
                <p><strong>Job Title:</strong> ${job_title}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Region:</strong> ${region}</p>
                <br />
                <h3>Message:</h3>
                <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
                <br />
                <p><strong>Privacy Consented:</strong> ${privacy_consent ? 'Yes' : 'No'}</p>
                <p><strong>Marketing Updates:</strong> ${marketing_updates ? 'Yes' : 'No'}</p>
            `
        };

        // You could also send a styled auto-responder back to the user here using another transporter.sendMail() call!

        // Send the email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email. Ensure SMTP credentials are set in Netlify Environment Variables.' }),
        };
    }
};
