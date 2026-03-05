import { useEffect, useState } from 'react';
import { getLeagues } from '../api';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FLAG = { England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Germany: '🇩🇪', Spain: '🇪🇸', France: '🇫🇷', Italy: '🇮🇹', Netherlands: '🇳🇱', Belgium: '🇧🇪', Turkey: '🇹🇷' };

export default function Leagues() {
    const [leagues, setLeagues] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { getLeagues().then(setLeagues); }, []);

    const byCountry = leagues.reduce((acc, l) => {
        acc[l.country] = acc[l.country] || [];
        acc[l.country].push(l);
        return acc;
    }, {});

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🏆 Leagues</h1>
                <p className="page-sub">All {leagues.length} leagues tracked across Europe</p>
            </div>
            {Object.entries(byCountry).map(([country, lgs]) => (
                <div key={country} style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{FLAG[country] || '🌍'}</span> {country}
                    </h2>
                    <div className="grid grid-3">
                        {lgs.map(l => (
                            <div key={l.id} className="card" style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/standings?league_id=${l.id}`)}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                <div style={{ fontSize: 26, marginBottom: 8 }}>{FLAG[country] || '🌍'}</div>
                                <div style={{ fontWeight: 700, fontSize: 16 }}>{l.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>FBref ID: {l.fbref_id || '—'}</div>
                                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                    <span className="badge badge-blue" onClick={e => { e.stopPropagation(); navigate(`/standings?league_id=${l.id}`) }}>Standings</span>
                                    <span className="badge badge-purple" onClick={e => { e.stopPropagation(); navigate(`/fixtures?league_id=${l.id}`) }}>Fixtures</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
