// src/pages/AdminDas.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDas = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userType = localStorage.getItem("userType");

    if (!isAuthenticated || userType !== "admin") {
      console.log('auth value: ', isAuthenticated);
      console.log('userType value: ', userType);
      navigate("/auth");
      return;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const sidebarItems = [
    { id: "overview", icon: "fas fa-chart-bar", label: "Overview", path: "/admin/overview" },
    { id: "equipment", icon: "fas fa-cogs", label: "Equipment Management", path: "/admin/equipment" },
    { id: "bookings", icon: "fas fa-calendar-check", label: "Booking Requests", path: "/admin/bookings" },
    { id: "users", icon: "fas fa-users", label: "User Management", path: "/admin/users" },
    { id: "settings", icon: "fas fa-cog", label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background font-poppins flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="p-6 font-bold text-4xl font-sans text-primary mb-8 cursor-pointer"
          onClick={() => navigate("/")}>
            ziksir
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <i className={item.icon}></i>
                <span className="font-open-sans">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground font-open-sans">
                Welcome back, Administrator
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* <Button onClick={toggleTheme} variant="outline" size="sm">
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </Button> */}

              <Button onClick={handleLogout} variant="outline">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDas;
