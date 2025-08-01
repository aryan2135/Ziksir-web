import React, { useState, useEffect, useRef } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Bookings = () => {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const calendarRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/booking")
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
      });
  }, []);

  const getEventColor = (status) => {
    switch (status) {
      case "Confirmed": return "#3B82F6";
      case "Pending": return "#F59E0B";
      case "Cancelled": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setStartDateTime(info.event.start?.toISOString().slice(0, 16));
    setEndDateTime(info.event.end?.toISOString().slice(0, 16));
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedEvent) {
      selectedEvent.setStart(startDateTime);
      selectedEvent.setEnd(endDateTime);
      try {
        await axios.put(`http://localhost:5000/api/booking/${selectedEvent.extendedProps._id}`, {
          startTime: startDateTime,
          endTime: endDateTime,
        });
      } catch (err) {
        console.error("Error updating booking:", err);
      }
    }
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Booking Requests</h2>
        <Button variant="outline" onClick={() => setCalendarOpen(true)}>
          <i className="fas fa-calendar-alt"></i>
          <span className="ml-2">View Calendar</span>
        </Button>
      </div>

      {/* Recent Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">{booking.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {booking.user?.name || "Unknown"} • {new Date(booking.slotDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Modal */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-auto animate-modal">
          <DialogHeader className="w-full flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Bookings Calendar</DialogTitle>
          </DialogHeader>
          <div className="p-4 w-full">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={bookings.map((b) => ({
                title: b.title,
                start: b.startTime,
                end: b.endTime || b.startTime,
                color: getEventColor(b.status),
                _id: b._id,
              }))}
              eventClick={handleEventClick}
              headerToolbar={{
                start: "prevYear,prev,next,nextYear today",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              customButtons={{
                prevYear: {
                  text: "«",
                  click: () => calendarRef.current.getApi().prevYear(),
                },
                nextYear: {
                  text: "»",
                  click: () => calendarRef.current.getApi().nextYear(),
                },
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
              }}
              dayHeaderClassNames="bg-blue-100 text-blue-700 font-medium"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="font-semibold">{selectedEvent?.title}</p>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date & Time</label>
              <Input type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date & Time</label>
              <Input type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Animations */}
      <style>
        {`
          .animate-modal {
            animation: fadeInScale 0.3s ease-out;
          }
          @keyframes fadeInScale {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          .fc-event {
            cursor: pointer !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .fc-event:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default Bookings;
