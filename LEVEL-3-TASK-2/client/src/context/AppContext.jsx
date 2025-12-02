import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
    // 1. Force credentials to be sent with every request
    axios.defaults.withCredentials = true;

    // 2. BACKEND URL FIX (Crucial)
    // We use "http://localhost:4000" as default (WITHOUT /api).
    // We also use .replace() to strip '/api' if it accidentally comes from the .env file.
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/api\/?$/, '');

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            // Now we manually add /api, and since backendUrl is clean, it fits perfectly.
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            // console.log(error);
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