import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/user.routes';
import bookingRoutes from './routes/booking.routes';
import equipmentRoutes from './routes/equipment.routes';

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/equipment', equipmentRoutes);

export default app;
