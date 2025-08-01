import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BrowseEquipment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/equipment");
        setEquipments(response.data);
      } catch (error) {
        console.error("Failed to fetch equipment data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

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

  if (loading) {
    return <p className="text-center">Loading equipment...</p>;
  }

  return (
    <div className="space-y-6">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equipment, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl hover:scale-105 transition-all border rounded-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <i className={`fas fa-cogs text-xl text-accent-foreground`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <CardDescription>
                      {equipment.type} • {equipment.equipmentLocation}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{equipment.descriptionFields?.[0]?.value || "No description available."}</p>

                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Key Specifications:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {equipment.descriptionFields?.slice(1).map((spec, i) => (
                        <li key={i} className="flex items-center">
                          <i className="fas fa-check text-blue-400 mr-2"></i>
                          {spec.key}: {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-auto min-h-[40px]">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        equipment.status === "available"
                          ? "bg-blue-100 text-blue-800"
                          : equipment.status === "unavailable"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                    </span>

                    {equipment.status === "available" ? (
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
