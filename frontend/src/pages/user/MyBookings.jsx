import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added navigation
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  const navigate = useNavigate(); // Hook for navigation

  const [userBookings] = useState([
    {
      id: 1,
      equipmentName: "Confocal Microscope",
      bookingDate: "2025-07-20",
      timeSlot: "09:00-10:00 AM",
      status: "approved",
      organizationAddress: "ABC Research Institute",
      noOfSamples: 3,
      organizationCategory: "Academic",
      emailId: "john.doe@example.com",
      contactNo: "+91 9876543210",
      submittedAt: "2025-07-18",
      sampleDescription: "Microscopy analysis for protein visualization."
    },
    {
      id: 2,
      equipmentName: "PCR Machine",
      bookingDate: "2025-07-18",
      timeSlot: "10:00-11:00 AM",
      status: "completed",
      organizationAddress: "XYZ Labs",
      noOfSamples: 5,
      organizationCategory: "Industry",
      emailId: "lab@example.com",
      contactNo: "+91 9876500000",
      submittedAt: "2025-07-15",
      sampleDescription: "DNA amplification testing."
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-poppins">My Bookings</h2>
        <Button
          className="bg-accent hover:bg-accent/90"
          onClick={() => navigate("/user/book-slots")} // Navigate to booking page
        >
          <i className="fas fa-plus mr-2"></i>
          New Booking
        </Button>
      </div>

      {/* Bookings List */}
      <div className="grid gap-6">
        {userBookings.length === 0 ? (
          // Empty State
          <Card>
            <CardContent className="p-12 text-center">
              <i className="fas fa-calendar-times text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any equipment bookings yet.
              </p>
              <Button
                className="bg-accent hover:bg-accent/90"
                onClick={() => navigate("/book-slots")} // Navigate to booking page
              >
                <i className="fas fa-plus mr-2"></i>
                Book Your First Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          userBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <i className="fas fa-microscope text-accent"></i>
                      <span>{booking.equipmentName}</span>
                    </CardTitle>
                    <CardDescription>
                      {booking.bookingDate} • {booking.timeSlot}
                    </CardDescription>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : booking.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : booking.status === "completed"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Booking Details */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Booking Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Organization:</span>{" "}
                        {booking.organizationAddress}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Samples:</span>{" "}
                        {booking.noOfSamples}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        {booking.organizationCategory}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Contact Info</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Email:</span> {booking.emailId}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span> {booking.contactNo}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Submitted:</span>{" "}
                        {new Date(booking.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sample Description */}
                {booking.sampleDescription && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-foreground mb-2">Sample Description</h4>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                      {booking.sampleDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
