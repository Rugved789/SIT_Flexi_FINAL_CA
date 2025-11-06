import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
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
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;