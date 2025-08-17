import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const userId = user._id;

      const response = await axios.get(
        import.meta.env.VITE_API_URI + `/api/bookings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const sortedBookings = response.data.sort((a, b) => {
        const order = { pending: 0, approved: 1, completed: 2, rejected: 3 };
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      });

      setUserBookings(sortedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-poppins">My Bookings</h2>
        <Button
          className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-sm sm:text-base"
          onClick={() => navigate("/user/book-slots")}
        >
          <i className="fas fa-plus mr-2"></i>
          New Booking
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center text-sm sm:text-base">Loading bookings...</p>
      ) : userBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <i className="fas fa-calendar-times text-4xl sm:text-6xl text-muted-foreground mb-3 sm:mb-4"></i>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              You haven't made any equipment bookings yet.
            </p>
            <Button
              className="bg-accent hover:bg-accent/90 text-sm sm:text-base"
              onClick={() => navigate("/user/book-slots")}
            >
              <i className="fas fa-plus mr-2"></i>
              Book Your First Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {userBookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                      <i className="fas fa-microscope text-accent text-sm sm:text-base" />
                      <span className="truncate">{booking.equipmentId?.name || "Unknown Equipment"}</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {booking.slotDate?.slice(0, 10)} • {booking.timeSlot}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Booking Details</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p>
                        <span className="text-muted-foreground">Organization:</span>{" "}
                        {booking.userId.organizationAddress || "NA"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Samples:</span>{" "}
                        {booking.userId.noOfSamples || "NA"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        {booking.organizationCategory || "NA"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Contact Info</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {booking.emailId || booking.userId?.email || "NA"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {booking.contactNo || booking.userId?.contactNo || "NA"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Submitted:</span>{" "}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.sampleDescription && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Sample Description</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                      {booking.sampleDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
