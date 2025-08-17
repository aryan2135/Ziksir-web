import Message, { IMessageModel } from "../models/message.model";
import { IMessage } from "../interfaces/message.interface";
export const createMessage = async (data: IMessage): Promise<IMessageModel> => {
  const newMessage = new Message(data);
  return await newMessage.save();
};

export const getAllMessages = async (): Promise<IMessageModel[]> => {
  return await Message.find().sort({ createdAt: -1 });
};

export const getMessageById = async (id: string): Promise<IMessageModel | null> => {
  return await Message.findById(id);
};

export const deleteMessage = async (id: string): Promise<IMessageModel | null> => {
  return await Message.findByIdAndDelete(id);
};
