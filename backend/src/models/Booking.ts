import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  equipment: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  equipment: String,
  date: Date,
  status: { type: String, default: 'pending' }
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
