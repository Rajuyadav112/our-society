import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function Messages() {
    const [admin, setAdmin] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchAdminAndMessages = async () => {
            try {
                const adminRes = await api.get("/users/admin");
                setAdmin(adminRes.data);

                const msgsRes = await api.get(`/messages/${adminRes.data.id}`);
                setMessages(msgsRes.data);
            } catch (err) {
                console.error("Failed to fetch chat data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminAndMessages();
    }, []);

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
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) return <div className="container">Loading Chat...</div>;

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <Navbar />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '24px' }}>Chat with Admin</h2>

                <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.length === 0 ? (
                            <p style={{ textAlign: 'center', opacity: 0.5 }}>No messages yet. Send a message to the Admin!</p>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.senderId === admin.id ? 'flex-start' : 'flex-end',
                                    background: msg.senderId === admin.id ? 'rgba(255,255,255,0.1)' : 'var(--accent-color)',
                                    padding: '10px 16px',
                                    borderRadius: msg.senderId === admin.id ? '0 12px 12px 12px' : '12px 12px 0 12px',
                                    maxWidth: '80%'
                                }}>
                                    {msg.content}
                                </div>
                            ))
                        )}
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
        </div>
    );
}

export default Messages;
