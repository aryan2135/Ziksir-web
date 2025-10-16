import express from "express";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware";
import { env } from "./config/env";
import "./config/passport/googleStrategy";

import userRoutes from "./routes/user.routes";
import bookingRoutes from "./routes/booking.routes";
import equipmentRoutes from "./routes/equipment.routes";
import requestRoutes from "./routes/request.routes";
import messageRoutes from "./routes/message.routes";
import consultingRouer from "./routes/consulting.routes";
import prototypingRouter from "./routes/prototyping.routes";

const app = express();

console.log("client url: ", process.env.CLIENT_URL);
console.log("database url: ", process.env.MONGO_URI);

app.set("trust proxy", 1);

const allowOrigin = env.CLIENT_URL;

// ✅ All-in-one CORS middleware (Express 5 safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Vary", "Origin"); // good practice
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  // Preflight ko yahin end kar do
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(rateLimitMiddleware);

app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/consulting", consultingRouer);
app.use("/api/prototyping", prototypingRouter);
app.use("/api/testing", (req, res) => {
  res.json({ message: "Testing endpoint" });
});

// Basic health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    routes: [
      "/api/user",
      "/api/bookings",
      "/api/equipment",
      "/api/requests",
      "/api/messages",
    ],
  });
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// import { sendEmail } from "./utils/emails/sendEmail";

// app.get("/api/test-email", async (req, res) => {
//   try {
//     const info = await sendEmail(
//       "aryandongre53@gmail.com",
//       "Ziksir Email Test",
//       "<h2>It works! ✅</h2>"
//     );
//     res.json({ success: true, info });
//   } catch (error) {
//     console.error(error);
//     const message = error instanceof Error ? error.message : String(error);
//     res.status(500).json({ success: false, error: message });
//   }
// });

export default app;
