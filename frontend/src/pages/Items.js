import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Items.css';
import Navbar from '../components/Navbar';
import MasonryGrid from '../components/MasonryGrid';
import FilterBar from '../components/FilterBar';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../components/LoadingAnimation';
import Footer from '../components/Footer';

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
  // const [loading, setLoading] = useState(true);

  const fetchItems = async() => {
    // setLoading(true);
    try {
        const params = new URLSearchParams();
        for (const key in filters) {
          filters[key].forEach(value => {
            if (value) params.append(key, value);
          });
        }
        const response = await API.get(`/api/items?${params.toString()}`);
        setItems(response.data);

        setLikedItems(response.data
          .filter(i => i.likedByCurrentUser)
          .map(i => i._id));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [filters]);

  
  const handleDelete = async (id) => {
    // const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    // if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await API.delete(`/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    // const userId = localStorage.getItem('userId');
    if (!token) {
      alert('Please log in to like items.');
      navigate('/login');
      return;
    }
    try {
      const response = await API.post(`/api/items/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchItems();
      // const updatedItem = response.data;

      // // update item in list
      // setItems(prevItems => 
      //   prevItems.map(item =>
      //     item._id === updatedItem._id ? updatedItem : item
      //   )
      // );

      // // update likedItems list
      // setLikedItems(prev =>
      //   updatedItem.likes.includes(userId)
      //   ? [...prev, id]
      //   : prev.filter(itemId => itemId !== id)
      // );
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const response = await API.put(`/api/items/${itemId}/toggle-availability`);
      setItems((prevItems) =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, isAvailable: response.data.isAvailable } : item
        )
      );
      navigate('/items');
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };


  return (
    <div className="items-wrapper">
      <Navbar />
      <div className="items-container">
        <h1>b r o w s e</h1>
        <>
        <FilterBar filters={filters} setFilters={setFilters}/>
          {items.length === 0 ? (
            <p>Nothing here yet! o ~ o</p>
          ): (
            <MasonryGrid items={items} onToggleAvailability={toggleAvailability} onDelete={handleDelete} onLike={handleLike} likedItems={likedItems}/>
          )}
        </>
      </div>
      <Footer />
    </div>
  );
}

export default Items;
