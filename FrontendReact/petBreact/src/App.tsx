import "./index.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { DarkModeProvider } from "./contexts/DarkModeContext";
import NotFound from "./components/NotFound";

import CreatePetProfile from "./components/PetDashboard/CreateProfile";
import SwitchProfile from "./components/PetDashboard/SwitchProfile";
import EditPetProfile from "./components/PetDashboard/EditPetProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PetDashboard from "./pages/PetDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import OAuth from "./pages/OAuth";

// Protected route component for admin routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }
  return <>{children}</>;
};

// Protected route component for user routes
const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  // We don't need to check for OAuth callback anymore as we have a dedicated route
  // The OAuth component will handle the processing

  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth/callback" element={<OAuth />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedUserRoute>
                  <PetDashboard />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/pet-profiles"
              element={
                <ProtectedUserRoute>
                  <SwitchProfile />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/create-pet-profile"
              element={
                <ProtectedUserRoute>
                  <CreatePetProfile />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/edit-pet-profile"
              element={
                <ProtectedUserRoute>
                  <EditPetProfile />
                </ProtectedUserRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
