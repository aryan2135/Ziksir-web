import { Booking } from "../models/Booking.model";
import { Equipment } from "../models/Equipment.model";
import { Booking as BookingInterface } from "../interfaces/booking.interface";

class BookingService {
    async createBooking(data: BookingInterface): Promise<BookingInterface> {
        const booking = new Booking(data);

        const savedBooking = await booking.save();

        if (savedBooking.status === 'approved') {
            await Equipment.findByIdAndUpdate(savedBooking.equipmentId, {
                $inc: { available: -1 },
            });
        }

        return savedBooking;
    }

    async getAllBookings(): Promise<BookingInterface[]> {
        return await Booking.find().populate("userId").populate("equipmentId");
    }

    async getBookingById(id: string): Promise<BookingInterface | null> {
        return await Booking.findById(id).populate("userId").populate("equipmentId");
    }

    async updateBooking(id: string, data: Partial<BookingInterface>): Promise<BookingInterface | null> {
        const existingBooking = await Booking.findById(id);
        if (!existingBooking) {
            throw new Error("Booking not found");
        }

        if (data.status && data.status !== existingBooking.status) {
            const equipmentId = existingBooking.equipmentId;

            if (existingBooking.status === 'approved' && data.status !== 'approved') {
                await Equipment.findByIdAndUpdate(equipmentId, {
                    $inc: { available: 1 },
                });
            }

            if (data.status === 'approved') {
                await Equipment.findByIdAndUpdate(equipmentId, {
                    $inc: { available: -1 },
                });
            }

            if (data.status === 'completed' || data.status === 'cancelled') {
                await Equipment.findByIdAndUpdate(equipmentId, {
                    $inc: { available: 1 },
                });
            }
        }

        return await Booking.findByIdAndUpdate(id, data, { new: true }).populate("userId").populate("equipmentId");
    }

    async deleteBooking(id: string): Promise<BookingInterface | null> {
        const existingBooking = await Booking.findById(id);
        if (!existingBooking) {
            throw new Error("Booking not found");
        }

        if (existingBooking.status === 'approved' || existingBooking.status === 'completed') {
            throw new Error("Cannot delete a booking with status 'approved' or 'completed'");
        }

        return await Booking.findByIdAndDelete(id);
    }

    async getBookingsByUserId(userId: string): Promise<BookingInterface[]> {
        return await Booking.find({ userId }).populate("equipmentId");
    }

    async getBookingsByEquipmentId(equipmentId: string): Promise<BookingInterface[]> {
        return await Booking.find({ equipmentId }).populate("userId");
    }
}

export const bookingService = new BookingService();