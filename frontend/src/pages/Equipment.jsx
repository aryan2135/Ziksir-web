import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Equipment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentList, setEquipmentList] = useState(() => {
    const saved = localStorage.getItem("equipmentList");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "High-Resolution Microscope", type: "Imaging", status: "Available", location: "Lab A-201" },
          { name: "PCR Machine", type: "Molecular Biology", status: "In Use", location: "Lab B-105" },
          { name: "Centrifuge", type: "Sample Preparation", status: "Maintenance", location: "Lab A-203" },
          { name: "Spectrophotometer", type: "Analysis", status: "Available", location: "Lab C-301" },
        ];
  });

  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentIndex, setCurrentIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", location: "", status: "Available" });

  useEffect(() => {
    localStorage.setItem("equipmentList", JSON.stringify(equipmentList));
  }, [equipmentList]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = () => {
    if (!formData.name || !formData.type || !formData.location) {
      alert("Please fill all fields");
      return;
    }

    if (dialogMode === "add") {
      setEquipmentList([...equipmentList, formData]);
    } else {
      const updatedList = [...equipmentList];
      updatedList[currentIndex] = formData;
      setEquipmentList(updatedList);
    }

    setFormData({ name: "", type: "", location: "", status: "Available" });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      const updatedList = equipmentList.filter((_, i) => i !== index);
      setEquipmentList(updatedList);
    }
  };

  const filteredEquipment = equipmentList.filter((item) =>
    `${item.name} ${item.type} ${item.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Equipment Management</h2>

        {/* ✅ Add / Edit Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setDialogMode("add");
                setFormData({ name: "", type: "", location: "", status: "Available" });
              }}
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "add" ? "Add New Equipment" : "Edit Equipment"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Equipment Name</Label>
                <Input
                  name="name"
                  placeholder="Enter equipment name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Input
                  name="type"
                  placeholder="Enter equipment type"
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
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
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
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

      {/* ✅ Search Bar */}
      <div className="w-full max-w-sm">
        <Input
          type="text"
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg"
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
              filteredEquipment.map((equipment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <i className="fas fa-microscope text-accent-foreground"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{equipment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {equipment.type} • {equipment.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        equipment.status === "Available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : equipment.status === "In Use"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {equipment.status}
                    </span>
                    {/* Edit Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDialogMode("edit");
                            setCurrentIndex(index);
                            setFormData(equipment);
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
                          <div>
                            <Label>Equipment Name</Label>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Input
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
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
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="In Use">In Use</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full" onClick={handleAddOrEdit}>
                            Update Equipment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(index)}
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
