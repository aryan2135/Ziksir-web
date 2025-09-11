import { Router } from "express";
import { PrototypingController } from "../controllers/prototyping.controller";
import { upload } from "../middlewares/uploadMiddleware";
const router = Router();
const prototypingController = new PrototypingController();

router.post(
  "/addPrototype",
  upload.single("file"),
  prototypingController.addPrototyping.bind(prototypingController)
);
router.delete(
  "/cancelPrototypeReq/:id",
  prototypingController.deletePrototyping.bind(prototypingController)
);

// GET all prototyping requests (for admin)
router.get(
  "/allPrototyping",
  prototypingController.getAllPrototyping.bind(prototypingController)
);

export default router;
