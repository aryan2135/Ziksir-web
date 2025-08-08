import crypto from "crypto";

const GenertateRandomString = () => {
  const randomBytes = crypto.randomBytes(32);
  const randomString = randomBytes.toString("hex");
  return randomString;
};

export default GenertateRandomString;
