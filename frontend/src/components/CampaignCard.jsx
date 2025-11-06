import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Campaign.css';

const CampaignCard = ({ campaign }) => {
  return (
    <div className="campaign-card">
      {campaign.image && (
        <div className="campaign-image">
          <img src={campaign.image} alt={campaign.title} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="campaign-body">
        <h3>{campaign.title}</h3>
        <p>{campaign.description}</p>
        <div className="campaign-meta">
          <span>Goal: ₹{campaign.goalAmount}</span>
          <span>Raised: ₹{campaign.raisedAmount || 0}</span>
          <span>Status: {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : ''}</span>
        </div>
        <div className="campaign-actions">
          <Link to={`/donate/${campaign._id}`} className="donate-btn">Donate</Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
