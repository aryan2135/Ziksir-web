import mongoose, { Schema } from "mongoose";
import {
  ResetToken as ResetTokenInterface,
  Otp as OtpInterface,
} from "../interfaces/token.interface";

// Reset Token Schema
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
    expires: 15 * 60, // 15 minutes
  },
});

// OTP Schema
const otpSchema = new mongoose.Schema<OtpInterface>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3 * 60, // 3 minutes
  },
});

export const ResetTokenModel = mongoose.model<ResetTokenInterface>(
  "ResetToken",
  resetTokenSchema
);

export const OtpModel = mongoose.model<OtpInterface>("Otp", otpSchema);
