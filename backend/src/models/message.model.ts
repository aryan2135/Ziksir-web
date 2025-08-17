import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../interfaces/message.interface";

export interface IMessageModel extends IMessage, Document {}

const MessageSchema: Schema = new Schema<IMessageModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    institution: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessageModel>("Message", MessageSchema);
