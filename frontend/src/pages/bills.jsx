import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Bills() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await api.get("/bills");
            setBills(res.data);
        } catch (error) {
            console.error("Failed to fetch bills", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = (id) => {
        alert(`Payment gateway integration for Bill #${id} coming soon!`);
    };

    const handleSendReminders = async () => {
        try {
            const res = await api.post("/bills/reminders");
            alert(res.data.message);
        } catch (error) {
            console.error(error);
            alert("Failed to send reminders");
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            <Navbar onLogout={handleLogout} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '2rem' }}>💳 My Bills</h2>
                    {user?.role === 'admin' && (
                        <button
                            onClick={handleSendReminders}
                            className="btn-primary"
                            style={{ background: '#f59e0b', color: 'black' }}
                        >
                            🔔 Send Reminders
                        </button>
                    )}
                </div>

                {/* Bills List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {loading ? (
                        <p>Loading bills...</p>
                    ) : bills.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                            <p>No bills pending! 🎉</p>
                        </div>
                    ) : (
                        bills.map((bill) => (
                            <div key={bill.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{bill.type}</h3>
                                    <p style={{ opacity: 0.7, marginBottom: '4px' }}>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
                                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Member: {bill.User ? `${bill.User.name} (${bill.User.phone})` : 'N/A'}</p>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: bill.status === 'Pending' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: bill.status === 'Pending' ? '#f87171' : '#34d399'
                                    }}>
                                        {bill.status}
                                    </span>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
                                        ₹{bill.amount}
                                    </div>
                                    {bill.status === 'Pending' && (
                                        <button onClick={() => handlePay(bill.id)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bills;
