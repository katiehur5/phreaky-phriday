import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import EventCalendar from '../components/EventCalendar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Events.css';

const Events = () => {
  const navigate = useNavigate();

  return (
    <div className="events-wrapper">
        <Navbar />
        <div className="landing-container">
            <EventCalendar />
        </div>
        <Footer />
    </div>
  );
};

export default Events;
