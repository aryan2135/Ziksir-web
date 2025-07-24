import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UserDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: 'Hello! I\'m your research assistant. How can I help you today?' }
  ]);
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

  const sidebarItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
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