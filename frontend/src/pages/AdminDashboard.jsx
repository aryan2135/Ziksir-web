import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userType = localStorage.getItem('userType');
    
    if (!isAuthenticated || userType !== 'admin') {
      navigate('/auth');
      return;
    }

    // Check theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    // Load bookings from localStorage
    const loadBookings = () => {
      const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      setBookings(savedBookings);
    };
    
    loadBookings();
    
    // Refresh bookings every 5 seconds when on bookings page
    const interval = setInterval(() => {
      if (activeSection === 'bookings') {
        loadBookings();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleBookingAction = (bookingId, action) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: action }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setNewDate(null);
    setNewTimeSlot('');
    setIsRescheduleDialogOpen(true);
  };

  const saveReschedule = () => {
    if (!newDate || !newTimeSlot) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { 
            ...booking, 
            bookingDate: newDate,
            timeSlot: newTimeSlot,
            status: 'rescheduled'
          }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setIsRescheduleDialogOpen(false);
  };

  const isSlotTaken = (date, timeSlot) => {
    return bookings.some(booking => 
      booking.status === 'approved' &&
      new Date(booking.bookingDate).toDateString() === date.toDateString() &&
      booking.timeSlot === timeSlot
    );
  };

  const sidebarItems = [
    { id: 'overview', icon: 'fas fa-chart-bar', label: 'Overview' },
    { id: 'equipment', icon: 'fas fa-cogs', label: 'Equipment Management' },
    { id: 'bookings', icon: 'fas fa-calendar-check', label: 'Booking Requests' },
    { id: 'users', icon: 'fas fa-users', label: 'User Management' },
    { id: 'analytics', icon: 'fas fa-analytics', label: 'Analytics' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Admin Dashboard Overview</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Equipment', value: '156', icon: 'fas fa-microscope', color: 'text-blue-500' },
                { title: 'Active Bookings', value: '23', icon: 'fas fa-calendar-check', color: 'text-green-500' },
                { title: 'Pending Requests', value: '8', icon: 'fas fa-clock', color: 'text-yellow-500' },
                { title: 'Total Users', value: '342', icon: 'fas fa-users', color: 'text-purple-500' }
              ].map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-accent rounded-lg flex items-center justify-center`}>
                        <i className={`${stat.icon} text-xl text-accent-foreground`}></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'New equipment added', time: '2 hours ago', icon: 'fas fa-plus' },
                      { action: 'Booking request approved', time: '4 hours ago', icon: 'fas fa-check' },
                      { action: 'User registration', time: '6 hours ago', icon: 'fas fa-user-plus' },
                      { action: 'Equipment maintenance scheduled', time: '1 day ago', icon: 'fas fa-wrench' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <i className={`${activity.icon} text-sm text-accent-foreground`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Add Equipment', icon: 'fas fa-plus', action: () => setActiveSection('equipment') },
                      { label: 'View Requests', icon: 'fas fa-inbox', action: () => setActiveSection('bookings') },
                      { label: 'User Management', icon: 'fas fa-users', action: () => setActiveSection('users') },
                      { label: 'Generate Report', icon: 'fas fa-file-alt', action: () => setActiveSection('analytics') }
                    ].map((action, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="h-20 flex-col space-y-2"
                        onClick={action.action}
                      >
                        <i className={`${action.icon} text-xl`}></i>
                        <span className="text-sm">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'equipment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">Equipment Management</h2>
              <Button>
                <i className="fas fa-plus mr-2"></i>
                Add New Equipment
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipment Inventory</CardTitle>
                <CardDescription>Manage your research equipment and facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'High-Resolution Microscope', type: 'Imaging', status: 'Available', location: 'Lab A-201' },
                    { name: 'PCR Machine', type: 'Molecular Biology', status: 'In Use', location: 'Lab B-105' },
                    { name: 'Centrifuge', type: 'Sample Preparation', status: 'Maintenance', location: 'Lab A-203' },
                    { name: 'Spectrophotometer', type: 'Analysis', status: 'Available', location: 'Lab C-301' }
                  ].map((equipment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                          <i className="fas fa-microscope text-accent-foreground"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{equipment.name}</h4>
                          <p className="text-sm text-muted-foreground">{equipment.type} • {equipment.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          equipment.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          equipment.status === 'In Use' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {equipment.status}
                        </span>
                        <Button variant="outline" size="sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">Booking Requests</h2>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <i className="fas fa-sync mr-2"></i>
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <i className="fas fa-calendar-times text-6xl text-muted-foreground mb-4"></i>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Booking Requests</h3>
                    <p className="text-muted-foreground">There are currently no booking requests to review.</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <i className="fas fa-user text-accent"></i>
                            <span>{booking.name}</span>
                          </CardTitle>
                          <CardDescription>
                            {booking.equipmentName} • {booking.bookingDate ? format(new Date(booking.bookingDate), "PPP") : 'No date'} • {booking.timeSlot}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          booking.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Email:</span> {booking.emailId}</p>
                            <p><span className="text-muted-foreground">Phone:</span> {booking.contactNo}</p>
                            <p><span className="text-muted-foreground">Organization:</span> {booking.organizationAddress}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Booking Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Samples:</span> {booking.noOfSamples}</p>
                            <p><span className="text-muted-foreground">Category:</span> {booking.organizationCategory}</p>
                            <p><span className="text-muted-foreground">Submitted:</span> {new Date(booking.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {booking.sampleDescription && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-foreground mb-2">Sample Description</h4>
                          <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                            {booking.sampleDescription}
                          </p>
                        </div>
                      )}
                      
                      {booking.status === 'pending' && (
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleBookingAction(booking.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <i className="fas fa-check mr-2"></i>
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleReschedule(booking)}
                          >
                            <i className="fas fa-calendar-alt mr-2"></i>
                            Reschedule
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleBookingAction(booking.id, 'rejected')}
                          >
                            <i className="fas fa-times mr-2"></i>
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {booking.status === 'approved' && (
                        <div className="flex space-x-3">
                          <Button variant="outline" disabled>
                            <i className="fas fa-check mr-2"></i>
                            Approved
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleReschedule(booking)}
                          >
                            <i className="fas fa-calendar-alt mr-2"></i>
                            Reschedule
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Reschedule Dialog */}
            <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Reschedule Booking</DialogTitle>
                  <DialogDescription>
                    Select a new date and time for {selectedBooking?.name}'s booking
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      New Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newDate}
                          onSelect={setNewDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      New Time Slot
                    </label>
                    <Select value={newTimeSlot} onValueChange={setNewTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          '09:00-10:00',
                          '10:00-11:00',
                          '11:00-12:00',
                          '14:00-15:00',
                          '15:00-16:00',
                          '16:00-17:00'
                        ].map((slot) => {
                          const isTaken = newDate && isSlotTaken(newDate, slot);
                          return (
                            <SelectItem key={slot} value={slot} disabled={isTaken}>
                              {slot.replace('-', ' - ')} {isTaken && '(Taken)'}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {newDate && newTimeSlot && isSlotTaken(newDate, newTimeSlot) && (
                      <p className="text-sm text-red-500 mt-1">
                        This time slot is already booked. Please select another time.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveReschedule}
                    disabled={!newDate || !newTimeSlot || (newDate && newTimeSlot && isSlotTaken(newDate, newTimeSlot))}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-16">
            <i className="fas fa-tools text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="text-2xl font-bold text-primary mb-8">
            ZIKSI<span className="text-accent">Rweb</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <i className={item.icon}></i>
                <span className="font-open-sans">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground font-open-sans">
                Welcome back, Administrator
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={toggleTheme} variant="outline" size="sm">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </Button>
              
              <Button onClick={handleLogout} variant="outline">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;