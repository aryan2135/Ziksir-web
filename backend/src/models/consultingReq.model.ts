import mongoose, { Schema } from "mongoose";
import { ConsultingRequest } from "../interfaces/consultingReg.interface";

const ConsultingRequestSchema: Schema<ConsultingRequest> = new Schema(
  {
    organization: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    timeline: { type: String, required: true },
    budget: { type: Number, required: false },
    description: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ConsultingRequest>(
  "ConsultingRequest",
  ConsultingRequestSchema
);
