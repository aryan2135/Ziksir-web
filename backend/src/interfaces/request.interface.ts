import { Document } from "mongoose";
export interface RequestInterface extends Document{
    name: string; // who requested
    type: string;
    equipmentModel?: string;
    link?: string;
    imageUrl?: string; // URL or path to uploaded image
    status?: "pending" | "reviewed" | "fulfilled" | "rejected"; // default is "pending"
    createdAt?: Date;
    updatedAt?: Date;
}
