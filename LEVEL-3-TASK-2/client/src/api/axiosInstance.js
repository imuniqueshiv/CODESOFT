import axios from 'axios';

const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
    baseURL: backendUrl + '/api',
    withCredentials: true,
});

// INTERCEPTOR: Automatically add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = token; // Add custom header
            config.headers['Authorization'] = `Bearer ${token}`; // Add standard header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;