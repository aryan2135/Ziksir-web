import { User as UserInterface, UserData } from "../interfaces/user.interface";
import { User } from "../models/user.model";

import { model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async signup(userData: UserData): Promise<UserInterface> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user", // Default role is 'user'
    });

    return await newUser.save();
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: UserData }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret", // Use a secure secret in production
      { expiresIn: "7d" }
    );

    return { token, user };
  }

  async getTotalUserCount(): Promise<number> {
    return await User.countDocuments();
  }
  async getAllUsers(): Promise<UserInterface[]> {
    return await User.find().select("-password");
  }

  async getUserById(userId: string): Promise<UserInterface | null> {
    return await User.findById(userId).select("-password");
  }

  async updateUser(
    userId: string,
    userData: Partial<UserData>
  ): Promise<UserInterface | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    ).select("-password");
  }

  async deleteUser(userId: string): Promise<UserInterface | null> {
    return await User.findByIdAndDelete(userId);
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<UserInterface | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, runValidators: true }
    ).select("-password");
  }

  async isEmailExists(emaill: string): Promise<UserInterface | null> {
    return await User.findOne({ emailId: emaill });
  }

  async loginViaGoogle(profile: {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }) {
    const existingUser = await User.findOne({ clientId: profile.id });

    if (existingUser) {
      return existingUser;
    }
    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails?.[0]?.value || "",
      clientId: profile.id,
    });

    return newUser;
  }
}

export const authService = new AuthService();
