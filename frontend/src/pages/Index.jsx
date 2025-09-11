import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "@/api/axios";
import SlideInSection from "@/components/ui/slidein";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";

const ziksir = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isUserLogin = async () => {
      try {
        await axios.get(
          import.meta.env.VITE_API_URI + "/api/user/auth/verification",
          { withCredentials: true }
        );
        navigate("/user");
      } catch (error) {
        console.log("! for development mode ,user yet not authenticated");
      }
    };
    isUserLogin();
  }, []);

  // Fetch equipment suggestions for search
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URI + "/api/equipment");
        setEquipments(res.data || []);
      } catch (err) {
        console.error("Error fetching equipments:", err);
      }
    };
    fetchEquipments();
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | success | error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      await axios.post(import.meta.env.VITE_API_URI + "/api/messages", formData);
      setStatus("success");
      setFormData({ name: "", email: "", institution: "", message: "" }); // reset form
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Helmet>
        <title>Ziksir | World class services & equipment on demand</title>
        <meta name="description" content="World class services & equipment on demand. Book research equipment, consultancy, and prototyping services easily with Ziksir." />
        <meta name="keywords" content="equipment, research, booking, ziksir, consultancy, prototyping, services" />
        <meta name="author" content="Ziksir" />
        <meta property="og:title" content="Ziksir | World class services & equipment on demand" />
        <meta property="og:description" content="Book research equipment, consultancy, and prototyping services easily with Ziksir." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="ml-2 sm:ml-4 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-open-sans"
          >
            ziksir
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:flex items-center w-full max-w-2xl mx-8">
            <div className="flex items-center w-full rounded-full border border-gray-300 shadow-sm hover:shadow-md transition bg-white px-2 py-1">
              <input
                type="text"
                placeholder="Search equipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-700"
              />
              <button
                className="bg-primary text-white px-6 py-2 rounded-full ml-2 hover:bg-primary/90 transition"
                onClick={() => {
                  navigate(`/search?query=${searchQuery}`);
                  setShowSearchSuggestions(false);
                }}
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className="absolute top-full mt-2 bg-white border rounded-xl shadow-xl w-full z-50">
                <ul className="divide-y divide-gray-100">
                  <li
                    className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        navigate(
                          `/search?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
                        );
                      });
                      setShowSearchSuggestions(false);
                    }}
                  >
                    <i className="fas fa-location-dot text-primary"></i>
                    <span>Nearby – Find equipments around you</span>
                  </li>
                  {equipments
                    .filter((eq) =>
                      eq.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((eq) => (
                      <li
                        key={eq._id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigate(`/search?equipment=${eq._id}`);
                          setShowSearchSuggestions(false);
                        }}
                      >
                        {eq.name} – {eq.location}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["features", "process", "pricing", "contact"].map((sec) => (
              <button
                key={sec}
                onClick={() => scrollToSection(sec)}
                className="text-foreground hover:text-accent transition-colors"
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}
            <Button
              onClick={() => (window.location.href = "/auth")}
              variant="default"
              size="sm"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={() => (window.location.href = "/auth")}
              variant="default"
              size="sm"
              className="text-xs px-3 py-1"
            >
              <i className="fas fa-sign-in-alt"></i>
            </Button>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
            >
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {["features", "process", "pricing", "contact"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className="block w-full text-left text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-secondary"
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </button>
              ))}
              <button
                onClick={() => (window.location.href = "/auth")}
                className="block w-full text-left text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-secondary"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </button>
            </div>
          </div>
        )}
      </header>


      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-10 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              World class services & facilities on demand
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 font-open-sans px-2">
              Access thousands of instruments and services from renowned scientific organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Institution Logos Section */}
      <section className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16 xl:py-20 px-4">
        <div className="text-center">
          <p className="text-base sm:text-lg lg:mb-16 xl:mb-20 mb-8 sm:mb-10 opacity-80 tracking-wide px-2">
            Trusted by leading institutions across the country.
          </p>
          <div className="relative w-full overflow-hidden">
            <div className="flex min-w-full animate-marquee gap-4 sm:gap-6 lg:gap-8">
              <img
                src="logo-iitkgp.png"
                alt="IIT Kharagpur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-cu.png"
                alt="Calcutta University"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-durgapur.png"
                alt="NIT Durgapur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-jadavpur.png"
                alt="Jadavpur University"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-shibpur.png"
                alt="IIEST Shibpur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-heritage.png"
                alt="Heritage College"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-bangalore.png"
                alt="IISc Bangalore"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />

              <img
                src="logo-iitkgp.png"
                alt="IIT Kharagpur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-cu.png"
                alt="Calcutta University"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-durgapur.png"
                alt="NIT Durgapur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-jadavpur.png"
                alt="Jadavpur University"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-shibpur.png"
                alt="IIEST Shibpur"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-heritage.png"
                alt="Heritage College"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
              <img
                src="logo-bangalore.png"
                alt="IISc Bangalore"
                className="h-12 sm:h-16 md:h-18 lg:h-20 opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-violet-100">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground px-2">
              Why Choose Ziksir?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 font-open-sans px-2">
              Discover how Ziksir transforms your research experience.
            </p>
          </div>
          {/* Attractive Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 p-8 flex flex-col items-center text-center">
              <i className="fas fa-rocket text-4xl text-accent mb-4"></i>
              <h3 className="font-bold text-xl mb-2 text-black">Instant Access</h3>
              <p className="text-muted-foreground mb-4">
                Get immediate access to thousands of instruments and services from top institutions.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="font-semibold border-blue-700 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/search")}
              >
                Explore Equipments
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 p-8 flex flex-col items-center text-center">
              <i className="fas fa-comments text-4xl text-accent mb-4"></i>
              <h3 className="font-bold text-xl mb-2 text-black">Expert Support</h3>
              <p className="text-muted-foreground mb-4">
                Connect with IIT professors and certified experts for consultancy and prototyping.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="font-semibold border-blue-700 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/user/consultancy")}
              >
                Get Consultancy
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-blue-100 p-8 flex flex-col items-center text-center">
              <i className="fas fa-calendar-alt text-4xl text-accent mb-4"></i>
              <h3 className="font-bold text-xl mb-2 text-black">Flexible Booking</h3>
              <p className="text-muted-foreground mb-4">
                Book slots, request equipment, and manage your bookings with ease and transparency.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="font-semibold border-blue-700 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/user/book-slots")}
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* NEW: Research Industries & Startups Info Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-blue-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">
                For Research Industries & Startups
              </h3>
              <p className="text-muted-foreground mb-4 text-base">
                Ziksir empowers research-driven industries and innovative startups by providing seamless access to world-class scientific infrastructure, expert consultancy, and rapid prototyping services.
                <br /><br />
                Whether you need to validate your ideas, scale up production, or collaborate with top institutions, Ziksir is your gateway to success.
                <br /><br />
                <span className="font-semibold text-black">What we offer:</span>
                <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                  <li>On-demand booking of advanced equipment and labs</li>
                  <li>Direct collaboration with IIT professors and certified experts</li>
                  <li>Custom prototyping and product development support</li>
                  <li>Flexible plans for startups, SMEs, and enterprises</li>
                  <li>Analytics and reporting to optimize your R&D</li>
                </ul>
              </p>
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto px-6 py-3 bg-accent text-accent-foreground font-medium rounded-2xl shadow-md hover:shadow-lg hover:text-white"
                onClick={() => navigate("/industries")}
              >
                Learn More
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Research Industry"
                className="rounded-xl shadow-lg w-full max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/*Testimonials Section - Client Logos & Feedback */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto">
          <div className="text-center mb-5">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground px-2">
              What Our Clients Say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Maribus Solar */}
            <div className="bg-[#e3f0fa] rounded-2xl shadow-lg p-6 flex flex-col relative">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-900 mr-3">Maribus Solar</span>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAATCAMAAAC0hZ1zAAAA3lBMVEX////u9Pe85vWb3vaP2/a05Pbk8fb8/Pyl4PVz3f953v9/3//3+fqB2/ya39St47iM3PuS4ODB4IHS52XP52rP6/eA3e/O5myw36LG4XvQ53PM53R+4f/Y6/PK7Yr//wDu7gDd3QCsyHFryeu9u7re3t7R0dHY19bp6emHvOnBoRrfvAbv0Bvnyhy1x+ePuPiZtubhvl3/yQCWtu2iuuXM1+OpscDAy9eep7h8n9d7mMefs9J5pOtvm+ZkleaDl7s8ZqA2UZQvXJqvu9FKbaR+pOKIpMRPgK7F0uzY3+2LdE8rAAAA2klEQVR4AaXNQ4JDURBA0fq2jXZs287+N9Sv2kZyprcAZ6NohmU4/qskiJIsK4osMernpkm6oZNKOvUxmpbtuI5tYdWE983zXTcIAtf1cZX7sBg6AXJCGVfff5Si+FGEUXr3lZLs5JGd4t0LMo8AqdLl1fUNur1LCT6TzeVz2cLjarFYKleIavFBNpvLkZx9jLV6o9lqtZqNNurw3V6vP+h3n54OR/X2eDiZTIkZP18sF6t+fw2PupvtFgO2Duz2my4Frw6z2VOrAazH8B7VmKHhEb52PB4F+Id7IhMgcyIsOzIAAAAASUVORK5CYII=" 
                  alt="Maribus Solar"
                  className="w-10 h-10 rounded-full border-2 border-blue-300 bg-white object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="text-5xl text-blue-400 mb-2 leading-none">“</div>
                <p className="text-blue-900 font-medium text-base sm:text-lg mb-4">
                  Ziksir made R&amp;D equipment access easy – zero compliance and no massive upfront costs.<br />
                  Ziksir cut down our approval setup time by 2 months and saved 5 lakhs of rupees.
                </p>
                <div className="text-5xl text-blue-400 self-end leading-none">”</div>
              </div>
            </div>
            {/* Revoltaero Systems Pvt Ltd */}
            <div className="bg-[#e3f0fa] rounded-2xl shadow-lg p-6 flex flex-col relative">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-900 mr-3">Revoltaero Systems Pvt Ltd</span>
                <img
                  src="https://i.imgur.com/5Qw2y5R.png" 
                  alt="Revoltaero"
                  className="w-10 h-10 rounded-full border-2 border-blue-300 bg-white object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="text-5xl text-blue-400 mb-2 leading-none">“</div>
                <p className="text-blue-900 font-medium text-base sm:text-lg mb-4">
                  We could easily access high-quality research facilities through Ziksir. It saved nearly ₹8 lakhs and gave us the freedom to focus on innovation.<br />
                  The ease of access cut down our expected research time by 4 months.
                </p>
                <div className="text-5xl text-blue-400 self-end leading-none">”</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Process Section */}
      <section id="process" className="py-12 sm:py-16 px-4 bg-gray-900">
        <SlideInSection>
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-300 px-2">
                How ziksir Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-open-sans font-semibold px-2">
                Three simple steps to access world-class research infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {[
                {
                  title: "Discover",
                  description:
                    "Browse our comprehensive database of research equipment and facilities. Use filters to find exactly what you need.",
                  icon: "fas fa-search",
                },
                {
                  title: "Book",
                  description:
                    "Select your preferred time slots and submit booking requests. Get instant confirmation or quick approval.",
                  icon: "fas fa-calendar-plus",
                },
                {
                  title: "Research",
                  description:
                    "Access your booked resources, collaborate with your team, and focus on what matters most - your research.",
                  icon: "fas fa-microscope",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center h-full justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <i className={`${step.icon} text-2xl sm:text-3xl text-accent-foreground`}></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 font-open-sans font-semibold text-sm sm:text-base px-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SlideInSection>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4">
        <SlideInSection>
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground px-2">
                What Researchers Say
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-open-sans font-semibold px-2">
                Trusted by leading research institutions throughout the country.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
              {[
                {
                  quote:
                    "Easy to use platform which helps me find the equipment I require just in a few clicks. Its a real gamechanger from the tedious process before.",
                  author: "Dr. Sandeep Kumar Lehri",
                  role: "Professor, NIT Durgapur",
                  avatar: "fas fa-user-circle",
                },
                {
                  quote:
                    "A quick and easy, streamlined platform of laboratory equipment will benefit the whole research community at large.",
                  author: "Dr. Atul Jain",
                  role: "Professor, IIT Kharagpur",
                  avatar: "fas fa-user-circle",
                },
                {
                  quote:
                    "Finally, a solution that understands the unique needs of research facilities. The analytics help us optimize our resources.",
                  author: "Gautam R. Desiraju",
                  role: "Professor, IISc Bangalore",
                  avatar: "fas fa-user-circle",
                },
              ].map((testimonial, index) => {
                const starCounts = [4, 5, 4];
                const stars = starCounts[index];
                const starCountsInv = [1, 0, 1];
                const starsInv = starCountsInv[index];
                return (
                  <Card
                    key={index}
                    className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out h-full"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {[...Array(stars)].map((_, i) => (
                          <i
                            key={i}
                            className="fas fa-star text-accent text-sm"
                          ></i>
                        ))}
                        {[...Array(starsInv)].map((_, i) => (
                          <i
                            key={i}
                            className="fas fa-star text-gray-400 text-sm"
                          ></i>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 font-open-sans italic font-medium text-sm sm:text-base">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                          <i
                            className={`${testimonial.avatar} text-accent-foreground text-sm sm:text-base`}
                          ></i>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground font-bold text-sm sm:text-base">
                            {testimonial.author}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </SlideInSection>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 bg-gray-900">
        <SlideInSection>
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-300 px-2">
                Choose Your Plan
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-open-sans px-2">
                Flexible pricing for research teams of all sizes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
              {[
                {
                  name: "Researcher",
                  price: "₹999",
                  period: "/month",
                  description:
                    "Perfect for individual researchers and small teams",
                  features: [
                    "Access to equipment database",
                    "Basic booking functionality",
                    "Email support",
                    "Usage analytics",
                    "Mobile app access",
                  ],
                  icon: "fas fa-user",
                  popular: false,
                },
                {
                  name: "Institution",
                  price: "₹1999",
                  period: "/month",
                  description:
                    "Ideal for departments and research institutions",
                  features: [
                    "Everything in Researcher",
                    "Advanced booking management",
                    "Team collaboration tools",
                    "Priority support",
                    "Custom integrations",
                    "Advanced analytics",
                  ],
                  icon: "fas fa-university",
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For large organizations with complex needs",
                  features: [
                    "Everything in Institution",
                    "White-label solution",
                    "Dedicated account manager",
                    "24/7 phone support",
                    "Custom development",
                    "SLA guarantees",
                  ],
                  icon: "fas fa-building",
                  popular: false,
                },
              ].map((plan, index) => (
                <Card
                  key={index}
                  className={`relative shadow hover:shadow-xl hover:scale-105 transition-all duration-300 h-full ${plan.popular
                      ? "shadow-lg hover:shadow-2xl hover:scale-110 ring-2 ring-accent scale-105"
                      : ""
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <i
                        className={`${plan.icon} text-lg sm:text-xl md:text-2xl text-accent-foreground`}
                      ></i>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1 text-sm sm:text-base">
                        {plan.period}
                      </span>
                    </div>
                    <CardDescription className="font-open-sans text-sm sm:text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 sm:space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center font-open-sans text-sm sm:text-base"
                        >
                          <i className="fas fa-check text-accent mr-3 text-sm"></i>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full text-sm sm:text-base"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SlideInSection>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-9 sm:py-10 px-4">
        <SlideInSection>
          <div className="container mx-auto">
            <div className="text-center mb-10 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground px-2">
                Get In Touch
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-open-sans px-2">
                Ready to transform your research infrastructure management?
              </p>
            </div>

            <div className="space-y-12 max-w-6xl mx-auto">
              {/* ✅ Consultancy & Prototyping - Full Width */}
              <Card className="p-4 sm:p-6">
                <CardHeader className="pb-2 pt-0">
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    Consultancy & Prototyping Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Intro */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed ">
                      Transform your vision into reality with our expert consultancy and prototyping services.
                      Whether you’re a startup testing ideas or an enterprise innovating new solutions,
                      we provide tailored support at every stage.
                    </p>

                    {/* Feature grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {[
                        { title: "Idea Validation", desc: "Expert feedback to refine and strengthen your concepts." },
                        { title: "Rapid Prototyping", desc: "Quickly build functional prototypes to test feasibility." },
                        { title: "Expert-Led Certification", desc: "Credentials endorsed by IIT professors to add credibility." },
                        { title: "Scalable Solutions", desc: "A roadmap to turn prototypes into production-ready systems." }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-accent text-lg font-bold mt-1">✔</span>
                          <p className="leading-snug">
                            <strong>{item.title}:</strong> {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Outro */}
                    <p className="text-sm sm:text-base text-muted-foreground ">
                      Our team combines technical expertise with creative problem-solving to ensure your project not only works but thrives in real-world use cases.
                    </p>

                    {/* CTA */}
                    <button onClick={() => (window.location.href = "/auth")} className="w-full sm:w-auto px-6 py-3 bg-accent text-accent-foreground font-medium rounded-2xl shadow-md hover:shadow-lg transition">
                      Get Started
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Bottom Grid (Form + Other Ways to Reach Us) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Send us a message</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      We'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
                          placeholder="your.email@institution.edu"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution</label>
                        <input
                          type="text"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
                          placeholder="Your institution name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                          rows="4"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
                          placeholder="Tell us about your research infrastructure needs..."
                          required
                        ></textarea>
                      </div>
                      <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                        <i className="fas fa-paper-plane mr-2"></i>
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>

                    {/* ✅ Alerts */}
                    {status === "success" && (
                      <Alert className="mt-4 border-green-500 text-green-700">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                          Message sent successfully! We'll get back to you within 24 hours.
                        </AlertDescription>
                      </Alert>
                    )}
                    {status === "error" && (
                      <Alert className="mt-4 border-red-500 text-red-700">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Failed to send message. Please try again later.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Other Ways to Reach Us */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <i className="fas fa-envelope text-accent-foreground text-sm"></i>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm sm:text-base">Email</div>
                          <div className="text-muted-foreground text-xs sm:text-sm break-words">
                            suyashkankane@kgpian.iitkgp.ac.in
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <i className="fas fa-phone text-accent-foreground text-sm"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base">Phone</div>
                          <div className="text-muted-foreground text-xs sm:text-sm">
                            +91 917 964 3101
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <i className="fas fa-map-marker-alt text-accent-foreground text-sm"></i>
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base">Office</div>
                          <div className="text-muted-foreground text-xs sm:text-sm">
                            IIT Kharagpur
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SlideInSection>
      </section>


      {/* Footer */}
      <footer className="bg-navy py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="font-sans text-2xl sm:text-3xl font-bold text-secondary mb-4">
                ziksir
              </div>
              <p className="text-muted-foreground font-open-sans text-sm sm:text-base">
                Connecting researchers with the infrastructure they need to
                advance science.
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://www.instagram.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-foreground transition"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/yourcompany"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-foreground transition"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin text-2xl"></i>
                </a>
                <a
                  href="https://www.facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-foreground transition"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-muted-foreground font-open-sans text-xs sm:text-sm">
            <p>&copy; 2024 ziksir. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-accent-foreground shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up text-sm sm:text-base"></i>
      </button>
    </div>
  );
};

export default ziksir;
