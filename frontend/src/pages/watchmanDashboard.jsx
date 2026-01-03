import { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/navbar";

function WatchmanDashboard() {
    const [visitorName, setVisitorName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [flatNumber, setFlatNumber] = useState("");
    const [wing, setWing] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get("/visitors");
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEntry = async (e) => {
        e.preventDefault();
        if (!visitorName || !flatNumber || !wing) return;

        try {
            setLoading(true);
            await api.post("/visitors", { visitorName, purpose, flatNumber, wing });
            setVisitorName("");
            setPurpose("");
            setFlatNumber("");
            setWing("");
            fetchLogs();
            alert("Entry Logged!");
        } catch (err) {
            alert("Failed to log entry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1 className="page-title">Watchman Dashboard</h1>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3>New Visitor Entry</h3>
                <form onSubmit={handleEntry} style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '16px' }}>
                    <input className="input-field" placeholder="Visitor Name" value={visitorName} onChange={e => setVisitorName(e.target.value)} required />
                    <input className="input-field" placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />
                    <input className="input-field" placeholder="Wing" value={wing} onChange={e => setWing(e.target.value)} required />
                    <input className="input-field" placeholder="Flat Number" value={flatNumber} onChange={e => setFlatNumber(e.target.value)} required />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Logging..." : "Log Entry"}
                    </button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
                <h3>Recent Logs</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', color: 'white' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Time</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Visitor</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Flat</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Purpose</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Guard</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '8px' }}>{new Date(log.entryTime).toLocaleString()}</td>
                                <td style={{ padding: '8px' }}>{log.visitorName}</td>
                                <td style={{ padding: '8px' }}>{log.wing}-{log.flatNumber}</td>
                                <td style={{ padding: '8px' }}>{log.purpose}</td>
                                <td style={{ padding: '8px' }}>{log.Watchman?.name || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WatchmanDashboard;
