import { sendEmail } from "./sendEmail";
import { resetLinkTemplate } from "./templates/resetLinkTemplate";

export const sendResetLinkEmail = async (to: string, resetLink: string) => {
  const html = resetLinkTemplate(resetLink);
  return sendEmail(to, "Reset Your Password - ziksir", html);
};
