import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // for styling

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Phreaky Phriday</h1>
      <p className="landing-subtitle">So lucky to be...</p>
      <div className="button-group">
        <button className="landing-button" onClick={() => navigate('/enter')}>Sign Up</button>
        <button className="landing-button" onClick={() => navigate('/login')}>Log In</button>
      </div>
    </div>
  );
};

export default LandingPage;
