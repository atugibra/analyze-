import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import { getLeagues, getHealth } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
    const [leagues, setLeagues] = useState([]);
    const [health, setHealth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getLeagues().then(setLeagues).catch(console.error);
        getHealth().then(setHealth).catch(() => setHealth({ status: 'unhealthy' }));
    }, []);

    const stats = [
        { label: 'Leagues', value: leagues.length, icon: Trophy, color: '#3b82f6', bg: 'rgba(59,130,246,.15)' },
        { label: 'Seasons', value: 6, icon: Calendar, color: '#8b5cf6', bg: 'rgba(139,92,246,.15)' },
        { label: 'Teams', value: '200+', icon: Shield, color: '#22c55e', bg: 'rgba(34,197,94,.15)' },
        { label: 'Players', value: '5,000+', icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">⚡ FootballIQ Dashboard</h1>
                <p className="page-sub">Real-time football analytics platform</p>
            </div>

            {/* API Status */}
            <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                {health?.status === 'healthy'
                    ? <CheckCircle size={20} color="#22c55e" />
                    : <XCircle size={20} color="#ef4444" />}
                <span style={{ fontWeight: 600 }}>API Status:</span>
                <span style={{ color: health?.status === 'healthy' ? '#22c55e' : '#ef4444' }}>
                    {health?.status || 'Checking...'}
                </span>
                {health?.database && <span className="badge badge-green" style={{ marginLeft: 8 }}>{health.database}</span>}
            </div>

            {/* Stat cards */}
            <div className="grid grid-4" style={{ marginBottom: 28 }}>
                {stats.map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg }}>
                            <s.icon size={22} color={s.color} />
                        </div>
                        <div>
                            <div className="stat-val">{s.value}</div>
                            <div className="stat-lbl">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leagues grid */}
            <div className="card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>All Leagues</h2>
                <div className="grid grid-3">
                    {leagues.map(l => (
                        <div key={l.id} className="card card-sm" style={{ cursor: 'pointer', transition: 'all .2s' }}
                            onClick={() => navigate(`/standings?league_id=${l.id}`)}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{l.name}</div>
                            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l.country}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
