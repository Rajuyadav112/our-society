import { useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
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
    if (isAdminLogin && !passkey) {
      setError("Please enter admin passkey");
      return;
    }
    if (!isAdminLogin && !password) {
      setError("Please enter password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let res;
      if (isAdminLogin) {
        res = await api.post("/users/admin-login", { phone, passkey, name });
      } else {
        res = await api.post("/users/login", { phone, password });
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user info

      onLogin();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '2rem', color: 'var(--text-color)' }}>
          {isAdminLogin ? "Admin Login" : "Welcome Back"}
        </h2>

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

        <form onSubmit={handleLogin}>
          {isAdminLogin && (
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

          {isAdminLogin ? (
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
              placeholder="Password"
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
            {loading ? "Logging in..." : (isAdminLogin ? "Login as Admin" : "Login")}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <button
            onClick={() => setIsAdminLogin(!isAdminLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
          >
            {isAdminLogin ? "Not an admin? Resident Login" : "Login as Admin"}
          </button>
        </div>

        {!isAdminLogin && (
          <div style={{ marginTop: '12px', textAlign: 'center', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              New user? <Link to="/register" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>Register here</Link>
            </div>
            <div>
              <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Forgot Password?</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;
