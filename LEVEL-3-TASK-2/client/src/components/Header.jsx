import React, { useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets' // still used for hand wave & brand logo

const OrbitingLogo = ({ className = 'w-36 h-36 sm:w-44 sm:h-44' }) => (
  <>
    <style>{`
      @keyframes floatY { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
      @keyframes rotateClock { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
      @keyframes rotateAnti { 0% { transform: rotate(0deg) } 100% { transform: rotate(-360deg) } }
      @keyframes dotPulse { 0% { r: 2.5 } 50% { r: 4 } 100% { r: 2.5 } }

      .logo-float { animation: floatY 4s ease-in-out infinite; transform-origin: center; }
      .ring-fast { animation: rotateClock 6s linear infinite; transform-origin: 50% 50%; }
      .ring-slow { animation: rotateAnti 10s linear infinite; transform-origin: 50% 50%; }
      .dot-pulse { animation: dotPulse 2s ease-in-out infinite; transform-origin: center; }
    `}</style>

    <div className={`relative rounded-full p-2 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full filter blur-2xl opacity-20 bg-gradient-to-tr from-indigo-200 to-blue-200"></div>

      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="relative logo-float drop-shadow-xl">
        <defs>
          <radialGradient id="g1" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e6f0ff" />
          </radialGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feBlend in="SourceGraphic" in2="blur"/>
          </filter>
        </defs>

        <circle cx="80" cy="80" r="66" fill="url(#g1)" stroke="#eef2ff" strokeWidth="2"/>

        <g transform="translate(80,80)">
          <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cfe8ff" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="8" fill="#4f46e5" opacity="0.95" filter="url(#soft)"/>
        </g>

        <g transform="translate(80,80)">
          <g className="ring-slow">
            <ellipse rx="48" ry="20" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeOpacity="0.7"/>
          </g>
          <g className="ring-fast">
            <ellipse rx="30" ry="12" fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeOpacity="0.9"/>
          </g>
        </g>

        <g transform="translate(80,80)">
          <g style={{ transformOrigin: '50% 50%', animation: 'rotateClock 6s linear infinite' }}>
            <circle cx="48" cy="0" r="2.8" fill="#60a5fa" className="dot-pulse" />
          </g>

          <g style={{ transformOrigin: '50% 50%', animation: 'rotateAnti 8s linear infinite' }}>
            <circle cx="-48" cy="0" r="2.6" fill="#7dd3fc" className="dot-pulse" />
          </g>

          <g style={{ transformOrigin: '50% 50%', animation: 'rotateClock 4s linear infinite' }}>
            <circle cx="30" cy="0" r="2.8" fill="#a78bfa" className="dot-pulse" />
          </g>

          <g style={{ transformOrigin: '50% 50%', animation: 'rotateAnti 5.5s linear infinite' }}>
            <circle cx="-30" cy="0" r="2.4" fill="#60a5fa" className="dot-pulse" />
          </g>
        </g>

        <ellipse cx="80" cy="132" rx="20" ry="4" fill="#000" opacity="0.06" />
      </svg>
    </div>
  </>
)

const Header = () => {
  const { userData } = useContext(AppContent)
  const navigate = useNavigate()

  // pick a brand logo from assets (fallback to header_img)
  const brandLogo = assets.logo ?? assets.brand_logo ?? assets.header_img

  // initial for profile if name exists
  const initial = userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'S'

  return (
    <>
      {/* Fixed dark top header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* left: logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              {/* brand logo if available */}
              {brandLogo ? (
                <img src={brandLogo} alt="PROSYNCT logo" className="w-7 h-7 object-contain" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600" />
              )}
            </div>

            <div className="text-sm font-semibold text-slate-100 select-none">
              PROSYNCT
            </div>
          </div>

          {/* right: profile circle */}
          <div className="flex items-center gap-4">
            {/* optional: username text on dark header (kept minimal) */}
            <div className="hidden sm:flex items-center text-sm text-slate-200/80">
              {userData ? userData.name : 'Developer'}
            </div>

            {/* profile avatar (clickable) */}
            <button
              onClick={() => {
                // example: navigate to profile or open menu — feel free to change
                navigate('/profile')
              }}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-medium text-white shadow-sm hover:scale-105 transition-transform"
              aria-label="Open profile"
            >
              {userData && userData.name ? initial : 'S'}
            </button>
          </div>
        </div>
      </header>

      {/* main hero container — add top padding so fixed header doesn't overlap */}
      <div className="pt-20">
        <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 transition-all duration-500 ease-in-out">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-tr from-blue-200 to-indigo-200"></div>

            {/* Inline animated orbiting logo */}
            <OrbitingLogo className="w-36 h-36 sm:w-44 sm:h-44" />
          </div>

          <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-slate-600">
            Hey {userData ? userData.name : 'Developer'}!
            <img className="w-8 aspect-square hover:rotate-12 transition-transform" src={assets.hand_wave} alt="wave" />
          </h1>

          <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent py-1">
            Welcome to PROSYNCT
          </h2>

         <p className="mb-8 max-w-lg text-lg text-slate-400 leading-relaxed">
  Experience the perfect synergy of performance, design, and seamless workflow management.
</p>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white rounded-full px-10 py-3 font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  )
}

export default Header;
