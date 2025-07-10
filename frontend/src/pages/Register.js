import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneNumber: '',
    email: '', 
    password: '', 
    classYear: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when user types

    // Validate email as user types
    if (name === 'email') {
      const isEmail = /^\S+@\S+\.\S+$/.test(value);
      if (!isEmail && value) {
        setError('Please enter valid email');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const isEmail = /^\S+@\S+\.\S+$/.test(formData.email);
    if (!isEmail) {
      setError('Please register with Yale email');
      return;
    }

    try {
      const response = await API.post('/api/auth/register', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      navigate('/home');
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 409 || 
            (error.response.data.error && error.response.data.error.includes('already registered'))) {
          setError('An account with this email already exists. Try logging in instead.');
        } else if (error.response.data.error === 'Enter valid email.') {
          setError('Please register with valid email');
        } else {
          setError(error.response.data.error || 'Registration failed. Please try again.');
        }
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="tel" 
          name="phoneNumber" 
          placeholder="Phone Number" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Preferred Email" 
          autoComplete="off" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          autoComplete="new-password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="classYear" 
          placeholder="Class Year" 
          value={formData.classYear} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
