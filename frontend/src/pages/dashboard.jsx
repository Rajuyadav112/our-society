import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import api from "../api/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({ name: "User", role: "Resident" });
  const [stats, setStats] = useState({
    notices: 0,
    complaints: 0,
    bills: 0
  });

  useEffect(() => {
    // Redirect watchman to their own dashboard if they land here
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (savedUser.role === 'watchman') {
      window.location.href = "/watchman-dashboard"; // Using window.location to ensure full redirect
      return;
    }

    // Fetch user and stats
    const fetchData = async () => {
      try {
        const [userRes, noticesRes, complaintsRes, billsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/notices"),
          api.get("/complaints"),
          api.get("/bills")
        ]);

        setUser(userRes.data.user);
        localStorage.setItem("user", JSON.stringify(userRes.data.user));

        setStats({
          notices: noticesRes.data.length,
          complaints: complaintsRes.data.filter(c => c.status === 'Open').length,
          bills: billsRes.data.filter(b => b.status === 'Pending').length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '40px', paddingTop: '80px' }}>
      <Navbar />

      <div className="container" style={{ padding: '0 20px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '8px', color: 'var(--text-color)' }}>
            Welcome back, {user.name} 👋
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(0.9rem, 3vw, 1.2rem)' }}>
            Here's what's happening in your society today.
          </p>
        </header>

        <div className="grid-1-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Notices Card */}
          <Link to="/notices" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>📢 Notices</h3>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.notices}</span>
            </div>
            <p style={{ color: 'var(--text-dim)' }}>Check latest announcements from the committee.</p>
          </Link>

          {/* Complaints Card */}
          <Link to="/complaints" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>🔧 Complaints</h3>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', padding: '4px 12px', borderRadius: '12px', fontWeight: '600', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                {stats.complaints} Open
              </div>
            </div>
            <p style={{ color: 'var(--text-dim)' }}>Report issues or track your existing complaints.</p>
          </Link>

          {/* Bills Card */}
          <Link to="/bills" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>💳 Bills</h3>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '4px 12px', borderRadius: '12px', fontWeight: '600', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {stats.bills} Pending
              </div>
            </div>
            <p style={{ color: 'var(--text-dim)' }}>View and pay your pending maintenance bills.</p>
          </Link>

          {/* Admin Panel Card */}
          {user.role === 'admin' && (
            <Link to="/admin-dashboard" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)', border: '1px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>🛡️ Admin Panel</h3>
              </div>
              <p style={{ color: 'var(--text-dim)' }}>Manage users, view bills, and track complaints.</p>
            </Link>
          )}

          {/* Messages Card (Residents Only) */}
          {user.role !== 'admin' && (
            <Link to="/messages" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>💬 Messages</h3>
              </div>
              <p style={{ color: 'var(--text-dim)' }}>Chat with the society admin and stay updated.</p>
            </Link>
          )}

          {/* Profile Card */}
          <Link to="/profile" className="glass-panel" style={{ padding: '24px', display: 'block', textDecoration: 'none', color: 'var(--text-color)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>👤 My Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Role</span>
                <span style={{ fontWeight: '600' }}>{user.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Phone</span>
                <span>{user.phone || "N/A"}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
