import { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        document.body.className = darkMode ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        fetchUser();
    }, [darkMode]);

    const fetchUser = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data.user);
            setEditData(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Persist update
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const res = await api.post("/users/profile-picture", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser({ ...user, profilePicture: res.data.profilePicture });
            alert("Profile picture uploaded successfully!");
            // Force refresh profile data to ensure sync
            fetchUser();
        } catch (err) {
            console.error("Failed to upload image", err);
            alert("Failed to upload profile picture");
        }
    };

    const handleSave = async () => {
        try {
            const res = await api.put("/users/profile", {
                flatOwnerName: editData.flatOwnerName,
                name: editData.name, // Allow name edit too if desired
                wing: editData.wing,
                flatNumber: editData.flatNumber
            });
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Sync with localStorage
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile");
        }
    };

    if (!user) return <div className="container" style={{ padding: '20px' }}>Loading...</div>;

    const profileImgUrl = user.profilePicture
        ? `http://localhost:3000${user.profilePicture}`
        : "https://via.placeholder.com/150";

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <Navbar />

            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={profileImgUrl}
                            alt="Profile"
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white' }}
                        />
                        <label htmlFor="profile-upload" style={{
                            position: 'absolute', bottom: 0, right: 0,
                            background: '#6366f1', color: 'white',
                            borderRadius: '50%', width: '30px', height: '30px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', border: '2px solid white'
                        }}>
                            📷
                        </label>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                className="input-field"
                                value={editData.name || ''}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '200px', marginBottom: '8px', padding: '4px' }}
                            />
                        ) : (
                            <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-color)' }}>{user.name}</h2>
                        )}
                        <p style={{ color: 'var(--text-dim)', margin: '4px 0' }}>{user.role.toUpperCase()} - <span style={{ fontSize: '0.9em', color: user.status === 'approved' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>{(user.status || 'Approved').toUpperCase()}</span></p>

                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    className="input-field"
                                    style={{ width: '60px', padding: '4px' }}
                                    placeholder="Wing"
                                    value={editData.wing || ''}
                                    onChange={(e) => setEditData({ ...editData, wing: e.target.value })}
                                />
                                <input
                                    className="input-field"
                                    style={{ width: '80px', padding: '4px' }}
                                    placeholder="Flat"
                                    value={editData.flatNumber || ''}
                                    onChange={(e) => setEditData({ ...editData, flatNumber: e.target.value })}
                                />
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-dim)' }}>{user.wing} - {user.flatNumber}</p>
                        )}
                    </div>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="btn-primary"
                        style={{ marginLeft: 'auto', padding: '8px 16px' }}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setEditData(user); }}
                            style={{
                                background: 'transparent',
                                border: '1px solid currentColor',
                                color: 'inherit',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginLeft: '8px'
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div className="card-item" style={{ color: 'var(--text-color)' }}>
                        <h3 style={{ marginBottom: '12px' }}>Contact Info</h3>
                        <p style={{ marginBottom: '8px' }}>Phone: {user.phone}</p>
                        <div style={{ marginTop: '8px' }}>
                            <label style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Owner Name</label>
                            {isEditing ? (
                                <input
                                    className="input-field"
                                    value={editData.flatOwnerName || ''}
                                    onChange={(e) => setEditData({ ...editData, flatOwnerName: e.target.value })}
                                />
                            ) : (
                                <p style={{ fontWeight: '500' }}>{user.flatOwnerName || "N/A"}</p>
                            )}
                        </div>
                    </div>

                    <div className="card-item" style={{ color: 'var(--text-color)' }}>
                        <h3 style={{ marginBottom: '12px' }}>Maintenance Status</h3>
                        {/* Mock data for now, waiting for admin approval logic integration */}
                        {user.status === 'approved' ? (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255,165,0,0.2)',
                                border: '1px solid orange',
                                borderRadius: '8px',
                                color: 'orange'
                            }}>
                                ⚠️ Pending: ₹1,200 (For Dec 2025)
                            </div>
                        ) : (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255,0,0,0.2)',
                                border: '1px solid red',
                                borderRadius: '8px',
                                color: 'red'
                            }}>
                                🔒 Account Pending Approval by Admin
                            </div>
                        )}
                    </div>

                    <div className="card-item" style={{ color: 'var(--text-color)' }}>
                        <h3 style={{ marginBottom: '12px' }}>Settings</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Dark Mode</span>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    padding: '8px 24px',
                                    background: darkMode ? 'var(--primary-color)' : '#e5e7eb',
                                    color: darkMode ? '#fff' : '#1f2937',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {darkMode ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;
