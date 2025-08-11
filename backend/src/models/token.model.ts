import mongoose, { Schema } from "mongoose";
import { ResetToken as ResetTokenInterface } from "../interfaces/token.interface";

const resetTokenSchema = new Schema<ResetTokenInterface>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 15 * 60, // 15 min
  },
});

export const ResetTokenModel = mongoose.model<ResetTokenInterface>(
  "ResetToken",
  resetTokenSchema
);
