import { useEffect, useState } from 'react';
import { getMatches, getLeagues, deleteMatch } from '../api';
import { Trash2 } from 'lucide-react';

export default function Fixtures() {
    const [matches, setMatches] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [filters, setFilters] = useState({ league_id: '', season_id: '', team: '', date_from: '', date_to: '', limit: 50 });
    const [loading, setLoading] = useState(false);

    useEffect(() => { getLeagues().then(setLeagues); }, []);
    useEffect(() => { load(); }, [filters]);

    const load = () => {
        setLoading(true);
        const p = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        getMatches(p).then(r => { setMatches(r); setLoading(false); }).catch(() => setLoading(false));
    };

    const del = async (id) => {
        if (!confirm('Delete this match?')) return;
        await deleteMatch(id);
        setMatches(m => m.filter(x => x.id !== id));
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📅 Fixtures & Results</h1>
                <p className="page-sub">All matches — filter by league, season, team, or date</p>
            </div>

            <div className="filters">
                <select value={filters.league_id} onChange={e => setFilters(f => ({ ...f, league_id: e.target.value }))}>
                    <option value="">All Leagues</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <input className="input" placeholder="Team name..." value={filters.team}
                    onChange={e => setFilters(f => ({ ...f, team: e.target.value }))} />
                <input className="input" type="date" value={filters.date_from}
                    onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))} />
                <input className="input" type="date" value={filters.date_to}
                    onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))} />
                <select value={filters.limit} onChange={e => setFilters(f => ({ ...f, limit: e.target.value }))}>
                    {[25, 50, 100, 200].map(n => <option key={n} value={n}>{n} rows</option>)}
                </select>
            </div>

            {loading ? <div className="loading">Loading...</div> : (
                <div className="tbl-wrap">
                    <table>
                        <thead><tr>
                            <th>Date</th><th>GW</th><th>League</th><th>Season</th>
                            <th>Home</th><th>Score</th><th>Away</th>
                            <th>Venue</th><th>Attendance</th><th></th>
                        </tr></thead>
                        <tbody>
                            {matches.map(m => (
                                <tr key={m.id}>
                                    <td>{m.match_date || '—'}</td>
                                    <td>{m.gameweek ?? '—'}</td>
                                    <td><span className="badge badge-blue">{m.league}</span></td>
                                    <td>{m.season}</td>
                                    <td style={{ fontWeight: 600 }}>{m.home_team}</td>
                                    <td>
                                        {m.score_raw
                                            ? <span className="score"><span className="score-box">{m.home_score ?? '?'}</span>–<span className="score-box">{m.away_score ?? '?'}</span></span>
                                            : <span style={{ color: 'var(--muted)' }}>TBD</span>}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{m.away_team}</td>
                                    <td style={{ color: 'var(--muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.venue || '—'}</td>
                                    <td style={{ color: 'var(--muted)' }}>{m.attendance ? Number(m.attendance).toLocaleString() : '—'}</td>
                                    <td><button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => del(m.id)}><Trash2 size={13} /></button></td>
                                </tr>
                            ))}
                            {!matches.length && <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No matches found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
