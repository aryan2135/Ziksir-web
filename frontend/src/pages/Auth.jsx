import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check theme from localStorage
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

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication logic
    if (isLogin) {
      // Check credentials
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Redirect to admin dashboard
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      } else if (formData.username && formData.password) {
        // Regular user login
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/user');
      } else {
        alert('Please enter valid credentials');
      }
    } else {
      // Sign up logic
      if (formData.password === formData.confirmPassword && formData.username && formData.password) {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/user');
      } else {
        alert('Please check your inputs');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <Button onClick={toggleTheme} variant="outline" size="sm">
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </Button>
      </div>

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
          <h1 className="text-4xl font-bold text-primary mb-2">
            ZIKSI<span className="text-accent">Rweb</span>
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
                : 'Join the research community today'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground font-open-sans mb-2">
                <i className="fas fa-info-circle mr-2"></i>
                Demo Credentials:
              </p>
              <p className="text-sm font-mono">
                <strong>Admin:</strong> admin / admin123<br/>
                <strong>User:</strong> user / password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;