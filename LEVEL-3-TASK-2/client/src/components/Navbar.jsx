import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)

  /* -----------------------------------------------
      APPLY ANIMATED BODY BACKGROUND (ONLY BODY)
      Navbar UI remains exactly same
  -------------------------------------------------*/
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'prosynct-body-style'

    styleEl.innerHTML = `
      @keyframes bodyGradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes bodyOverlayShift {
        0% { transform: translateX(0); opacity: 0.06; }
        50% { transform: translateX(5%); opacity: 0.10; }
        100% { transform: translateX(0); opacity: 0.06; }
      }

      body.prosynct-bg {
        background: linear-gradient(120deg, #0a0f1e 0%, #101828 35%, #25305a 65%, #2563eb 100%);
        background-size: 200% 200%;
        animation: bodyGradientShift 16s ease-in-out infinite;
        color-scheme: dark;
        position: relative;
        overflow-x: hidden;
        min-height: 100vh;
      }

      body.prosynct-bg::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(99,102,241,0.05), rgba(99,102,241,0.02));
        animation: bodyOverlayShift 22s ease-in-out infinite;
        pointer-events: none;
        mix-blend-mode: overlay;
        filter: blur(14px);
      }

      body.prosynct-bg::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center 20%, rgba(255,255,255,0.08), transparent 60%);
        pointer-events: none;
      }
    `

    document.head.appendChild(styleEl)
    document.body.classList.add('prosynct-bg')

    return () => {
      document.body.classList.remove('prosynct-bg')
      const old = document.getElementById('prosynct-body-style')
      if (old) old.remove()
    }
  }, [])

  /* -----------------------------------------------
      FUNCTIONS (unchanged)
  -------------------------------------------------*/
  const sendVerificationOtp = async () => {
    try {
        const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
        if (data.success) {
            navigate('/email-verify');
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error sending OTP");
    }
  }

  const logout = async () => {
    try {
        await axios.post(backendUrl + '/api/auth/logout');
        setIsLoggedin(false);
        setUserData(null);
        navigate('/login');
    } catch (error) {
        toast.error(error.message);
    }
  }

  /* -----------------------------------------------
      OLD NAVBAR (NO CHANGES)
  -------------------------------------------------*/
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 bg-slate-900/50 backdrop-blur-md border-b border-white/10 z-50 transition-all">

      {/* Logo Section */}
      <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer group'>
        <img
          src={assets.logo}
          alt="Logo"
          className='w-28 sm:w-32 object-contain hover:opacity-90 transition-opacity'
        />
      </div>

      {/* Profile / Login Section */}
      {userData ? (
        <div className='w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold cursor-pointer shadow-md hover:scale-105 transition-transform relative group'>
          {userData.name ? userData.name[0].toUpperCase() : 'U'}

          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
            <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm w-32 shadow-xl'>
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className='py-2 px-3 hover:bg-gray-100 cursor-pointer text-xs text-red-500 font-semibold'>Verify Email</li>
              )}
              <li onClick={() => navigate('/dashboard')} className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded'>Dashboard</li>
              <li onClick={logout} className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded text-red-600'>Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20'
        >
          Login
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      )}

    </div>
  )
}

export default Navbar
