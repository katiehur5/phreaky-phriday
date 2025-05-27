import React from 'react';
import '../styles/MarqueeSection.css';

const images = [
  'http://192.168.20.140:3000/uploads/home_marquee/IMG_5997.JPG',
  'http://192.168.20.140:3000/uploads/home_marquee/IMG_5998.JPG',
  'http://192.168.20.140:3000/uploads/home_marquee/IMG_6001.JPG',
  'http://192.168.20.140:3000/uploads/home_marquee/alicia.jpg',
  'http://192.168.20.140:3000/uploads/home_marquee/aliciabryn.jpg',
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
