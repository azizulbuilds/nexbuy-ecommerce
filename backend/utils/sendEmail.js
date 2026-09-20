const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// Send Email Verification OTP
// ==========================================
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Nexbuy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your E-Commerce Verification Code",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Email Verification</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing: 5px;">${otp}</h1>

        <p>This code will expire in 10 minutes.</p>

        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ==========================================
// Send Password Reset OTP
// ==========================================
const sendPasswordResetOTP = async (email, otp) => {
  const mailOptions = {
    from: `"MERN E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset</h2>

        <p>We received a request to reset your password.</p>

        <p>Your password reset OTP is:</p>

        <h1 style="letter-spacing: 5px;">${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetOTP,
};