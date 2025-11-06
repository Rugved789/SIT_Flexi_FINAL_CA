import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user: authUser, loginUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", contact: "", address: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/profile");
        const u = res.data.user;
        setForm({ name: u.name || "", email: u.email || "", contact: u.contact || "", address: u.address || "", password: "" });
      } catch (err) {
        console.error("Failed fetching profile", err);
        setErrors([{ msg: err.response?.data?.message || "Failed to load profile" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, contact: form.contact, address: form.address };
      if (form.password) payload.password = form.password;

      const res = await api.put("/auth/profile", payload);
      const updated = res.data.user;
      setSuccess(res.data.message || "Profile updated");

      // Update global auth context and localStorage user copy
      if (loginUser) {
        // keep token as-is, update stored user
        const token = localStorage.getItem("token");
        loginUser(updated, token);
      }
    } catch (err) {
      console.error("Update profile error", err);
      const resp = err.response?.data;
      if (resp?.errors && Array.isArray(resp.errors)) {
        setErrors(resp.errors.map((r) => ({ msg: r.msg || r.message || JSON.stringify(r) })));
      } else if (resp?.message) {
        setErrors([{ msg: resp.message }]);
      } else {
        setErrors([{ msg: "Failed to update profile" }]);
      }
    } finally {
      setLoading(false);
      setForm((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {loading && <p>Loading...</p>}

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((err, idx) => (
            <div key={idx} className="error-item">{err.msg}</div>
          ))}
        </div>
      )}

      {success && <div className="form-success">{success}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input name="contact" value={form.contact} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>New Password (leave blank to keep)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>Save profile</button>
      </form>
    </div>
  );
};

export default Profile;