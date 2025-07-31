import { Equipment } from "../models/equipment.model";
import { Equipment as EquipmentInterface } from "../interfaces/equipment.interface";

class EquipmentService {
    async createEquipment(data: EquipmentInterface): Promise<EquipmentInterface> {
        const equipment = new Equipment(data);
        return await equipment.save();
    }

    async getAllEquipment(): Promise<EquipmentInterface[]> {
        return await Equipment.find();
    }

    async getTotalEquipmentCount(): Promise<number> {
        return await Equipment.countDocuments();
    }

    async getEquipmentById(id: string): Promise<EquipmentInterface | null> {
        return await Equipment.findById(id);
    }

    async updateEquipment(id: string, data: Partial<EquipmentInterface>): Promise<EquipmentInterface | null> {
        return await Equipment.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteEquipment(id: string): Promise<EquipmentInterface | null> {
        return await Equipment.findByIdAndDelete(id);
    }
}

export const equipmentService = new EquipmentService();