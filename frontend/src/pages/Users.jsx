import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch total users
  const fetchUserCount = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URI + "/api/user/count");
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URI + "/api/user");
      setUsers(response.data || []);
    } catch (error) {
      console.warn("Users list endpoint not available.");
      setUsers([]);
    }
  };

  // DELETE user by ID
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URI}/api/user/${userId}`);
      // Remove user from state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      // Update count
      fetchUserCount();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Check console for details.");
    }
  };

  useEffect(() => {
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
            <p className="text-muted-foreground">No registered users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-secondary rounded-lg"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{user.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email} • {user.role}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(user._id)}>
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
