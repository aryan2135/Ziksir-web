import { Router } from "express";
import * as MessageController from "../controllers/message.controller";

const router = Router();

// Save a new message
router.post("/", MessageController.createMessage);

// Fetch all messages
router.get("/", MessageController.getMessages);

// Fetch single message
router.get("/:id", MessageController.getMessage);

// Delete a message
router.delete("/:id", MessageController.deleteMessage);

export default router;
