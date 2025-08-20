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
  },
  { timestamps: true }
);

export default mongoose.model<ConsultingRequest>(
  "ConsultingRequest",
  ConsultingRequestSchema
);
