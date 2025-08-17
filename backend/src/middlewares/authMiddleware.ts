import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Step 1: find user
    const foundUser = await User.findById(decoded.id).select("-password");
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // Step 2: assign safely
    req.user = { id: foundUser._id.toString() }; // Type-safe for Express.User

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
