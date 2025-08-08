import bcrypt from "bcrypt";

const genrateHash = async (data: any) => {
  const saltrounds = await bcrypt.genSalt(10);
  const hashedData = await bcrypt.hash(data, saltrounds);
  return hashedData;
};

const compareHash = async (plainData: any, hashedData: any) => {
  const isMatch = await bcrypt.compare(plainData, hashedData);
  return isMatch;
};

export { genrateHash, compareHash };
