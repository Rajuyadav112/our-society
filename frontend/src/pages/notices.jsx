import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Notices() {
    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [commentInputs, setCommentInputs] = useState({}); // Map noticeId -> comment text
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        fetchUser();
        fetchNotices();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get("/users/me");
            setCurrentUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Sync state
        } catch (error) {
            console.error("Failed to fetch user");
        }
    };

    const fetchNotices = async () => {
        try {
            const res = await api.get("/notices");
            setNotices(res.data);
        } catch (error) {
            console.error("Failed to fetch notices", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            await api.post("/notices", { title, content });
            setTitle("");
            setContent("");
            fetchNotices(); // Refresh list
        } catch (error) {
            alert("Failed to post notice");
        }
    };

    const handleAddComment = async (noticeId) => {
        const text = commentInputs[noticeId];
        if (!text) return;

        try {
            await api.post(`/notices/${noticeId}/comments`, { content: text });
            setCommentInputs(prev => ({ ...prev, [noticeId]: '' }));
            fetchNotices(); // Refresh to see new comment
        } catch (error) {
            alert("Failed to post comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/notices/comments/${commentId}`);
            fetchNotices();
        } catch (error) {
            alert("Failed to delete comment");
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            <Navbar onLogout={handleLogout} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>📢 Notices Board</h2>

                {/* Post Notice Form (Simplified for demo) */}
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Post a New Notice</h3>
                    <form onSubmit={handlePostNotice}>
                        <input
                            className="input-field"
                            placeholder="Notice Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="input-field"
                            placeholder="Notice Content"
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ resize: 'vertical' }}
                        />
                        <button type="submit" className="btn-primary">Post Notice</button>
                    </form>
                </div>

                {/* Notices List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <p>Loading notices...</p>
                    ) : notices.length === 0 ? (
                        <p>No notices found.</p>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice.id} className="glass-panel" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>{notice.title}</h3>
                                    <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{notice.content}</p>
                                <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.5 }}>
                                    Posted by: {notice.postedBy}
                                </div>

                                {/* Comments Section */}
                                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Replies</h4>

                                    {notice.NoticeComments && notice.NoticeComments.map(comment => (
                                        <div key={comment.id} style={{ marginBottom: '8px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <small style={{ fontWeight: 'bold' }}>{comment.User?.name || 'User'}</small>

                                                {(currentUser?.role === 'admin' || currentUser?.id === comment.userId) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>{comment.content}</p>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <input
                                            className="input-field"
                                            placeholder="Write a reply..."
                                            style={{ padding: '8px', fontSize: '0.9rem' }}
                                            value={commentInputs[notice.id] || ''}
                                            onChange={e => setCommentInputs(prev => ({ ...prev, [notice.id]: e.target.value }))}
                                        />
                                        <button
                                            onClick={() => handleAddComment(notice.id)}
                                            className="btn-primary"
                                            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notices;
