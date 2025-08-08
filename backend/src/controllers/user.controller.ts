import { Request, Response } from "express";
import { authService } from "../services/user.service";
import passport from "passport";
import { generateToken } from "../utils/jwt";
import { env } from "../config/env";
import GenertateRandomString from "../utils/generateBytes";

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.signup(req.body);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTotalUserCount(req: Request, res: Response): Promise<void> {
    try {
      const totalUsers = await authService.getTotalUserCount();
      res.status(200).json({ totalUsers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await authService.updateUser(req.params.id, req.body);
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deletedUser = await authService.deleteUser(req.params.id);
      res
        .status(200)
        .json({ message: "User deleted successfully", user: deletedUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await authService.changePassword(
        req.params.id,
        req.body.newPassword
      );
      res
        .status(200)
        .json({ message: "Password changed successfully", user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  googleAuth = passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  });

  googleCallback = (req: Request, res: Response) => {
    passport.authenticate(
      "google",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          return res.status(401).json({ error: "Authentication failed" });
        }
        const token = generateToken(user.id);

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect(`${env.CLIENT_URL}/user`);
      }
    )(req, res);
  };

  authorization = (req: Request, res: Response) => {
    //DB call if needed,we can acess req.user here !
    res.status(200).json({ message: "completed" });
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      path: "/",
    });
    return res.status(200).json({ message: "logout successfully" });
  };

  forgotPassword = (req: Request, res: Response) => {
    const { email } = req.body;
    const token = GenertateRandomString();
  };
}
export const authController = new AuthController();
