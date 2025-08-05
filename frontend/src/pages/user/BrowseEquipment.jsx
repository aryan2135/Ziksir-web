import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
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
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URI + "/api/equipment"
        );
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <p className="text-center">Loading equipment...</p>;
  }

  return (
    <>
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
            filteredEquipments.map((equipment) => (
              <Card
                key={equipment._id}
                className="shadow-lg hover:shadow-xl hover:scale-105 transition-all border rounded-lg cursor-pointer"
                onClick={() => setSelectedEquipment(equipment)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-accent">
                      {equipment.img_location ? (
                        <img
                          src={equipment.img_location}
                          alt={equipment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-cogs text-xl text-accent-foreground" />
                      )}
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
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {equipment.available} / {equipment.quantity} available
                    </div>
                    {equipment.available > 0 ? (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/user/book-slots");
                        }}
                      >
                        <i className="fas fa-calendar-plus mr-2"></i> Book Now
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        <i className="fas fa-ban mr-2"></i> Not Available
                      </Button>
                    )}
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

      {/* Modal Popup with Radix Dialog */}
      <Dialog.Root open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 max-w-lg w-[90vw] max-h-[90vh] overflow-auto rounded-lg bg-white p-6 shadow-lg
              -translate-x-1/2 -translate-y-1/2 z-50 focus:outline-none"
            aria-describedby="equipment-details-description"
          >
            {selectedEquipment && (
              <>
                <Dialog.Title className="text-2xl font-bold mb-4">
                  {selectedEquipment.name}
                </Dialog.Title>
                <Dialog.Description
                  id="equipment-details-description"
                  className="mb-4 text-sm text-muted-foreground"
                >
                  {selectedEquipment.type} • {selectedEquipment.equipmentLocation}
                </Dialog.Description>

                <div className="mb-4">
                  <img
                    src={selectedEquipment.img_location}
                    alt={selectedEquipment.name}
                    className="w-full max-h-60 object-contain rounded-md mb-4"
                  />
                  <p>
                    <strong>Provider:</strong>{" "}
                    {
                      selectedEquipment.descriptionFields?.find(
                        (f) => f.key === "provider"
                      )?.value || "N/A"
                    }
                  </p>
                  <p>
                    <strong>Last Maintenance:</strong>{" "}
                    {formatDate(selectedEquipment.lastMaintenance)}
                  </p>

                  <div className="mt-3">
                    <strong>Affiliations:</strong>
                    <ul className="list-disc list-inside ml-5 text-muted-foreground">
                      {selectedEquipment.descriptionFields
                        ?.find((f) => f.key === "affiliation")
                        ?.value?.map((affil, i) => (
                          <li key={i}>{affil}</li>
                        )) || <li>N/A</li>}
                    </ul>
                  </div>

                  <p className="mt-3">
                    <strong>Available:</strong> {selectedEquipment.available} /{" "}
                    {selectedEquipment.quantity}
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  {selectedEquipment.available > 0 ? (
                    <Button onClick={() => navigate("/user/book-slots")}>
                      <i className="fas fa-calendar-plus mr-2"></i> Book Now
                    </Button>
                  ) : (
                    <Button disabled>
                      <i className="fas fa-ban mr-2"></i> Not Available
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEquipment(null)}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
