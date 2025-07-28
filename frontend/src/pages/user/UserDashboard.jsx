import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function UserDashboard() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/user" },
    { name: "Book Slots", path: "/user/book-slots" },
    { name: "Browse Equipment", path: "/user/browse-equipment" },
    { name: "My Bookings", path: "/user/my-bookings" },
    { name: "Research Assistant", path: "/user/research-assistant" },
    { name: "Profile", path: "/user/profile" },
  ];

  const isDashboard = location.pathname === "/user";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-6 font-Lucida Sana font-bold text-3xl text-black-500 t">ziksir</div>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Research Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Manage your research activities and bookings
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            <button className="bg-pink-100 px-4 py-2 rounded hover:bg-blue-300 font-bold font-poppins "
                    onClick={() => window.location.href = '/' } >Logout</button>
          </div>
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
                    value: "5",
                    icon: "fas fa-calendar-check",
                  },
                  {
                    title: "Pending Requests",
                    value: "2",
                    icon: "fas fa-clock",
                  },
                  {
                    title: "Completed Sessions",
                    value: "18",
                    icon: "fas fa-check-circle",
                  },
                ].map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
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
