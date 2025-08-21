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
  const [errMsg, setErrMsg] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?._id;

      if (!userId) throw new Error("User not found in localStorage.");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/api/bookings/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res?.data) ? res.data : [];
      // pehle jaise status-based sort
      const order = { pending: 0, approved: 1, completed: 2, rejected: 3 };
      data.sort(
        (a, b) =>
          (order[(a?.status || "").toLowerCase()] ?? 4) -
          (order[(b?.status || "").toLowerCase()] ?? 4)
      );

      // 🔁 UI par ulta dikhane ke liye reverse
      data.reverse();

      setUserBookings(data);
    } catch (e) {
      console.error(e);
      setErrMsg(
        e?.response?.data?.message || e?.message || "Failed to fetch bookings."
      );
      setUserBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusClasses = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (s === "approved")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (s === "completed")
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (s === "rejected")
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "bg-muted text-foreground";
  };

  const fmtDate = (val) => {
    try {
      if (!val) return "—";
      const d = new Date(val);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString();
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-poppins">
          My Bookings
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-sm sm:text-base"
            onClick={fetchBookings}
          >
            <i className="fas fa-rotate-right mr-2" />
            Refresh
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 w-full sm:w-auto text-sm sm:text-base"
            onClick={() => navigate("/user/book-slots")}
          >
            <i className="fas fa-plus mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center text-sm sm:text-base">
          Loading bookings...
        </p>
      ) : errMsg ? (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm sm:text-base text-red-600">
              <i className="fas fa-triangle-exclamation mr-2" />
              {errMsg}
            </p>
          </CardContent>
        </Card>
      ) : userBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <i className="fas fa-calendar-times text-4xl sm:text-6xl text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No Bookings Yet
            </h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              You haven't made any equipment bookings yet.
            </p>
            <Button
              className="bg-accent hover:bg-accent/90 text-sm sm:text-base"
              onClick={() => navigate("/user/book-slots")}
            >
              <i className="fas fa-plus mr-2" />
              Book Your First Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {userBookings.map((booking) => {
            const samples = booking?.sample ?? "—"; // exact: sample key you used
            const category = booking?.Category ?? "—"; // exact: Category (capital C)

            const equipmentName =
              booking?.equipmentId?.name ||
              booking?.equipment?.name ||
              booking?.equipmentName ||
              "Unknown Equipment";

            const slotDateRaw =
              booking?.slotDate || booking?.date || booking?.bookingDate || "";
            const slotDate =
              typeof slotDateRaw === "string" && slotDateRaw.length >= 10
                ? slotDateRaw.slice(0, 10)
                : slotDateRaw || "—";

            const timeSlot =
              booking?.timeSlot || booking?.slotTime || booking?.time || "—";

            const organization =
              booking?.organizationName ||
              booking?.userId?.organizationName ||
              booking?.userId?.organizationAddress ||
              booking?.organizationAddress ||
              "—";

            const email =
              booking?.emailId ||
              booking?.email ||
              booking?.userId?.email ||
              "—";
            const phone =
              booking?.contactNo ||
              booking?.phone ||
              booking?.mobile ||
              booking?.userId?.contactNo ||
              booking?.userId?.phone ||
              booking?.userId?.mobile ||
              "—";

            const submitted = fmtDate(booking?.bookingDate);
            const status = booking?.status
              ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
              : "Status";

            return (
              <Card
                key={booking?._id || Math.random()}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                        <i className="fas fa-microscope text-accent text-sm sm:text-base" />
                        <span className="truncate">{equipmentName}</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {slotDate} • {timeSlot}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses(
                        booking?.status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        Booking Details
                      </h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p className="truncate">
                          <span className="text-muted-foreground">
                            Organization:
                          </span>{" "}
                          {organization}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Samples:
                          </span>{" "}
                          {samples}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Category:
                          </span>{" "}
                          {category}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        Contact Info
                      </h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p className="truncate">
                          <span className="text-muted-foreground">Email:</span>{" "}
                          {email}
                        </p>
                        <p className="truncate">
                          <span className="text-muted-foreground">Phone:</span>{" "}
                          {phone}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Submitted:
                          </span>{" "}
                          {submitted}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking?.sampleDescription ? (
                    <div className="mt-4">
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        Sample Description
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                        {booking.sampleDescription}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
