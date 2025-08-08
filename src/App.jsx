import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SlotList from "./pages/SlotList";
import AdminPortal from "./pages/AdminPortal";
import AdminLoginPage from "./pages/AdminPortal"; // Corrected import path
import HomePage from "./pages/Home";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Footer from "./components/Footer"; // Ensure folder/file casing matches
import Navbar from "./pages/Navbar.jsx";


// List of authorized admin emails
const ADMIN_EMAILS = ["garvnoor111@gmail.com"]; // Replace with your admin emails

// Protected Admin Route component
const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }
  if (!ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar/> {/* Navbar component as self-closing */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/slots" element={<SlotList />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPortal />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer /> {/* Footer component as self-closing */}
    </BrowserRouter>
  );
}

export default App;
