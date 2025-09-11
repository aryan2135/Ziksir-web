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
import RequestEquipment from "./pages/user/RequestEquipment.jsx";
// import ResearchAssistant from "./pages/user/ResearchAssistant.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import ProtectedRoute from "./components/hoc/protectedRoute.js";
import EquipmentRequestPage from "./pages/EquipmentRequest.jsx";
import MessagesPage from "./pages/Messages.jsx";
import SearchPage from "./pages/search.jsx";
import ConsultPage from "./pages/user/Consultancy.jsx";
import PrototypingPage from "./pages/user/Prototyping.jsx";
import IndustryInfo from "./pages/industries.jsx";
import ConsultPrototypePage from "./pages/ConsultPrototype.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/industries" element={<IndustryInfo />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />

          {/* ✅ Protected User Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="book-slots" element={<BookSlots />} />
            <Route path="browse-equipment" element={<BrowseEquipment />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="request-equipment" element={<RequestEquipment />} />
            <Route path="consultancy" element={<ConsultPage />} />
            <Route path="prototyping" element={<PrototypingPage />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* ✅ Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="overview" element={<OverviewPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="consult-prototype" element={<ConsultPrototypePage />} />
            <Route path="requests" element={<EquipmentRequestPage/>} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
