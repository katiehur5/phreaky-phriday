import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import MarqueeSection from '../components/MarqueeSection';
import Footer from '../components/Footer';

const Home = () => {
  const [offsetY, setOffsetY] = useState(0);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div
          className="parallax parallax-heart"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <img src="/parallax/hearttext.png" alt="home is where the heart is" />
        </div>
        <div className="polaroid-card">
          <img
            src='/home_marquee/aphimerch.JPEG'
            alt="Browse prompt"
            className="polaroid-img"
          />
          <Link to="/items" className="home-link">browse items</Link>
        </div>
      </section>

      <section className="home-container">
        <div
          className="parallax parallax-555"
          style={{ transform: `translateY(${offsetY * 0.15}px)` }}
        >
          <img src="/parallax/555.png" alt="555" />
        </div>
        <div className="polaroid-card">
          <img
            src='/home_marquee/curlinghair.jpg'
            alt="Upload prompt"
            className="polaroid-img"
          />
          <Link to="/add-item" className="home-link">upload item</Link>
        </div>
      </section>
      <section className="home-container">
        <div className="polaroid-card">
          <img
            src='/home_marquee/sparklers.jpg'
            alt="Profile prompt"
            className="polaroid-img"
          />
          <Link to={`/profile/${userId}`} className="home-link">your profile</Link>
        </div>
      </section>
      {/* Bottom */}
      <section className="about">
        {/* <div className="girl-wrapper">
          <img
            src='/catalinacoff.png'
            alt="coffee drinker"
            className="about-girl"
          />
        </div> */}
          <h3>about phreaky phriday</h3>
          <p>
          A nonstop closet rotation among your closest friends, designed to collectivize closets, 
          <br></br>
          foster feminism, and reinforce reciprocity among women.
          <br></br>
          <br></br>
          with love,
          <br></br>
          Katie Hur
          </p>
      </section>
      <Footer />
    </div>

    
  );
};

export default Home;
