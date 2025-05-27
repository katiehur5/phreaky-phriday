import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.20.140:3000/api', // Replace with your backend URL if deployed
});

// api.js
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
