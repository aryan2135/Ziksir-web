import { Document, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  clientId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  phone: string;
  emailId: string;
  organizationAddress: string;
  state: string;
  country: string;
  gstin: string;
  gstinNo: string;
  panNo: string;
  pincode: number;
  remarks: string;
  organizationCategory: string;
  authProvider: "google" | "local";
}

export interface UserData {
  _id?: Types.ObjectId; // ✅ Optional here because when creating a user, _id doesn't exist yet
  clientId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  phone: string;
  emailId: string;
  organizationAddress: string;
  state: string;
  country: string;
  gstin: string;
  gstinNo: string;
  panNo: string;
  pincode: number;
  remarks: string;
  organizationCategory: string;
  authProvider: "google" | "local";
}
