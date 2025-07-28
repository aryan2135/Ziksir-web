import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Load registered users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    setUsers(storedUsers);
  }, []);

  // Delete user from list
  const handleDelete = (username) => {
    const updatedUsers = users.filter((user) => user.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Registered Users</h2>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground">No users have signed up yet.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">{user.fullName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.username} • {user.email}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.username)}
                  >
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
