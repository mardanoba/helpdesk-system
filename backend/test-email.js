require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Test Email from Helpdesk',
    text: 'This is a test email to verify Nodemailer setup.',
  });

  console.log('Message sent: %s', info.messageId);
}

testEmail().catch(console.error);
