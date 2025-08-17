import mongoose, { Schema } from 'mongoose';
import {RequestInterface } from '../interfaces/request.interface';

const EquipmentRequestSchema = new Schema<RequestInterface>(
  {
    name: { type: String, required: true }, // who requested
    type: { type: String, required: true },
    equipmentModel: { type: String },
    link: { type: String },
    imageUrl: { type: String }, // URL or path to uploaded image
    status: { type: String, enum: ["pending", "reviewed", "fulfilled", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export const EquipmentRequest = mongoose.model<RequestInterface>('EquipmentRequest', EquipmentRequestSchema);