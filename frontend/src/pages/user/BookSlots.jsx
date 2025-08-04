// BookSlots.jsx (Improved UX)
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
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user._id;

  const [equipmentList, setEquipmentList] = useState([]);

  const [bookingForm, setBookingForm] = useState({
    equipmentId: "",
    slotDate: null,
    status: "pending",
    contactNo: "",
    emailId: "",
    sampleDescription: "",
    analysisRequired: "",
    timeSlot: "",
    name: "",
    organizationAddress: "",
    state: "",
    country: "",
    gstin: "",
    gstinNo: "",
    panNo: "",
    pincode: "",
    referenceNo: "",
    remarks: "",
    organizationCategory: "",
    noOfSamples: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/api/equipment`)
      .then((res) => setEquipmentList(res.data))
      .catch((err) => console.error("Error fetching equipment list:", err));
  }, []);

  const handleBookingFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId,
      ...bookingForm,
      slotDate: bookingForm.slotDate?.toISOString(),
      bookingDate: new Date().toISOString(),
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
    <div className="space-y-6 max-w-6xl mx-auto p-6 ">
      <h2 className="text-3xl font-bold text-foreground">Book Slots</h2>

      <form onSubmit={handleBookingSubmit} className="space-y-2">

        {/* Booking Schedule Section */}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">📅 Booking Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            {/* Equipment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Equipment *</label>
              <Select
                value={bookingForm.equipmentId}
                onValueChange={(value) => handleBookingFormChange("equipmentId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentList.map((eq) => (
                    <SelectItem key={eq._id} value={eq._id}>{eq.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Total Equipment Charge */}
            <div>
              <label className="text-sm font-medium mb-2 block">Total Equipment Charge *</label>
              <Input
                placeholder="Enter total charge"
                value={bookingForm.totalCharge}
                onChange={(e) => handleBookingFormChange("totalCharge", e.target.value)}
                required
              />
            </div>

            {/* Slot Date */}
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
                    {bookingForm.slotDate ? format(bookingForm.slotDate, "PPP") : "Pick a date"}
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

            {/* Time Slot */}
            <div>
              <label className="text-sm font-medium mb-2 block">Time Slot *</label>
              <Select
                value={bookingForm.timeSlot}
                onValueChange={(value) => handleBookingFormChange("timeSlot", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "09:00-10:00",
                    "10:00-11:00",
                    "11:00-12:00",
                    "14:00-15:00",
                    "15:00-16:00",
                    "16:00-17:00",
                  ].map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot.replace("-", " - ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>


        {/* Customer Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">👤 Customer / Party Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <Input placeholder="Full Name *" value={bookingForm.name} onChange={(e) => handleBookingFormChange("name", e.target.value)} required />
            <Input placeholder="Organization Address *" value={bookingForm.organizationAddress} onChange={(e) => handleBookingFormChange("organizationAddress", e.target.value)} required />
            <Input placeholder="State *" value={bookingForm.state} onChange={(e) => handleBookingFormChange("state", e.target.value)} required />
            <Input placeholder="Country *" value={bookingForm.country} onChange={(e) => handleBookingFormChange("country", e.target.value)} required />
            <Select value={bookingForm.gstin} onValueChange={(v) => handleBookingFormChange("gstin", v)}>
              <SelectTrigger><SelectValue placeholder="Customer/Party GSTIN?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="GSTIN No" value={bookingForm.gstinNo} onChange={(e) => handleBookingFormChange("gstinNo", e.target.value)} />
            <Input placeholder="PAN No" value={bookingForm.panNo} onChange={(e) => handleBookingFormChange("panNo", e.target.value)} />
            <Input placeholder="Contact No *" value={bookingForm.contactNo} onChange={(e) => handleBookingFormChange("contactNo", e.target.value)} required />
            <Input type="email" placeholder="Email ID *" value={bookingForm.emailId} onChange={(e) => handleBookingFormChange("emailId", e.target.value)} required />
            <Input placeholder="Pincode *" value={bookingForm.pincode} onChange={(e) => handleBookingFormChange("pincode", e.target.value)} required />
            <Input placeholder="Reference No" value={bookingForm.referenceNo} onChange={(e) => handleBookingFormChange("referenceNo", e.target.value)} />
            <Input placeholder="Remarks" value={bookingForm.remarks} onChange={(e) => handleBookingFormChange("remarks", e.target.value)} />
          </CardContent>
        </Card>

        {/* Research Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">🔬 Research Equipment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <Select value={bookingForm.organizationCategory} onValueChange={(v) => handleBookingFormChange("organizationCategory", v)}>
              <SelectTrigger><SelectValue placeholder="Organization Category *" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Industry">Industry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bookingForm.noOfSamples} onValueChange={(v) => handleBookingFormChange("noOfSamples", v)}>
              <SelectTrigger><SelectValue placeholder="No. of Samples *" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Future input: total charges, etc. */}
            <div className="md:col-span-3 grid md:grid-cols-2 gap-6 mt-6">
              <Textarea placeholder="Sample Description *" value={bookingForm.sampleDescription} onChange={(e) => handleBookingFormChange("sampleDescription", e.target.value)} required />
              <Textarea placeholder="Analysis Required *" value={bookingForm.analysisRequired} onChange={(e) => handleBookingFormChange("analysisRequired", e.target.value)} required />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/user")}>Cancel</Button>
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90">Submit Booking Request</Button>
        </div>
      </form>
    </div>
  );
}
