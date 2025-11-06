import React, { useEffect, useState } from "react";
import api from '../../utils/api';
import "../donor/donor.css";

const BrowseCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donationData, setDonationData] = useState({ amount: "", type: "money" });
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch all campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
  const res = await api.get('/campaigns');
        // API returns { timestamp, campaigns }
        const data = res.data && res.data.campaigns ? res.data.campaigns : res.data;
        // Ensure campaigns is an array before setting state
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

    const handleDonate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        await api.post(
          "/donations/create",
          {
            campaignId: selectedCampaign._id,
            amount: Number(donationData.amount),
            donationType: donationData.type,
          }
        );

      alert("✅ Donation Successful!");
      setSelectedCampaign(null);
      setDonationData({ amount: "", type: "money" });
    } catch (err) {
      // surface detailed validation errors when available
      const resp = err.response?.data;
      if (resp && resp.error && Array.isArray(resp.error.details) && resp.error.details.length > 0) {
        // Be defensive: details may or may not include `field`/`message` keys depending on source
        const msgs = resp.error.details.map(d => {
          if (typeof d === 'string') return d;
          const msg = d.message || d.msg || d.message || JSON.stringify(d);
          const fld = d.field || d.param || '';
          return fld ? `${fld}: ${msg}` : msg;
        }).join('\n');
        alert('Validation failed:\n' + msgs);
        return;
      }

      // Fallbacks
      const fallback = resp?.message || err.response?.statusText || err.message || 'Unknown error';
      console.error('Donation create error details:', err.response?.data || err);
      alert("❌ Error making donation: " + fallback);
    }
  };

  return (
    <div>
      <h2>Active Campaigns</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="campaign-grid">
          {campaigns.map((c) => (
            <div key={c._id} className="campaign-card">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p>Goal: ₹{c.goalAmount}</p>
              <button onClick={() => setSelectedCampaign(c)}>Donate Now</button>
            </div>
          ))}
        </div>
      )}

      {/* Donation Modal */}
      {selectedCampaign && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Donate to {selectedCampaign.title}</h3>
            <form onSubmit={handleDonate}>
              <label>Donation Type</label>
              <select
                value={donationData.type}
                onChange={(e) => setDonationData({ ...donationData, type: e.target.value })}
              >
                <option value="money">Money</option>
                <option value="items">Items</option>
              </select>

              {donationData.type === 'money' ? (
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={donationData.amount}
                  onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                  required
                />
              ) : (
                <textarea
                  placeholder="Describe the items you want to donate"
                  value={donationData.itemDetails || ''}
                  onChange={(e) => setDonationData({ ...donationData, itemDetails: e.target.value })}
                  required
                />
              )}

              <div className="modal-actions">
                <button type="submit">Confirm Donation</button>
                <button type="button" className="cancel-btn" onClick={() => setSelectedCampaign(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCampaigns;