import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AddItem.css'; // Import styles
import Navbar from '../components/Navbar';

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    condition: '',
    swapType: '',
    washInstructions: '',
    price: '',
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
      form.append('category', formData.category);
      if (formData.subcategory) { form.append('subcategory', formData.subcategory); }
      if (formData.condition) { form.append('condition', formData.condition); }
      if (formData.size) { form.append('size', formData.size); }
      if (formData.swapType) { form.append('swapType', formData.swapType); }
      if (formData.washInstructions) { form.append('washInstructions', formData.washInstructions); }
      if (formData.price) { form.append('price', formData.price); }

      if (formData.swapType === 'borrow me') {
        form.append('washInstructions', formData.washInstructions);
      }

      if (formData.swapType === 'buy me') {
        form.append('price', formData.price);
      }


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
        {/* FILE FIELD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />

        {/* NAME FIELD */}
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* CATEGORY FIELD */}
        <div className="options">
          <span className="label">CATEGORY:</span>
          {['clothing', 'shoes', 'accessories', 'home goods', 'other'].map((c) => (
            <label key={c} className="label">
            <input
              type="radio"
              name="category"
              value={c}
              checked={formData.category === c}
              onChange={handleChange}
              // required
            />
              {c}
            </label>
          ))}
        </div>

        {/* CONDITIONAL SUBCATEGORY FIELDS */}
        {formData.category === 'clothing' && (
          <div className="options">
            <span className="label">CLOTHING TYPE:</span>
          {['dress', 'top', 'bottom', 'outerwear', 'other'].map((c) => (
            <label key={c} className="label">
            <input
              type="radio"
              name="subcategory"
              value={c}
              checked={formData.subcategory === c}
              onChange={handleChange}
              // required
            />
              {c}
            </label>
          ))}
        </div>
        )}

        {/* size field (optional) */}
        <input
          type="text"
          name="size"
          placeholder="Size (optional)"
          value={formData.size}
          onChange={handleChange}
        />

        {/* DESCRIPTION FIELD */}
        <textarea
          name="description"
          placeholder="Description: brand, fit, color, material, etc."
          value={formData.description}
          onChange={handleChange}
          // required
        />

        {/* CONDITION FIELD */}
        <div className="options">
          <span className="label">CONDITION:</span>
          {['new', 'good', 'poor'].map((c) => (
            <label key={c} className="label">
            <input
              type="radio"
              name="condition"
              value={c}
              checked={formData.condition === c}
              onChange={handleChange}
              // required
            />
              {c}
            </label>
          ))}
        </div>

        {/* SWAP TYPE FIELD */}
        <div className="options">
          <span className="label">SWAP TYPE:</span>
        {['buy me', 'take me', 'borrow me'].map((c) => (
            <label key={c} className="label">
            <input
              type="radio"
              name="swapType"
              value={c}
              checked={formData.swapType === c}
              onChange={handleChange}
              // required
            />
              {c}
            </label>
          ))}
        </div>
        {/* CONDITIONAL WASH / PRICE FIELDS */}
        {formData.swapType === 'borrow me' && (
          <input
            type="text"
            name="washInstructions"
            placeholder="Wash Instructions"
            value={formData.washInstructions}
            onChange={handleChange}
            // required
          />
        )}

        {formData.swapType === 'buy me' && (
          <input
            type="number"
            name="price"
            placeholder="Selling Price ($)"
            value={formData.price}
            onChange={handleChange}
            // required
          />
        )}

        {/* SUBMIT BUTTON */}
        <button type="submit">upload to closet</button>
      </form>
    </div>
    </div>
  );
}

export default AddItem;
