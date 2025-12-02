// import axios from 'axios';

// // Create an axios instance with dynamic backend URL
// const API = axios.create({
//     // If VITE_API_URL exists (Production), use it. Otherwise use localhost (Development).
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', 
//     withCredentials: true 
// });

// // Add a response interceptor to handle errors globally
// API.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.error("API Error:", error);
//         return Promise.reject(error);
//     }
// );

// export default API;

import axios from 'axios';

const api = axios.create({
  // CRITICAL CHANGE: Use the variable we just confirmed exists!
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export default api;