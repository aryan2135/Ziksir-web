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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axios";

export default function BookSlots() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user._id;

  const [equipmentList, setEquipmentList] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const showAlert = (message, type = "info") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

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
    totalCharge: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const savedDetails = JSON.parse(
          localStorage.getItem("customerDetails")
        );
        if (savedDetails) {
          setBookingForm((prev) => ({
            ...prev,
            ...savedDetails,
          }));
        } else {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_API_URI}/api/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userData = response.data;

          setBookingForm((prev) => ({
            ...prev,
            name: userData.name || "",
            contactNo: userData.phone || "",
            emailId: userData.email || "",
            organizationAddress: userData.organizationAddress || "",
            state: userData.state || "",
            country: userData.country || "",
            gstin: userData.gstin || "",
            gstinNo: userData.gstinNo || "",
            panNo: userData.panNo || "",
            pincode: userData.pincode || "",
            organizationCategory: userData.organizationCategory || "",
            noOfSamples: userData.noOfSamples || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user details for autofill:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URI + "/api/equipment")
      .then((res) => setEquipmentList(res.data))
      .catch((err) => console.error("Error fetching equipment list:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const equipmentIdFromQuery = params.get("equipmentId");
    if (equipmentIdFromQuery) {
      setBookingForm((prev) => ({
        ...prev,
        equipmentId: equipmentIdFromQuery,
      }));
    }
  }, [location.search]);

  const handleBookingFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please log in first.", "error");
      return;
    }

    const userUpdatePayload = {
      name: bookingForm.name,
      contactNo: bookingForm.contactNo,
      emailId: bookingForm.emailId,
      organizationAddress: bookingForm.organizationAddress,
      state: bookingForm.state,
      country: bookingForm.country,
      gstin: bookingForm.gstin,
      gstinNo: bookingForm.gstinNo,
      panNo: bookingForm.panNo,
      pincode: bookingForm.pincode,
      Category: bookingForm.organizationCategory,
      Sample: bookingForm.noOfSamples,
    };

    try {
      // await axios.put(
      //   `${import.meta.env.VITE_API_URI}/api/bookings/${userId}`,
      //   userUpdatePayload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // localStorage.setItem(
      //   "customerDetails",
      //   JSON.stringify(userUpdatePayload)
      // );

      const bookingPayload = {
        userId,
        equipmentId: bookingForm.equipmentId,
        slotDate: bookingForm.slotDate?.toISOString(),
        bookingDate: new Date().toISOString(),
        status: "pending",
        timeSlot: bookingForm.timeSlot,
        sampleDescription: bookingForm.sampleDescription,
        analysisRequired: bookingForm.analysisRequired,
        referenceNo: bookingForm.referenceNo,
        remarks: bookingForm.remarks,
        Category: bookingForm.organizationCategory,
        sample: bookingForm.noOfSamples,
        totalCharge: bookingForm.totalCharge,

        // 🔥 Added as you asked:
        phone: bookingForm.contactNo,
      };

      await axios.post(
        import.meta.env.VITE_API_URI + "/api/bookings/",
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("Booking request submitted successfully!", "success");
      setBookingForm({
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
        totalCharge: "",
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      showAlert("Submission failed. Please try again.", "error");
    }
  };

  return (
    <div className="bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Book Slots
        </h2>

        {alert.visible && (
          <div
            className={`transition-all duration-300 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium w-fit ${
              alert.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : alert.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-muted-foreground">
                📅 Booking Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">
                  Equipment *
                </label>
                <Select
                  value={bookingForm.equipmentId}
                  onValueChange={(value) =>
                    handleBookingFormChange("equipmentId", value)
                  }
                >
                  <SelectTrigger className="text-xs sm:text-sm">
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
                <label className="text-xs sm:text-sm font-medium mb-2 block">
                  Total Equipment Charge *
                </label>
                <Input
                  placeholder="Enter total charge"
                  value={bookingForm.totalCharge}
                  onChange={(e) =>
                    handleBookingFormChange("totalCharge", e.target.value)
                  }
                  required
                  className="text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">
                  Booking Date *
                </label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs sm:text-sm",
                        !bookingForm.slotDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {bookingForm.slotDate
                        ? format(bookingForm.slotDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingForm.slotDate}
                      onSelect={(date) => {
                        handleBookingFormChange("slotDate", date);
                        setCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">
                  Time Slot *
                </label>
                <Select
                  value={bookingForm.timeSlot}
                  onValueChange={(value) =>
                    handleBookingFormChange("timeSlot", value)
                  }
                >
                  <SelectTrigger className="text-xs sm:text-sm">
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

          {/* Customer / Party Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-muted-foreground">
                👤 Customer / Party Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Input
                placeholder="Full Name *"
                value={bookingForm.name}
                onChange={(e) =>
                  handleBookingFormChange("name", e.target.value)
                }
                required
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Organization Address *"
                value={bookingForm.organizationAddress}
                onChange={(e) =>
                  handleBookingFormChange("organizationAddress", e.target.value)
                }
                required
                className="text-xs sm:text-sm sm:col-span-2 lg:col-span-1"
              />
              <Select
                value={bookingForm.state}
                onValueChange={(v) => handleBookingFormChange("state", v)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="State *" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Andhra Pradesh",
                    "Arunachal Pradesh",
                    "Assam",
                    "Bihar",
                    "Chhattisgarh",
                    "Goa",
                    "Gujarat",
                    "Haryana",
                    "Himachal Pradesh",
                    "Jharkhand",
                    "Karnataka",
                    "Kerala",
                    "Madhya Pradesh",
                    "Maharashtra",
                    "Manipur",
                    "Meghalaya",
                    "Mizoram",
                    "Nagaland",
                    "Odisha",
                    "Punjab",
                    "Rajasthan",
                    "Sikkim",
                    "Tamil Nadu",
                    "Telangana",
                    "Tripura",
                    "Uttar Pradesh",
                    "Uttarakhand",
                    "West Bengal",
                    "Andaman and Nicobar Islands",
                    "Chandigarh",
                    "Dadra and Nagar Haveli and Daman and Diu",
                    "Delhi",
                    "Jammu and Kashmir",
                    "Ladakh",
                    "Lakshadweep",
                    "Puducherry",
                  ].map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={bookingForm.country}
                onValueChange={(v) => handleBookingFormChange("country", v)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Country *" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "India",
                    "United States",
                    "United Kingdom",
                    "Australia",
                    "Canada",
                    "Germany",
                    "France",
                    "Singapore",
                    "Japan",
                    "China",
                    "Nepal",
                    "Bangladesh",
                    "Sri Lanka",
                  ].map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={bookingForm.gstin}
                onValueChange={(v) => handleBookingFormChange("gstin", v)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Customer/Party GSTIN?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="GSTIN No"
                value={bookingForm.gstinNo}
                onChange={(e) =>
                  handleBookingFormChange("gstinNo", e.target.value)
                }
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="PAN No"
                value={bookingForm.panNo}
                onChange={(e) =>
                  handleBookingFormChange("panNo", e.target.value)
                }
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Contact No *"
                value={bookingForm.contactNo}
                onChange={(e) =>
                  handleBookingFormChange("contactNo", e.target.value)
                }
                required
                className="text-xs sm:text-sm"
              />
              <Input
                type="email"
                placeholder="Email ID *"
                value={bookingForm.emailId}
                onChange={(e) =>
                  handleBookingFormChange("emailId", e.target.value)
                }
                required
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Pincode *"
                value={bookingForm.pincode}
                onChange={(e) =>
                  handleBookingFormChange("pincode", e.target.value)
                }
                required
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Reference No"
                value={bookingForm.referenceNo}
                onChange={(e) =>
                  handleBookingFormChange("referenceNo", e.target.value)
                }
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Remarks"
                value={bookingForm.remarks}
                onChange={(e) =>
                  handleBookingFormChange("remarks", e.target.value)
                }
                className="text-xs sm:text-sm sm:col-span-2 lg:col-span-1"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-muted-foreground">
                🔬 Research Equipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Select
                value={bookingForm.organizationCategory}
                onValueChange={(v) =>
                  handleBookingFormChange("organizationCategory", v)
                }
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Organization Category *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Industry">Industry</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={bookingForm.noOfSamples}
                onValueChange={(v) => handleBookingFormChange("noOfSamples", v)}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="No. of Samples *" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <Textarea
                  placeholder="Sample Description *"
                  value={bookingForm.sampleDescription}
                  onChange={(e) =>
                    handleBookingFormChange("sampleDescription", e.target.value)
                  }
                  required
                  className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
                />
                <Textarea
                  placeholder="Analysis Required *"
                  value={bookingForm.analysisRequired}
                  onChange={(e) =>
                    handleBookingFormChange("analysisRequired", e.target.value)
                  }
                  required
                  className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user")}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto text-xs sm:text-sm"
            >
              Submit Booking Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
