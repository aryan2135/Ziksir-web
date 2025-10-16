import { Request, Response } from "express";
import { PrototypingService } from "../services/prototyping.service";
import { notifyRequestSubmitted } from "../utils/emails/notifyEmailrequests";

const prototypingService = new PrototypingService();

export class PrototypingController {
  async addPrototyping(req: Request, res: Response) {
    try {
      // File info from multer
      let fileUrl = null;
      if (req.file) {
        fileUrl = `/uploads/requests/${req.file.filename}`;
      }

      // Merge file URL with rest of form data
      const prototypeData = {
        ...req.body,
        file: fileUrl,
        name: (req as any).user?.fullName || req.body.userName,
        email: (req as any).user?.email || req.body.email,
      };

      const created = await prototypingService.addPrototyping(prototypeData);

      await notifyRequestSubmitted({
        type: "prototyping",
        user: {
          name: (req as any).user?.fullName || req.body.userName,
          email: (req as any).user?.email || req.body.email,
        },
        payload: {
          organization: req.body.organization,
          phone: req.body.phone,
          prototypeType: req.body.prototypeType,
          requirements: req.body.requirements,
        },
        id: (created as any)?._id?.toString?.(),
      });

      res.status(201).json(created);
    } catch (err: any) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error adding prototyping data", error: err });
    }
  }

  async deletePrototyping(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await prototypingService.deletePrototyping(id);

      if (!deleted) {
        return res.status(404).json({ message: "Prototyping data not found" });
      }

      res.status(200).json({ message: "Prototyping data deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error deleting prototyping data", error: err });
    }
  }

  async getAllPrototyping(req: Request, res: Response) {
    try {
      const requests = await prototypingService.getAllPrototyping();
      res.status(200).json(requests);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching prototyping data", error: err });
    }
  }
  async getUserPrototyping(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const requests = await prototypingService.getUserPrototyping(email);
      res.status(200).json(requests);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching prototyping data", error: err });
    }
  }
}
