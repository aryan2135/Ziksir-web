import { Toaster } from "@/components/ui/toaster.js";
import { Toaster as Sonner } from "@/components/ui/sonner.js";
import { TooltipProvider } from "@/components/ui/tooltip.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Auth from "./pages/Auth.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import NotFound from "./pages/NotFound.js";
import SettingsPage from "./pages/settings.jsx";
import BookingsPage from "./pages/Bookings.jsx";
import UsersPage from "./pages/Users.jsx";
import OverviewPage from "./pages/Overview.jsx";
import EquipmentPage from "./pages/Equipment.jsx";
import BookSlots from "./pages/user/BookSlots.jsx";
import BrowseEquipment from "./pages/user/BrowseEquipment.jsx";
import MyBookings from "./pages/user/MyBookings.jsx";
import ResearchAssistant from "./pages/user/ResearchAssistant.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/user" element={<UserDashboard />}>
            <Route path="book-slots" element={<BookSlots />} />
            <Route path="browse-equipment" element={<BrowseEquipment />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="research-assistant" element={<ResearchAssistant />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Nested Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="overview" element={<OverviewPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
