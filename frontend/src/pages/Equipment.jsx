import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "@/api/axios";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/80x80.png?text=No+Image";

const getEquipmentImage = (equipment) => {
  if (equipment.images && Array.isArray(equipment.images) && equipment.images[0]?.url) {
    return equipment.images[0].url;
  }
  if (equipment.image && typeof equipment.image === "string" && equipment.image.trim()) {
    return equipment.image;
  }
  if (equipment.imageUrl && typeof equipment.imageUrl === "string" && equipment.imageUrl.trim()) {
    return equipment.imageUrl;
  }
  return PLACEHOLDER_IMG;
};

const Equipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    equipmentLocation: "",
    status: "available",
    quantity: 1,
    available: 1,
    descriptionFields: [],
    imageUrl: "",
  });
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URI + "/api/equipment";

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get(API_BASE);
      setEquipmentList(res.data);
    } catch (err) {
      console.error("Failed to fetch equipment", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "available" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddOrEdit = async () => {
    try {
      const payload = {
        ...formData,
        descriptionFields: formData.descriptionFields || [],
      };

      if (dialogMode === "add") {
        await axios.post(API_BASE, payload);
      } else {
        await axios.put(`${API_BASE}/${selectedId}`, payload);
        setEditDialogOpen(false);
      }

      resetForm();
      fetchEquipment();
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      equipmentLocation: "",
      status: "available",
      quantity: 1,
      available: 1,
      descriptionFields: [],
      imageUrl: "",
    });
    setSelectedId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchEquipment();
      } catch (err) {
        console.error("Failed to delete equipment", err);
      }
    }
  };

  const filteredEquipment = equipmentList.filter((item) =>
    `${item.name} ${item.type} ${item.equipmentLocation}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const statusClasses = {
    available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    unavailable: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-primary">Equipment Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setDialogMode("add");
                resetForm();
              }}
              className="bg-primary text-white"
            >
              <i className="fas fa-plus mr-2" /> Add New Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add New Equipment" : "Edit Equipment"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {["name", "type", "equipmentLocation", "imageUrl"].map((field) => (
                <div key={field}>
                  <Label>
                    {field === "equipmentLocation"
                      ? "Location"
                      : field === "imageUrl"
                      ? "Image URL"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    placeholder={
                      field === "imageUrl"
                        ? "https://example.com/image.jpg"
                        : undefined
                    }
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    name="quantity"
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Available</Label>
                  <Input
                    name="available"
                    type="number"
                    min={0}
                    value={formData.available}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">available</SelectItem>
                    <SelectItem value="unavailable">unavailable</SelectItem>
                    <SelectItem value="maintenance">maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-primary text-white" onClick={handleAddOrEdit}>
                {dialogMode === "add" ? "Add Equipment" : "Update Equipment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full max-w-sm">
        <Input
          type="text"
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>Manage your research equipment and facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((equipment) => {
                const effectiveStatus =
                  equipment.status === "maintenance"
                    ? "maintenance"
                    : equipment.available > 0
                    ? "available"
                    : "unavailable";

                return (
                  <div
                    key={equipment._id}
                    className="flex flex-col sm:flex-row items-center sm:items-start p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 gap-4"
                  >
                    {/* Equipment Image */}
                    <img
                      src={getEquipmentImage(equipment)}
                      alt={equipment.name}
                      className="w-20 h-20 object-cover rounded-lg border bg-gray-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                    />
                    {/* Equipment Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">{equipment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {equipment.type} • {equipment.equipmentLocation}
                          </p>
                        </div>
                        <span className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${statusClasses[effectiveStatus]}`}>
                          {effectiveStatus}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <div><strong>Quantity:</strong> {equipment.quantity}</div>
                        <div><strong>Available:</strong> {equipment.available}</div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <Dialog open={editDialogOpen && selectedId === equipment._id} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDialogMode("edit");
                                setFormData({
                                  ...equipment,
                                  imageUrl: equipment.imageUrl || "",
                                });
                                setSelectedId(equipment._id);
                                setEditDialogOpen(true);
                              }}
                            >
                              <i className="fas fa-edit" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Equipment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {["name", "type", "equipmentLocation", "imageUrl"].map((field) => (
                                <div key={field}>
                                  <Label>
                                    {field === "equipmentLocation"
                                      ? "Location"
                                      : field === "imageUrl"
                                      ? "Image URL"
                                      : field.charAt(0).toUpperCase() + field.slice(1)}
                                  </Label>
                                  <Input
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    placeholder={
                                      field === "imageUrl"
                                        ? "https://example.com/image.jpg"
                                        : undefined
                                    }
                                  />
                                </div>
                              ))}
                              <div className="flex gap-4">
                                <div>
                                  <Label>Quantity</Label>
                                  <Input
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div>
                                  <Label>Available</Label>
                                  <Input
                                    name="available"
                                    type="number"
                                    value={formData.available}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Select
                                  value={formData.status}
                                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">available</SelectItem>
                                    <SelectItem value="unavailable">unavailable</SelectItem>
                                    <SelectItem value="maintenance">maintenance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button className="w-full bg-primary text-white" onClick={handleAddOrEdit}>
                                Update Equipment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(equipment._id)}
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">No equipment found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Equipment;
