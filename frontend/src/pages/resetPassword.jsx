import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // For toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { id, token } = useParams();
  const navigate = useNavigate();

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_API_URI + "/api/user" + `/${id}/change-password`,
        { token, newPassword: password }
      );
      setSuccess(true);
    } catch (error) {
      console.log("error while updating password");
      setError("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black font-poppins flex items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/95 border border-border shadow-2xl text-center p-6">
          <CardTitle className="text-2xl font-semibold mb-4 text-primary">
            Password Changed Successfully!
          </CardTitle>
          <CardDescription className="mb-6">
            Your password has been updated. You can now sign in with your new
            password.
          </CardDescription>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Back to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black font-poppins flex items-center justify-center px-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/95 border border-border shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary hover:opacity-90">
              ziksir
            </h1>
          </a>
          <p className="text-sm text-muted-foreground">
            Research Infrastructure Platform
          </p>
          <CardTitle className="text-2xl font-semibold mt-3">
            Reset Your Password
          </CardTitle>
          <CardDescription className="mt-1">
            Enter your new password below to reset your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 mt-2">
          <div className="space-y-2 relative">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="border border-gray-300 rounded-md pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-colors focus:border-0"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="border border-gray-300 rounded-md pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-colors focus:border-0"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <Button
            className="w-full"
            onClick={handlePasswordUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
