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
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>New Website Inquiry</title>
                    <!-- Fallback web fonts if email client supports it -->
                    <style type="text/css">
                        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@400;500;600&display=swap');
                        body, td { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                        h1, h2 { font-family: 'DM Serif Display', Georgia, serif; }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #fcfafc; color: #1a1a1a;">
                    <!-- Wrapper Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fcfafc; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <!-- Main Content Container -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);">
                                    
                                    <!-- Header / Hero Simulation -->
                                    <tr>
                                        <td style="background-color: #fbf9fb; padding: 50px 40px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.03);">
                                            <!-- Title with the serif font and green highlight -->
                                            <h1 style="margin: 0; font-size: 32px; font-weight: 400; color: #1a1a1a; letter-spacing: -0.5px; line-height: 1.2;">
                                                New <span style="color: #00a859; font-style: italic;">Inquiry.</span>
                                            </h1>
                                            <p style="margin: 15px auto 0; font-size: 15px; color: #555555; max-width: 400px; line-height: 1.5; font-weight: 400;">
                                                A new contact request has been submitted through the Autowhat AI website. Details are provided below.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Body Data -->
                                    <tr>
                                        <td style="padding: 40px;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td valign="top" style="padding-bottom: 25px;">
                                                        <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 6px;">Name</strong>
                                                        <span style="font-size: 16px; color: #1a1a1a; font-weight: 500;">${first_name} ${last_name}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign="top" style="padding-bottom: 25px;">
                                                        <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 6px;">Email</strong>
                                                        <a href="mailto:${work_email}" style="font-size: 16px; color: #00a859; text-decoration: none; font-weight: 500;">${work_email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign="top" style="padding-bottom: 25px;">
                                                        <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 6px;">Job Title & Company</strong>
                                                        <span style="font-size: 16px; color: #1a1a1a; font-weight: 500;">${job_title} <span style="color: #666;">at</span> ${company}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign="top" style="padding-bottom: 30px;">
                                                        <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 6px;">Region</strong>
                                                        <span style="font-size: 16px; color: #1a1a1a; font-weight: 500;">${region}</span>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Message Box -->
                                            <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666666; font-weight: 600; margin-bottom: 12px;">Message</strong>
                                            <div style="background-color: #fafafa; border: 1px solid #eeeeee; border-left: 4px solid #00a859; border-radius: 6px; padding: 24px; margin-bottom: 30px;">
                                                <p style="margin: 0; font-size: 15px; color: #333333; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                                            </div>
                                            
                                            <!-- Meta data -->
                                            <div style="font-size: 14px; color: #555555; border-top: 1px solid #f0f0f0; padding-top: 25px;">
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td align="left">
                                                            <strong style="color: #666666;">Privacy Policy Consented:</strong> <span style="color: ${privacy_consent ? '#00a859' : '#e53e3e'}; font-weight: 600;">${privacy_consent ? 'Yes' : 'No'}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Simplified Footer -->
                                    <tr>
                                        <td style="background-color: #1a1a1a; padding: 24px; text-align: center;">
                                            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.7); font-family: 'Clear Sans', sans-serif; letter-spacing: 0.5px;">Automated message sent securely via Autowhat AI</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
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
