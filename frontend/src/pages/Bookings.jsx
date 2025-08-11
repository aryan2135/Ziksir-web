import React, { useState, useEffect, useRef } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Bookings = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [status, setStatus] = useState("pending");
  const [filterStatus, setFilterStatus] = useState("all");
  const calendarRef = useRef(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URI + "/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getEventColor = (status) => {
    switch (status) {
      case "approved":
        return "#3B82F6";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    setSelectedEvent({
      id: event.extendedProps._id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      status: event.extendedProps.status,
    });
    setStartDateTime(event.startStr.slice(0, 16));
    setEndDateTime(event.endStr?.slice(0, 16) || event.startStr.slice(0, 16));
    setStatus(event.extendedProps.status || "pending");
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent?.id) return;
    try {
      await axios.put(import.meta.env.VITE_API_URI + `/api/bookings/${selectedEvent.id}`, {
        startTime: new Date(startDateTime).toISOString(),
        endTime: new Date(endDateTime).toISOString(),
        status,
      });
      setEditOpen(false);
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const handleEventDrop = async (info) => {
    const { event } = info;
    try {
      await axios.put(import.meta.env.VITE_API_URI + `/api/bookings/${event.extendedProps._id}`, {
        startTime: event.start.toISOString(),
        endTime: event.end?.toISOString() || event.start.toISOString(),
        status: event.extendedProps.status,
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking time:", error);
      info.revert();
    }
  };

  const handleEventResize = async (info) => {
    const { event } = info;
    try {
      await axios.put(import.meta.env.VITE_API_URI + `/api/bookings/${event.extendedProps._id}`, {
        startTime: event.start.toISOString(),
        endTime: event.end?.toISOString(),
        status: event.extendedProps.status,
      });
      fetchBookings();
    } catch (error) {
      console.error("Error resizing booking:", error);
      info.revert();
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URI + `/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const filteredSortedBookings = bookings
    .filter((b) => filterStatus === "all" || b.status === filterStatus)
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.slotDate) - new Date(a.slotDate);
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Booking Requests</h2>
        <Button variant="outline" onClick={() => setCalendarOpen(true)}>
          View Calendar
        </Button>
      </div>

      <Card className="bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-6">
        <CardHeader className="flex flex-wrap justify-between gap-2 w-full">
          <CardTitle>Recent Bookings</CardTitle>
          <div className=" w-[160px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredSortedBookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredSortedBookings.map((b) => (
                <div
                  key={b._id}
                  className="group flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg"
                >
                  <div>
                    <h4 className="font-semibold text-lg">{b.equipmentId?.name || "Unknown Equipment"}</h4>
                    <p className="text-sm text-gray-500">
                      {b.userId?.name || "Unknown User"} • {new Date(b.slotDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full transition-opacity duration-200
                        ${
                          b.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                        ${b.status === "pending" ? "group-hover:opacity-0" : ""}
                      `}
                    >
                      {b.status}
                    </span>

                    {b.status === "pending" && (
                      <div className="absolute right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={async () => {
                            await axios.put(import.meta.env.VITE_API_URI + `/api/bookings/${b._id}`, {
                              status: "approved",
                            });
                            fetchBookings();
                          }}
                          className="bg-green-100 hover:bg-green-200 text-green-800 font-bold rounded-full px-2 py-1 text-sm"
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          onClick={async () => {
                            await axios.put(import.meta.env.VITE_API_URI + `/api/bookings/${b._id}`, {
                              status: "cancelled",
                            });
                            fetchBookings();
                          }}
                          className="bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-full px-2 py-1 text-sm"
                          title="Reject"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="text-red-600 hover:text-red-800 text-xl font-bold"
                      title="Delete Booking"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-auto animate-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Bookings Calendar</DialogTitle>
          </DialogHeader>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            editable={true}
            events={bookings.map((b) => ({
              title: b.equipmentId?.name || "Booking",
              start: b.startTime,
              end: b.endTime || b.startTime,
              color: getEventColor(b.status),
              extendedProps: {
                _id: b._id,
                status: b.status,
              },
            }))}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            headerToolbar={{
              start: "prev,next today",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date & Time</label>
              <Input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date & Time</label>
              <Input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
