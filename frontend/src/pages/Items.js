import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Items.css';
import Navbar from '../components/Navbar';
import MasonryGrid from '../components/MasonryGrid';

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await API.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="items-wrapper">
      <Navbar />
    <div className="items-container">
      <h1>b r o w s e</h1>
      {items.length === 0 ? (
        <p>No items available.</p>
      ): (
        <MasonryGrid items={items} onDelete={handleDelete} />
      )}
    </div>
    </div>
  );
}

export default Items;
