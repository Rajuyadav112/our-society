import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/admin/overview");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users overview", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (userId, newStatus) => {
        try {
            await api.put(`/users/${userId}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const openChat = async (user) => {
        setSelectedUser(user);
        try {
            const res = await api.get(`/messages/${user.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await api.post("/messages/send", {
                receiverId: selectedUser.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Admin Dashboard</h2>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>User Management</h3>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Name & Phone</th>
                                    <th style={{ padding: '12px' }}>Flat & Owner</th>
                                    <th style={{ padding: '12px' }}>Bills</th>
                                    <th style={{ padding: '12px' }}>Complaints</th>
                                    <th style={{ padding: '12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {user.profilePicture && (
                                                    <img src={`http://localhost:3000${user.profilePicture}`} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt="" />
                                                )}
                                                <div>
                                                    <strong>{user.name}</strong><br />
                                                    <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{user.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{user.wing}-{user.flatNumber}</span>
                                                <span style={{ fontSize: '0.85em', opacity: 0.8 }}>Owner: {user.flatOwnerName || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                background: user.pendingBills > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                                color: user.pendingBills > 0 ? '#ef4444' : '#4caf50',
                                                fontWeight: '600',
                                                border: `1px solid ${user.pendingBills > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`
                                            }}>
                                                {user.pendingBills} Pending
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                background: user.openComplaints > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                                color: user.openComplaints > 0 ? '#f59e0b' : '#4caf50',
                                                fontWeight: '600',
                                                border: `1px solid ${user.openComplaints > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`
                                            }}>
                                                {user.openComplaints} Open
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => openChat(user)}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#2196f3', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Chat
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chat Modal */}
                {selectedUser && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>Chat with {selectedUser.name}</h3>
                                <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{
                                        alignSelf: msg.senderId === selectedUser.id ? 'flex-start' : 'flex-end',
                                        background: msg.senderId === selectedUser.id ? 'rgba(255,255,255,0.1)' : 'var(--accent-color)',
                                        padding: '10px 16px',
                                        borderRadius: msg.senderId === selectedUser.id ? '0 12px 12px 12px' : '12px 12px 0 12px',
                                        maxWidth: '80%'
                                    }}>
                                        {msg.content}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                                <input
                                    className="input-field"
                                    style={{ margin: 0 }}
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Send</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
