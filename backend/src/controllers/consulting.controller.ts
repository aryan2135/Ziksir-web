import { Request, Response } from "express";
import { consultingService } from "../services/consulting.service";

class ConsultingController {
  async createConsultingRequest(req: Request, res: Response): Promise<void> {
    try {
      const consultingRequest = await consultingService.createConsultingRequest(
        req.body
      );
      res.status(201).json({
        message: "Consulting request created successfully",
        data: consultingRequest,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteConsultingRequest(req: Request, res: Response): Promise<void> {
    try {
      const deletedRequest = await consultingService.deleteConsultingRequest(
        req.params.id
      );
      if (!deletedRequest) {
        res.status(404).json({ message: "Consulting request not found" });
        return;
      }
      res.status(200).json({
        message: "Consulting request deleted successfully",
        data: deletedRequest,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllConsultingRequests(req: Request, res: Response): Promise<void> {
    try {
      const requests = await consultingService.getAllConsultingRequests();
      res.status(200).json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const consultingController = new ConsultingController();
