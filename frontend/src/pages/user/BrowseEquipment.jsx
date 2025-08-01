import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function BrowseEquipment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [equipments, setEquipments] = useState([]); // initially empty array
  const [loading, setLoading] = useState(true);

  // Fetch JSON on component mount
  useEffect(() => {
    fetch("/equipment.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch resources.json");
        return res.json();
      })
      .then((data) => {
        setEquipments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredEquipments = equipments
    .filter((equipment) =>
      equipment.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const searchLower = searchTerm.toLowerCase();
      const aStarts = a.title.toLowerCase().startsWith(searchLower);
      const bStarts = b.title.toLowerCase().startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  if (loading) {
    return <p>Loading equipment data...</p>;
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
            <Card
              key={equipment.id || index}
              className="shadow-lg hover:shadow-xl hover:scale-105 transition-all border rounded-lg flex flex-col overflow-hidden"
            >
              <img
                src={equipment.img_url}
                alt={equipment.title}
                className="w-full h-48 object-contain bg-gray-100 p-3"
              />
              <CardHeader>
                <CardTitle className="text-lg">{equipment.title}</CardTitle>
                <CardDescription>{equipment.type}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Provider:</strong> {equipment.provider}
                </p>
                <p>
                  <strong>Affiliation:</strong>{" "}
                  {(equipment.affiliation && equipment.affiliation.join(", ")) || "N/A"}
                </p>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={() => navigate("/user/book-slots")}>
                    <i className="fas fa-calendar-plus mr-2"></i>Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full">
            No equipment found.
          </p>
        )}
      </div>
    </div>
  );
}

