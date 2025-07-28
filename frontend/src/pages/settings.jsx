// src/pages/admin/Settings.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">System Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Admin Name" />
            <Input placeholder="Email Address" type="email" />
            <Input placeholder="Password" type="password" />
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
