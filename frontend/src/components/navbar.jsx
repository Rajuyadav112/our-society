import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--nav-border)',
      marginBottom: '32px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/dashboard" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>Our Society</Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Dashboard</Link>
        {user.role === 'admin' && (
          <Link to="/admin-dashboard" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Admin Panel</Link>
        )}
        <Link to="/notices" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Notices</Link>
        <Link to="/complaints" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Complaints</Link>
        <Link to="/bills" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Bills</Link>
        <Link to="/profile" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Profile</Link>
        {user.role !== 'admin' && (
          <Link to="/messages" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Messages</Link>
        )}
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '8px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>
    </nav >
  );
}

export default Navbar;
