import React from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';
import API from '../api';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const MasonryGrid = ({ items, onDelete, onLike, likedItems }) => {
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
        <Link to={`/items/${item._id}`} key={item._id}>
          <div className="masonry-card">
          <div 
            className="like-icon" 
            onClick={(e) =>  {
              e.preventDefault();
              onLike(item._id);
            }}
          >
            {likedItems.includes(item._id) ? <FaHeart /> : <FaRegHeart />}
          </div>
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
          </div>
          </div>
        </Link>
      ))}
    </Masonry>
  );
};

export default MasonryGrid;