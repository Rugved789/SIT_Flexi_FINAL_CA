import React from "react";
import DonorDashboard from "../components/Dashboard/DonorDashboard";
import NgoDashboard from "../components/Dashboard/NgoDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Example: { name: "Rugved", role: "ngo" }

  if (!user) {
    return <p className="text-center mt-10 text-red-600">Please log in to view dashboard.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "donor" && <DonorDashboard />}
      {user.role === "ngo" && <NgoDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
