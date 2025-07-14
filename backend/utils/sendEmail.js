import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter with your email credentials (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `CampusRoomsKe <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
