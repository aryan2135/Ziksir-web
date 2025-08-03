import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDB } from './config/db';
import userRoutes from './routes/user.routes';
import equipmentRoutes from "./routes/equipment.routes";
import bookingRoutes from './routes/booking.routes';

app.use('/api/auth', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);


const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
