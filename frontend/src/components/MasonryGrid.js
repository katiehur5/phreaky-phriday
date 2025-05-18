import React from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';
import API from '../api';

const MasonryGrid = ({ items, onDelete }) => {
  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    600: 1
  };

  const userId = localStorage.getItem('userId');

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {items.map(item => (
        <div className="masonry-card" key={item._id}>
          <img 
            src={`http://localhost:3000/${item.imagePath}`} 
            alt={item.name} 
            className="masonry-img" 
          />
          <div className="masonry-info">
            <h3>{item.name}</h3>
            <p>{item.owner.name}</p>
            {item.owner._id.toString() === userId && (
              <button onClick={() => onDelete(item._id)} className="delete-button">
                remove
              </button>
            )}
            {/* <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span> */}
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryGrid;