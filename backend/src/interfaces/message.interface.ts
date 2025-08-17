import { Document } from "mongoose";
export interface IMessage extends Document{
  name: string;
  email: string;
  institution: string;
  message: string;
  createdAt?: Date;
}
