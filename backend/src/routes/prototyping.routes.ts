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

export default router;
