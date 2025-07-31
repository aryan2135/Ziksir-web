import mongoose, { Schema } from "mongoose";
import { Equipment as EquipmentInterface } from "../interfaces/equipment.interface";

const EquipmentSchema = new Schema<EquipmentInterface>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    equipmentLocation: { type: String },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'maintenance'],
        default: 'available',
    },
    lastMaintenance: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    descriptionFields: [
        {
        key: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
        },
    ],
    quantity: {type: Number, default: 1},
    available: {type: Number, default: 1},
});

export const Equipment = mongoose.model<EquipmentInterface>('Equipment', EquipmentSchema);