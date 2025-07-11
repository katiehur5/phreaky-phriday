import axios from 'axios';

const API = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Add request interceptor
API.interceptors.request.use(
  config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem('token') && // Only redirect if token exists
      window.location.pathname !== '/login' // Don't redirect if already on login
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
