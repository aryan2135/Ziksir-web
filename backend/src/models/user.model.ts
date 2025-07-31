import mongoose, { Document, Schema } from 'mongoose';
import { User as UserInterface } from '../interfaces/user.interface';

const userSchema = new Schema<UserInterface>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export const User = mongoose.model<UserInterface>('User', userSchema);
