import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch total user count from backend
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URI + "/api/user/count");
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    // Optional: Fetch all users if endpoint exists (e.g., /api/user)
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URI + "/api/user"); // only if route exists
        setUsers(response.data.users || []);
      } catch (error) {
        console.warn("Users list endpoint not available. Showing count only.");
        setUsers([]); // fallback
      }
    };

    fetchUserCount();
    fetchAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Registered Users</h2>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-foreground mb-4">
            Total Registered Users: {totalUsers}
          </p>

          {users.length === 0 ? (
            <p className="text-muted-foreground">No detailed user data available.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.email} • {user.role}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <i className="fas fa-trash mr-1"></i> Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
