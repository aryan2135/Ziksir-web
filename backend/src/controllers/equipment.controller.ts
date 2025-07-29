import { Request, Response } from "express";
import { equipmentService } from "../services/equipment.service";

class EquipmentController {
    async createEquipment(req: Request, res: Response): Promise<void> {
        try {
            const equipment = await equipmentService.createEquipment(req.body);
            res.status(201).json(equipment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllEquipment(req: Request, res: Response): Promise<void> {
        try {
            const equipment = await equipmentService.getAllEquipment();
            res.status(200).json(equipment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEquipmentById(req: Request, res: Response): Promise<void> {
        try {
            const equipment = await equipmentService.getEquipmentById(req.params.id);
            if (!equipment) {
                res.status(404).json({ message: "Equipment not found" });
                return;
            }
            res.status(200).json(equipment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateEquipment(req: Request, res: Response): Promise<void> {
        try {
            const equipment = await equipmentService.updateEquipment(req.params.id, req.body);
            if (!equipment) {
                res.status(404).json({ message: "Equipment not found" });
                return;
            }
            res.status(200).json(equipment);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteEquipment(req: Request, res: Response): Promise<void> {
        try {
            const equipment = await equipmentService.deleteEquipment(req.params.id);
            if (!equipment) {
                res.status(404).json({ message: "Equipment not found" });
                return;
            }
            res.status(200).json({ message: "Equipment deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const equipmentController = new EquipmentController();