import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate()
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
                if (data.success) {
                    setIsLoggedin(true);
                    await getUserData(); 
                    navigate('/dashboard'); // Go to Dashboard on success
                } else {
                    toast.error(data.message || 'Register failed');
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
                if (data.success) {
                    setIsLoggedin(true);
                    await getUserData();
                    navigate('/dashboard'); // Go to Dashboard on success
                } else {
                    toast.error(data.message || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Login/Register error:', error);
            if (!error.response) {
                toast.error('Network error or server unreachable.');
                return;
            }
            const serverMsg = error.response.data && error.response.data.message;
            toast.error(serverMsg || `Server error (${error.response.status})`);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-indigo-100'>
            
            <div className='bg-white p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-gray-700 transition-all duration-300'>

                <h2 className='text-3xl font-bold text-center mb-3 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent'>
                    {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                </h2>

                <p className='text-center text-sm mb-8 text-slate-500'>
                    {state === 'Sign Up' ? 'Create your account to get started' : 'Login to your account!'}
                </p>

                <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>

                    {state === "Sign Up" && (
                        <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-indigo-50 border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-200 transition-all'>
                            <img src={assets.person_icon} alt="" className='w-5 opacity-60' />
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name} 
                                className='bg-transparent outline-none w-full text-gray-700' 
                                type="text" placeholder='Full Name' required 
                            />
                        </div>
                    )}

                    <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-indigo-50 border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-200 transition-all'>
                        <img src={assets.mail_icon} alt="" className='w-5 opacity-60' />
                        <input 
                            onChange={e => setEmail(e.target.value)} 
                            value={email}  
                            className='bg-transparent outline-none w-full text-gray-700' 
                            type="email" placeholder='Email id' required 
                        />
                    </div>

                    <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-indigo-50 border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-200 transition-all'>
                        <img src={assets.lock_icon} alt="" className='w-5 opacity-60' />
                        <input 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            className='bg-transparent outline-none w-full text-gray-700' 
                            type="password" placeholder='Password' required 
                        />
                    </div>

                    <p onClick={()=>navigate('/reset-password')} className='mb-2 text-indigo-600 cursor-pointer hover:underline text-sm text-right'>
                        Forgot password?
                    </p>

                    <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all'>
                        {state}
                    </button>
                </form>

                {state === "Sign Up" ? (
                    <p className='text-slate-500 text-center text-xs mt-6'>
                        Already have an account?{' '}
                        <span onClick={()=> setState('Login')} className='text-indigo-600 cursor-pointer font-medium hover:underline'>Login here</span>
                    </p>
                ) : (
                    <p onClick={()=> setState('Sign Up')} className='text-slate-500 text-center text-xs mt-6'>
                        Don't have an account?{' '}
                        <span className='text-indigo-600 cursor-pointer font-medium hover:underline'>Sign Up</span>
                    </p>
                )}

            </div>
        </div>
    )
}

export default Login;