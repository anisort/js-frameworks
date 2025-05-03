require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

exports.sendConfirmationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/confirm/${token}`;

  try {
    await transporter.sendMail({
      from: `"Task App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Registration confirmation',
      html: `<p>Click <a href="${url}">here</a>, to verify your account.</p>`
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: `"Task App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Password recovery',
      html: `<p>Click <a href="${url}">here</a>, for password recovery.</p>`
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
