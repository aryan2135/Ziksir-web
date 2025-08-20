import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

class BookingController {
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const booking = await bookingService.updateBooking(
        req.params.id,
        req.body
      );
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(200).json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const booking = await bookingService.deleteBooking(req.params.id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingCounts(req: Request, res: Response): Promise<void> {
    try {
      const {
        totalBookings,
        approvedBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
      } = await bookingService.getBookingCounts();
      res.status(200).json({
        totalBookings,
        approvedBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingCountByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const bookings = await bookingService.getBookingCountByUserId(userId);
      res.status(200).json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const bookingController = new BookingController();
