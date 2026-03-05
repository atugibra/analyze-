import { useState, useEffect } from 'react';
import { getHealth, getLeagues } from '../api';
import { CheckCircle, XCircle, RefreshCw, Download, Trash2, AlertTriangle } from 'lucide-react';

export default function SyncManager() {
    const [health, setHealth] = useState(null);
    const [leagues, setLeagues] = useState([]);
    const [log, setLog] = useState([]);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        getHealth().then(setHealth).catch(() => setHealth({ status: 'unhealthy' }));
        getLeagues()
            .then(data => setLeagues(Array.isArray(data) ? data : []))
            .catch(err => { console.error('getLeagues failed:', err); setLeagues([]); });
    }, []);

    const addLog = (msg, type = 'info') => setLog(l => [{ msg, type, time: new Date().toLocaleTimeString() }, ...l]);

    const checkHealth = async () => {
        const h = await getHealth().catch(() => ({ status: 'unhealthy' }));
        setHealth(h);
        addLog(`API Health: ${h.status}`, h.status === 'healthy' ? 'success' : 'error');
    };

    const triggerImport = () => {
        addLog('To import your Excel file, run:', 'info');
        addLog('cd football-analytics/importer', 'code');
        addLog('python import_excel.py --file "C:/Users/LATIB PRO/Downloads/download (1).xlsx"', 'code');
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🔄 Sync & Data Manager</h1>
                <p className="page-sub">Monitor API health, trigger imports, manage your data</p>
            </div>

            {/* Health card */}
            <div className="grid grid-2" style={{ marginBottom: 24 }}>
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>API Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        {health?.status === 'healthy'
                            ? <CheckCircle size={28} color="#22c55e" />
                            : <XCircle size={28} color="#ef4444" />}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>{health?.status || 'Checking...'}</div>
                            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Database: {health?.database || '—'}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost" onClick={checkHealth}><RefreshCw size={14} /> Refresh</button>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Data Overview</h3>
                    <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>Leagues in database: <strong style={{ color: 'var(--text)' }}>{leagues.length}</strong></div>
                    <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                        <div>Extension → Sync button → API → Database</div>
                    </div>
                </div>
            </div>

            {/* Import guide */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} /> Import Excel Data
                </h3>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Run this command in your terminal:</div>
                    <code style={{ fontSize: 13, color: '#93c5fd', display: 'block' }}>
                        cd football-analytics/importer
                    </code>
                    <code style={{ fontSize: 13, color: '#93c5fd', display: 'block', marginTop: 6 }}>
                        python import_excel.py --file "C:/Users/LATIB PRO/Downloads/download (1).xlsx"
                    </code>
                </div>
                <button className="btn btn-primary" onClick={triggerImport}><Download size={14} /> Show Command</button>
            </div>

            {/* Extension sync setup */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} color="#f59e0b" /> Chrome Extension Setup
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
                    The extension is already configured to sync to the live Railway API:
                </p>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Current setting in <code>backend_sync.js</code> line 9:</div>
                    <code style={{ fontSize: 13, color: '#86efac', display: 'block' }}>this.backendUrl = 'https://football-analytics-production-5b3d.up.railway.app';</code>
                    <div style={{ fontSize: 12, color: '#22c55e', marginTop: 8 }}>✅ Already pointing to Railway — no changes needed</div>
                </div>
            </div>

            {/* Activity log */}
            {log.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 700 }}>Activity Log</h3>
                        <button className="btn btn-ghost" onClick={() => setLog([])}><Trash2 size={13} /> Clear</button>
                    </div>
                    {log.map((l, i) => (
                        <div key={i} style={{
                            padding: '8px 12px', borderRadius: 6, marginBottom: 6, fontSize: 13,
                            background: l.type === 'success' ? 'rgba(34,197,94,.1)' : l.type === 'error' ? 'rgba(239,68,68,.1)' : l.type === 'code' ? 'var(--surface2)' : 'var(--surface2)',
                            color: l.type === 'code' ? '#93c5fd' : l.type === 'success' ? '#86efac' : l.type === 'error' ? '#fca5a5' : 'var(--muted)',
                            fontFamily: l.type === 'code' ? 'monospace' : 'inherit',
                            display: 'flex', justifyContent: 'space-between'
                        }}>
                            <span>{l.msg}</span>
                            <span style={{ fontSize: 11, opacity: .7 }}>{l.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
