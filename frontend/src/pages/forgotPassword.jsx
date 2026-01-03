import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP & New Password
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phone) return setError("Enter phone number");

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/users/forgot-password", { phone });
            setMessage("OTP Sent Successfully! Please check your messages.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return setError("Fill all fields");

        try {
            setLoading(true);
            setError("");

            await api.post("/users/reset-password", { phone, otp, newPassword });

            alert("Password Reset Successfully!");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Reset Password</h2>

                {error && <div style={{ background: 'rgba(255,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ background: 'rgba(0,255,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <input className="input-field" type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <input className="input-field" type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                        <input className="input-field" type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" style={{ fontSize: '0.9rem' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
