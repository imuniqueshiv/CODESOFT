import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;

    // --- SMART BACKEND URL ---
    // 1. Get the variable from Vercel (or use localhost if missing)
    // 2. We use a safe check (import.meta.env && ...) to prevent crashes in some build environments
    // 3. Remove '/api' from the end if it exists (to prevent double /api/api issues)
    
    const apiEnvVar = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : false;
    const rawUrl = apiEnvVar || "http://localhost:4000";
    const backendUrl = rawUrl.replace(/\/api$/, ''); 

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
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
        backendUrl,
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