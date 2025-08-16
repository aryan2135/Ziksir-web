import {
  ResetToken as ResetTokenInterface,
  Otp as OtpInterface,
} from "../interfaces/token.interface";
import { ResetTokenModel, OtpModel } from "../models/token.model";
import { generateHash, compareHash } from "../utils/bcrypt";
import { Error, Types } from "mongoose";
class TokenService {
  async saveResetToken(
    id: Types.ObjectId,
    token: string
  ): Promise<ResetTokenInterface | null> {
    const hasedToken = await generateHash(token);
    try {
      const resetToken = await ResetTokenModel.create({
        userId: id,
        token: hasedToken,
      });
      return resetToken;
    } catch (error) {
      console.error("Error saving reset token:", error);
      throw new Error("Unable to save reset token");
    }
  }
  async verifyResetToken(token: string): Promise<ResetTokenInterface | null> {
    try {
      const hashedToken = await generateHash(token);

      const resetTokenDoc = await ResetTokenModel.findOne({
        token: hashedToken,
      });
      if (resetTokenDoc) {
        await ResetTokenModel.deleteOne({ token: hashedToken });
        return resetTokenDoc;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error("Unable to verify token");
    }
  }
  async saveOtp(
    otpString: string,
    email: string
  ): Promise<OtpInterface | null> {
    try {
      const hashedOTP = await generateHash(otpString);
      const otpDoc = await OtpModel.create({ otp: hashedOTP, email });
      return otpDoc; // Successfully saved OTP document
    } catch (error) {
      console.error("Error saving OTP:", error);
      return null; // If something fails, return null
    }
  }
  async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
    try {
      // 1. Find OTP doc by email
      const otpDoc = await OtpModel.findOne({ email });
      if (!otpDoc) {
        return false; // OTP not found or expired
      }

      // 2. Compare entered OTP with hashed OTP in DB
      const isMatch = await compareHash(enteredOtp, otpDoc.otp);
      if (!isMatch) {
        return false; // OTP doesn't match
      }

      // 3. OTP matched → delete it
      await OtpModel.deleteOne({ _id: otpDoc._id });

      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  }
}

export const tokenService = new TokenService();
