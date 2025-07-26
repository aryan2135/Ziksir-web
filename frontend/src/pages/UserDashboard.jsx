import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const UserDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: 'Hello! I\'m your research assistant. How can I help you today?' }
  ]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    organizationAddress: '',
    state: '',
    country: '',
    gstin: '',
    gstinNo: '',
    panNo: '',
    contactNo: '',
    emailId: '',
    pincode: '',
    referenceNo: '',
    remarks: '',
    organizationCategory: '',
    equipmentName: '',
    equipmentCharge: '',
    noOfSamples: '',
    sampleDescription: '',
    analysisRequired: '',
    bookingDate: null,
    timeSlot: ''
  });
  const [userBookings, setUserBookings] = useState([]);
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
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

    // Load user bookings
    loadUserBookings();
  }, [navigate]);

  const loadUserBookings = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setUserBookings(bookings);
  };

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user message
    setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I can help you find the right equipment for your research. What type of experiment are you planning?",
        "Let me search our database for available equipment that matches your requirements.",
        "Would you like me to check the booking availability for specific equipment?",
        "I can also provide information about equipment specifications and usage guidelines."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: 'bot', message: randomResponse }]);
    }, 1000);

    setChatMessage('');
  };

  const handleBookingFormChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Store booking in localStorage (simulate backend)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      ...bookingForm,
      id: Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Reset form
    setBookingForm({
      name: '',
      organizationAddress: '',
      state: '',
      country: '',
      gstin: '',
      gstinNo: '',
      panNo: '',
      contactNo: '',
      emailId: '',
      pincode: '',
      referenceNo: '',
      remarks: '',
      organizationCategory: '',
      equipmentName: '',
      equipmentCharge: '',
      noOfSamples: '',
      sampleDescription: '',
      analysisRequired: '',
      bookingDate: null,
      timeSlot: ''
    });
    
    // Show success message and refresh bookings
    setShowSubmissionMessage(true);
    setTimeout(() => setShowSubmissionMessage(false), 3000);
    loadUserBookings();
    
    // Switch to bookings view
    setActiveSection('bookings');
  };

  const sidebarItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'book-slots', icon: 'fas fa-calendar-plus', label: 'Book Slots' },
    { id: 'browse', icon: 'fas fa-search', label: 'Browse Equipment' },
    { id: 'bookings', icon: 'fas fa-calendar', label: 'My Bookings' },
    { id: 'chatbot', icon: 'fas fa-robot', label: 'Research Assistant' },
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Welcome to Your Research Hub</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'My Bookings', value: '5', icon: 'fas fa-calendar-check', color: 'text-blue-500' },
                { title: 'Pending Requests', value: '2', icon: 'fas fa-clock', color: 'text-yellow-500' },
                { title: 'Completed Sessions', value: '18', icon: 'fas fa-check-circle', color: 'text-green-500' }
              ].map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
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
                  <CardTitle>Recent Equipment</CardTitle>
                  <CardDescription>Equipment you've recently used or bookmarked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Confocal Microscope', location: 'Lab A-201', lastUsed: '2 days ago' },
                      { name: 'Flow Cytometer', location: 'Lab B-105', lastUsed: '1 week ago' },
                      { name: 'Mass Spectrometer', location: 'Lab C-301', lastUsed: '2 weeks ago' }
                    ].map((equipment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                          <i className="fas fa-microscope text-accent-foreground"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{equipment.name}</h4>
                          <p className="text-sm text-muted-foreground">{equipment.location} • {equipment.lastUsed}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
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
                      { label: 'Browse Equipment', icon: 'fas fa-search', action: () => setActiveSection('browse') },
                      { label: 'New Booking', icon: 'fas fa-plus', action: () => setActiveSection('bookings') },
                      { label: 'Research Assistant', icon: 'fas fa-robot', action: () => setActiveSection('chatbot') },
                      { label: 'View Calendar', icon: 'fas fa-calendar', action: () => setActiveSection('bookings') }
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

      case 'book-slots':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Book Equipment Slots</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* Customer/Party Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">Customer/Party Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={bookingForm.name}
                        onChange={(e) => handleBookingFormChange('name', e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Organization Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={bookingForm.organizationAddress}
                        onChange={(e) => handleBookingFormChange('organizationAddress', e.target.value)}
                        placeholder="Enter organization address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.state} onValueChange={(value) => handleBookingFormChange('state', value)}>
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
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.country} onValueChange={(value) => handleBookingFormChange('country', value)}>
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
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Customer/Party GSTIN <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.gstin} onValueChange={(value) => handleBookingFormChange('gstin', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="--Select Option--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        GSTIN No
                      </label>
                      <Input
                        value={bookingForm.gstinNo}
                        onChange={(e) => handleBookingFormChange('gstinNo', e.target.value)}
                        placeholder="GSTIN No"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        PAN No
                      </label>
                      <Input
                        value={bookingForm.panNo}
                        onChange={(e) => handleBookingFormChange('panNo', e.target.value)}
                        placeholder="PAN No"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Contact No <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={bookingForm.contactNo}
                        onChange={(e) => handleBookingFormChange('contactNo', e.target.value)}
                        placeholder="Contact No(In Number)"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Id <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={bookingForm.emailId}
                        onChange={(e) => handleBookingFormChange('emailId', e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={bookingForm.pincode}
                        onChange={(e) => handleBookingFormChange('pincode', e.target.value)}
                        placeholder="Pincode"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Reference No
                      </label>
                      <Input
                        value={bookingForm.referenceNo}
                        onChange={(e) => handleBookingFormChange('referenceNo', e.target.value)}
                        placeholder="Reference No."
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Remarks
                      </label>
                      <Input
                        value={bookingForm.remarks}
                        onChange={(e) => handleBookingFormChange('remarks', e.target.value)}
                        placeholder="Remarks"
                      />
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
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Organization Category <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.organizationCategory} onValueChange={(value) => handleBookingFormChange('organizationCategory', value)}>
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
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Equipment Name <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.equipmentName} onValueChange={(value) => handleBookingFormChange('equipmentName', value)}>
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
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Equipment Charge (Incl. GST)
                      </label>
                      <Input
                        value={bookingForm.equipmentCharge}
                        onChange={(e) => handleBookingFormChange('equipmentCharge', e.target.value)}
                        placeholder="Equipment Charge"
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        No Of Samples <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.noOfSamples} onValueChange={(value) => handleBookingFormChange('noOfSamples', value)}>
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
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Sample Description (Max 500 words) <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={bookingForm.sampleDescription}
                        onChange={(e) => handleBookingFormChange('sampleDescription', e.target.value)}
                        placeholder="Describe your samples..."
                        maxLength={500}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Analysis Required (Max 500 words) <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={bookingForm.analysisRequired}
                        onChange={(e) => handleBookingFormChange('analysisRequired', e.target.value)}
                        placeholder="Describe the analysis required..."
                        maxLength={500}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">Booking Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Booking Date <span className="text-red-500">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !bookingForm.bookingDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingForm.bookingDate ? format(bookingForm.bookingDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={bookingForm.bookingDate}
                            onSelect={(date) => handleBookingFormChange('bookingDate', date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Time Slot <span className="text-red-500">*</span>
                      </label>
                      <Select value={bookingForm.timeSlot} onValueChange={(value) => handleBookingFormChange('timeSlot', value)}>
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

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setActiveSection('dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  Submit Booking Request
                </Button>
              </div>
            </form>
          </div>
        );

      case 'chatbot':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Research Assistant</h2>
            
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-robot mr-2 text-accent"></i>
                  AI Research Assistant
                </CardTitle>
                <CardDescription>
                  Get help finding equipment, booking resources, and research guidance
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-secondary/30 rounded-lg">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        chat.type === 'user' 
                          ? 'bg-accent text-accent-foreground ml-4' 
                          : 'bg-card border border-border mr-4'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {chat.type === 'bot' && (
                            <i className="fas fa-robot text-accent mt-1"></i>
                          )}
                          <p className="font-open-sans text-sm">{chat.message}</p>
                          {chat.type === 'user' && (
                            <i className="fas fa-user text-accent-foreground mt-1"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about equipment, bookings, or research help..."
                    className="flex-1 font-open-sans"
                  />
                  <Button type="submit">
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">My Bookings</h2>
              <Button onClick={() => setActiveSection('book-slots')}>
                <i className="fas fa-plus mr-2"></i>
                New Booking
              </Button>
            </div>

            {showSubmissionMessage && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>Booking submitted successfully! Your request is now pending review.</span>
                </div>
              </div>
            )}
            
            <div className="grid gap-6">
              {userBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <i className="fas fa-calendar-times text-6xl text-muted-foreground mb-4"></i>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't made any equipment bookings yet.</p>
                    <Button onClick={() => setActiveSection('book-slots')}>
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
                            {booking.bookingDate ? format(new Date(booking.bookingDate), "PPP") : 'No date'} • {booking.timeSlot}
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Booking Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Organization:</span> {booking.organizationAddress}</p>
                            <p><span className="text-muted-foreground">Samples:</span> {booking.noOfSamples}</p>
                            <p><span className="text-muted-foreground">Category:</span> {booking.organizationCategory}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Contact Info</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Email:</span> {booking.emailId}</p>
                            <p><span className="text-muted-foreground">Phone:</span> {booking.contactNo}</p>
                            <p><span className="text-muted-foreground">Submitted:</span> {new Date(booking.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
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

      case 'browse':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Browse Equipment</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'High-Resolution Microscope',
                  category: 'Imaging',
                  location: 'Lab A-201',
                  availability: 'Available',
                  image: 'fas fa-microscope',
                  description: 'Advanced confocal microscope with high-resolution imaging capabilities. Perfect for cellular and molecular imaging studies with sub-micrometer resolution.',
                  specifications: ['Resolution: 0.1 μm', 'Magnification: 1000x-100000x', 'Wavelength: 405-633 nm']
                },
                {
                  name: 'PCR Machine',
                  category: 'Molecular Biology',
                  location: 'Lab B-105',
                  availability: 'In Use',
                  image: 'fas fa-dna',
                  description: 'Thermal cycler for polymerase chain reaction (PCR) amplification. Supports gradient PCR and real-time quantitative PCR applications.',
                  specifications: ['96-well capacity', 'Temperature range: 4-99°C', 'Ramp rate: 5°C/sec']
                },
                {
                  name: 'Centrifuge',
                  category: 'Sample Preparation',
                  location: 'Lab A-203',
                  availability: 'Maintenance',
                  image: 'fas fa-circle-notch',
                  description: 'High-speed centrifuge for sample separation and purification. Variable speed control with safety interlocks and automatic rotor recognition.',
                  specifications: ['Max speed: 15,000 RPM', 'Capacity: 24 tubes', 'Temperature: -10°C to 40°C']
                },
                {
                  name: 'Spectrophotometer',
                  category: 'Analysis',
                  location: 'Lab C-301',
                  availability: 'Available',
                  image: 'fas fa-chart-line',
                  description: 'UV-Vis spectrophotometer for quantitative analysis of biological samples. Ideal for protein quantification and enzyme assays.',
                  specifications: ['Wavelength: 190-1100 nm', 'Bandwidth: 1.5 nm', 'Accuracy: ±0.3 nm']
                },
                {
                  name: 'Flow Cytometer',
                  category: 'Cell Analysis',
                  location: 'Lab B-107',
                  availability: 'Available',
                  image: 'fas fa-stream',
                  description: 'Multi-parameter flow cytometer for cell counting, sorting, and biomarker detection. Supports fluorescent and non-fluorescent analysis.',
                  specifications: ['4-color detection', 'Sample rate: 10,000 events/sec', 'Detection limit: 0.1% positive cells']
                },
                {
                  name: 'Mass Spectrometer',
                  category: 'Chemical Analysis',
                  location: 'Lab C-305',
                  availability: 'Available',
                  image: 'fas fa-atom',
                  description: 'High-resolution mass spectrometer for molecular identification and quantification. LC-MS/MS capabilities for complex sample analysis.',
                  specifications: ['Mass range: 50-2000 m/z', 'Resolution: 100,000 FWHM', 'Sensitivity: fg level']
                }
              ].map((equipment, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <i className={`${equipment.image} text-xl text-accent-foreground`}></i>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{equipment.name}</CardTitle>
                        <CardDescription>{equipment.category} • {equipment.location}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {equipment.description}
                      </p>
                      
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Key Specifications:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {equipment.specifications.map((spec, specIndex) => (
                            <li key={specIndex} className="flex items-center">
                              <i className="fas fa-check text-green-500 mr-2"></i>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          equipment.availability === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          equipment.availability === 'In Use' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {equipment.availability}
                        </span>
                        <Button 
                          size="sm" 
                          disabled={equipment.availability !== 'Available'}
                          onClick={() => setActiveSection('book-slots')}
                        >
                          <i className="fas fa-calendar-plus mr-2"></i>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">User Profile</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user text-6xl text-accent-foreground"></i>
                  </div>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-camera mr-2"></i>
                    Change Photo
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                      <Input value="Dr. Sarah Johnson" readOnly className="bg-muted" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                      <Input value="sarah.johnson@university.edu" readOnly className="bg-muted" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                      <Input value="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Organization</label>
                      <Input value="Stanford University" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
                      <Input value="Biology Department" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Research Area</label>
                      <Input value="Molecular Biology" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>
                      <i className="fas fa-save mr-2"></i>
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Bookings', value: '23', icon: 'fas fa-calendar-check', color: 'text-blue-500' },
                      { label: 'Completed Sessions', value: '18', icon: 'fas fa-check-circle', color: 'text-green-500' },
                      { label: 'Pending Requests', value: '2', icon: 'fas fa-clock', color: 'text-yellow-500' },
                      { label: 'Member Since', value: 'Jan 2024', icon: 'fas fa-user-clock', color: 'text-purple-500' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-secondary rounded-lg">
                        <div className={`w-12 h-12 ${stat.color} mx-auto mb-2 flex items-center justify-center`}>
                          <i className={`${stat.icon} text-2xl`}></i>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline">
                        <i className="fas fa-key mr-2"></i>
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">
                        <i className="fas fa-shield-alt mr-2"></i>
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">Login History</h4>
                        <p className="text-sm text-muted-foreground">View recent login activity</p>
                      </div>
                      <Button variant="outline">
                        <i className="fas fa-history mr-2"></i>
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              <h1 className="text-xl font-semibold text-foreground">Research Dashboard</h1>
              <p className="text-sm text-muted-foreground font-open-sans">
                Manage your research activities and bookings
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

export default UserDashboard;