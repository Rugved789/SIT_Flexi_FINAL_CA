import React, { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import api from "../utils/api";


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setErrors([]);
    const res = await api.post("/auth/register", form);
    // show success message inline then redirect
    setSuccess(res.data.message || 'Registration successful');
    setTimeout(() => { window.location.href = "/login"; }, 800);
  } catch (err) {
    const resp = err.response?.data;
    if (resp && resp.error && Array.isArray(resp.error.details)) {
      setErrors(resp.error.details.map(d => d.message || d.msg));
      return;
    }
    setErrors([resp?.message || 'Registration failed']);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join our donation community</p>
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
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
