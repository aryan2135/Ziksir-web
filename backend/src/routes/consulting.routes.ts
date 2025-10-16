import { Router } from "express";
import { consultingController } from "../controllers/consulting.controller";

const router = Router();

// Add new consulting request
router.post(
  "/addConsulting",
  consultingController.addConsulting.bind(consultingController)
);

// Delete consulting request
router.delete(
  "/cancelConsulting/:id",
  consultingController.deleteConsultingRequest.bind(consultingController)
);

// GET all consulting requests (for admin)
router.get(
  "/allConsulting",
  consultingController.getAllConsultingRequests.bind(consultingController)
);

router.patch(
  "/updateConsulting/:id",
  consultingController.updateConsultingRequest.bind(consultingController)
);
router.post(
  "/userConsulting",
  consultingController.getUserConsultingRequests.bind(consultingController)
);
export default router;
