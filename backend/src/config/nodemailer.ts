import nodemailer from "nodemailer";
import { env } from "./env";

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});
