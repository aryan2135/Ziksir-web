import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || {};
    } catch {
      return {};
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
      return {
        name: savedProfile.name || currentUser.fullName || "Your Full Name",
        email: savedProfile.email || currentUser.email || "your.email@example.com",
        phone: savedProfile.phone || "+91 98123-40567",
        organization: savedProfile.organization || "Your Organization",
        department: savedProfile.department || "Your Department",
        researchArea: savedProfile.researchArea || "Your Research Area",
      };
    } catch {
      return {
        name: currentUser.fullName || "Your Full Name",
        email: currentUser.email || "your.email@example.com",
        phone: "+91 98123-40567",
        organization: "Your Organization",
        department: "Your Department",
        researchArea: "Your Research Area",
      };
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [stats, setStats] = useState({ totalBookings: 0, pendingBookings: 0, completedBookings: 0 });
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
      setProfile({
        name: savedProfile.name || currentUser.fullName || "Your Full Name",
        email: savedProfile.email || currentUser.email || "your.email@example.com",
        phone: savedProfile.phone || "+91 98123-40567",
        organization: savedProfile.organization || "Your Organization",
        department: savedProfile.department || "Your Department",
        researchArea: savedProfile.researchArea || "Your Research Area",
      });
    } catch {
      setProfile({
        name: currentUser.fullName || "Your Full Name",
        email: currentUser.email || "your.email@example.com",
        phone: "+91 98123-40567",
        organization: "Your Organization",
        department: "Your Department",
        researchArea: "Your Research Area",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "currentUser") {
        try {
          const newUser = JSON.parse(event.newValue) || {};
          setCurrentUser(newUser);
          const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
          setProfile({
            name: savedProfile.name || newUser.fullName || "Your Full Name",
            email: savedProfile.email || newUser.email || "your.email@example.com",
            phone: savedProfile.phone || "+91 98123-40567",
            organization: savedProfile.organization || "Your Organization",
            department: savedProfile.department || "Your Department",
            researchArea: savedProfile.researchArea || "Your Research Area",
          });
          setIsEditing(false);
        } catch {
          setCurrentUser({});
          setProfile({
            name: "Your Full Name",
            email: "your.email@example.com",
            phone: "+91 98123-40567",
            organization: "Your Organization",
            department: "Your Department",
            researchArea: "Your Research Area",
          });
          setIsEditing(false);
        }
      }
      if (event.key === "userProfile") {
        try {
          const savedProfile = JSON.parse(event.newValue) || {};
          setProfile((prev) => ({ ...prev, ...savedProfile }));
        } catch {}
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        if (!currentUser._id || !token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/api/bookings/count/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch booking stats:", err);
      }
    }
    fetchStats();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    const updatedUser = { ...currentUser, fullName: profile.name };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setIsEditing(false);
    showAlert("Profile updated successfully!", "success");
  };

  const handlePasswordChange = async () => {
    if (password.newPassword !== password.confirmPassword) {
      showAlert("Passwords do not match!", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = currentUser._id;
      if (!token || !userId) {
        showAlert("User not authenticated", "error");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_API_URI}/api/user/${userId}/change-password`,
        { newPassword: password.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Password updated successfully!", "success");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      showAlert("Failed to update password. Please try again.", "error");
    }
  };

  return (
    <>
      {/* Alert Popup */}
      {alert.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white z-50 transition-opacity duration-300 ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">User Profile</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="md:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className={`fas ${isEditing ? "fa-times" : "fa-edit"} mr-2`}></i>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" value={profile.name} readOnly={!isEditing} onChange={handleChange} />
                <InputField label="Email Address" name="email" value={profile.email} readOnly />
                <InputField label="Phone Number" name="phone" value={profile.phone} readOnly={!isEditing} onChange={handleChange} />
                <InputField label="Organization" name="organization" value={profile.organization} readOnly={!isEditing} onChange={handleChange} />
                <InputField label="Department" name="department" value={profile.department} readOnly={!isEditing} onChange={handleChange} />
                <InputField label="Research Area" name="researchArea" value={profile.researchArea} readOnly={!isEditing} onChange={handleChange} />
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

          {/* Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Total Bookings", value: stats.totalBookings, icon: "fa-calendar-check", color: "text-blue-500" },
                  { label: "Completed", value: stats.completedBookings, icon: "fa-check-circle", color: "text-green-500" },
                  { label: "Pending", value: stats.pendingBookings, icon: "fa-clock", color: "text-yellow-500" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-secondary rounded-lg">
                    <div className={`w-12 h-12 ${stat.color} mx-auto mb-2 flex items-center justify-center`}>
                      <i className={`fas ${stat.icon} text-2xl`}></i>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="md:col-span-2">
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
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
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
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="mt-4"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPasswords({ ...password, newPassword: e.target.value })
                        }
                      />
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="mt-4"
                        value={password.confirmPassword}
                        onChange={(e) =>
                          setPasswords({ ...password, confirmPassword: e.target.value })
                        }
                      />
                      <Button className="mt-4 w-full" onClick={handlePasswordChange}>
                        Update Password
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Reusable Input Field Component
function InputField({ label, name, value, onChange, readOnly = false }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-2">{label}</label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={readOnly ? "bg-muted" : ""}
      />
    </div>
  );
}
