import React, { useState, useContext } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      // Diagnostic: log full response to help debug unexpected shapes
      console.log("Login response:", res);

      // Accept success only when both user and token exist
      if (res && res.data && res.data.user && res.data.token) {
        loginUser(res.data.user, res.data.token);
        const role = res.data.user.role;
        if (role === "donor") {
          navigate("/donor-dashboard");
        } else if (role === "ngo") {
          navigate("/ngo-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
        alert(res.data.message || "Login successful");
      } else {
        console.error("Unexpected login response shape:", res && res.data ? res.data : res);
        alert("Login failed - Invalid response from server. Check console/network tab for details.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="switch-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
