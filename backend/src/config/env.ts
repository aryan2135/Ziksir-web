import dotenv from "dotenv";
dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (key == "IS_CROSS_SITE" && !value) return "";
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
}

export const env = {
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  CLIENT_URL: getEnvVariable("CLIENT_URL"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  SMTP_USER: getEnvVariable("SMTP_USER"),
  SMTP_PASS: getEnvVariable("SMTP_PASS"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  IS_CROSS_SITE: getEnvVariable("IS_CROSS_SITE"),
};
