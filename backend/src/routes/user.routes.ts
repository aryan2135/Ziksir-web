import express from "express";
import { authController } from "../controllers/user.controller";
import passport from "passport";
import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/auth/google", authController.googleAuth);
router.get("/auth/google/callback", authController.googleCallback);
router.get("/auth/verification", verifyToken, authController.authorization);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.get("/count", authController.getTotalUserCount);
router.get("/", authController.getAllUsers);
router.get("/:id", authController.getUserById);
router.put("/:id", authController.updateUser);
router.delete("/:id", authController.deleteUser);
router.post("/:id/change-password", authController.changePassword);
export default router;
