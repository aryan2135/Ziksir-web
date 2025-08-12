import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/ui/googleAuthButton";
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
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Login
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
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userType", user.role);

        navigate(user.role === "admin" ? "/admin/overview" : "/user");
      } else {
        // Signup validation
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("All fields are required.");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        // Signup
        await axios.post(import.meta.env.VITE_API_URI + "/api/user/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role || "user",
        });

        setIsLogin(true);
        setFormData({
          name: "",
          username: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
          role: "user",
        });
        setError("Signup successful! Please log in.");
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
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-[38px] right-3 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute top-[38px] right-3 text-gray-500"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Select Role</Label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full text-lg py-3">
                <i
                  className={`fas ${
                    isLogin ? "fa-sign-in-alt" : "fa-user-plus"
                  } mr-2`}
                ></i>
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
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
