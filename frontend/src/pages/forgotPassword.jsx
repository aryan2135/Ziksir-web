import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/api/axios";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendResetLink = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URI + "/api/user/forgot-password",
        { email }
      );
      if (response.data.googleUser === true) {
        setErrorMsg(
          "You are logged in via Google. Password reset is not available. Please use Google login."
        );
        setSent(false);
      } else {
        setSent(true);
      }
    } catch (error) {
      console.log("Error while sending reset mail", error.message);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black font-poppins flex items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/95 border border-border shadow-2xl text-center p-6">
          <CardHeader>
            <h1 className="text-3xl font-bold text-primary">ziksir</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="animate-pulse text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent animate-fadeIn">
              Reset link sent
            </h2>
            <p className="text-base text-gray-500 leading-relaxed font-normal ">
              If this email exists in our records, we’ve sent a reset link to
              it. Please check your inbox. If it doesn’t appear within a few
              minutes, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <a
              href="/auth"
              className="text-blue-400 font-semibold hover:underline"
            >
              Return to Sign In
            </a>
          </CardFooter>
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
            Enter your verified email address, and we’ll send you a link to
            reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 mt-2">
          {errorMsg && (
            <p className="text-red-500 text-sm mb-2 font-semibold text-center">
              {errorMsg}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md focus:border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSendResetLink}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center mt-6">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <a
              href="/auth"
              className="text-blue-500 font-medium hover:underline"
            >
              Back to Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
