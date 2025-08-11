import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("currentUser");
        const userId = JSON.parse(user)._id;
        const res = await axios.get(
          import.meta.env.VITE_API_URI + `/api/bookings/count/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch booking stats:", err);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/user" },
    { name: "Book Slots", path: "/user/book-slots" },
    { name: "Browse Equipment", path: "/user/browse-equipment" },
    { name: "My Bookings", path: "/user/my-bookings" },
    { name: "Request Equipment", path: "/user/request-equipment" },
    { name: "Research Assistant", path: "/user/research-assistant" },
    { name: "Profile", path: "/user/profile" },
  ];

  const isDashboard = location.pathname === "/user";

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // const handleUserLogout = async () => {
  //   try {
  //     await axios.post(
  //       import.meta.env.VITE_API_URI + "/api/user/logout",
  //       {},
  //       { withCredentials: true }
  //     );
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //     console.log("error while logout ...");
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userType");
    navigate("/"); 
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white shadow md:flex flex-col">
        <button
          className="py-6 text-2xl font-Lucida Sana font-bold  text-3xl text-black focus:outline-none"
          onClick={() => {
            navigate("/user");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          ziksir
        </button>
        <nav className="flex-1 px-4">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    location.pathname === item.path
                      ? "bg-blue-800 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen
            ? "opacity-100 pointer-events-auto bg-black bg-opacity-50"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        {/* Slide-in Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 transition-transform duration-300 ease-in-out transform ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent close on sidebar click
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              className="text-2xl font-bold text-black focus:outline-none"
              onClick={() => {
                navigate("/user");
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMobileSidebarOpen(false);
              }}
            >
              ziksir
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      location.pathname === item.path
                        ? "bg-blue-800 text-white"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 hidden md:flex justify-between items-center">
          <div>
            <h1 className=" text-xl font-bold">Research Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Manage your research activities and bookings
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            <button
              className="bg-white px-4 py-2 rounded hover:bg-blue-300 font-bold font-poppins"
              onClick={handleLogout} //changes to handle logout
            >
              Logout
            </button>
          </div>
        </header>
        {/* Mobile Header */}
        <header className="flex md:hidden bg-white shadow p-4 justify-between items-center">
          <button
            onClick={() => {
              navigate("/user");
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/user");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-2xl font-bold text-black"
          >
            ziksir
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-2xl focus:outline-none"
          >
            <i className="fas fa-bars"></i> {/* Font Awesome hamburger icon */}
          </button>
        </header>

        {/* Dashboard or Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isDashboard ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Welcome to Your Research Hub
              </h2>

              {/* Stats Section */}
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
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                          <i className={`${stat.icon} text-xl`}></i>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Equipment + Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Equipment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Equipment</CardTitle>
                    <CardDescription>
                      Equipment you've recently used or bookmarked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Confocal Microscope",
                          location: "Lab A-201",
                          lastUsed: "2 days ago",
                        },
                        {
                          name: "Flow Cytometer",
                          location: "Lab B-105",
                          lastUsed: "1 week ago",
                        },
                        {
                          name: "Mass Spectrometer",
                          location: "Lab C-301",
                          lastUsed: "2 weeks ago",
                        },
                      ].map((equipment, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                            <i className="fas fa-microscope"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{equipment.name}</h4>
                            <p className="text-sm text-gray-500">
                              {equipment.location} • {equipment.lastUsed}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Browse Equipment",
                          icon: "fas fa-search",
                          link: "/user/browse-equipment",
                        },
                        {
                          label: "New Booking",
                          icon: "fas fa-plus",
                          link: "/user/book-slots",
                        },
                        {
                          label: "Research Assistant",
                          icon: "fas fa-robot",
                          link: "/user/research-assistant",
                        },
                        {
                          label: "View Calendar",
                          icon: "fas fa-calendar",
                          link: "/user/my-bookings",
                        },
                      ].map((action, index) => (
                        <Link
                          key={index}
                          to={action.link}
                          className="border rounded-lg flex flex-col justify-center items-center h-20 hover:bg-gray-100 transition"
                        >
                          <i className={`${action.icon} text-xl`}></i>
                          <span className="text-sm">{action.label}</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
