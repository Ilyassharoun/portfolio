import dotenv from "dotenv";
import nodemailer from "nodemailer";
import dns from "dns";

dotenv.config();

// Force IPv4 for all connections
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Force IPv4 connection
  tls: {
    rejectUnauthorized: false
  },
  // Alternative: Use direct host configuration
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // Don't use IPv6
  family: 4,
});

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  const { name, email, subject, message } = data;

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact: ${subject}`,
    html: `
      <h2>New Message From Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};