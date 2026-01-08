import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const docInputRef = useRef(null);

    useEffect(() => {
        fetchUsers();
        fetchUnreadCounts();
        const interval = setInterval(updateLastSeen, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const updateLastSeen = async () => {
        try { await api.put("/users/profile", { lastSeen: new Date() }); } catch (e) { }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/overview");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users overview", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCounts = async () => {
        try {
            const res = await api.get("/messages/unread-counts");
            const counts = {};
            res.data.forEach(item => { counts[item.senderId] = item.count; });
            setUnreadCounts(counts);
        } catch (err) {
            console.error("Failed to fetch unread counts", err);
        }
    };

    const openChat = async (user) => {
        setSelectedUser(user);
        try {
            const res = await api.get(`/messages/${user.id}`);
            setMessages(res.data);
            await api.put(`/messages/mark-read/${user.id}`);
            fetchUnreadCounts();
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
            setShowAttachmentMenu(false);
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file || !selectedUser) return;
        const formData = new FormData();
        formData.append("receiverId", selectedUser.id);
        formData.append("image", file);

        try {
            const res = await api.post("/messages/send", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages([...messages, res.data]);
            setShowAttachmentMenu(false);
        } catch (err) {
            console.error("Failed to upload file", err);
        }
    };

    const handleReaction = async (messageId, reaction) => {
        try {
            const res = await api.post(`/messages/${messageId}/react`, { reaction });
            setMessages(messages.map(m => m.id === messageId ? res.data : m));
            setShowEmojiPicker(null);
        } catch (err) {
            console.error("Failed to react", err);
        }
    };

    if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading dashboard...</div>;

    const residents = users.filter(u => u.role === "resident");

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '80px', boxSizing: 'border-box' }}>
            <Navbar />
            <div className="container" style={{ paddingBottom: '40px' }}>
                <h1 style={{ marginBottom: '30px', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Admin Dashboard</h1>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <tr>
                                    <th style={{ padding: '15px 20px', textAlign: 'left' }}>Resident Name</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left' }}>Flat Details</th>
                                    <th className="hidden-mobile" style={{ padding: '15px 20px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {residents.map(user => (
                                    <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {user.profilePicture ? (
                                                    <img src={`http://localhost:3000${user.profilePicture}`} alt="" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '600' }}>{user.name}</span>
                                                    {unreadCounts[user.id] > 0 && (
                                                        <span style={{ background: '#25d366', color: 'white', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold', width: 'fit-content' }}>
                                                            {unreadCounts[user.id]} new
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', opacity: 0.8, fontSize: '0.9rem' }}>
                                            W-{user.wing}, F-{user.flatNumber}
                                        </td>
                                        <td className="hidden-mobile" style={{ padding: '15px 20px', opacity: 0.8 }}>{user.phone}</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => openChat(user)}>Message</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                <h2 style={{ margin: '30px 0 20px', fontSize: '1.5rem' }}>🛡️ Security Staff</h2>
                <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '40px' }}>
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <tr>
                                    <th style={{ padding: '15px 20px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'left' }}>Security ID</th>
                                    <th style={{ padding: '15px 20px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => u.role === 'watchman').length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>No security staff registered yet.</td>
                                    </tr>
                                ) : (
                                    users.filter(u => u.role === 'watchman').map(user => (
                                        <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '600' }}>{user.name}</span>
                                                        {unreadCounts[user.id] > 0 && (
                                                            <span style={{ background: '#25d366', color: 'white', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold', width: 'fit-content' }}>
                                                                {unreadCounts[user.id]} new
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 20px', opacity: 0.8 }}>{user.phone}</td>
                                            <td style={{ padding: '15px 20px', fontFamily: 'monospace', color: '#10b981' }}>{user.securityId || 'N/A'}</td>
                                            <td style={{ padding: '15px 20px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => openChat(user)}>Message</button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                                                            try {
                                                                await api.delete(`/users/${user.id}`);
                                                                fetchUsers(); // Refresh list
                                                            } catch (err) {
                                                                alert('Failed to delete user');
                                                                console.error(err);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '0.85rem',
                                                        background: 'rgba(239, 68, 68, 0.2)',
                                                        color: '#f87171',
                                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chat Modal */}
                {selectedUser && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                        <div className="card chat-modal-mobile-fix" style={{ width: '100%', maxWidth: '600px', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                            <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#202c33' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {selectedUser.profilePicture ? (
                                        <img src={`http://localhost:3000${selectedUser.profilePicture}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#e9edef' }}>{selectedUser.name}</div>
                                        <span style={{ fontSize: '0.75rem', color: '#8696a0' }}>
                                            {selectedUser.lastSeen ? `Last seen: ${new Date(selectedUser.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#8696a0', fontSize: '1.8rem', cursor: 'pointer', padding: '0 10px' }}>×</button>
                            </div>

                            <div className="chat-container-mobile-fix" style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                background: '#0b141a',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                                    opacity: 0.05,
                                    pointerEvents: 'none',
                                    zIndex: 0
                                }}></div>

                                {messages.map((msg, idx) => {
                                    const isMe = msg.senderId !== selectedUser.id;
                                    return (
                                        <div key={idx} className="chat-bubble-mobile-fix" style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                            gap: '8px',
                                            maxWidth: '85%',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            {!isMe && (
                                                selectedUser.profilePicture ? (
                                                    <img src={`http://localhost:3000${selectedUser.profilePicture}`} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginBottom: '4px' }} alt="" />
                                                ) : (
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', marginBottom: '4px' }}>
                                                        {selectedUser.name.charAt(0)}
                                                    </div>
                                                )
                                            )}

                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                                <div
                                                    onClick={(e) => {
                                                        if (!isMe) {
                                                            e.stopPropagation();
                                                            setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id);
                                                        }
                                                    }}
                                                    style={{
                                                        background: isMe ? '#005c4b' : '#202c33',
                                                        color: '#e9edef',
                                                        padding: '8px 12px',
                                                        borderRadius: '12px',
                                                        borderTopRightRadius: isMe ? '2px' : '12px',
                                                        borderTopLeftRadius: !isMe ? '2px' : '12px',
                                                        position: 'relative',
                                                        boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                                                        cursor: !isMe ? 'pointer' : 'default',
                                                        minWidth: '60px'
                                                    }}
                                                >
                                                    {msg.imageUrl && (
                                                        <img
                                                            src={`http://localhost:3000${msg.imageUrl}`}
                                                            style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '4px', cursor: 'pointer', display: 'block' }}
                                                            alt="Sent image"
                                                            onClick={(e) => { e.stopPropagation(); window.open(`http://localhost:3000${msg.imageUrl}`, '_blank'); }}
                                                        />
                                                    )}

                                                    {msg.fileUrl && (
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); window.open(`http://localhost:3000${msg.fileUrl}`, '_blank'); }}
                                                            style={{
                                                                background: 'rgba(0,0,0,0.2)',
                                                                padding: '10px',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                marginBottom: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                                                            <div style={{ overflow: 'hidden' }}>
                                                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.fileName || 'Document'}</div>
                                                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Click to view</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {msg.content && <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{msg.content}</div>}

                                                    {/* Reactions Display */}
                                                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '-10px',
                                                            [isMe ? 'left' : 'right']: '5px',
                                                            background: '#343f46',
                                                            padding: '1px 5px',
                                                            borderRadius: '10px',
                                                            fontSize: '11px',
                                                            display: 'flex',
                                                            gap: '2px',
                                                            border: '1px solid rgba(255,255,255,0.05)',
                                                            zIndex: 10,
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                                        }}>
                                                            {Object.values(msg.reactions).map((r, i) => <span key={i}>{r}</span>)}
                                                        </div>
                                                    )}

                                                    {/* Emoji Picker Popup */}
                                                    {showEmojiPicker === msg.id && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '-45px',
                                                            left: isMe ? 'auto' : '0',
                                                            right: isMe ? '0' : 'auto',
                                                            background: '#233138',
                                                            padding: '6px 10px',
                                                            borderRadius: '25px',
                                                            display: 'flex',
                                                            gap: '8px',
                                                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                            zIndex: 100,
                                                            border: '1px solid rgba(255,255,255,0.05)'
                                                        }}>
                                                            {['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => (
                                                                <span
                                                                    key={emoji}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleReaction(msg.id, emoji);
                                                                    }}
                                                                    style={{ cursor: 'pointer', fontSize: '1.3rem', transition: 'transform 0.1s' }}
                                                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                                                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                >
                                                                    {emoji}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                        <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMe && (
                                                            <span style={{ color: msg.isRead ? '#53bdeb' : '#8696a0', fontSize: '12px', fontWeight: 'bold', display: 'flex' }}>
                                                                {msg.isRead ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>

                            <div style={{ position: 'relative' }}>
                                {showAttachmentMenu && (
                                    <div className="attachment-menu">
                                        <div className="attachment-item" onClick={() => cameraInputRef.current.click()}>
                                            🤳 <span>Open Camera</span>
                                        </div>
                                        <div className="attachment-item" onClick={() => fileInputRef.current.click()}>
                                            🖼️ <span>Send Photo</span>
                                        </div>
                                        <div className="attachment-item" onClick={() => docInputRef.current.click()}>
                                            📄 <span>Choose Document</span>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={sendMessage} style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', alignItems: 'center', background: '#202c33' }}>
                                    <div
                                        style={{ cursor: 'pointer', opacity: 0.7, fontSize: '1.5rem', transform: showAttachmentMenu ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', color: '#8696a0' }}
                                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                    >
                                        ➕
                                    </div>

                                    {/* Hidden Inputs */}
                                    <input type="file" ref={cameraInputRef} style={{ display: 'none' }} accept="image/*" capture="camera" onChange={(e) => handleFileUpload(e.target.files[0])} />
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} />
                                    <input type="file" ref={docInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={(e) => handleFileUpload(e.target.files[0])} />

                                    <input
                                        className="input-field"
                                        style={{ margin: 0, borderRadius: '24px', padding: '10px 20px', background: '#2a3942', border: 'none', color: 'white' }}
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                            if (showAttachmentMenu) setShowAttachmentMenu(false);
                                        }}
                                    />
                                    <button type="submit" className="btn-primary" style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00a884', border: 'none' }}>
                                        ➜
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default AdminDashboard;
