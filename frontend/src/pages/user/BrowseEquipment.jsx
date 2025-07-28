import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function BrowseEquipment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const equipments = [
    {
      name: "High-Resolution Microscope",
      category: "Imaging",
      location: "Lab A-201",
      availability: "Available",
      icon: "fas fa-microscope",
      description:
        "Advanced confocal microscope with high-resolution imaging capabilities. Perfect for cellular and molecular imaging studies with sub-micrometer resolution.",
      specifications: ["Resolution: 0.1 μm", "Magnification: 1000x-100000x", "Wavelength: 405-633 nm"]
    },
    {
      name: "PCR Machine",
      category: "Molecular Biology",
      location: "Lab B-105",
      availability: "In Use",
      icon: "fas fa-dna",
      description:
        "Thermal cycler for polymerase chain reaction (PCR) amplification. Supports gradient PCR and real-time quantitative PCR applications.",
      specifications: ["96-well capacity", "Temperature range: 4-99°C", "Ramp rate: 5°C/sec"]
    },
    {
      name: "Centrifuge",
      category: "Sample Preparation",
      location: "Lab A-203",
      availability: "Maintenance",
      icon: "fas fa-circle-notch",
      description:
        "High-speed centrifuge for sample separation and purification. Variable speed control with safety interlocks and automatic rotor recognition.",
      specifications: ["Max speed: 15,000 RPM", "Capacity: 24 tubes", "Temperature: -10°C to 40°C"]
    },
    {
      name: "Spectrophotometer",
      category: "Analysis",
      location: "Lab C-301",
      availability: "Available",
      icon: "fas fa-chart-line",
      description:
        "UV-Vis spectrophotometer for quantitative analysis of biological samples. Ideal for protein quantification and enzyme assays.",
      specifications: ["Wavelength: 190-1100 nm", "Bandwidth: 1.5 nm", "Accuracy: ±0.3 nm"]
    },
    {
      name: "Flow Cytometer",
      category: "Cell Analysis",
      location: "Lab B-107",
      availability: "Available",
      icon: "fas fa-stream",
      description:
        "Multi-parameter flow cytometer for cell counting, sorting, and biomarker detection. Supports fluorescent and non-fluorescent analysis.",
      specifications: ["4-color detection", "Sample rate: 10,000 events/sec", "Detection limit: 0.1% positive cells"]
    },
    {
      name: "Mass Spectrometer",
      category: "Chemical Analysis",
      location: "Lab C-305",
      availability: "Available",
      icon: "fas fa-atom",
      description:
        "High-resolution mass spectrometer for molecular identification and quantification. LC-MS/MS capabilities for complex sample analysis.",
      specifications: ["Mass range: 50-2000 m/z", "Resolution: 100,000 FWHM", "Sensitivity: fg level"]
    }
  ];

  const filteredEquipments = equipments
  .filter((equipment) =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const searchLower = searchTerm.toLowerCase();
    const aStarts = a.name.toLowerCase().startsWith(searchLower);
    const bStarts = b.name.toLowerCase().startsWith(searchLower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Browse Equipment</h2>
        <Input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equipment, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow border rounded-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <i className={`${equipment.icon} text-xl text-accent-foreground`}></i>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <CardDescription>
                      {equipment.category} • {equipment.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{equipment.description}</p>

                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Key Specifications:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {equipment.specifications.map((spec, specIndex) => (
                        <li key={specIndex} className="flex items-center">
                          <i className="fas fa-check text-blue-400 mr-2"></i>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-auto min-h-[40px]">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        equipment.availability === "Available"
                          ? "bg-blue-100 text-blue-800"
                          : equipment.availability === "In Use"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.availability}
                    </span>

                    {equipment.availability === "Available" ? (
                      <Button size="sm" onClick={() => navigate("/user/book-slots")}>
                        <i className="fas fa-calendar-plus mr-2"></i> Book Now
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        <i className="fas fa-ban mr-2"></i> Not Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full">No equipment found.</p>
        )}
      </div>
    </div>
  );
}
