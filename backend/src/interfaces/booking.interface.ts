import mongoose from "mongoose";

export interface Booking extends Document {
  userId: mongoose.Types.ObjectId;
  equipmentId: mongoose.Types.ObjectId;
  bookingDate: Date;
  slotDate: Date;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  sample: Number;
  Category: String; // 'Academic' | 'Industry'
  phone: string;
}
