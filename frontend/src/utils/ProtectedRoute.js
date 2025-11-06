// src/utils/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const role = user?.role;
      if (!role || !allowedRoles.includes(role)) {
        // unauthorized
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
