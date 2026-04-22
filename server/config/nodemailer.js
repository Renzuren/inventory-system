const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'MISSING');
  console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'MISSING');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials missing in .env file');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const emailFrom = `"Stockify" <${process.env.EMAIL_USER}>`;

module.exports = { createTransporter, emailFrom };