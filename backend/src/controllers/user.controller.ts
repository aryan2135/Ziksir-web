import { Request, Response } from "express";
import { authService } from "../services/user.service";
import { tokenService } from "../services/token.service";
import passport from "passport";
import { generateToken } from "../utils/jwt";
import { env } from "../config/env";
import { GenertateRandomString, generateOtp4 } from "../utils/generateCodes";
import { sendResetLinkEmail } from "../utils/emails/sendResetlinkEmail";
import { sendOtpEmail } from "../utils/emails/sendOTPemail";

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

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return res.status(400).json({ error: "User ID is missing" });
      }
      const updatedUser = await authService.updateUser(req.user.id, {
        ...req.body,
        organizationCategory: req.body.organization,
        organizationAddress: req.body.department,
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
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
      if (req.body.resetToken) {
        const resetToken = await tokenService.verifyResetToken(
          req.body.resetToken
        );
        if (!resetToken) {
          res.status(400).json({ message: "token expired or Invalid " });
          return;
        }
        req.params.id = resetToken.userId.toString();
      }
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
          return res.status(401).json({
            error:
              "Authentication failed ,  user did not sign uped via google please try login with user googel password instead ",
          });
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

  authorization = async (req: Request, res: Response) => {
    if (!req.user?.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ message: "completed", user });
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      path: "/",
    });
    return res.status(200).json({ message: "logout successfully" });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await authService.isEmailExists(email);
    if (user?.authProvider == "google")
      return res.status(200).json({
        message: "google users does not need to change password",
        googleUser: true,
      });
    if (!user)
      return res.status(200).json({
        isUserExists: false,
        message: "if this email exists , a password reset link has been sent  ",
      });

    const token = GenertateRandomString();
    try {
      await tokenService.saveResetToken(user._id, token);
      const resetURL =
        env.CLIENT_URL + "/reset-password" + `/${user._id}/` + token;

      await sendResetLinkEmail(email, resetURL);
      return res.status(200).json({ message: "email sent successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
  sendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const isExist = await authService.isEmailExists(email);
      if (isExist) {
        return res.status(400).json({
          message:
            "This email is already registered. Please sign in to continue",
        });
      }
      const otp = generateOtp4();
      const otpDoc = await tokenService.saveOtp(otp, email);

      if (!otpDoc) {
        return res.status(500).json({ message: "Error while saving OTP" });
      }
      sendOtpEmail(email, otp);
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in sendOTP:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyUserOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const isValid = await tokenService.verifyOtp(email, otp);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
export const authController = new AuthController();
