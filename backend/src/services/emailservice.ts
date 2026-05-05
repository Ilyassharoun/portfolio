import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  const { name, email, subject, message } = data;

  try {
    const response = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.EMAIL_USER!],
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
    });
    
    console.log("✅ Email sent via Resend:", response);
    return response;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
};