import React from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';

const ProfileMasonryGrid = ({ items, onDelete }) => {
  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    600: 1
  };

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {items.map(item => (
        <div className="masonry-card" key={item._id}>
          <img 
            src={`${baseUrl}/${item.imagePath}`} 
            alt={item.name} 
            className="masonry-img" 
          />
          <div className="masonry-info">
            <h3>{item.name}</h3>
            <button onClick={() => onDelete(item._id)} className="delete-button">
              remove
            </button>
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default ProfileMasonryGrid;
