import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import "../src/config/passport/googleStrategy";

import userRoutes from './routes/user.routes';
import bookingRoutes from './routes/booking.routes';
import equipmentRoutes from './routes/equipment.routes';
import requestRoutes from './routes/request.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();
const app = express();

console.log("client url: ", process.env.CLIENT_URL);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/user',
      '/api/bookings', 
      '/api/equipment',
      '/api/requests',
      '/api/messages'
    ]
  });
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

export default app;
