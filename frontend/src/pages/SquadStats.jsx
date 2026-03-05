import { useEffect, useState } from 'react';
import { getSquadStats, getLeagues } from '../api';

export default function SquadStats() {
    const [stats, setStats] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [filters, setFilters] = useState({ league_id: '', season_id: '', split: '' });

    useEffect(() => { getLeagues().then(setLeagues); }, []);
    useEffect(() => {
        const p = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        getSquadStats(p).then(setStats);
    }, [filters]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🛡️ Squad Stats</h1>
                <p className="page-sub">Team statistics — attacking (for) and defensive (against)</p>
            </div>
            <div className="filters">
                <select value={filters.league_id} onChange={e => setFilters(f => ({ ...f, league_id: e.target.value }))}>
                    <option value="">All Leagues</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <select value={filters.split} onChange={e => setFilters(f => ({ ...f, split: e.target.value }))}>
                    <option value="">Both</option>
                    <option value="for">For (Attacking)</option>
                    <option value="against">Against (Defensive)</option>
                </select>
            </div>
            <div className="tbl-wrap">
                <table>
                    <thead><tr>
                        <th>Team</th><th>Type</th><th>League</th><th>Season</th>
                        <th>Games</th><th>Poss%</th><th>Goals</th><th>Assists</th>
                        <th>Players</th><th>Avg Age</th><th>Minutes</th>
                    </tr></thead>
                    <tbody>
                        {stats.map((s, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 600 }}>{s.team}</td>
                                <td>
                                    <span className={`badge ${s.split === 'for' ? 'badge-green' : 'badge-red'}`}>
                                        {s.split === 'for' ? 'For' : 'vs'}
                                    </span>
                                </td>
                                <td><span className="badge badge-blue">{s.league}</span></td>
                                <td style={{ color: 'var(--muted)' }}>{s.season}</td>
                                <td>{s.games}</td>
                                <td>{s.possession ?? '—'}</td>
                                <td style={{ fontWeight: 700, color: s.split === 'for' ? '#22c55e' : '#ef4444' }}>{s.goals ?? '—'}</td>
                                <td style={{ fontWeight: 700, color: '#3b82f6' }}>{s.assists ?? '—'}</td>
                                <td style={{ color: 'var(--muted)' }}>{s.players_used}</td>
                                <td style={{ color: 'var(--muted)' }}>{s.avg_age}</td>
                                <td style={{ color: 'var(--muted)' }}>{s.minutes ? Number(s.minutes).toLocaleString() : '—'}</td>
                            </tr>
                        ))}
                        {!stats.length && <tr><td colSpan={11} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No data. Sync first.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
