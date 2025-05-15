import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AddItem.css'; // Import styles

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // Get logged-in user's ID
      const token = localStorage.getItem('token'); // Get token for authentication

      if (!userId || !token) {
        alert('You must be logged in to add an item.');
        navigate('/login');
        return;
      }

      const response = await API.post(
        '/items',
        { ...formData, owner: userId }, // Attach owner ID to item
        { headers: { Authorization: `Bearer ${token}` } } // Send token for authentication
      );

      alert('Item added successfully!');
      navigate('/items'); // Redirect to item listings
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    }
  };

  return (
    <div className="add-item-container">
      <h1>Add a New Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Item</button>
      </form>
    </div>
  );
}

export default AddItem;
