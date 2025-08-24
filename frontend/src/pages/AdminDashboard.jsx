// src/pages/AdminDas.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";

const AdminDas = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userType = localStorage.getItem("userType");

    if (!isAuthenticated || userType !== "admin") {
      navigate("/auth");
      return;
    }
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    try {
      await axios.post(
        import.meta.env.VITE_API_URI + "/api/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log("error while logout ...");
    }
  };

  const sidebarItems = [
    {
      id: "overview",
      icon: "fas fa-chart-bar",
      label: "Overview",
      path: "/admin/overview",
    },
    {
      id: "equipment",
      icon: "fas fa-cogs",
      label: "Equipment Management",
      path: "/admin/equipment",
    },
    {
      id: "bookings",
      icon: "fas fa-calendar-check",
      label: "Booking Requests",
      path: "/admin/bookings",
    },
    {
      id: "requests",
      icon: "fas fa-cogs",
      label: "Equipment Requests",
      path: "/admin/requests",
    },
    {
      id: "users",
      icon: "fas fa-users",
      label: "User Management",
      path: "/admin/users",
    },
    {
      id: "equipment-requests",
      icon: "fas fa-box",
      label: "Equipment Requests",
      path: "/admin/requests",
    },
    {
      id: "messages",
      icon: "fas fa-envelope",
      label: "User Messages",
      path: "/admin/messages",
    },
    {
      id: "settings",
      icon: "fas fa-cog",
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-poppins flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="p-6">
          <div
            className="p-6 font-bold text-4xl font-sans text-primary mb-8 cursor-pointer"
            onClick={() => {
              navigate("/admin/overview");
              setSidebarOpen(false);
            }}
          >
            ziksir
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
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

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground font-open-sans">
              Welcome back, Administrator
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={handleLogout} variant="outline">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
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
