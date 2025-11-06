import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import { Link } from "react-router-dom";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      window.location.href = "/login";
      return;
    }

    const response = await api.get(`/campaigns/my-campaigns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // API returns { timestamp, campaigns }
    const data = response.data && response.data.campaigns ? response.data.campaigns : response.data;
    setCampaigns(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching NGO campaigns:", error);
    const status = error.response?.status;

    if (status === 401) {
      alert("Not authorized. Please login again.");
      window.location.href = "/login";
      return;
    }
    if (status === 403) {
      alert("Access denied. You need an NGO account to manage campaigns.");
      window.location.href = "/";
      return;
    }

    alert("Error fetching campaigns");
  }
};
;

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this campaign?")) {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCampaigns();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting campaign");
    }
  }
};


  return (
    <div className="manage-campaigns">
      <div className="header">
        <h2>Manage Campaigns</h2>
        <Link to="/ngo-dashboard/create" className="create-btn">
          Create New Campaign
        </Link>
      </div>
      <div className="campaigns-list">
        {campaigns.map(campaign => (
          <div key={campaign._id} className="campaign-card">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <div className="campaign-details">
              <span>Goal: ₹{campaign.goalAmount}</span>
              <span>Raised: ₹{campaign.raisedAmount}</span>
              <span>Status: {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : ''}</span>
            </div>
            <div className="actions">
              <button onClick={() => handleDelete(campaign._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <p>No campaigns found. Create your first campaign!</p>
        )}
      </div>
    </div>
  );
};

export default ManageCampaigns;