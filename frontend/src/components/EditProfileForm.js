import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Register.css'; // reuse existing styles

function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    classYear: '',

    insta: '',
    snapchat: '',
    pinterest: '',
    whatsapp: '',
    residence: '',
    venmo: '',

    style: '',
    influencer: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email|| '',
        phoneNumber: user.phoneNumber || '',
        classYear: user.classYear || '',

        insta: user.insta || '',
        snapchat: user.snapchat || '',
        pinterest: user.pinterest || '',
        whatsapp: user.whatsapp || '',
        residence: user.residence || '',
        venmo: user.venmo || '',

        style: user.style || '',
        influencer: user.influencer || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await API.put(`/api/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('User updated successfully!');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <span className="cancel-row">
        <div onClick={onCancel} className="cancel-btn">
          cancel
        </div>
      </span>
      <h2>Edit Profile</h2>
      <p>Place a * next to preferred contact methods</p>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Preferred Email" />
      <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Digits" />
      <input type="text" name="classYear" value={formData.classYear} onChange={handleChange} placeholder="Class Year" />
      <input type="text" name="residence" value={formData.residence} onChange={handleChange} placeholder="Residential College or Addy" />

      <input type="text" name="insta" value={formData.insta} onChange={handleChange} placeholder="Insta" />
      <input type="text" name="snapchat" value={formData.snapchat} onChange={handleChange} placeholder="Snapchat" />
      <input type="text" name="pinterest" value={formData.pinterest} onChange={handleChange} placeholder="Pinterest" />
      <input type="text" name="venmo" value={formData.venmo} onChange={handleChange} placeholder="Venmo" />

      <input type="text" name="style" value={formData.style} onChange={handleChange} placeholder="What's your style? (be funny haha with it)" />
      <input type="text" name="influencer" value={formData.influencer} onChange={handleChange} placeholder="Favorite influencer?" />

      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditProfileForm;
