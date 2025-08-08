import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { NextFunction, Request, Response } from "express";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
