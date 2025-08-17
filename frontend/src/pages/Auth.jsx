import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/ui/googleAuthButton";
import OtpComponent from "../components/hoc/OtpComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/api/axios";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    window.location.href =
      import.meta.env.VITE_API_URI + "/api/user/auth/google";
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(import.meta.env.VITE_API_URI + "/api/user/sendOTP", {
        email: formData.email,
      });
      setShowOtp(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const enteredOtp = otp.join("");
      await axios.post(import.meta.env.VITE_API_URI + "/api/user/verifyOTP", {
        email: formData.email,
        otp: enteredOtp,
      });
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin) {
      if (!showOtp) {
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Please fill all fields before generating OTP.");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        await sendOtp();
        return;
      } else if (otp.join("").length < 4) {
        setError("Please enter the complete 4-digit OTP.");
        return;
      }
    }

    try {
      if (isLogin) {
        const res = await axios.post(
          import.meta.env.VITE_API_URI + "/api/user/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("userType", user.role);

        navigate(user.role === "admin" ? "/admin/overview" : "/user");
      } else {
        const otpVerified = await verifyOtp();
        if (!otpVerified) return;

        await axios.post(import.meta.env.VITE_API_URI + "/api/user/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role || "user",
        });

        // ✅ Set isAuthenticated true after signup
        localStorage.setItem("isAuthenticated", "true");

        setIsLogin(true);
        setFormData({
          name: "",
          username: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
          role: "user",
        });
        setSuccess("Signup successful! Please log in.");
        setShowOtp(false);
        setOtp(["", "", "", ""]);
      }
    } catch (err) {
      let backendError =
        err?.response?.data?.message ||
        "An error occurred during authentication.";
      if (typeof backendError !== "string") {
        backendError = JSON.stringify(backendError);
      }

      setError(
        backendError.includes("Invalid") || backendError.includes("not")
          ? "Credentials mismatch."
          : backendError
      );
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="absolute top-4 left-4">
        <Button onClick={() => navigate("/")} variant="outline" size="sm">
          <i className="fas fa-home mr-2"></i> Home
        </Button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-sans text-4xl font-bold text-primary mb-2">
            ziksir
          </h1>
          <p className="text-muted-foreground font-open-sans">
            Research Infrastructure Platform
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-2xl text-accent-foreground"></i>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="font-open-sans">
              {isLogin
                ? "Sign in to access your research dashboard"
                : "Join the research community today"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <p className="text-red-500 text-center mb-4 font-semibold">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 text-center mb-4 font-semibold">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="absolute top-0 right-0 text-[13px] text-blue-600 hover:underline"
                  >
                    Forgot password ?
                  </button>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label> 
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {!isLogin && showOtp && (
                <>
                  <OtpComponent otp={otp} setOtp={setOtp} />
                  <Button
                    type="submit"
                    className={`w-full text-lg py-3 mt-2 ${
                      otp.join("").length < 4 || loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary"
                    }`}
                    disabled={otp.join("").length < 4 || loading}
                  >
                    {loading ? "Processing..." : "Sign Up"}
                  </Button>
                </>
              )}

              {(isLogin || !showOtp) && (
                <Button
                  type="submit"
                  className="w-full text-lg py-3"
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <i
                        className={`fas ${
                          isLogin
                            ? "fa-sign-in-alt"
                            : showOtp
                            ? "fa-user-plus"
                            : "fa-key"
                        } mr-2`}
                      ></i>
                      {isLogin ? "Sign In" : "Generate OTP"}
                    </>
                  )}
                </Button>
              )}
            </form>

            <GoogleAuthButton onClick={handleGoogleAuth}>
              {isLogin ? "Continue with Google" : "Sign Up with Google"}
            </GoogleAuthButton>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                    setShowOtp(false);
                    setOtp(["", "", "", ""]);
                  }}
                  className="text-accent hover:underline ml-1 font-semibold"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
