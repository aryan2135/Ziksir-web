import { ResetToken as ResetTokenInterface } from "../interfaces/token.interface";
import { ResetTokenModel } from "../models/token.model";
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
}

export const tokenService = new TokenService();
