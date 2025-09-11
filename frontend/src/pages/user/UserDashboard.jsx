import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { Helmet } from "react-helmet";

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/user" },
    { name: "Book Slots", path: "/user/book-slots" },
    { name: "Browse Equipment", path: "/user/browse-equipment" },
    { name: "Request Equipment", path: "/user/request-equipment" },
    { name: "My Bookings", path: "/user/my-bookings" },
    { name: "Consultancy", path: "/user/consultancy" },
    { name: "Prototyping", path: "/user/prototyping" },
    { name: "Profile", path: "/user/profile" },
  ];

  const isDashboard = location.pathname === "/user";

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("currentUser");
      const userId = JSON.parse(user)._id;

      const res = await axios.get(
        import.meta.env.VITE_API_URI + `/api/bookings/count/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(
        res.data || {
          totalBookings: 0,
          pendingBookings: 0,
          completedBookings: 0,
        }
      );
    } catch (err) {
      console.error("Failed to fetch booking stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (location.pathname === "/user") {
      fetchStats();
    }
  }, [location.pathname, fetchStats]);

  useEffect(() => {
    const onFocus = () => fetchStats();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchStats();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchStats]);

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URI + "/api/user/logout");
    } catch (error) {
      console.log(error);
    }
    navigate("/");
  };

  // Example: Announcements, Quick Links, and Tips
  const announcements = [
    {
      title: "🎉 New Equipment Added!",
      desc: "Check out the latest additions to our research equipment inventory.",
      link: "/user/browse-equipment",
      linkText: "Browse Equipment",
    },
    {
      title: "📢 Consultancy Open",
      desc: "Get expert advice for your research or startup. Submit your request today.",
      link: "/user/consultancy",
      linkText: "Request Consultancy",
    },
    {
      title: "🛠️ Prototyping Support",
      desc: "Transform your ideas into reality with our prototyping services.",
      link: "/user/prototyping",
      linkText: "Prototyping Info",
    },
  ];

  const tips = [
    "Tip: You can track all your bookings and requests from 'My Bookings'.",
    "Tip: Use the 'Browse Equipment' page to find the best tools for your research.",
    "Tip: Need help? Reach out via Consultancy for expert guidance.",
  ];

  return (
    <>
      <Helmet>
        <title>User Dashboard | Ziksir</title>
        <meta
          name="description"
          content="Manage your research activities, bookings, and profile on Ziksir's user dashboard."
        />
        <meta
          name="keywords"
          content="research, dashboard, bookings, ziksir, equipment, consultancy, prototyping"
        />
        <meta name="author" content="Ziksir" />
        <meta property="og:title" content="User Dashboard | Ziksir" />
        <meta
          property="og:description"
          content="Manage your research activities, bookings, and profile on Ziksir's user dashboard."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Responsive Navbar */}
      <header className="w-full bg-white shadow sticky top-0 z-50">
        <nav className="container mx-auto px-2 sm:px-4 py-5 flex items-center justify-between">
          {/* Logo */}
          <button
            className="text-3xl sm:text-4xl font-bold text-primary"
            onClick={() => navigate("/user")}
          >
            ziksir
          </button>
          {/* Desktop: Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="font-semibold hidden md:inline-flex"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </Button>
          {/* Mobile: Menu Button */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="outline"
            size="sm"
            className="md:hidden"
            aria-label="Open menu"
          >
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </Button>
        </nav>
        {/* Desktop: Menu Items Bar */}
        <div className="w-full bg-gradient-to-r from-primary via-accent to-violet-400 border-t border-gray-200 shadow-sm hidden md:block">
          <div className="container mx-auto px-2 sm:px-4 py-3 flex overflow-x-auto gap-2 md:gap-3 lg:gap-4 scrollbar-thin scrollbar-thumb-gray-200 justify-center">
            {menuItems.map((item) => (
              <span
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer px-3 sm:px-4 py-2 font-semibold whitespace-nowrap transition shadow-none rounded-full
                  ${location.pathname === item.path
                    ? "bg-white text-primary"
                    : "bg-white/80 text-primary hover:bg-white/90"}
                `}
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minWidth: "90px",
                  maxWidth: "140px",
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  borderRadius: "9999px",
                  transition: "background 0.2s, color 0.2s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                }}
                title={item.name}
              >
                <span className="block truncate">{item.name}</span>
              </span>
            ))}
          </div>
        </div>
      </header>
      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex md:hidden">
          <div className="bg-white w-64 h-full p-6 flex flex-col gap-4 shadow-lg">
            <button
              className="text-2xl font-bold text-primary mb-6"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/user");
              }}
            >
              ziksir
            </button>
            {menuItems.map((item) => (
              <span
                key={item.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.path);
                }}
                className={`cursor-pointer px-4 py-2 font-semibold rounded-full text-left transition
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
                  display: "block",
                  cursor: "pointer",
                }}
              >
                {item.name}
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
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
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
          {isDashboard ? (
            <div className="space-y-8">
              {/* Welcome & Stats */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="flex-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug">
                  Welcome to Your Research Hub
                </h2>
                <Button
                  variant="outline"
                  onClick={fetchStats}
                  disabled={statsLoading}
                  aria-label="Refresh stats"
                  className="shrink-0 border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {statsLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "My Bookings",
                    value: stats.totalBookings,
                    icon: "fas fa-calendar-check",
                  },
                  {
                    title: "Pending Requests",
                    value: stats.pendingBookings,
                    icon: "fas fa-clock",
                  },
                  {
                    title: "Completed Sessions",
                    value: stats.completedBookings,
                    icon: "fas fa-check-circle",
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">{stat.title}</p>
                          <p className="text-3xl font-bold">
                            {statsLoading ? "…" : stat.value}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center text-white">
                          <i className={`${stat.icon} text-xl`}></i>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Announcements */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Latest Announcements</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {announcements.map((a, i) => (
                    <Card key={i} className="border-l-4 border-primary bg-white/90">
                      <CardContent className="p-4">
                        <div className="font-bold text-foreground mb-1">{a.title}</div>
                        <div className="text-gray-700 mb-2">{a.desc}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary"
                          onClick={() => navigate(a.link)}
                        >
                          {a.linkText}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              {/* Tips & Help */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Tips & Help</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </>
  );
}
