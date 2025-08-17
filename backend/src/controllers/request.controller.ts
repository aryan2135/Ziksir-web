import { Request, Response } from "express";
import { requestService } from "../services/request.service";
import { RequestInterface } from "../interfaces/request.interface";

class RequestController {
  // Create a request
  async createRequest(req: Request, res: Response) {
    try {
      let imageUrl: string | undefined;

      if ((req as any).file) {
        const file = (req as any).file as Express.Multer.File;
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/requests/${file.filename}`;
      }

      const newRequest = await requestService.createRequest({
        ...req.body,
        ...(imageUrl ? { imageUrl } : {}),
      } as RequestInterface);

      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: "Error creating request", error });
    }
  }

  // Get all requests
  async getRequests(_req: Request, res: Response) {
    try {
      const requests = await requestService.getAllRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching requests", error });
    }
  }

  // Get a single request by ID
  async getRequestById(req: Request, res: Response) {
    try {
      const request = await requestService.getRequestById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Error fetching request", error });
    }
  }

  // Update a request by ID
  async updateRequest(req: Request, res: Response) {
    try {
      let imageUrl: string | undefined;

      if ((req as any).file) {
        const file = (req as any).file as Express.Multer.File;
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/requests/${file.filename}`;
      }

      const updatedRequest = await requestService.updateRequest(req.params.id, {
        ...req.body,
        ...(imageUrl ? { imageUrl } : {}),
      });

      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating request", error });
    }
  }

  // Delete a request by ID
  async deleteRequest(req: Request, res: Response) {
    try {
      const deletedRequest = await requestService.deleteRequest(req.params.id);
      if (!deletedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting request", error });
    }
  }
}

export const requestController = new RequestController();
