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

      <section className="hero">
        {/* <h1 className="home-title">welcome to phreaky phriday</h1> */}
        {/* <p className="home-subtitle">gimme dat.</p> */}
        {/* <MarqueeSection /> */}
        {/* <img src={'/loading.gif'} alt="loading..." /> */}
      </section>

      {/* <section className="home-nav">
        <Link to="/items" className="home-link">browse items</Link>
        <Link to="/add-item" className="home-link">upload item</Link>
        <Link to={`/profile/${userId}`} className="home-link">your profile</Link>
        {/* Add future sections here */}
        {/* <Link to="/calendar" className="home-link">Upcoming Events</Link> */}
        {/* <Link to="/community" className="home-link">Community Board</Link> */}
      {/* </section> */}

      <section className="home-container">
        <div className="polaroid-card">
          <img
            src="/home_marquee/aphimerch.JPEG"
            alt="Browse prompt"
            className="polaroid-img"
          />
          <Link to="/items" className="home-link">browse items</Link>
        </div>
      </section>
      <section className="home-container">
        <div className="polaroid-card">
          <img
            src="/home_marquee/sparklers.jpg"
            alt="Upload prompt"
            className="polaroid-img"
          />
          <Link to="/add-item" className="home-link">upload item</Link>
        </div>
      </section>
      <section className="home-container">
        <div className="polaroid-card">
          <img
            src="/home_marquee/IMG_5998.JPG"
            alt="Profile prompt"
            className="polaroid-img"
          />
          <Link to={`/profile/${userId}`} className="home-link">your profile</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
