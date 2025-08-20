import { Request, Response } from "express";
import { PrototypingService } from "../services/prototyping.service";

const prototypingService = new PrototypingService();

export class PrototypingController {
  async addPrototyping(req: Request, res: Response) {
    try {
      // File info from multer
      let fileUrl = null;
      if (req.file) {
        // You can construct URL as per your server setup
        fileUrl = `/uploads/requests/${req.file.filename}`;
      }

      // Merge file URL with rest of form data
      const prototypeData = {
        ...req.body,
        file: fileUrl,
      };

      const data = await prototypingService.addPrototyping(prototypeData);
      res.status(201).json({ message: "Prototyping data added", data });
    } catch (err) {
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
}
