import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import CampaignCard from '../components/CampaignCard';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/campaigns');
        const data = res.data && res.data.campaigns ? res.data.campaigns : [];
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load campaigns', err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="campaigns-page">
      <h2>All Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns available.</p>
      ) : (
        <div className="campaign-grid">
          {campaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
