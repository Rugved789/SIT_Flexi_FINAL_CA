import React, { useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleDonate = () => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    } else {
      navigate('/login');
    }
  };

  const handleDashboard = () => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DonateEase
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          {/* Campaigns removed per request */}
          <button className="nav-link donate-btn" onClick={handleDonate}>
            Donate
          </button>
          <button className="nav-link dashboard-btn" onClick={handleDashboard}>
            Dashboard
          </button>
          {user ? (
            <>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-btn">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
