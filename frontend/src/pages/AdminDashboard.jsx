// src/pages/AdminDas.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { Helmet } from "react-helmet";

const AdminDas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const location = useLocation();

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
      setMessage({ type: "error", text: "Error while logging out." });
    }
  };

  const menuItems = [
    { name: "Overview", icon: "fas fa-chart-bar", path: "/admin/overview" },
    { name: "Equipment Management", icon: "fas fa-cogs", path: "/admin/equipment" },
    { name: "Booking Requests", icon: "fas fa-calendar-check", path: "/admin/bookings" },
    { name: "Equipment Requests", icon: "fas fa-box", path: "/admin/requests" },
    { name: "User Management", icon: "fas fa-users", path: "/admin/users" },
    { name: "Consulting & Prototyping", icon: "fas fa-lightbulb", path: "/admin/consult-prototype" },
    { name: "User Messages", icon: "fas fa-envelope", path: "/admin/messages" },
    { name: "Settings", icon: "fas fa-cog", path: "/admin/settings" },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Ziksir</title>
        <meta name="description" content="Admin dashboard for Ziksir platform." />
      </Helmet>
      {/* Responsive Navbar */}
      <header className="w-full bg-white shadow sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-5 flex items-center justify-between">
          {/* Logo */}
          <button
            className="text-4xl font-bold text-primary"
            onClick={() => navigate("/admin/overview")}
          >
            ziksir
          </button>
          {/* Desktop: Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-red-600 text-red-600 font-semibold hidden md:inline-flex"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
          {/* Mobile: Menu Button */}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="outline"
            size="sm"
            className="md:hidden"
            aria-label="Open menu"
          >
            <i className={`fas ${sidebarOpen ? "fa-times" : "fa-bars"}`}></i>
          </Button>
        </nav>
        {/* Desktop: Menu Items Bar */}
        <div className="w-full bg-gradient-to-r from-primary via-accent to-violet-400 border-t border-gray-200 shadow-sm hidden md:block">
          <div className="container mx-auto px-2 sm:px-4 py-3 flex overflow-x-auto gap-2 md:gap-3 lg:gap-4 scrollbar-thin scrollbar-thumb-gray-200 justify-center">
            {menuItems.map((item) => (
              <span
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer px-3 sm:px-4 py-2 font-semibold whitespace-nowrap transition shadow-none rounded-full flex items-center gap-2
                  ${location.pathname === item.path
                    ? "bg-white text-primary"
                    : "bg-white/80 text-primary hover:bg-white/90"}
                `}
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minWidth: "90px",
                  maxWidth: "170px",
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  borderRadius: "9999px",
                  transition: "background 0.2s, color 0.2s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                title={item.name}
              >
                <i className={`${item.icon} text-base`} />
                <span className="block truncate">{item.name}</span>
              </span>
            ))}
          </div>
        </div>
      </header>
      {/* Mobile Sidebar Menu */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex md:hidden">
          <div className="bg-white w-64 h-full p-6 flex flex-col gap-4 shadow-lg">
            <button
              className="text-2xl font-bold text-primary mb-6"
              onClick={() => {
                setSidebarOpen(false);
                navigate("/admin/overview");
              }}
            >
              ziksir
            </button>
            {menuItems.map((item) => (
              <span
                key={item.path}
                onClick={() => {
                  setSidebarOpen(false);
                  navigate(item.path);
                }}
                className={`cursor-pointer px-4 py-2 font-semibold rounded-full text-left transition flex items-center gap-2
                  ${location.pathname === item.path
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary hover:bg-primary/20"}
                `}
                style={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  minWidth: "120px",
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  borderRadius: "9999px",
                  marginBottom: "8px",
                  transition: "background 0.2s, color 0.2s",
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <i className={`${item.icon} text-base`} />
                <span className="block truncate">{item.name}</span>
              </span>
            ))}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="border-red-600 text-red-600 font-semibold mt-auto"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        {message.text && message.type === "success" && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-white bg-green-600`}>
            {message.text}
          </div>
        )}
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h2 className="flex-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug">
              Admin Dashboard
            </h2>
            <span className="text-sm text-muted-foreground font-open-sans">
              Welcome back, Administrator
            </span>
          </div>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminDas;
