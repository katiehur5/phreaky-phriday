import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Items.css';
import Navbar from '../components/Navbar';
import MasonryGrid from '../components/MasonryGrid';
import FilterBar from '../components/FilterBar';
import { useNavigate } from 'react-router-dom';

function Items() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    swapType: [],
    category: [],
    subcategory: [],
    size: []
  });
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const params = new URLSearchParams();
        for (const key in filters) {
          filters[key].forEach(value => {
            if (value) params.append(key, value);
          });
        }
        const response = await API.get(`/items?${params.toString()}`);
        setItems(response.data);

      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
    fetchItems();
  }, [filters]);

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

  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like items.');
      navigate('/login');
      return;
    }
    try {
      const response = await API.post(`/items/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Toggle like state locally for quick UI update
      setLikedItems(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id) // Unlike
          : [...prev, id] // Like
      );

      // update like count in the item list
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id
            ? { ...item, likes: response.data.likes }
            : item
        )
      );
    } catch (err) {
      console.error('Error liking item:', err);
    }
  }

  return (
    <div className="items-wrapper">
      <Navbar />
    <div className="items-container">
      <h1>b r o w s e</h1>
      <>
      <FilterBar filters={filters} setFilters={setFilters} />
        {items.length === 0 ? (
          <p>No items available.</p>
        ): (
          <MasonryGrid items={items} onDelete={handleDelete} onLike={handleLike} likedItems={likedItems}/>
        )}
      </>
    </div>
    </div>
  );
}

export default Items;
