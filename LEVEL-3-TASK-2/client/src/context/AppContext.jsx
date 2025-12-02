import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    
    // BACKEND URL CONFIG
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/api\/?$/, '');

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    // UPDATED: Initialize token from LocalStorage
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // Function to fetch User Data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // toast.error(error.message);
        }
    }

    // UPDATED: Monitor Token Changes
    useEffect(() => {
        if (token) {
            // 1. Save to LocalStorage
            localStorage.setItem('token', token);
            
            // 2. Set default header for ALL axios requests
            axios.defaults.headers.common['token'] = token;
            
            // 3. Set LoggedIn state and fetch data
            setIsLoggedin(true);
            getUserData();
        } else {
            // Logout Cleanup
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['token'];
            setIsLoggedin(false);
            setUserData(null);
        }
    }, [token]);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        token, setToken // Expose setToken so Login page can use it
    };

    return (
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    );
};

export default AppContextProvider;