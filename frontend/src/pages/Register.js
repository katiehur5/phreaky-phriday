import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    phoneNumber: '',
    email: '', 
    password: '', 
    classYear: ''
  });

  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const isYaleEmail = /^[a-zA-Z0-9._%+-]+@yale\.edu$/.test(value);
      setEmailError(isYaleEmail ? '' : 'Email must be a yale.edu address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // no page reload
    try {
      const response = await API.post('/auth/register', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response && error.response.status === 409) {
        alert('An account with this email already exists. Try logging in instead.');
      }
      else if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
      else {
        alert('Registration failed.');
      }
    }
  };

  return (
    <div style={{ margin: '40px auto', maxWidth: '400px', padding: '20px' }}>
    <form onSubmit={handleSubmit}>
      <center><h1>Register</h1></center>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" autoComplete="off" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
      <input type="text" name="classYear" placeholder="Class Year" value={formData.classYear} onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
    </div>
  );
}

export default Register;
