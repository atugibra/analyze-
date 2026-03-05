import { useEffect, useState } from 'react';
import { getPlayers, getTopScorers, getLeagues } from '../api';

export default function Players() {
    const [players, setPlayers] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [filters, setFilters] = useState({ league_id: '', season_id: '', position: '', min_goals: '', search: '', sort_by: 'goals', limit: 50 });
    const [loading, setLoading] = useState(false);

    useEffect(() => { getLeagues().then(setLeagues); }, []);
    useEffect(() => { load(); }, [filters]);

    const load = () => {
        setLoading(true);
        const p = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        getPlayers(p).then(r => { setPlayers(r); setLoading(false); }).catch(() => setLoading(false));
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">👤 Player Stats</h1>
                <p className="page-sub">Search, filter, and sort all player data</p>
            </div>
            <div className="filters">
                <input className="input" placeholder="Search player..." value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                <select value={filters.league_id} onChange={e => setFilters(f => ({ ...f, league_id: e.target.value }))}>
                    <option value="">All Leagues</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <select value={filters.position} onChange={e => setFilters(f => ({ ...f, position: e.target.value }))}>
                    <option value="">All Positions</option>
                    {['GK', 'DF', 'MF', 'FW'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input className="input" placeholder="Min goals" type="number" value={filters.min_goals}
                    onChange={e => setFilters(f => ({ ...f, min_goals: e.target.value }))} style={{ width: 110 }} />
                <select value={filters.sort_by} onChange={e => setFilters(f => ({ ...f, sort_by: e.target.value }))}>
                    {['goals', 'assists', 'games', 'minutes'].map(s => <option key={s} value={s}>Sort: {s}</option>)}
                </select>
                <select value={filters.limit} onChange={e => setFilters(f => ({ ...f, limit: e.target.value }))}>
                    {[25, 50, 100, 250].map(n => <option key={n} value={n}>{n} rows</option>)}
                </select>
            </div>
            {loading ? <div className="loading">Loading...</div> : (
                <div className="tbl-wrap">
                    <table>
                        <thead><tr>
                            <th>Player</th><th>Team</th><th>League</th><th>Pos</th><th>Age</th>
                            <th>Games</th><th>Min</th><th>Goals</th><th>Assists</th><th>G+A</th>
                        </tr></thead>
                        <tbody>
                            {players.map((p, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{p.player_name}</td>
                                    <td style={{ color: 'var(--muted)' }}>{p.team}</td>
                                    <td><span className="badge badge-blue">{p.league}</span></td>
                                    <td><span className="badge badge-purple">{p.position || '—'}</span></td>
                                    <td style={{ color: 'var(--muted)' }}>{p.age || '—'}</td>
                                    <td>{p.games || 0}</td>
                                    <td style={{ color: 'var(--muted)' }}>{p.minutes ? Number(p.minutes).toLocaleString() : '—'}</td>
                                    <td style={{ fontWeight: 700, color: '#22c55e' }}>{p.goals ?? 0}</td>
                                    <td style={{ fontWeight: 700, color: '#3b82f6' }}>{p.assists ?? 0}</td>
                                    <td style={{ fontWeight: 800 }}>{(p.goals ?? 0) + (p.assists ?? 0)}</td>
                                </tr>
                            ))}
                            {!players.length && <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No players found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
