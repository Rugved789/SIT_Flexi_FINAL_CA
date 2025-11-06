import React from "react";
import "./Dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">DonationHub</h2>
        <nav>
          <ul>
            <li className="active">Overview</li>
            <li>NGO Approvals</li>
            <li>Campaign Reports</li>
            <li>User Management</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Welcome, Admin 👨‍💼</h1>
        </header>

        <section className="cards-section">
          <div className="card">
            <h3>Total NGOs</h3>
            <p>45</p>
          </div>
          <div className="card">
            <h3>Active Campaigns</h3>
            <p>22</p>
          </div>
          <div className="card">
            <h3>Total Donations</h3>
            <p>₹3.4L</p>
          </div>
        </section>

        <section className="campaigns-section">
          <h2>Pending NGO Approvals</h2>
          <div className="campaigns-list">
            <div className="campaign-card">
              <h3>Helping Hands Trust</h3>
              <p>Status: Pending</p>
              <button>Approve</button>
              <button className="delete-btn">Reject</button>
            </div>
            <div className="campaign-card">
              <h3>Future Hope NGO</h3>
              <p>Status: Pending</p>
              <button>Approve</button>
              <button className="delete-btn">Reject</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
