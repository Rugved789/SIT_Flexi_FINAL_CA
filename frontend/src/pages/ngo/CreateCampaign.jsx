import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "../../styles/Campaign.css";

const CreateCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    goalAmount: "",
    category: "Other",
    image: ""
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation to avoid backend validation errors
    if (!campaign.title || campaign.title.trim().length < 5) {
      setErrors(['Title must be at least 5 characters long']);
      return;
    }
    if (!campaign.description || campaign.description.trim().length < 20) {
      setErrors(['Description must be at least 20 characters long']);
      return;
    }
    if (!campaign.goalAmount || Number(campaign.goalAmount) <= 0) {
      setErrors(['Goal amount must be a positive number']);
      return;
    }

    try {
      setErrors([]);
      setSuccess('');
      // Ensure goalAmount is sent as a number
      const payload = { ...campaign, goalAmount: Number(campaign.goalAmount) };

      await api.post(`/campaigns/create`, payload);
      setSuccess('Campaign created successfully!');
      setTimeout(() => navigate('/ngo-dashboard/manage'), 800);
    } catch (error) {
      console.error('CreateCampaign error:', error);
      const resp = error.response?.data;
      if (resp && resp.error && Array.isArray(resp.error.details) && resp.error.details.length > 0) {
        setErrors(resp.error.details.map(d => d.message || d.msg || JSON.stringify(d)));
        return;
      }
      setErrors([resp?.message || 'Error creating campaign']);
    }
  };

  const handleChange = (e) => {
    setCampaign({
      ...campaign,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="create-campaign">
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="form-errors">
            <ul>
              {errors.map((err, idx) => (
                <li key={idx} style={{ color: 'red' }}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        {success && (
          <div className="form-success" style={{ color: 'green' }}>{success}</div>
        )}
        <div className="form-group">
          <label>Campaign Title</label>
          <input
            type="text"
            name="title"
            value={campaign.title}
            onChange={handleChange}
            required
            placeholder="Enter campaign title"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={campaign.description}
            onChange={handleChange}
            required
            placeholder="Describe your campaign"
          />
        </div>
        <div className="form-group">
          <label>Goal Amount (₹)</label>
          <input
            type="number"
            name="goalAmount"
            value={campaign.goalAmount}
            onChange={handleChange}
            required
            placeholder="Enter target amount"
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            value={campaign.category} 
            onChange={handleChange}
          >
            <option value="Food">Food</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Environment">Environment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Campaign Image URL</label>
          <input
            type="url"
            name="image"
            value={campaign.image}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {campaign.image ? (
            <img 
              src={campaign.image} 
              alt="Campaign preview" 
              className="preview-image"
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <div className="image-placeholder">
              Image preview will appear here
            </div>
          )}
        </div>
        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
};

export default CreateCampaign;