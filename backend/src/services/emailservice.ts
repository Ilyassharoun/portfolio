import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Force IPv4 by using Gmail's IP directly
const transporter = nodemailer.createTransport({
  host: "142.250.80.108", // smtp.gmail.com IPv4 address
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
  },
  // Override the default connection to force IPv4
  socketCreator: (port: number, host: string) => {
    const net = require('net');
    return net.createConnection({ 
      port, 
      host,
      family: 4 // Force IPv4
    });
  }
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