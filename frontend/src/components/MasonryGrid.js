import React, {useState} from 'react';
import Masonry from 'react-masonry-css';
import '../styles/MasonryGrid.css';
import API from '../api';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';

const MasonryGrid = ({ items, onToggleAvailability, onDelete, onLike, likedItems }) => {
  const breakpointColumnsObj = {
    default: 3,
    900: 2,
    600: 1
  };
  const userId = localStorage.getItem('userId');
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (e, itemId) => {
    e.preventDefault();
    setItemToDelete(itemId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
    }
    setShowModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  return (
    <>
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
                    onClick={(e) => handleDeleteClick(e, item._id)}
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
      
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to remove this item?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default MasonryGrid;