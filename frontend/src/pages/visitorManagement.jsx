import { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function VisitorManagement() {
    const [visitorName, setVisitorName] = useState("");
    const [visitorPhone, setVisitorPhone] = useState("");
    const [purpose, setPurpose] = useState("");
    const [customPurpose, setCustomPurpose] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [wing, setWing] = useState("");
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const purposeOptions = [
        "Delivery",
        "Guest/Visitor",
        "Service/Maintenance",
        "Courier",
        "Food Delivery",
        "Cab/Taxi",
        "Other"
    ];

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = logs.filter(log =>
                log.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.wing.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [searchTerm, logs]);

    const fetchLogs = async () => {
        try {
            const res = await api.get("/visitors");
            setLogs(res.data);
            setFilteredLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEntry = async (e) => {
        e.preventDefault();
        if (!visitorName || !flatNumber || !wing) return;

        const finalPurpose = purpose === "Other" ? customPurpose : purpose;

        try {
            setLoading(true);
            await api.post("/visitors", {
                visitorName,
                visitorPhone,
                purpose: finalPurpose || "Not specified",
                flatNumber,
                wing
            });

            setVisitorName("");
            setVisitorPhone("");
            setPurpose("");
            setCustomPurpose("");
            setFlatNumber("");
            setWing("");

            setSuccessMessage("✓ Entry logged successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            fetchLogs();
        } catch (err) {
            alert("Failed to log entry");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            return "Today, " + date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px', paddingTop: '80px' }}>
            <Navbar />
            <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="page-title" style={{ marginBottom: '24px' }}>🛡️ Visitor Management</h1>

                {successMessage && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                        color: '#10b981',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        textAlign: 'center',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        animation: 'slideDown 0.3s ease-out'
                    }}>
                        {successMessage}
                    </div>
                )}

                <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
                    <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>📝</span> New Visitor Entry
                    </h3>
                    <form onSubmit={handleEntry}>
                        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    Visitor Name *
                                </label>
                                <input
                                    className="input-field"
                                    placeholder="Enter visitor name"
                                    value={visitorName}
                                    onChange={e => setVisitorName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    Phone Number *
                                </label>
                                <input
                                    className="input-field"
                                    placeholder="Enter phone number"
                                    value={visitorPhone}
                                    onChange={e => setVisitorPhone(e.target.value)}
                                    required
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    title="Please enter valid 10 digit number"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    Purpose *
                                </label>
                                <select
                                    className="input-field"
                                    value={purpose}
                                    onChange={e => setPurpose(e.target.value)}
                                    required
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="">Select purpose</option>
                                    {purposeOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            {purpose === "Other" && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                        Specify Purpose *
                                    </label>
                                    <input
                                        className="input-field"
                                        placeholder="Enter purpose"
                                        value={customPurpose}
                                        onChange={e => setCustomPurpose(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    Wing *
                                </label>
                                <input
                                    className="input-field"
                                    placeholder="e.g., A, B, C"
                                    value={wing}
                                    onChange={e => setWing(e.target.value.toUpperCase())}
                                    required
                                    maxLength="2"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    Flat Number *
                                </label>
                                <input
                                    className="input-field"
                                    placeholder="e.g., 101, 202"
                                    value={flatNumber}
                                    onChange={e => setFlatNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                padding: '14px',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? "⏳ Logging Entry..." : "✓ Log Entry"}
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <span style={{ fontSize: '1.8rem' }}>📋</span> Recent Visitor Logs
                        </h3>
                        <input
                            className="input-field"
                            placeholder="🔍 Search by name, purpose, flat..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '300px', margin: 0 }}
                        />
                    </div>

                    {filteredLogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                            <p style={{ fontSize: '1.2rem' }}>📭 No visitor logs found</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Date & Time</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Visitor Name</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Phone</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Purpose</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Wing</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Flat No.</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>Logged By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log, index) => (
                                        <tr
                                            key={log.id}
                                            style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
                                        >
                                            <td style={{ padding: '12px', color: 'var(--text-dim)' }}>
                                                {formatDateTime(log.entryTime)}
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-color)', fontWeight: '500' }}>
                                                {log.visitorName}
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-dim)' }}>
                                                {log.visitorPhone || 'N/A'}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    background: 'rgba(99, 102, 241, 0.2)',
                                                    color: '#818cf8',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {log.purpose || 'Not specified'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>
                                                {log.wing}
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-color)', fontWeight: '600' }}>
                                                {log.flatNumber}
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-dim)' }}>
                                                {log.Watchman?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisitorManagement;
