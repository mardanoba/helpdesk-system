
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,           // smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT), // 587
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000, // 15 seconds
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Help Desk System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
};

module.exports = sendEmail;
