import dotenv from "dotenv";
import nodemailer from "nodemailer";
import net from "net";

dotenv.config();

// Force Node.js to use IPv4 ONLY
import dns from "dns";
dns.setDefaultResultOrder('ipv4first');

// Override the default lookup to force IPv4
const originalLookup = dns.lookup;
(dns as any).lookup = (hostname: string, options: any, callback: any) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options.family = 4; // Force IPv4
  return originalLookup(hostname, options, callback);
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Changed from 465 to 587 with STARTTLS
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  const { name, email, subject, message } = data;

  console.log('📧 Attempting to send email with IPv4 only...');
  console.log('📧 Email config:', {
    host: 'smtp.gmail.com',
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