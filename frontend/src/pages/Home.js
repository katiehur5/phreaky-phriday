import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import MarqueeSection from '../components/MarqueeSection';

const Home = () => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="home-wrapper">
        <Navbar />

      <div className="home-container">
        <h1 className="home-title">welcome to phreaky phriday</h1>
        <p className="home-subtitle">gimme dat.</p>
        <MarqueeSection />

        <div className="home-nav">
          <Link to="/items" className="home-link">browse items</Link>
          <Link to="/add-item" className="home-link">upload item</Link>
          <Link to={`/profile/${userId}`} className="home-link">your profile</Link>
          {/* Add future sections here */}
          {/* <Link to="/calendar" className="home-link">Upcoming Events</Link> */}
          {/* <Link to="/community" className="home-link">Community Board</Link> */}
        </div>
      </div>

    </div>
  );
};

export default Home;
