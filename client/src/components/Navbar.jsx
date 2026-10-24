import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon-box">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="brand-text">
            Campus<strong>Lost&Found</strong>
          </span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Nav Links */}
        <nav className={`navbar-nav ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Browse Feed
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Report Item
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-items"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              My Dashboard
            </NavLink>
          )}

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-profile-badge">
                <span className="user-greeting" title={user?.email}>
                  Hi, <strong>{user?.name?.split(' ')[0] || 'Student'}</strong>
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-btn-group">
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
