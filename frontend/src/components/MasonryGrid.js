import React from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';
import API from '../api';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const MasonryGrid = ({ items, onToggleAvailability, onDelete, onLike, likedItems }) => {
  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    600: 1
  };

  const userId = localStorage.getItem('userId');

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
            <div className="like-section">
              <div 
                className="like-icon" 
                onClick={(e) =>  {
                  e.preventDefault();
                  onLike(item._id);
                }}
              >
                {likedItems.includes(item._id) ? <FaHeart /> : <FaRegHeart />}
              </div>
              <span className="like-count">{item.likes.length}</span>
            </div>
          <img 
            src={item.imagePath} 
            alt={item.name} 
            className="masonry-img" 
          />
          <div className="masonry-info">
            <h3>{item.name}</h3>
            <p>{item.owner.name}</p>
            {item.owner._id.toString() === userId && (
              <>
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
              </>
            )}
          </div>
          </div>
        </Link>
      ))}
    </Masonry>
  );
};

export default MasonryGrid;