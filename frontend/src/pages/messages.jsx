import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function Messages() {
    const [admin, setAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const docInputRef = useRef(null);

    useEffect(() => {
        const fetchAdminAndMessages = async () => {
            try {
                const adminRes = await api.get("/users/admin");
                setAdmin(adminRes.data);

                const msgsRes = await api.get(`/messages/${adminRes.data.id}`);
                setMessages(msgsRes.data);

                await api.put(`/messages/mark-read/${adminRes.data.id}`);
            } catch (err) {
                console.error("Failed to fetch chat data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminAndMessages();
        updateLastSeen();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const updateLastSeen = async () => {
        try { await api.put("/users/profile", { lastSeen: new Date() }); } catch (e) { }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !admin) return;

        try {
            const res = await api.post("/messages/send", {
                receiverId: admin.id,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
            setShowAttachmentMenu(false);
        } catch (err) {
            console.error("Failed to send message", err);
            alert("Failed to send message. Please check connection.");
        }
    };

    const handleFileUpload = async (file) => {
        if (!file || !admin) return;
        const formData = new FormData();
        formData.append("receiverId", admin.id);
        formData.append("image", file); // Backend uses 'image' fieldname in middleware

        try {
            const res = await api.post("/messages/send", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages([...messages, res.data]);
            setShowAttachmentMenu(false);
        } catch (err) {
            console.error("Failed to upload file", err);
            alert("Failed to upload file. Please try again.");
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

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b141a', color: 'white' }}>Loading Chat...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: admin ? 'center' : 'flex-start', paddingTop: '70px', boxSizing: 'border-box' }}>
            <Navbar />

            <div className="chat-modal-mobile-fix" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: 'auto', width: '95%', height: '85vh', boxShadow: '0 12px 24px rgba(0,0,0,0.2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Chat Header */}
                <div style={{ padding: '15px 20px', background: '#202c33', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ position: 'relative' }}>
                        {admin?.profilePicture ? (
                            <img src={`http://localhost:3000${admin.profilePicture}`} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                        ) : (
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                A
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', border: '2px solid #202c33' }}></div>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e9edef' }}>Society Admin</h3>
                        <span style={{ fontSize: '0.8rem', color: '#8696a0' }}>Online</span>
                    </div>
                </div>

                {/* Messages Area */}
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

                    {messages.length === 0 ? (
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '50px', opacity: 0.5, color: '#e9edef' }}>
                            No messages yet. Say hello to the admin!
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.senderId !== admin?.id;
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
                                        admin?.profilePicture ? (
                                            <img src={`http://localhost:3000${admin.profilePicture}`} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginBottom: '4px' }} alt="" />
                                        ) : (
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', marginBottom: '4px' }}>
                                                A
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
                        })
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
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

                    <form onSubmit={sendMessage} style={{ padding: '15px 20px', background: '#202c33', display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div
                            style={{ cursor: 'pointer', opacity: 0.7, fontSize: '1.5rem', color: '#8696a0', transform: showAttachmentMenu ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}
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
    );
}

export default Messages;
