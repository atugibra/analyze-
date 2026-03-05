import { useState, useEffect } from 'react';
import { getTeams, getH2H } from '../api';
import { Swords } from 'lucide-react';

export default function HeadToHead() {
    const [teams, setTeams] = useState([]);
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => { getTeams().then(setTeams); }, []);

    const search = async () => {
        if (!teamA || !teamB) return;
        const r = await getH2H(teamA, teamB);
        setResults(r);
        setSearched(true);
    };

    const teamAName = teams.find(t => t.id == teamA)?.name;
    const teamBName = teams.find(t => t.id == teamB)?.name;

    const stats = results.reduce((acc, m) => {
        if (m.home_score == null) return acc;
        const aIsHome = m.home_team === teamAName;
        const aGoals = aIsHome ? m.home_score : m.away_score;
        const bGoals = aIsHome ? m.away_score : m.home_score;
        if (aGoals > bGoals) acc.aWins++;
        else if (bGoals > aGoals) acc.bWins++;
        else acc.draws++;
        return acc;
    }, { aWins: 0, bWins: 0, draws: 0 });

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">⚔️ Head to Head</h1>
                <p className="page-sub">Compare two teams historical record</p>
            </div>
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Team A</div>
                        <select value={teamA} onChange={e => setTeamA(e.target.value)} style={{ minWidth: 200 }}>
                            <option value="">Select team...</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.league})</option>)}
                        </select>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--muted)', paddingBottom: 4 }}>vs</div>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Team B</div>
                        <select value={teamB} onChange={e => setTeamB(e.target.value)} style={{ minWidth: 200 }}>
                            <option value="">Select team...</option>
                            {teams.filter(t => t.id != teamA).map(t => <option key={t.id} value={t.id}>{t.name} ({t.league})</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={search}><Swords size={15} /> Compare</button>
                </div>
            </div>

            {searched && (
                <>
                    {results.length > 0 && (
                        <div className="grid grid-3" style={{ marginBottom: 24 }}>
                            {[
                                { label: teamAName || 'Team A', value: stats.aWins, color: '#22c55e' },
                                { label: 'Draws', value: stats.draws, color: '#f59e0b' },
                                { label: teamBName || 'Team B', value: stats.bWins, color: '#ef4444' },
                            ].map(s => (
                                <div key={s.label} className="stat-card">
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        <div style={{ fontSize: 40, fontWeight: 800, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label} Wins</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="tbl-wrap">
                        <table>
                            <thead><tr>
                                <th>Date</th><th>Season</th><th>League</th>
                                <th>Home</th><th>Score</th><th>Away</th><th>Venue</th>
                            </tr></thead>
                            <tbody>
                                {results.map((m, i) => (
                                    <tr key={i}>
                                        <td>{m.match_date || '—'}</td>
                                        <td>{m.season}</td>
                                        <td><span className="badge badge-blue">{m.league}</span></td>
                                        <td style={{ fontWeight: 600 }}>{m.home_team}</td>
                                        <td><span className="score"><span className="score-box">{m.home_score ?? '?'}</span>–<span className="score-box">{m.away_score ?? '?'}</span></span></td>
                                        <td style={{ fontWeight: 600 }}>{m.away_team}</td>
                                        <td style={{ color: 'var(--muted)' }}>{m.venue || '—'}</td>
                                    </tr>
                                ))}
                                {!results.length && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No meetings found between these teams</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
