import mongoose, { Document, Schema } from 'mongoose';
import { User as UserInterface } from '../interfaces/user.interface';

const userSchema = new Schema<UserInterface>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  contactNo: {type: String, required: false},
  emailId: {type: String, required: false},
  organizationAddress: {type: String, required: false},
  state: {type: String, required: false},
  country: {type: String, required: false},
  gstin: {type: String, required: false},
  gstinNo: {type: String, required: false},
  panNo: {type: String, required: false},
  pincode: {type: Number, required: false},
  remarks: {type: String, required: false},
  organizationCategory: {type: String, required: false}
});

export const User = mongoose.model<UserInterface>('User', userSchema);
