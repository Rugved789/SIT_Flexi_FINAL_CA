import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [donationType, setDonationType] = useState('money');
  const [amount, setAmount] = useState('');
  const [itemDetails, setItemDetails] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data?.campaign || null);
      } catch (err) {
        console.error('Failed to fetch campaign', err);
      }
    };
    fetch();
  }, [id]);

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    try {
      const payload = {
        campaignId: id,
        donationType,
      };
      if (donationType === 'money') {
        payload.amount = Number(amount);
      } else {
        payload.itemDetails = itemDetails;
      }

      await api.post('/donations/create', payload);
      setSuccess('Donation successful');
      // navigate after brief delay so user sees success
      setTimeout(() => navigate('/donor-dashboard'), 800);
    } catch (err) {
      console.error('Donation error', err);
      const resp = err.response?.data;
      if (resp && resp.error && Array.isArray(resp.error.details)) {
        const msgs = resp.error.details.map(d => d.message || d.msg || JSON.stringify(d));
        setErrors(msgs);
        return;
      }
      setErrors([resp?.message || 'Donation failed']);
    }
  };

  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="donate-page">
      <h2>Donate to {campaign.title}</h2>
      <p>{campaign.description}</p>
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
        <label>Donation Type</label>
        <select value={donationType} onChange={(e) => setDonationType(e.target.value)}>
          <option value="money">Money</option>
          <option value="items">Items</option>
        </select>

        {donationType === 'money' ? (
          <div>
            <label>Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
          </div>
        ) : (
          <div>
            <label>Item details</label>
            <textarea value={itemDetails} onChange={(e) => setItemDetails(e.target.value)} required />
          </div>
        )}

        <button type="submit">Confirm Donation</button>
      </form>
    </div>
  );
};

export default Donate;
