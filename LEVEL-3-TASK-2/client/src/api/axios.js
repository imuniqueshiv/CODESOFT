import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if it exists, otherwise localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export default api;