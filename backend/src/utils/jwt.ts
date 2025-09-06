import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { NextFunction, Request, Response } from "express";

const isProd = env.NODE_ENV === "production";
const name = isProd ? "__Host-session" : "authToken";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[name];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as Express.User;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
