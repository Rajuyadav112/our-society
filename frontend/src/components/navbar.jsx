import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    navigate("/login");
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/messages/unread-counts");
      const total = res.data.reduce((acc, curr) => acc + curr.count, 0);
      setUnreadCount(total);
    } catch (e) {
      console.error("Failed to fetch unread count", e);
    }
  };

  const NavLinks = () => (
    <>
      <NavLink to={user.role === 'watchman' ? "/watchman-dashboard" : "/dashboard"} className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
      {user.role === 'admin' && (
        <NavLink to="/admin-dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin Panel</NavLink>
      )}
      <NavLink to="/notices" className="nav-link" onClick={() => setIsMenuOpen(false)}>Notices</NavLink>
      <NavLink to="/complaints" className="nav-link" onClick={() => setIsMenuOpen(false)}>Complaints</NavLink>
      <NavLink to="/bills" className="nav-link" onClick={() => setIsMenuOpen(false)}>Bills</NavLink>
      <NavLink to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</NavLink>
      {user.role !== 'admin' && (
        <NavLink to="/messages" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Messages
          {unreadCount > 0 && (
            <span style={{
              marginLeft: '6px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 'bold',
              verticalAlign: 'middle'
            }}>
              {unreadCount}
            </span>
          )}
        </NavLink>
      )}
    </>
  );

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '70px',
      boxSizing: 'border-box'
    }}>
      <Link to={user.role === 'watchman' ? "/watchman-dashboard" : "/dashboard"} style={{
        fontSize: '1.25rem',
        fontWeight: '800',
        color: 'white',
        zIndex: 1001,
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none'
      }}>
        <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🏘️</div>
        <span className="hidden-mobile">Our Society</span>
        <span className="hidden-desktop">Society</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden-mobile" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <NavLinks />
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 12px' }} />
        <button
          onClick={handleLogout}
          className="btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger Toggle - Very Visible */}
      <div
        className="hidden-desktop hamburger-icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ zIndex: 1001 }}
      >
        <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(7px, 7px)' : 'none', background: isMenuOpen ? '#ef4444' : 'white' }}></span>
        <span style={{ opacity: isMenuOpen ? 0 : 1, background: 'white' }}></span>
        <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none', background: isMenuOpen ? '#ef4444' : 'white' }}></span>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)} />

      <div className={`mobile-menu-content ${isMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '40px' }}>
          <NavLinks />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
          <button
            onClick={handleLogout}
            className="btn-primary"
            style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: 'none',
              width: '100%',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
