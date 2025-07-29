import { Request, Response } from "express";
import { authService } from "../services/auth.service";

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
            res.status(200).json({ message: "Login successful", token, user });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const authController = new AuthController();