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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipments = async () => {
      const res = await axios.get("/api/equipment");
      setEquipments(res.data);
    };
    fetchEquipments();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(equipments.length / PAGE_SIZE);
  const paginatedEquipments = equipments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
                className="text-foreground hover:text-accent transition-colors font-semibold"
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
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
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
                  className="block w-full text-left text-foreground hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-secondary font-semibold"
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
      <div className="pt-24 pb-8 px-2 sm:px-4 flex flex-col-reverse md:flex-row gap-6 md:gap-8">
        {/* Left: Equipments list */}
        <div className="md:w-2/3 w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">
            Available Equipments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEquipments.map((eq) => (
              <div
                key={eq._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border flex flex-col cursor-pointer group"
                onClick={() => navigate(`/equipment/${eq._id}`)}
              >
                <div className="relative">
                  <img
                    src={eq.imageUrl}
                    alt={eq.name}
                    className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
                    ₹{eq.price} / session
                  </span>
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
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/equipment/${eq._id}`);
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
          <div className="w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg border">
            <iframe
              title="equipments-map"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "250px",
                maxHeight: "100%",
                borderRadius: "16px",
              }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=equipment+near+me`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
