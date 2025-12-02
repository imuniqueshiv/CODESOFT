import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    // Ensure credentials are sent with every request
    axios.defaults.withCredentials = true;

    // --- FIX: ROBUST URL HANDLING ---
    // If VITE_API_URL is "https://api.com/api", we use it directly.
    // If we need the base (without /api) for some reason, we strip it carefully.
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    
    // Derived backend URL (for endpoints that might be outside /api, though usually not needed if organized well)
    // If apiUrl is '.../api', this becomes '.../'
    const backendUrl = apiUrl; 

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            // Using the full apiUrl ensures we hit the correct route
            const { data } = await axios.get(`${apiUrl}/auth/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            // console.log(error.message);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/user/data`);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendUrl, // Pass this if you need it elsewhere
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    };

    return (
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    );
};

export default AppContextProvider;