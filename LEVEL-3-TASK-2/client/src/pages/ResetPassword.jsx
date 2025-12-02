import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext' 
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

    const { backendUrl } = useContext(AppContent)
    axios.defaults.withCredentials = true

    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState(false) 
    const [otp, setOtp] = useState('') 
    const [isOtpSubmited, setIsOtpSubmited] = useState(false)

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

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to send email");
        }
    }

    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpString = inputRefs.current.map(el => el.value).join('');
        if (otpString.length < 6) {
            toast.error("Please enter the 6-digit OTP.");
            return;
        }
        setOtp(otpString); 
        setIsOtpSubmited(true); 
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
            if (data.success) {
                toast.success(data.message);
                navigate('/login'); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" 
            />

            {/* Form 1: Enter Email */}
            {!isEmailSent && (
                <form onSubmit={onSubmitEmail} className='bg-white p-10 rounded-2xl shadow-2xl w-96 transition-all duration-300'>
                    <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        Reset Password
                    </h1>
                    <p className="text-center mb-8 text-slate-500 text-sm">
                        Enter your registered email address
                    </p>
                    <div className='mb-6 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-indigo-50 border border-indigo-100'>
                        <img src={assets.mail_icon} alt="" className='w-4 opacity-50' />
                        <input type="email" placeholder='Email id' className='bg-transparent outline-none w-full text-gray-700'
                            value={email} onChange={e => setEmail(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className='w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all'>
                        Submit
                    </button>
                </form>
            )}

            {/* Form 2: Enter OTP */}
            {!isOtpSubmited && isEmailSent && (
                <form onSubmit={onSubmitOTP} className="bg-white p-10 rounded-2xl shadow-2xl w-96 transition-all duration-300">
                    <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        Enter OTP
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
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all">
                        Verify OTP
                    </button>
                </form>
            )}

            {/* Form 3: New Password */}
            {isOtpSubmited && isEmailSent && (
                <form onSubmit={onSubmitNewPassword} className='bg-white p-10 rounded-2xl shadow-2xl w-96 transition-all duration-300'>
                    <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        New Password
                    </h1>
                    <p className="text-center mb-8 text-slate-500 text-sm">
                        Enter the new password below
                    </p>
                    <div className='mb-6 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-indigo-50 border border-indigo-100'>
                        <img src={assets.lock_icon} alt="" className='w-4 opacity-50' />
                        <input type="password" placeholder='New Password' className='bg-transparent outline-none w-full text-gray-700'
                            value={newPassword} onChange={e => setNewPassword(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className='w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all'>
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    )
}

export default ResetPassword