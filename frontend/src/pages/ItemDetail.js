import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import '../styles/ItemDetail.css';
import Slider from "react-slick";
import { CustomNextArrow, CustomPrevArrow } from "../components/CustomArrows";
import EditItemForm from '../components/EditItemForm';
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  async function fetchItem() {
      try {
        const res = await API.get(`/api/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error('Failed to load item:', err);
      }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const images = [item.imagePath, ...(item.additionalImages || [])];
  const userId = localStorage.getItem('userId');
  const isOwner = userId === item.owner._id.toString();

  return (
    <div className="item-detail-wrapper">
      <Navbar />
      <div className="item-detail-content">
        <div className="back-row">
          <div onClick={() => navigate(-1)} className="back-btn">
            back
          </div>
        </div>
      <div className="item-detail-card">
        <Slider 
          dots={images.length > 1} infinite={images.length > 1} speed={500} slidesToShow={1} slidesToScroll={1} className="item-carousel"
          swipe={true} touchMove={true} swipeToSlide={true}
          arrows={images.length > 1} nextArrow={<CustomNextArrow />} prevArrow={<CustomPrevArrow />}>
          {images.map((img, idx) => (
            <div key={idx}>
              <img 
                src={img} 
                alt={`Item ${idx}`} 
                className="carousel-img" 
              />
            </div>
          ))}
        </Slider>
      
        <div className="item-detail-info">
          {/* not in edit mode */}
          {isOwner && !isEditing && (
            <span
              className="edit-row">
              <div
                onClick={() => setIsEditing(true)} 
                className="edit-btn">
                <MdEdit />
              </div>
            </span>
          )}

          {/* in edit mode */}
          {isEditing ? (
            <EditItemForm
              item={item}
              onSave={() => {
                fetchItem();    // refresh item
                setIsEditing(false); // exit edit mode
              }}
              onCancel={() => {
                setIsEditing(false);
              }}
            />
          ) : (
            <>
            <h1>{item.name}</h1>
            <p className="description">{item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
            {item.subcategory && <p><strong>Subcategory:</strong> {item.subcategory}</p>}
            <p><strong>Condition:</strong> {item.condition}</p>
            {item.size && <p><strong>Size:</strong> {item.size}</p>}
            <p><strong>Swap type:</strong> {item.swapType}</p>
            {item.swapType === 'borrow me' && item.washInstructions && (
              <p><strong>Wash Instructions:</strong> {item.washInstructions}</p>
            )}
            {item.swapType === 'buy me' && item.price && (
              <p><strong>Price:</strong> ${item.price}</p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="tags-container">
                <p><strong>Tags:</strong></p>
                <div className="tags-list">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag-block"
                      onClick={() => navigate(`/items?tags=${encodeURIComponent(tag)}`)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <br></br>
            <p><strong>Owner:</strong>{' '}
              <a className="contact-link" href={`/profile/${item.owner?._id}`}>
                  {item.owner?.name}
              </a>
            </p>
            <p><strong>Email:</strong>{' '}
              <a className="contact-link" href={`mailto:${item.owner?.email}?subject=${encodeURIComponent(`Interested in ${item.name}`)}`}>
                  {item.owner?.email}
              </a>
            </p>
            <p><strong>Digits:</strong>{' '}
              <a className="contact-link" href={`sms:${item.owner.phoneNumber}?body=${encodeURIComponent(
                `Hey ${item.owner.name}, is your item "${item.name}" still available?`
              )}`}>
                {item.owner.phoneNumber}</a>
            </p>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
          
  );
}

export default ItemDetail;
