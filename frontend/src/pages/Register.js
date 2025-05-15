import React, { useState } from 'react';
import API from '../api';

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneNumber: '',
    email: '', 
    password: '', 
    classYear: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/users/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <input type="text" name="classYear" placeholder="Class Year" value={formData.classYear} onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
