import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Use Gmail's IPv4 address directly to avoid IPv6 resolution
const transporter = nodemailer.createTransport({
  host: "142.250.80.108", // Gmail SMTP IPv4 address (bypasses DNS)
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
  // Override name to match certificate
  name: "smtp.gmail.com",
});

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  const { name, email, subject, message } = data;

  console.log('📧 Attempting to send email via IPv4...');
  console.log('📧 Config:', {
    host: '142.250.80.108 (Gmail IPv4)',
    port: 587,
    user: process.env.EMAIL_USER ? 'Set' : 'MISSING',
    pass: process.env.EMAIL_PASS ? 'Set' : 'MISSING',
  });

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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};