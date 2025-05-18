import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AddItem.css'; // Import styles
import Navbar from '../components/Navbar';

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Get logged-in user's ID
    const token = localStorage.getItem('token'); // Get token for authentication

    if (!userId || !token) {
      alert('You must be logged in to add an item.');
      navigate('/login');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('image', imageFile);
      form.append('owner', userId);

      await API.post('/items', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Item added successfully!');
      navigate('/items'); // Redirect to item listings
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    }
  };

  return (
    <div className="additem-wrapper">
      <Navbar />

    <div className="add-item-container">
      <h1>contribute to the closet!</h1>
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
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
        <button type="submit">upload to closet</button>
      </form>
    </div>
    </div>
  );
}

export default AddItem;
