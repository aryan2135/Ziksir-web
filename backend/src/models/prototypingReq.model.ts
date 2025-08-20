import mongoose, { Schema } from "mongoose";
import { PrototypingRequest } from "../interfaces/prototypingReq.interface";

const PrototypingRequestSchema: Schema<PrototypingRequest> = new Schema(
  {
    organization: { type: String, required: true },
    phone: { type: String, required: true },
    prototypeType: { type: String, required: true },
    materials: { type: String, required: true },
    equipment: { type: String, required: true },
    requirements: { type: String, required: true },
    useCase: { type: String, required: true },
    scalability: { type: String, required: false }, // Prototype → Production
    ip: { type: String, required: false }, // Patents / intellectualProperty info

    file: { type: String, required: false }, // Store uploaded file's URL/path
  },
  { timestamps: true }
);

export default mongoose.model<PrototypingRequest>(
  "PrototypingRequest",
  PrototypingRequestSchema
);
