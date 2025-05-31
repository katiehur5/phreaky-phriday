import React from 'react';
import '../styles/MarqueeSection.css';

const baseUrl = process.env.REACT_APP_API_URL;

const images = [
  `${baseUrl}/uploads/home_marquee/IMG_5997.JPG`,
  `${baseUrl}/uploads/home_marquee/IMG_5998.JPG`,
  `${baseUrl}/uploads/home_marquee/IMG_6001.JPG`,
  `${baseUrl}/uploads/home_marquee/alicia.jpg`,
  `${baseUrl}/uploads/home_marquee/aliciabryn.jpg`,
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
