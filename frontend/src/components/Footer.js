import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    const userId = localStorage.getItem('userId');
    return (
        <section className="footer">
            <div className="logo">
                <img src="/ppfavicon2.png"></img>
            </div>
            <div className="links">
                <div className="link-group">
                    <p>EXPLORE</p>
                    <p><a href="/items">Browse</a></p>
                    <p><a href="/add-item">Upload</a></p>
                    <p>OOTDs</p>
                    <p><a href={`/profile/${userId}`}>Profile</a></p>
                </div>
                <div className="link-group">
                    <p>MORE PHREAKY</p>
                    <p>Rewards</p>
                    <p>Merch</p>
                    <p>About Sustainability</p>
                </div>
                <div className="link-group">
                    <p>SUPPORT</p>
                    <p>FAQ</p>
                    <p>Feedback</p>
                    <p>Status</p>
                    <p>Privacy</p>
                </div>
                <div className="link-group">
                    <p>ABOUT</p>
                    <p>Contact</p>
                    <p><a href="https://github.com/katiehur5/phreaky-phriday">Github</a></p>
                    <p>Visit Frills</p>
                    <p>Download app</p>
                </div>
                {/* about us */}
                {/* contact us */}
                {/* contribute */}
                {/* social media */}
                {/* API */}
                {/* frills website */}
                {/* download app */}
                {/* EXPLORE */}
                    {/* browse */}
                    {/* upload */}
                    {/* profile */}
                {/* SUPPORT */}
                    {/* FAQ */}
                    {/* Feedback (canny) */}
                    {/* status */}
                    {/* privacy policy */}
                {/* ABOUT */}
                    {/* Team */}
                    {/* Release notes */}
                    {/* Join us */}
                    {/* Github */}
                
            </div>
        </section>
    );
};

  
export default Footer;