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
      const savedProfile =
        JSON.parse(localStorage.getItem("userProfile")) || {};
      return {
        name: savedProfile.name || currentUser.fullName || "Your Full Name",
        email:
          savedProfile.email || currentUser.email || "your.email@example.com",
        phone: currentUser.phone || "+91 98123-40567",
        organization:
          savedProfile.organization ||
          currentUser.organization ||
          "Your Organization",
        department:
          savedProfile.department ||
          currentUser.department ||
          "Your Department",
        researchArea: savedProfile.researchArea || "Your Research Area",
      };
    } catch {
      return {
        name: currentUser.fullName || "Your Full Name",
        email: currentUser.email || "your.email@example.com",
        phone: currentUser.phone || "+91 98123-40567",
        organization: currentUser.organization || "Your Organization",
        department: currentUser.department || "Your Department",
        researchArea: "Your Research Area",
      };
    }
  });

  const [originalProfile, setOriginalProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    try {
      const savedProfile =
        JSON.parse(localStorage.getItem("userProfile")) || {};
      const initProfile = {
        name: savedProfile.name || currentUser.fullName || "Your Full Name",
        email:
          savedProfile.email || currentUser.email || "your.email@example.com",
        phone: savedProfile.phone || currentUser.phone || "+91 98123-40567",
        organization:
          savedProfile.organization ||
          currentUser.organization ||
          "Your Organization",
        department:
          savedProfile.department ||
          currentUser.department ||
          "Your Department",
        researchArea: savedProfile.researchArea || "Your Research Area",
      };
      setProfile(initProfile);
      setOriginalProfile(initProfile);
    } catch {
      const initProfile = {
        name: currentUser.fullName || "Your Full Name",
        email: currentUser.email || "your.email@example.com",
        phone: currentUser.phone || "+91 98123-40567",
        organization: currentUser.organization || "Your Organization",
        department: currentUser.department || "Your Department",
        researchArea: "Your Research Area",
      };
      setProfile(initProfile);
      setOriginalProfile(initProfile);
    }
  }, [currentUser]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "currentUser") {
        try {
          const newUser = JSON.parse(event.newValue) || {};
          setCurrentUser(newUser);
          const savedProfile =
            JSON.parse(localStorage.getItem("userProfile")) || {};
          const updatedProfile = {
            name: savedProfile.name || newUser.fullName || "Your Full Name",
            email:
              savedProfile.email || newUser.email || "your.email@example.com",
            phone: savedProfile.phone || "+91 98123-40567",
            organization:
              savedProfile.organization ||
              newUser.organization ||
              "Your Organization",
            department:
              savedProfile.department ||
              newUser.department ||
              "Your Department",
            researchArea: savedProfile.researchArea || "Your Research Area",
          };
          setProfile(updatedProfile);
          setOriginalProfile(updatedProfile);
          setIsEditing(false);
        } catch {
          setCurrentUser({});
          const defaultProfile = {
            name: "Your Full Name",
            email: "your.email@example.com",
            phone: "+91 98123-40567",
            organization: "Your Organization",
            department: "Your Department",
            researchArea: "Your Research Area",
          };
          setProfile(defaultProfile);
          setOriginalProfile(defaultProfile);
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
          `${import.meta.env.VITE_API_URI}/api/bookings/count/${
            currentUser._id
          }`,
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

  const handleUpdate = async () => {
    try {
      const updatedData = {};
      Object.keys(profile).forEach((key) => {
        if (profile[key] && profile[key].trim() !== "")
          updatedData[key] = profile[key];
      });

      if (Object.keys(updatedData).length === 0) {
        showAlert("No changes to update!", "error");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URI}/api/user/updateUser`,
        updatedData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = {
        ...currentUser,
        fullName: profile.name,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("userProfile", JSON.stringify(profile));

      setOriginalProfile(profile);
      setIsEditing(false);
      showAlert("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showAlert("Failed to update profile. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
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
      {alert.message && (
        <div
          className={`fixed top-4 right-4 px-3 sm:px-4 py-2 rounded-md shadow-md text-white z-50 transition-opacity duration-300 text-sm sm:text-base ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">User Profile</h2>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage your account details</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <i
                  className={`fas ${isEditing ? "fa-times" : "fa-edit"} mr-2`}
                ></i>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  readOnly
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
                <InputField
                  label="Organization"
                  name="organization"
                  value={profile.organization}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
                <InputField
                  label="Department"
                  name="department"
                  value={profile.department}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
                <InputField
                  label="Research Area"
                  name="researchArea"
                  value={profile.researchArea}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </div>
              {isEditing && (
                <div className="mt-4 sm:mt-6">
                  <Button onClick={handleUpdate} className="w-full sm:w-auto text-sm sm:text-base">
                    <i className="fas fa-save mr-2"></i>Update Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function InputField({ label, name, value, onChange, readOnly = false }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium block mb-2">{label}</label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`${readOnly ? "bg-muted" : ""} text-xs sm:text-sm`}
      />
    </div>
  );
}
