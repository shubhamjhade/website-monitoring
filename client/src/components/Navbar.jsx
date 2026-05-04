import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 no-underline flex-shrink-0" onClick={handleNavClick}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center" 
               style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="8"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
              <line x1="12" y1="4" x2="12" y2="7"/>
              <line x1="12" y1="17" x2="12" y2="20"/>
              <line x1="4" y1="12" x2="7" y2="12"/>
              <line x1="17" y1="12" x2="20" y2="12"/>
            </svg>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight">
            <span style={{ color: '#7c3aed' }}>SYNTH</span>
            <span className="text-gray-400"> MONITOR</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links-desktop flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${isActive('/dashboard') ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>Dashboard</Link>
              <Link to="/analytics" className={`px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${isActive('/analytics') ? 'text-white bg-white/[0.08]' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>Analytics</Link>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-gray-300 hidden lg:inline">{user?.name}</span>
                </div>
                <button onClick={logout} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors no-underline">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5 no-underline">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger Button (mobile) */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay">
          {isAuthenticated ? (
            <>
              {user && (
                <div className="flex items-center gap-3 mb-6">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}
              <Link to="/dashboard" onClick={handleNavClick} className={`px-8 py-3 rounded-xl text-lg font-medium no-underline transition-all ${isActive('/dashboard') ? 'text-white bg-white/[0.08]' : 'text-gray-400'}`}>Dashboard</Link>
              <Link to="/analytics" onClick={handleNavClick} className={`px-8 py-3 rounded-xl text-lg font-medium no-underline transition-all ${isActive('/analytics') ? 'text-white bg-white/[0.08]' : 'text-gray-400'}`}>Analytics</Link>
              <button onClick={() => { logout(); handleNavClick(); }} className="px-8 py-3 rounded-xl text-lg font-medium text-red-400 hover:bg-red-500/[0.08] transition-all mt-4 border-none bg-transparent cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleNavClick} className="px-8 py-3 rounded-xl text-lg font-medium text-gray-400 no-underline">Sign In</Link>
              <Link to="/register" onClick={handleNavClick} className="btn-primary text-lg !py-3 !px-8 no-underline mt-2">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
