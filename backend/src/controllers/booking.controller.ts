import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  const { equipment, date } = req.body;
  const booking = await Booking.create({
    userId: req.user._id,
    equipment,
    date,
  });
  res.status(201).json(booking);
};
