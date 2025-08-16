import { mailTransporter } from "../../config/nodemailer";
import { env } from "../../config/env";

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const info = await mailTransporter.sendMail({
      from: `"ziksir" <${env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
