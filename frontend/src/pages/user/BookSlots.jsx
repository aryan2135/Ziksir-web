import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function BookSlots() {
  const navigate = useNavigate();

  const [bookingForm, setBookingForm] = useState({
    name: "",
    organizationAddress: "",
    state: "",
    country: "",
    gstin: "",
    gstinNo: "",
    panNo: "",
    contactNo: "",
    emailId: "",
    pincode: "",
    referenceNo: "",
    remarks: "",
    organizationCategory: "",
    equipmentName: "",
    equipmentCharge: "",
    totalEquipmentCharge: "",
    noOfSamples: "",
    sampleDescription: "",
    analysisRequired: "",
    bookingDate: null,
    timeSlot: "",
  });

  const handleBookingFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Data:", bookingForm);
    alert("Booking request submitted!");
    navigate("/user");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-foreground">Book Equipment Slots</h2>

      <form onSubmit={handleBookingSubmit} className="space-y-8">
        {/* Customer/Party Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Customer/Party Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <Input value={bookingForm.name} onChange={(e) => handleBookingFormChange("name", e.target.value)} placeholder="Enter your name" required />
              </div>

              {/* Organization Address */}
              <div>
                <label className="text-sm font-medium mb-2 block">Organization Address *</label>
                <Input value={bookingForm.organizationAddress} onChange={(e) => handleBookingFormChange("organizationAddress", e.target.value)} placeholder="Enter organization address" required />
              </div>

              {/* State */}
              <div>
                <label className="text-sm font-medium mb-2 block">State *</label>
                <Select value={bookingForm.state} onValueChange={(value) => handleBookingFormChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div>
                <label className="text-sm font-medium mb-2 block">Country *</label>
                <Select value={bookingForm.country} onValueChange={(value) => handleBookingFormChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer/Party GSTIN */}
              <div>
                <label className="text-sm font-medium mb-2 block">Customer/Party GSTIN *</label>
                <Select value={bookingForm.gstin} onValueChange={(value) => handleBookingFormChange("gstin", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="--Select Option--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* GSTIN No */}
              <div>
                <label className="text-sm font-medium mb-2 block">GSTIN No</label>
                <Input value={bookingForm.gstinNo} onChange={(e) => handleBookingFormChange("gstinNo", e.target.value)} placeholder="GSTIN No" />
              </div>

              {/* PAN No */}
              <div>
                <label className="text-sm font-medium mb-2 block">PAN No</label>
                <Input value={bookingForm.panNo} onChange={(e) => handleBookingFormChange("panNo", e.target.value)} placeholder="PAN No" />
              </div>

              {/* Contact No */}
              <div>
                <label className="text-sm font-medium mb-2 block">Contact No *</label>
                <Input value={bookingForm.contactNo} onChange={(e) => handleBookingFormChange("contactNo", e.target.value)} placeholder="Contact No" required />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input type="email" value={bookingForm.emailId} onChange={(e) => handleBookingFormChange("emailId", e.target.value)} placeholder="Enter email address" required />
              </div>

              {/* Pincode */}
              <div>
                <label className="text-sm font-medium mb-2 block">Pincode *</label>
                <Input value={bookingForm.pincode} onChange={(e) => handleBookingFormChange("pincode", e.target.value)} placeholder="Pincode" required />
              </div>

              {/* Reference No */}
              <div>
                <label className="text-sm font-medium mb-2 block">Reference No</label>
                <Input value={bookingForm.referenceNo} onChange={(e) => handleBookingFormChange("referenceNo", e.target.value)} placeholder="Reference No" />
              </div>

              {/* Remarks */}
              <div>
                <label className="text-sm font-medium mb-2 block">Remarks</label>
                <Input value={bookingForm.remarks} onChange={(e) => handleBookingFormChange("remarks", e.target.value)} placeholder="Remarks" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Equipment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Research Equipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Organization Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Organization Category *</label>
                <Select value={bookingForm.organizationCategory} onValueChange={(value) => handleBookingFormChange("organizationCategory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="--Select Option--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Institution</SelectItem>
                    <SelectItem value="research">Research Organization</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Equipment Name *</label>
                <Select value={bookingForm.equipmentName} onValueChange={(value) => handleBookingFormChange("equipmentName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="microscope">High-Resolution Microscope</SelectItem>
                    <SelectItem value="pcr">PCR Machine</SelectItem>
                    <SelectItem value="centrifuge">Centrifuge</SelectItem>
                    <SelectItem value="spectrometer">Spectrophotometer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Charge */}
              <div>
                <label className="text-sm font-medium mb-2 block">Equipment Charge (Incl. GST)</label>
                <Input value={bookingForm.equipmentCharge} readOnly className="bg-muted" />
              </div>

              {/* Total Equipment Charge */}
              <div>
                <label className="text-sm font-medium mb-2 block">Total Equipment Charge</label>
                <Input value={bookingForm.totalEquipmentCharge} readOnly className="bg-muted" />
              </div>

              {/* No Of Samples */}
              <div>
                <label className="text-sm font-medium mb-2 block">No Of Samples *</label>
                <Select value={bookingForm.noOfSamples} onValueChange={(value) => handleBookingFormChange("noOfSamples", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nothing selected" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Sample</SelectItem>
                    <SelectItem value="2">2 Samples</SelectItem>
                    <SelectItem value="3">3 Samples</SelectItem>
                    <SelectItem value="5">5 Samples</SelectItem>
                    <SelectItem value="10">10 Samples</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sample Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Sample Description (Max 500 words) *</label>
                <Textarea value={bookingForm.sampleDescription} onChange={(e) => handleBookingFormChange("sampleDescription", e.target.value)} placeholder="Describe your samples..." rows={4} required />
              </div>

              {/* Analysis Required */}
              <div className="md:col-span-1">
                <label className="text-sm font-medium mb-2 block">Analysis Required (Max 500 words) *</label>
                <Textarea value={bookingForm.analysisRequired} onChange={(e) => handleBookingFormChange("analysisRequired", e.target.value)} placeholder="Describe the analysis required..." rows={4} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Booking Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Booking Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !bookingForm.bookingDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingForm.bookingDate ? format(bookingForm.bookingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingForm.bookingDate}
                      onSelect={(date) => handleBookingFormChange("bookingDate", date)}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slot */}
              <div>
                <label className="text-sm font-medium mb-2 block">Time Slot *</label>
                <Select value={bookingForm.timeSlot} onValueChange={(value) => handleBookingFormChange("timeSlot", value)}>
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

        {/* ✅ Action Buttons */}
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
