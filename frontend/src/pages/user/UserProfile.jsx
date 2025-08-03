import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  // Load current user details from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  const [profile, setProfile] = useState({
    name: savedProfile.name || currentUser.fullName || "Your Full Name",
    email: savedProfile.email || currentUser.email || "your.email@example.com",
    phone: savedProfile.phone || "+91 98123-40567",
    organization: savedProfile.organization || "Your Organization",
    department: savedProfile.department || "Your Department",
    researchArea: savedProfile.researchArea || "Your Research Area"
  });

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save updated info
  const handleUpdate = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));

    // Also update currentUser if name or email changed
    const updatedUser = {
      ...currentUser,
      fullName: profile.name,
      email: profile.email
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  useEffect(() => {
    // Sync profile state with latest localStorage values
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">User Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-6xl text-accent-foreground"></i>
            </div>

            {/* Change Photo Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <i className="fas fa-camera mr-2"></i>
                  Change Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Profile Photo</DialogTitle>
                </DialogHeader>
                <input type="file" accept="image/*" className="mt-4" />
                <Button className="mt-4 w-full">Upload</Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <i className={`fas ${isEditing ? "fa-times" : "fa-edit"} mr-2`}></i>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Full Name</label>
                <Input name="name" value={profile.name} onChange={handleChange} readOnly={!isEditing} className={!isEditing ? "bg-muted" : ""} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Email Address</label>
                <Input name="email" value={profile.email} readOnly className="bg-muted" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Phone Number</label>
                <Input name="phone" value={profile.phone} onChange={handleChange} readOnly={!isEditing} className={!isEditing ? "bg-muted" : ""} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Organization</label>
                <Input name="organization" value={profile.organization} onChange={handleChange} readOnly={!isEditing} className={!isEditing ? "bg-muted" : ""} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Department</label>
                <Input name="department" value={profile.department} onChange={handleChange} readOnly={!isEditing} className={!isEditing ? "bg-muted" : ""} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Research Area</label>
                <Input name="researchArea" value={profile.researchArea} onChange={handleChange} readOnly={!isEditing} className={!isEditing ? "bg-muted" : ""} />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <Button onClick={handleUpdate}>
                  <i className="fas fa-save mr-2"></i>
                  Update Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", value: "23", icon: "fas fa-calendar-check", color: "text-blue-500" },
                { label: "Completed Sessions", value: "18", icon: "fas fa-check-circle", color: "text-green-500" },
                { label: "Pending Requests", value: "2", icon: "fas fa-clock", color: "text-yellow-500" },
                { label: "Member Since", value: "Jan 2024", icon: "fas fa-user-clock", color: "text-purple-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-secondary rounded-lg">
                  <div className={`w-12 h-12 ${stat.color} mx-auto mb-2 flex items-center justify-center`}>
                    <i className={`${stat.icon} text-2xl`}></i>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-semibold">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <i className="fas fa-key mr-2"></i>
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <Input type="password" placeholder="New Password" className="mt-4" />
                    <Input type="password" placeholder="Confirm Password" className="mt-4" />
                    <Button className="mt-4 w-full">Update Password</Button>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-semibold">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Enable
                </Button>
              </div>

              {/* Login History */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-semibold">Login History</h4>
                  <p className="text-sm text-muted-foreground">View recent login activity</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <i className="fas fa-history mr-2"></i>
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Login History</DialogTitle>
                    </DialogHeader>
                    <ul className="space-y-2 mt-4 text-sm">
                      <li>✔️ Logged in from Chrome - Jul 20, 2025</li>
                      <li>✔️ Logged in from Mobile - Jul 18, 2025</li>
                      <li>❌ Failed login attempt - Jul 15, 2025</li>
                    </ul>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
