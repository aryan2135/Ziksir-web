import express from 'express';
import { bookingController } from '../controllers/booking.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();
router.get('/test', (req, res) => {
    res.json({ message: 'Booking route is working!' });
})
router.post('/',(req, res) => bookingController.createBooking(req, res));
router.get('/', (req, res) => bookingController.getAllBookings(req, res));
router.get('/count', (req, res) => bookingController.getBookingCounts(req, res));
router.get('/count/:id', (req, res) => bookingController.getBookingCountByUserId(req, res));
router.get('/:id', (req, res) => bookingController.getBookingById(req, res));
router.put('/:id', (req, res) => bookingController.updateBooking(req, res));
router.delete('/:id', (req, res) => bookingController.deleteBooking(req, res));

export default router;
