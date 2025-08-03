import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Overview = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalBookings: 0,
    approvedBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalUsers: 0,
  });

  const fetchStats = async () => {
    try {
      const [equipmentRes, bookingRes, usersRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URI + "/api/equipment/count"),
        axios.get(import.meta.env.VITE_API_URI + "/api/bookings/count"),
        axios.get(import.meta.env.VITE_API_URI + "/api/user/count"),
      ]);

      setStats({
      totalEquipment: equipmentRes.data.totalEquipments || 0,
      totalBookings: bookingRes.data.totalBookings || 0,
      approvedBookings: bookingRes.data.approved || 0,
      pendingBookings: bookingRes.data.pending || 0,
      completedBookings: bookingRes.data.completed || 0,
      cancelledBookings: bookingRes.data.cancelled || 0,
      totalUsers: usersRes.data.totalUsers || 0,
    });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  useEffect(() => {
    const clientUrl = import.meta.env.VITE_API_URI;
    console.log('client url: ', clientUrl);
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Equipment", value: stats.totalEquipment, icon: "fas fa-microscope" },
    { title: "Total Bookings", value: stats.totalBookings, icon: "fas fa-calendar" },
    // { title: "Approved", value: stats.approvedBookings, icon: "fas fa-check-circle" },
    // { title: "Pending", value: stats.pendingBookings, icon: "fas fa-clock" },
    // { title: "Completed", value: stats.completedBookings, icon: "fas fa-tasks" },
    // { title: "Cancelled", value: stats.cancelledBookings, icon: "fas fa-times-circle" },
    { title: "Total Users", value: stats.totalUsers, icon: "fas fa-users" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Admin Dashboard Overview</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New equipment added", time: "2 hours ago", icon: "fas fa-plus" },
                { action: "Booking request approved", time: "4 hours ago", icon: "fas fa-check" },
                { action: "User registration", time: "6 hours ago", icon: "fas fa-user-plus" },
                { action: "Equipment maintenance scheduled", time: "1 day ago", icon: "fas fa-wrench" },
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
                { label: "Add Equipment", icon: "fas fa-plus", path: "/admin/equipment" },
                { label: "View Requests", icon: "fas fa-inbox", path: "/admin/bookings" },
                { label: "User Management", icon: "fas fa-users", path: "/admin/users" },
                { label: "Generate Report", icon: "fas fa-file-alt", path: "/admin/settings" },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => (window.location.href = action.path)}
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
};

export default Overview;
