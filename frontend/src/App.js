import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Donate from "./pages/Donate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/donor-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["ngo"]}>
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      {/* Footer removed per request */}
    </>
  );
}

export default App;
