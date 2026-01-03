import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [wing, setWing] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [flatOwnerName, setFlatOwnerName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !name || !wing || !flatNumber || !password) {
      setError("Please fill in required fields (Name, Phone, Password, Wing, Flat No)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('name', name);
      formData.append('password', password);
      formData.append('wing', wing);
      formData.append('flatNumber', flatNumber);
      if (flatOwnerName) formData.append('flatOwnerName', flatOwnerName);
      if (profilePicture) formData.append('profilePicture', profilePicture);

      await api.post("/users/register", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
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
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '2rem' }}>Create Account</h2>

        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.2)',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            className="input-field"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="input-field"
              type="text"
              placeholder="Wing (e.g. A)"
              style={{ width: '40%' }}
              value={wing}
              onChange={(e) => setWing(e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Flat No (e.g. 101)"
              style={{ width: '60%' }}
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
            />
          </div>
          <input
            className="input-field"
            type="text"
            placeholder="Flat Owner Name"
            value={flatOwnerName}
            onChange={(e) => setFlatOwnerName(e.target.value)}
          />

          <label style={{ display: 'block', margin: '10px 0 5px', fontSize: '0.9rem', opacity: 0.8 }}>
            Profile Selfie (Optional)
          </label>
          <input
            type="file"
            className="input-field"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            style={{ padding: '8px' }}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', opacity: 0.8 }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 'bold' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
