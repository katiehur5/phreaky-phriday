import React from 'react';
import '../styles/MarqueeSection.css';

const images = [
  '/home_marquee/IMG_5997.JPG',
  '/home_marquee/IMG_5998.JPG',
  '/home_marquee/IMG_6001.JPG',
  '/home_marquee/alicia.jpg',
  '/home_marquee/aliciabryn.jpg',
  // Add more as needed
];

const MarqueeSection = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {[...images, ...images, ...images, ...images].map((src, index) => (
          <img key={index} src={src} alt="clothing item" className="marquee-img" />
        ))}
      </div>
    </div>
  );
};

export default MarqueeSection;
