import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Items.css';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await API.get('/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
    fetchItems();
  }, []);

  return (
    <div className="items-container">
      <h1>Available Items</h1>
      <div className="items-grid">
        {items.length === 0 ? (
          <p>No items available.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <div className="item-info">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p className="item-owner">Owner: {item.owner?.name || 'Unknown'}</p>
                <button className="swap-button">Request Swap</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  /* return (
    <div>
      <h1>Available Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <img src={item.imageUrl} alt={item.name} style={{ width: '200px' }} />
            <p>Owner: {item.owner?.name || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </div>
  ); */
}

export default Items;
