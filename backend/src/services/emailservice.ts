import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  const { name, email, subject, message } = data;

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const emailContent = [
    `From: "Portfolio Contact" <${process.env.EMAIL_USER}>`,
    `To: ${process.env.EMAIL_USER}`,
    `Subject: New Contact: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    `<h2>New Message From Portfolio</h2>`,
    `<p><strong>Name:</strong> ${name}</p>`,
    `<p><strong>Email:</strong> ${email}</p>`,
    `<p><strong>Subject:</strong> ${subject}</p>`,
    `<hr />`,
    `<p><strong>Message:</strong></p>`,
    `<p>${message}</p>`,
  ].join("\n");

  const encodedMessage = Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    
    console.log("✅ Email sent via Gmail API:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("❌ Gmail API error:", error);
    throw error;
  }
};