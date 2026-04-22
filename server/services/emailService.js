const { createTransporter, emailFrom } = require('../config/nodemailer');

const sendVerificationEmail = async (email, firstName, verificationToken) => {
  const transporter = createTransporter();
  const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: 'Verify your email for Stockify',
    html: `
      <h2>Welcome to Stockify, ${firstName}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:8px;">Verify Email</a>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Verification email sent to ${email}`);
  console.log(`📧 Message ID: ${info.messageId}`);
  return info;
};

module.exports = { sendVerificationEmail };