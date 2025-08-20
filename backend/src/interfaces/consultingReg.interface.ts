import { Document } from "mongoose";
export interface ConsultingRequest extends Document {
  organization: string;
  phone: string;
  category: string;
  timeline: string;
  budget?: number;
  description: string;
}
