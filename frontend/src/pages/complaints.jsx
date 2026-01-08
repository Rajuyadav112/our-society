import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({}); // Map of complaintId -> reply text
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchComplaints();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get("/complaints");
            setComplaints(res.data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return;

        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("userId", storedUser ? storedUser.id : 1);
            if (image) {
                formData.append("image", image);
            }

            await api.post("/complaints", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setTitle("");
            setDescription("");
            setImage(null);
            fetchComplaints();
        } catch (error) {
            console.error(error);
            alert("Failed to submit complaint");
        }
    };

    const handleReplySubmit = async (e, id) => {
        e.preventDefault();
        const text = replyText[id];
        if (!text) return;

        try {
            await api.put(`/complaints/${id}/reply`, { reply: text });
            setReplyText({ ...replyText, [id]: "" });
            fetchComplaints();
        } catch (error) {
            alert("Failed to send reply");
        }
    };

    const handleDeleteComplaint = async (id) => {
        if (!window.confirm("Are you sure you want to delete this complaint?")) return;
        try {
            await api.delete(`/complaints/${id}`);
            fetchComplaints();
        } catch (error) {
            alert("Failed to delete complaint");
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px', paddingTop: '80px' }}>
            <Navbar />

            <div className="container">
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '24px' }}>🔧 Complaints & Issues</h2>

                {/* File Complaint Form */}
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                    <h3 style={{ marginBottom: '16px' }}>File a Complaint</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="input-field"
                            placeholder="Issue Subject"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="input-field"
                            placeholder="Describe the issue in detail..."
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8 }}>Attach Image (Optional):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                style={{ color: 'white' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Submit Complaint</button>
                    </form>
                </div>

                {/* Complaints List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <p>Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p>No complaints found.</p>
                    ) : (
                        complaints.map((complaint) => (
                            <div key={complaint.id} className="glass-panel" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{complaint.title}</h3>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        background: complaint.status === 'Open' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: complaint.status === 'Open' ? '#f87171' : '#34d399'
                                    }}>
                                        {complaint.status}
                                    </span>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => handleDeleteComplaint(complaint.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                marginLeft: '10px',
                                                padding: 0
                                            }}
                                            title="Delete Complaint"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>

                                <p style={{ lineHeight: '1.6', opacity: 0.9, marginBottom: '16px' }}>{complaint.description}</p>

                                {complaint.imageUrl && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <img
                                            src={`http://localhost:3000${complaint.imageUrl}`}
                                            alt="Complaint Attachment"
                                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}

                                {/* Admin Reply Section */}
                                {complaint.adminReply && (
                                    <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #10b981' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px', color: '#10b981' }}>Admin Reply:</div>
                                        <p style={{ margin: 0 }}>{complaint.adminReply}</p>
                                    </div>
                                )}

                                {/* Admin Reply Input */}
                                {user?.role === 'admin' && !complaint.adminReply && ( // Simple logic: if already replied, don't show input
                                    <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                        <form onSubmit={(e) => handleReplySubmit(e, complaint.id)} style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                className="input-field"
                                                style={{ margin: 0, flex: 1, padding: '8px' }}
                                                placeholder="Write a reply..."
                                                value={replyText[complaint.id] || ""}
                                                onChange={(e) => setReplyText({ ...replyText, [complaint.id]: e.target.value })}
                                            />
                                            <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Reply</button>
                                        </form>
                                    </div>
                                )}

                                <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.5 }}>
                                    Filed on: {new Date(complaint.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Complaints;
