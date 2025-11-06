import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyDonations = async () => {
      setLoading(true);
      try {
        const res = await api.get("/donations/my-donations");
        // backend returns { timestamp, donations }
        const data = res.data?.donations ?? [];
        setDonations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load donations", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, []);

  return (
    <div className="my-donations-page">
      <h1>My Donations</h1>

      {loading && <p>Loading...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && donations.length === 0 && <p>You haven't made any donations yet.</p>}

      <div className="donations-list">
        {donations.map((d) => (
          <div key={d._id} className="donation-card">
            <h3>{d.campaignId?.title || 'Campaign'}</h3>
            <p>Type: {d.donationType}</p>
            {d.donationType === 'money' && <p>Amount: ₹{d.amount}</p>}
            {d.donationType === 'items' && <p>Items: {d.itemDetails}</p>}
            <p>Date: {new Date(d.createdAt).toLocaleString()}</p>
            <p>Status: {d.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonations;