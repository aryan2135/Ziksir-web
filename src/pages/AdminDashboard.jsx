import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
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