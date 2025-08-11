import { Document, Types } from "mongoose";

export interface ResetToken extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
}
