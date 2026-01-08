import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

function WatchmanDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px', paddingTop: '80px' }}>
            <Navbar />

            <div className="container" style={{ padding: '0 20px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '8px', color: 'var(--text-color)' }}>
                        Welcome back, {user.name} 👋
                    </h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(0.9rem, 3vw, 1.2rem)' }}>
                        Security Dashboard
                    </p>
                </header>

                <div className="grid-1-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Visitor Management Card */}
                    <Link to="/visitor-management" className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', display: 'block', textDecoration: 'none', color: 'var(--text-color)', border: '1px solid var(--primary-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>📝 Visitor Entry</h3>
                            <span style={{ fontSize: '2rem' }}>👥</span>
                        </div>
                        <p style={{ color: 'var(--text-dim)' }}>Log new visitors and view visitor history.</p>
                    </Link>

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

export default WatchmanDashboard;
