import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const NAV_ITEMS = [
  { label: "Features", section: "features" },
  { label: "Process", section: "process" },
  { label: "Pricing", section: "pricing" },
  { label: "Contact", section: "contact" },
];

const PAGE_SIZE = 8;

const SearchPage = () => {
  const [equipments, setEquipments] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipments = async () => {
      setLoading(true);
      const res = await axios.get("/api/equipment");
      setEquipments(res.data);
      setLoading(false);
    };
    fetchEquipments();
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Search filter
  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEquipments.length / PAGE_SIZE);
  const paginatedEquipments = filteredEquipments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Fallback image
  const fallbackImg =
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80";

  const equipmentDescriptions = {
    "3D Printer":
      "High-precision 3D printer for rapid prototyping and custom part fabrication.",
    "CNC Machine":
      "Computer-controlled cutting and milling machine for metal, wood, and plastic.",
    Oscilloscope:
      "Essential for visualizing electrical signals in research and diagnostics.",
    Spectrometer:
      "Analyze material composition and properties with advanced spectrometry.",
    "Laser Cutter":
      "Cut and engrave a variety of materials with high accuracy and speed.",
    Microscope:
      "High-resolution imaging for biological and material science research.",
    // Add more equipment names and their descriptions as needed
  };

  const getEquipmentDescription = (eq) => {
    if (eq.description && eq.description.trim() !== "") return eq.description;
    if (equipmentDescriptions[eq.name]) return equipmentDescriptions[eq.name];
    return "State-of-the-art equipment available for your research and prototyping needs.";
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                className={`text-foreground hover:text-accent transition-colors font-semibold ${
                  activeSection === item.section
                    ? "underline underline-offset-4 text-primary"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => navigate("/auth")}
              variant="default"
              size="sm"
              className="ml-2"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Login / Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              onClick={() => navigate("/auth")}
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
              <i
                className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}
              ></i>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className={`block w-full text-left text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-secondary font-semibold ${
                    activeSection === item.section
                      ? "underline underline-offset-4 text-primary"
                      : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => navigate("/auth")}
                className="block w-full text-left text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-secondary font-semibold"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login / Signup
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="pt-28 pb-8 px-2 sm:px-4 flex flex-col-reverse md:flex-row gap-6 md:gap-8">
        {/* Left: Equipments list */}
        <div className="md:w-2/3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Available Equipments
            </h2>
            <input
              type="text"
              placeholder="Search by name or location..."
              className="border rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg border animate-pulse h-72"
                  ></div>
                ))
              : paginatedEquipments.map((eq) => (
                  <div
                    key={eq._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border flex flex-col cursor-pointer group"
                    onClick={() => {
                      setSelectedEquipment(eq);
                      setShowModal(true);
                    }}
                  >
                    <div className="relative">
                      <img
                        src={eq.img_location || fallbackImg}
                        alt={eq.name}
                        className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform"
                        onError={(e) => (e.target.src = fallbackImg)}
                      />
                      <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
                        ₹{eq.price} / session
                      </span>
                      {/* Example badge for new/popular */}
                      {eq.isNew && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                          New
                        </span>
                      )}
                      {eq.isPopular && (
                        <span className="absolute top-10 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                          {eq.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                          <i className="fas fa-map-marker-alt text-primary"></i>
                          {eq.location}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                          {getEquipmentDescription(eq)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEquipment(eq);
                            setShowModal(true);
                          }}
                        >
                          View Details
                        </Button>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Save"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="far fa-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 rounded-md font-semibold border ${
                    currentPage === idx + 1
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-primary border-gray-300"
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Right: Map */}
        <div className="md:w-1/3 w-full md:sticky md:top-24 flex mb-0 md:mb-0 h-fit">
          <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg border bg-white flex flex-col">
            <div className="p-3 border-b text-primary font-bold text-center text-lg bg-blue-50">
              Equipment Locations
            </div>
            <iframe
              title="equipments-map"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "250px",
                maxHeight: "100%",
                borderRadius: "0 0 16px 16px",
                flex: 1,
              }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=equipment+near+me`}
            ></iframe>
          </div>
        </div>
      </div>

      {/* Equipment Details Modal */}
      {showModal && selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <img
              src={selectedEquipment.img_location || fallbackImg}
              alt={selectedEquipment.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
              onError={(e) => (e.target.src = fallbackImg)}
            />
            <h2 className="text-2xl font-bold text-primary mb-2">
              {selectedEquipment.name}
            </h2>
            <div className="mb-2 text-gray-600">
              <i className="fas fa-map-marker-alt text-primary mr-2"></i>
              {selectedEquipment.location}
            </div>
            <div className="mb-4 text-gray-700">
              {getEquipmentDescription(selectedEquipment)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Price:</span> ₹{selectedEquipment.price}{" "}
              / session
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
