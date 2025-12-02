import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;

    // --- FIX: PREVENT DOUBLE API PATH ---
    // 1. Get the variable (or use localhost root if missing)
    const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    
    // 2. CRITICAL: Remove '/api' from the end if it exists.
    // This ensures backendUrl is always "http://localhost:4000" (Root), not ".../api"
    const backendUrl = rawUrl.replace(/\/api\/?$/, ''); 

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            // We must manually add /api here now, because backendUrl is just the root
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
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
            // Manually add /api here too
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

    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendUrl, // Now this is safely just the root URL
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