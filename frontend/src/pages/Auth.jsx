import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // Special handling for admin
      if (formData.username === "admin") {
        if (formData.password === "admin123") { // Change to your real admin password
          const adminUser = {
            fullName: "Administrator",
            username: "admin",
            email: "admin@example.com"
          };
          localStorage.setItem("currentUser", JSON.stringify(adminUser));
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userType", "admin");
          navigate("/admin/Overview");
          return;
        } else {
          setError("Incorrect admin password.");
          return;
        }
      }

      // Normal user login
      const user = storedUsers.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userType", "user");
        navigate("/user");
      } else {
        setError("User is not registered. Redirecting to Sign Up...");
        setTimeout(() => {
          setIsLogin(false);
          setError("");
        }, 2000);
      }
    } else {
      // Sign Up validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.fullName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required.");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Save user in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const newUser = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      storedUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));

      // Save current user details for profile
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      // Auto login after sign up
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userType", "user");
      navigate("/user");
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Home Button */}
      <div className="absolute top-4 left-4">
        <Button onClick={() => navigate('/')} variant="outline" size="sm">
          <i className="fas fa-home mr-2"></i>
          Home
        </Button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
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
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="font-open-sans">
              {isLogin
                ? 'Sign in to access your research dashboard'
                : 'Join the research community today'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="font-open-sans"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="font-open-sans"
                />
              </div>

              {!isLogin && (
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
                    className="font-open-sans"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="font-open-sans"
                />
              </div>

              {!isLogin && (
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
                    className="font-open-sans"
                  />
                </div>
              )}

              <Button type="submit" className="w-full text-lg py-3">
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2`}></i>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground font-open-sans">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-accent hover:underline ml-1 font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
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
