import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <header>
        <div className="logo">ClinicCare</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <div className="hero">
        <h1>Your Trusted Clinic for Health & Wellness</h1>
        <p>Manage doctor appointments easily with our simple appointment calendar.</p>
        <Link to="/login" className="cta-button">Get Started</Link>
      </div>

      <footer>
        <p>&copy; 2025 ClinicCare. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
