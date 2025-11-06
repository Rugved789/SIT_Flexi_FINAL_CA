import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import CreateCampaign from "./ngo/CreateCampaign";
import ManageCampaigns from "./ngo/ManageCampaigns";

const NGODashboard = () => {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalDonations: 0,
  });

  // 🔄 Fetch NGO dashboard stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found. Please login again.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/campaigns/stats/overview",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error("❌ Error fetching NGO stats:", error);
    }
  };

  // 🚀 Fetch stats on load + every 10 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/ngo-dashboard">Dashboard Home</Link>
            </li>
            <li>
              <Link to="/ngo-dashboard/create">Create Campaign</Link>
            </li>
            <li>
              <Link to="/ngo-dashboard/manage">Manage Campaigns</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Dashboard Home */}
          <Route
            path=""
            element={
              <div className="dashboard-welcome">
                <h2>Welcome to NGO Dashboard</h2>

                <div className="quick-stats">
                  {/* Active Campaigns */}
                  <div className="stat-card">
                    <h3>Active Campaigns</h3>
                    <p>{stats.activeCampaigns}</p>
                  </div>

                  {/* Total Donations */}
                  <div className="stat-card">
                    <h3>Total Donations</h3>
                    <p>₹{stats.totalDonations.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Other Routes */}
          <Route path="create" element={<CreateCampaign />} />
          <Route path="manage" element={<ManageCampaigns />} />
        </Routes>
      </main>
    </div>
  );
};

export default NGODashboard;
