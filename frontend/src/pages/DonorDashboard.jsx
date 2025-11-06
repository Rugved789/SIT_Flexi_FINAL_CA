import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import "../styles/Dashboard.css";
import BrowseCampaigns from "./donor/BrowseCampaigns";
import MyDonations from "./donor/MyDonations";
import Profile from "./donor/Profile";

const DonorDashboard = () => {
  const sidebarItems = [
    { label: "Browse Campaigns", to: "" },
    { label: "My Donations", to: "my-donations" },
    { label: "Profile", to: "profile" },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <ul>
            {sidebarItems.map((item, idx) => (
              <li key={idx}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route index element={<BrowseCampaigns />} />
          <Route path="my-donations" element={<MyDonations />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default DonorDashboard;
