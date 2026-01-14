import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  attachments?: {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }[];
}

export async function sendEmail({
  to,
  subject,
  html,
  fromName = "Salinas Yuyay",
  attachments = [],
}: SendMailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const mailOptions = {
      from: {
        name: fromName,
        address: process.env.GMAIL_USER!,
      },
      to,
      subject,
      html,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    console.error(`Error sending email to ${to}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al enviar correo",
    };
  }
}
