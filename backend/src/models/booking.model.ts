import mongoose, { Document, Schema } from 'mongoose';
import { Booking as BookingInterface } from '../interfaces/booking.interface';

const bookingSchema = new Schema<BookingInterface>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  equipmentId: {type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
  bookingDate: { type: Date, default: Date.now, required: true },
  slotDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  sample: { type: Number, required: true },
  Category: { type: String, required: true, enum: ['Academic', 'Industry'] }
});

export const Booking = mongoose.model<BookingInterface>('Booking', bookingSchema);
