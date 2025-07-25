import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import styles

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    return () => {
      console.log('Login component unmounted');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError(''); // Clear any previous errors
    
    try {
      const response = await API.post('/api/auth/login', formData);

      // Store user token and ID in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);

      navigate('/home'); // Redirect to homepage after login
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        // Handle specific error messages from the backend
        const errorMessage = error.response.data.error;
        if (errorMessage === 'Invalid email') {
          setError("Couldn't find account that matches email");
        } else if (errorMessage === 'Invalid password') {
          setError('Incorrect password');
        } else {
          setError(errorMessage || 'An error occurred during login');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome back!</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="off"
          value={formData.email}
          // onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
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
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
