import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your Render URL later
});

// Automatically attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;