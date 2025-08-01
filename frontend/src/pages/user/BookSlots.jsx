import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";

export default function BookSlots() {
  const navigate = useNavigate();
  const user = localStorage.getItem("currentUser");
  const userId = JSON.parse(user)._id;
  console.log('userId: ', userId);

  const [bookingForm, setBookingForm] = useState({
    equipmentId: "",
    slotDate: null,
    status: "pending",
    contactNo: "",
    emailId: "",
    sampleDescription: "",
    analysisRequired: "",
    timeSlot: "",
  });

  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/equipment")
      .then((res) => setEquipmentList(res.data))
      .catch((err) => console.error("Error fetching equipment list:", err));
  }, []);

  const handleBookingFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingForm.equipmentId) {
      alert("Please select a valid equipment.");
      return;
    }

    const payload = {
      userId, //change this to the actual user ID
      equipmentId: bookingForm.equipmentId,
      bookingDate: new Date().toISOString(),
      slotDate: bookingForm.slotDate?.toISOString(),
      status: bookingForm.status,
      contactNo: bookingForm.contactNo,
      emailId: bookingForm.emailId,
      sampleDescription: bookingForm.sampleDescription,
      analysisRequired: bookingForm.analysisRequired,
      timeSlot: bookingForm.timeSlot,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      await axios.post("/api/bookings/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Booking request submitted successfully!");
      navigate("/user");
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-foreground">Book Equipment Slots</h2>

      <form onSubmit={handleBookingSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Booking Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Equipment *</label>
                <Select
                  value={bookingForm.equipmentId}
                  onValueChange={(value) =>
                    handleBookingFormChange("equipmentId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentList.map((eq) => (
                      <SelectItem key={eq._id} value={eq._id}>
                        {eq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Booking Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingForm.slotDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingForm.slotDate
                        ? format(bookingForm.slotDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingForm.slotDate}
                      onSelect={(date) => handleBookingFormChange("slotDate", date)}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Slot *</label>
                <Select
                  value={bookingForm.timeSlot}
                  onValueChange={(value) =>
                    handleBookingFormChange("timeSlot", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00-10:00">09:00 - 10:00 AM</SelectItem>
                    <SelectItem value="10:00-11:00">10:00 - 11:00 AM</SelectItem>
                    <SelectItem value="11:00-12:00">11:00 - 12:00 PM</SelectItem>
                    <SelectItem value="14:00-15:00">02:00 - 03:00 PM</SelectItem>
                    <SelectItem value="15:00-16:00">03:00 - 04:00 PM</SelectItem>
                    <SelectItem value="16:00-17:00">04:00 - 05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Sample Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sample Description *
                </label>
                <Textarea
                  value={bookingForm.sampleDescription}
                  onChange={(e) =>
                    handleBookingFormChange("sampleDescription", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Analysis Required *
                </label>
                <Textarea
                  value={bookingForm.analysisRequired}
                  onChange={(e) =>
                    handleBookingFormChange("analysisRequired", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Contact Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Contact No *</label>
                <Input
                  value={bookingForm.contactNo}
                  onChange={(e) =>
                    handleBookingFormChange("contactNo", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input
                  type="email"
                  value={bookingForm.emailId}
                  onChange={(e) =>
                    handleBookingFormChange("emailId", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/user")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
            Submit Booking Request
          </Button>
        </div>
      </form>
    </div>
  );
}
