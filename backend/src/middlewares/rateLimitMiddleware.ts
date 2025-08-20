import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again later",
    });
  },
});
