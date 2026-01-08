import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Notices from "./pages/notices";
import Complaints from "./pages/complaints";
import Bills from "./pages/bills";
import Profile from "./pages/profile";
import WatchmanDashboard from "./pages/watchmanDashboard";
import VisitorManagement from "./pages/visitorManagement";
import ForgotPassword from "./pages/forgotPassword";
import SecurityRegister from "./pages/securityRegister";

import AdminDashboard from "./pages/adminDashboard";
import Messages from "./pages/messages";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (loggedInUser) => {
    setIsAuthenticated(true);
    const user = loggedInUser || JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === 'admin') {
      navigate("/admin-dashboard");
    } else if (user.role === 'watchman') {
      navigate("/watchman-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/forgot-password"
        element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/security-register"
        element={!isAuthenticated ? <SecurityRegister /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/notices"
        element={isAuthenticated ? <Notices /> : <Navigate to="/login" />}
      />
      <Route
        path="/complaints"
        element={isAuthenticated ? <Complaints /> : <Navigate to="/login" />}
      />
      <Route
        path="/bills"
        element={isAuthenticated ? <Bills /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/messages"
        element={isAuthenticated ? <Messages /> : <Navigate to="/login" />}
      />
      <Route
        path="/watchman-dashboard"
        element={isAuthenticated ? <WatchmanDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/visitor-management"
        element={isAuthenticated ? <VisitorManagement /> : <Navigate to="/login" />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
