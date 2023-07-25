import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// @Create transporter using gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (email, message) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "Reset Password - Tokopaedi",
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error;
    console.log(`Email sent : ${info.response}`);
  });
};

export default sendEmail;
