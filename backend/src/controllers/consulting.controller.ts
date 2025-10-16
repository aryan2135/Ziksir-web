import { Request, Response } from "express";
import { consultingService } from "../services/consulting.service";
import { notifyRequestSubmitted } from "../utils/emails/notifyEmailrequests";

class ConsultingController {
  // Create consulting request without sending email
  // async createConsultingRequest(req: Request, res: Response): Promise<void> {
  //   try {
  //     const consultingRequest = await consultingService.createConsultingRequest(req.body);
  //     res.status(201).json({
  //       message: "Consulting request created successfully",
  //       data: consultingRequest,
  //     });
  //   } catch (error: any) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }

  // Delete consulting request
  async deleteConsultingRequest(req: Request, res: Response): Promise<void> {
    try {
      const deletedRequest = await consultingService.deleteConsultingRequest(req.params.id);
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

  // Get all consulting requests
  async getAllConsultingRequests(req: Request, res: Response): Promise<void> {
    try {
      const requests = await consultingService.getAllConsultingRequests();
      res.status(200).json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update consulting request
  async updateConsultingRequest(req: Request, res: Response): Promise<void> {
    try {
      const updatedRequest = await consultingService.updateConsultingRequest(req.params.id, req.body);
      if (!updatedRequest) {
        res.status(404).json({ message: "Consulting request not found" });
        return;
      }
      res.status(200).json({
        message: "Consulting request updated successfully",
        data: updatedRequest,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get user-specific consulting requests
  async getUserConsultingRequests(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const requests = await consultingService.getUserConsultingRequests(email);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching user requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Create consulting request AND send email notification
  async addConsulting(req: Request, res: Response) {
    try {
      const userName = req.body.userName || (req as any).user?.userName || "Unknown";
      const userEmail = req.body.email || (req as any).user?.email;
      if (!userEmail) {
        return res.status(400).json({ error: "User email is required to send notification" });
      }

      // Create request in DB
      const created = await consultingService.createConsultingRequest({
        ...req.body,
        name: userName,
        email: userEmail,
      });

      // Send email notification
      await notifyRequestSubmitted({
        type: "consulting",
        user: {
          name: (req as any).user?.fullName || req.body.userName,
          email: (req as any).user?.email || req.body.email,
        },
        payload: {
          organization: created.organization || req.body.organization,
          phone: created.phone || req.body.phone,
          category: created.category || req.body.category,
          description: created.description || req.body.description,
          timeline: created.timeline || req.body.timeline,
          budget: created.budget || req.body.budget,
        },
        id: (created as any)?._id?.toString?.(),
      });

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Error creating consulting request:", err);
      res.status(400).json({ error: err.message });
    }
  }
}

export const consultingController = new ConsultingController();
