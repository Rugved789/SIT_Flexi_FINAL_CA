import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartDonating = () => {
    if (user) {
      navigate(`/${user.role}-dashboard`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Make a Difference with Every Donation</h1>
          <p>Join our mission to support those in need — one donation at a time. Together, we can create lasting change and build stronger communities.</p>
          <button className="cta-button" onClick={handleStartDonating}>
            Start Donating
          </button>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>₹10M+</h3>
              <p>Total Donations</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>NGO Partners</p>
            </div>
            <div className="stat-card">
              <h3>10,000+</h3>
              <p>Lives Impacted</p>
            </div>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Active Campaigns</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Our Impact Areas</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c" alt="Education" />
              <h3>Education</h3>
              <p>Supporting quality education for underprivileged children</p>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa" alt="Healthcare" />
              <h3>Healthcare</h3>
              <p>Providing medical assistance to those in need</p>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1578357078586-491adf1aa5ba" alt="Food Security" />
              <h3>Food Security</h3>
              <p>Ensuring no one goes to bed hungry</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Donors Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"DonateEase made it incredibly easy for me to support causes I care about. The transparency and impact reports are fantastic!"</p>
              <div className="testimonial-author">
                <h4>Priya Sharma</h4>
                <p>Regular Donor</p>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"As an NGO partner, we've been able to reach more people and make a bigger impact thanks to the DonateEase platform."</p>
              <div className="testimonial-author">
                <h4>Rahul Mehta</h4>
                <p>NGO Director</p>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"The platform's ease of use and security features give me confidence that my donations are making a real difference."</p>
              <div className="testimonial-author">
                <h4>Anjali Patel</h4>
                <p>Monthly Donor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <p>© 2025 DonateEase | All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
