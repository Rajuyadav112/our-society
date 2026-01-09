import { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  const [loginType, setLoginType] = useState("resident"); // 'resident', 'watchman', 'admin'
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For admin login auto-creation
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter phone number");
      return;
    }
    if (loginType === 'admin' && !passkey) {
      setError("Please enter admin passkey");
      return;
    }
    if (loginType !== 'admin' && !password) {
      setError("Please enter password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      alert("Attempting login..."); // Debug alert

      let res;
      if (loginType === 'admin') {
        res = await api.post("/users/admin-login", { phone, passkey, name });
      } else {
        // Using native fetch to debug axios issue
        const response = await fetch("https://society-app-debug-live.loca.lt/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Bypass-Tunnel-Reminder": "true"
          },
          body: JSON.stringify({ phone, password })
        });

        const contentType = response.headers.get("content-type");
        let data;
        let text = "";

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          text = await response.text();
        }

        if (!response.ok) {
          // Throw explicit object with data needed for catch block
          throw {
            response: { data: data || { error: `Server Error ${response.status}: ${text.substring(0, 50)}` } }
          };
        }
        res = { data };
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user);

    } catch (err) {
      console.error(err);
      let msg = "Login failed";

      if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.message) {
        msg = err.message;
      }

      alert("Debug Error: " + msg); // Visible error for user
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (loginType === 'admin') return "🔐 Admin Login";
    if (loginType === 'watchman') return "🛡️ Security Login";
    return "👋 Welcome Back";
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ padding: 'clamp(20px, 5vw, 40px)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--text-color)' }}>
          {getTitle()}
        </h2>

        {/* Login Type Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '24px',
          background: 'rgba(255,255,255,0.05)',
          padding: '6px',
          borderRadius: '12px'
        }}>
          <button
            type="button"
            onClick={() => setLoginType('resident')}
            style={{
              padding: '12px',
              background: loginType === 'resident' ? 'var(--primary-color)' : 'transparent',
              color: loginType === 'resident' ? 'white' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
          >
            🏠 Resident
          </button>
          <button
            type="button"
            onClick={() => setLoginType('watchman')}
            style={{
              padding: '12px',
              background: loginType === 'watchman' ? 'var(--primary-color)' : 'transparent',
              color: loginType === 'watchman' ? 'white' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
          >
            🛡️ Security
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            style={{
              padding: '12px',
              background: loginType === 'admin' ? 'var(--primary-color)' : 'transparent',
              color: loginType === 'admin' ? 'white' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
          >
            🔐 Admin
          </button>
        </div>

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

        {/* Info Box for Watchman/Security */}
        {loginType === 'watchman' && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#818cf8',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.9rem'
          }}>
            <strong>Note:</strong> Enter the Security ID provided by the Admin.
          </div>
        )}

        <form onSubmit={handleLogin}>
          {loginType === 'admin' && (
            <input
              className="input-field"
              type="text"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="input-field"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {loginType === 'admin' ? (
            <input
              className="input-field"
              type="password"
              placeholder="Secret Passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
          ) : (
            <input
              className="input-field"
              type="password"
              placeholder={loginType === 'watchman' ? "Security ID (e.g., SEC-XXXX)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? "Logging in..." : `Login as ${loginType === 'resident' ? 'Resident' : loginType === 'watchman' ? 'Security' : 'Admin'}`}
          </button>
        </form>

        {loginType === 'resident' && (
          <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              New user? <Link to="/register" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Register here</Link>
            </div>
            <div>
              <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Forgot Password?</Link>
            </div>
          </div>
        )}

        {loginType === 'watchman' && (
          <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            New Security Staff? <Link to="/security-register" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Register here</Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;
