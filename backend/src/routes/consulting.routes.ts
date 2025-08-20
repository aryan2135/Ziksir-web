import { Router } from "express";
import { consultingController } from "../controllers/consulting.controller";

const router = Router();

// Add new consulting request
router.post(
  "/addConsulting",
  consultingController.createConsultingRequest.bind(consultingController)
);

// Delete consulting request
router.delete(
  "/cancelConsulting/:id",
  consultingController.deleteConsultingRequest.bind(consultingController)
);

export default router;
