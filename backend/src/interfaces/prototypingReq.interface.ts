import { Document } from "mongoose";

export interface PrototypingRequest extends Document {
  organization: string;
  phone: string;
  prototypeType: string;
  materials: string;
  equipment: string;
  requirements: string;
  useCase: string;
  scalability?: string; // Prototype → Production
  ip?: string; // Patents / intellectualProperty info
  file?: string; // Uploaded file URL/path

  createdAt?: Date;
  updatedAt?: Date;
}
