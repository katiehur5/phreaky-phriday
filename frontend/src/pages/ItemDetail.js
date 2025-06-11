import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import '../styles/ItemDetail.css';
import Slider from "react-slick";
import { CustomNextArrow, CustomPrevArrow } from "../components/CustomArrows";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await API.get(`/api/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error('Failed to load item:', err);
      }
    }

    fetchItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  return (
    <div className="item-detail-wrapper">
      <Navbar />
      <div className="item-detail-content">
      <div className="item-detail-card">
        <Slider 
          dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1} className="item-carousel"
          swipe={true} touchMove={true} swipeToSlide={true}
          arrows={true} nextArrow={<CustomNextArrow />} prevArrow={<CustomPrevArrow />}>
          {[item.imagePath, ...(item.additionalImages || [])].map((img, idx) => (
            <div key={idx}>
              <img 
                src={img} 
                alt={`Item ${idx}`} 
                className="carousel-img" 
              />
            </div>
          ))}
        </Slider>
        {/* <div className="item-images">
          <img
            className="item-detail-img"
            src={item.imagePath}
            alt={item.name}
          />
          <div className="additional-imgs">
            {item.additionalImages?.map((img, index) => (
              <img key={index} 
              src={img}
              alt={`Additional ${index}`} 
              className="sub-img"
              />
            ))}
          </div>
        </div> */}
        <div className="item-detail-info">
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
          <br></br>
          <p><strong>Owner:</strong> {item.owner?.name}</p>
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
        </div>
      </div>
      </div>
    </div>
  );
}

export default ItemDetail;
