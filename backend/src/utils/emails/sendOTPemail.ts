import { sendEmail } from "./sendEmail";
import { otpTemplate } from "./templates/otpTemplate";

export const sendOtpEmail = async (to: string, otp: string) => {
  const html = otpTemplate(otp);
  return sendEmail(to, "Your OTP Code - ziksir", html);
};
