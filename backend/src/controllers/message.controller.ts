import { Request, Response } from "express";
import * as MessageService from "../services/message.service";

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await MessageService.createMessage(req.body);
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
