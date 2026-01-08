import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

function SecurityRegister() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !phone) {
            setError("Please fill all fields");
            return;
        }

        if (phone.length !== 10) {
            setError("Phone number must be 10 digits");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/users/security-register", { name, phone });

            setSuccess({
                securityId: res.data.securityId,
                name: res.data.user.name,
                phone: res.data.user.phone
            });

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                padding: '20px'
            }}>
                <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: 'var(--text-color)', marginBottom: '24px' }}>
                        Registration Successful!
                    </h2>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                        border: '2px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ color: '#10b981', marginBottom: '16px', fontSize: '1.3rem' }}>
                            🔒 Registration Request Sent
                        </h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6' }}>
                            Your registration details have been sent to the <strong>Admin Panel</strong>.
                        </p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '12px' }}>
                            ⚠️ Please contact the Admin to collect your Security Key for login.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '12px' }}>
                            📋 Your Details:
                        </h4>
                        <p style={{ color: 'var(--text-dim)', margin: '8px 0' }}>
                            <strong>Name:</strong> {success.name}
                        </p>
                        <p style={{ color: 'var(--text-dim)', margin: '8px 0' }}>
                            <strong>Phone:</strong> {success.phone}
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <p style={{ color: '#818cf8', fontSize: '0.95rem', margin: 0 }}>
                            💡 <strong>To Login:</strong> Use your Phone Number and the Security ID provided by Admin.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                    >
                        Go to Login →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            padding: '20px'
        }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ marginBottom: '12px', textAlign: 'center', fontSize: '2rem', color: 'var(--text-color)' }}>
                    🛡️ Security Registration
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '32px' }}>
                    Register as a security guard
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        fontWeight: '500'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                            Full Name *
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                            Phone Number *
                        </label>
                        <input
                            className="input-field"
                            type="tel"
                            placeholder="Enter 10-digit phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            required
                            maxLength="10"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register as Security"}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Already registered? <Link to="/login" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default SecurityRegister;
