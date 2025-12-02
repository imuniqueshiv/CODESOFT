import axios from 'axios';

const api = axios.create({
  // This file SHOULD have /api because it's a dedicated instance
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export default api;