import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/Dashboard";
import MyEvent from "./pages/user/MyEvent";
import Marketplace from "./pages/user/Marketplace";
import Bookings from "./pages/user/Bookings";
import AIAssistant from "./pages/user/AIAssistant";
import InvitationMaker from "./pages/user/InvitationMaker";
import BudgetTasks from "./pages/user/BudgetTasks";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import Services from "./pages/vendor/Services";
import Portfolio from "./pages/vendor/Portfolio";
import VendorBookings from "./pages/vendor/VendorBookings";
import VendorAvailability from "./pages/vendor/VendorAvailability";
import VendorMessages from "./pages/vendor/VendorMessages";
import VendorProfile from "./pages/vendor/VendorProfile";
import CreateEvent from "./pages/user/CreateEvent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-event" element={<MyEvent />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/invitations" element={<InvitationMaker />} />
      <Route path="/design-studio" element={<InvitationMaker />} />
      <Route path="/budget-tasks" element={<BudgetTasks />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/vendor-bookings" element={<VendorBookings />} />
      <Route path="/vendor-availability" element={<VendorAvailability />} />
      <Route path="/vendor-messages" element={<VendorMessages />} />
      <Route path="/vendor-profile" element={<VendorProfile />} />
      <Route path="/profile" element={<VendorProfile />} />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
    
  );
}

export default App;