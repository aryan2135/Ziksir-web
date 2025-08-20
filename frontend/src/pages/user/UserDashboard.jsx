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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(""); // Consulting or Prototyping
  const [activeTab, setActiveTab] = useState("Consultancy");

  const [formData, setFormData] = useState({
    phone: "",
    organization: "",
    category: "",
    timeline: "",
    budget: "",
    description: "",
    prototypeType: "",
    materials: "",
    equipment: "",
    requirements: "",
    useCase: "",
    scalability: "",
    ip: "",
    file: null,
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
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch booking stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const menuItems = [
    { name: "Dashboard", path: "/user" },
    { name: "Book Slots", path: "/user/book-slots" },
    { name: "Browse Equipment", path: "/user/browse-equipment" },
    { name: "My Bookings", path: "/user/my-bookings" },
    { name: "Request Equipment", path: "/user/request-equipment" },
    { name: "Profile", path: "/user/profile" },
  ];

  const isDashboard = location.pathname === "/user";

  const handleUserLogout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URI + "/api/user/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userProfile");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("savedProfile");
      localStorage.setItem("isAuthenticated", "false");
      navigate("/");
    } catch (error) {
      console.log(error);
      console.log("error while logout ...");
    }
  };

  const handleOpenForm = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { formType, ...formData });
    setIsModalOpen(false);
    setFormData({
      phone: "",
      organization: "",
      category: "",
      timeline: "",
      budget: "",
      description: "",
      prototypeType: "",
      materials: "",
      equipment: "",
      requirements: "",
      useCase: "",
      scalability: "",
      ip: "",
      file: null,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-white shadow md:flex flex-col">
        <button
          className="py-6 text-3xl font-bold text-black focus:outline-none"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Research Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Manage your research activities and bookings
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            <button
              className="bg-white px-4 py-2 rounded hover:bg-blue-300 font-bold"
              onClick={handleUserLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
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
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                          <i className={`${stat.icon} text-xl`}></i>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Consultancy & Prototyping */}
              <Card>
                <CardHeader>
                  <CardTitle>Consultancy & Prototyping</CardTitle>
                  <CardDescription>
                    Get expert guidance, prototype support, and resources tailored to your research and innovation needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Tabs */}
                  <div className="flex space-x-4 mb-4">
                    <Button
                      onClick={() => setActiveTab("Consultancy")}
                      className={`flex-1 ${
                        activeTab === "Consultancy"
                          ? "bg-blue-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Consultancy
                    </Button>
                    <Button
                      onClick={() => setActiveTab("Prototyping")}
                      className={`flex-1 ${
                        activeTab === "Prototyping"
                          ? "bg-violet-800 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Prototyping
                    </Button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "Consultancy" && (
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Our consultancy services provide personalized guidance to
                        strengthen your research outcomes:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                        <li>Proposal review, experiment design, and methodology selection.</li>
                        <li>Funding advice, grant writing, and compliance support.</li>
                        <li>Publication guidance, peer-review preparation, and collaboration strategies.</li>
                      </ul>
                      <Button
                        onClick={() => handleOpenForm("Consulting")}
                        className="mt-4 w-full bg-blue-800 hover:bg-blue-900 text-white"
                      >
                        Request Consulting
                      </Button>
                    </div>
                  )}

                  {activeTab === "Prototyping" && (
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Transform your ideas into working prototypes with expert support:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                        <li>Mechanical, Electrical, IoT device development.</li>
                        <li>Software apps, platforms, and system integrations.</li>
                        <li>Testing, scalability planning, and manufacturability guidance.</li>
                      </ul>
                      <Button
                        onClick={() => handleOpenForm("Prototyping")}
                        className="mt-4 w-full bg-violet-800 hover:bg-violet-900 text-white"
                      >
                        Request Prototyping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              {formType} Request Form
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Shared Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Organization / Institution"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Consultancy Form */}
              {formType === "Consulting" && (
                <>
                  <input
                    type="text"
                    placeholder="Research Category / Domain"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                  <textarea
                    placeholder="Describe your research goals, challenges, or areas where you seek guidance..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Estimated Timeline (e.g., 3 months)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.timeline}
                    onChange={(e) =>
                      setFormData({ ...formData, timeline: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Approx. Budget (if applicable)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />
                </>
              )}

              {/* Prototyping Form */}
              {formType === "Prototyping" && (
                <>
                  <input
                    type="text"
                    placeholder="Prototype Type (Mechanical, Electrical, Software, etc.)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.prototypeType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prototypeType: e.target.value,
                      })
                    }
                    required
                  />
                  <textarea
                    placeholder="Materials / Components Needed"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    rows={2}
                    value={formData.materials}
                    onChange={(e) =>
                      setFormData({ ...formData, materials: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Equipment / Tools Required"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    rows={2}
                    value={formData.equipment}
                    onChange={(e) =>
                      setFormData({ ...formData, equipment: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Technical Requirements / Specifications"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Intended Use Case / Application"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    value={formData.useCase}
                    onChange={(e) =>
                      setFormData({ ...formData, useCase: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Scalability Plans (Prototype → Production)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.scalability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scalability: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Intellectual Property / Patents (if any)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={formData.ip}
                    onChange={(e) =>
                      setFormData({ ...formData, ip: e.target.value })
                    }
                  />
                  <input
                    type="file"
                    className="w-full border rounded-lg p-2"
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files[0] })
                    }
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white"
              >
                Submit {formType} Request
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
