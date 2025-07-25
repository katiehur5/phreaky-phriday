import React from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';
import { Link } from 'react-router-dom';

const ProfileMasonryGrid = ({ items, onToggleAvailability, onDelete }) => {
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
        <Link to={`/items/${item._id}`} key={item._id}>
          <div className={`masonry-card ${item.isAvailable ? '' : 'unavailable'}`}>
            {!item.isAvailable && (
              <div className="unavailable-overlay">Temporarily Unavailable</div>
            )}
            <img 
              src={item.imagePath} 
              alt={item.name} 
              className="masonry-img" 
            />
            <div className="masonry-info">
              <h3>{item.name}</h3>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleAvailability(item._id);
                }}
              >
                {item.isAvailable ? 'mark unavailable' : 'mark available'}
              </button>
              <button 
                className="delete-button"
                onClick={(e) =>  {
                  e.preventDefault();
                  onDelete(item._id);
                }}
              >
                remove
              </button>
            </div>
          </div>
        </Link>
      ))}
    </Masonry>
  );
};

export default ProfileMasonryGrid;
