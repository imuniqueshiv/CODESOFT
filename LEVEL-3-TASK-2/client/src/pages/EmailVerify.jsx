import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerify = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContent);
    const navigate = useNavigate();
    const inputRefs = React.useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map((el) => el.value);
        const otp = otpArray.join('');

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/verify-account`,
                { otp }, 
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message || 'Email verified successfully!');
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };
   
    useEffect(()=>{
        isLoggedin && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedin, userData]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
            />

            <form
                onSubmit={onSubmitHandler}
                className="bg-white p-10 rounded-2xl shadow-2xl w-96 transition-all duration-300"
            >
                <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    Verify Account
                </h1>
                <p className="text-center mb-8 text-slate-500 text-sm">
                    Enter the 6-digit code sent to your email.
                </p>

                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            type="text"
                            maxLength="1"
                            key={index}
                            required
                            className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-center text-xl rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
                            ref={(el) => (inputRefs.current[index] = el)}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all">
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;