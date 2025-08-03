import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import axios from "@/api/axios"; 

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
  });
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);

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
    setFormData((prev) => ({ ...prev, [name]: name === "quantity" || name === "available" ? parseInt(value) : value }));
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Equipment Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setDialogMode("add");
                resetForm();
              }}
            >
              <i className="fas fa-plus mr-2"></i>Add New Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "add" ? "Add New Equipment" : "Edit Equipment"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {["name", "type", "equipmentLocation"].map((field) => (
                <div key={field}>
                  <Label>{field === "equipmentLocation" ? "Location" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    name={field}
                    placeholder={`Enter ${field}`}
                    value={formData[field]}
                    onChange={handleInputChange}
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
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  value={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["available", "unavailable", "maintenance"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddOrEdit}>
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
          <div className="space-y-4">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((equipment) => (
                <div
                  key={equipment._id}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <i className="fas fa-microscope text-accent-foreground"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{equipment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {equipment.type} • {equipment.equipmentLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        equipment.status === "available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : equipment.status === "unavailable"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {equipment.status}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDialogMode("edit");
                            setFormData(equipment);
                            setSelectedId(equipment._id);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Equipment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {["name", "type", "equipmentLocation"].map((field) => (
                            <div key={field}>
                              <Label>{field === "equipmentLocation" ? "Location" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                              <Input
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
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
                              onValueChange={(value) => setFormData({ ...formData, status: value })}
                              value={formData.status}
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
                          <Button className="w-full" onClick={handleAddOrEdit}>
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
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No equipment found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Equipment;
