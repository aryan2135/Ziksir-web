import { Request, Response } from "express";
import * as MessageService from "../services/message.service";
import notifyRequestSubmitted from "../utils/emails/notifyEmailrequests";

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageService.createMessage(req.body);

    // Pull identity from auth if available; fall back to body
    const nameFromAuth = (req as any).user?.fullName;
    const emailFromAuth = (req as any).user?.email;

    // Fire notifications (user + admin). Do not block response on email errors.
    try {
      await notifyRequestSubmitted({
        type: "message",
        user: {
          name: nameFromAuth || req.body.name,
          email: emailFromAuth || req.body.email,
        },
        payload: {
          organization: req.body.organization || req.body.institution || "", // <- include institution
          phone: req.body.phone,
          subject: req.body.subject || "Website contact message",
          message: req.body.message,
        },
        id: (message as any)?._id?.toString?.(),
      });
    } catch (e) {
      console.error("notify(message) failed:", e);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create message", error });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await MessageService.getAllMessages();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error });
  }
};

export const getMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageService.getMessageById(req.params.id);
    if (!message) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch message", error });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedMessage = await MessageService.deleteMessage(req.params.id);
    if (!deletedMessage) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message", error });
  }
};
