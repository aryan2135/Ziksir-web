import crypto, { randomInt } from "crypto";

const GenertateRandomString = () => {
  const randomBytes = crypto.randomBytes(32);
  const randomString = randomBytes.toString("hex");
  return randomString;
};

function generateOtp4(): string {
  return randomInt(0, 10000).toString().padStart(4, "0");
}

export { GenertateRandomString, generateOtp4 };
