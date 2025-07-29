import express from 'express';
import { createBooking } from '../controllers/booking.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/', protect, createBooking);
export default router;
