import { useEffect, useState } from 'react';
import { getStandings, getLeagues, getSeasons } from '../api';
import { useSearchParams } from 'react-router-dom';

export default function Standings() {
    const [standings, setStandings] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const leagueId = searchParams.get('league_id') || '';
    const seasonId = searchParams.get('season_id') || '';

    // Load leagues once
    useEffect(() => { getLeagues().then(setLeagues).catch(() => setLeagues([])); }, []);

    // Reload seasons whenever the selected league changes
    useEffect(() => {
        const p = {};
        if (leagueId) p.league_id = leagueId;
        getSeasons(p)
            .then(setSeasons)
            .catch(() => setSeasons([]));
    }, [leagueId]);

    // Reload standings
    useEffect(() => {
        setLoading(true);
        const p = {};
        if (leagueId) p.league_id = leagueId;
        if (seasonId) p.season_id = seasonId;
        getStandings(p)
            .then(rows => { setStandings(rows); setLoading(false); })
            .catch(() => { setStandings([]); setLoading(false); });
    }, [leagueId, seasonId]);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const setParams = (updates) =>
        setSearchParams({ league_id: leagueId, season_id: seasonId, ...updates });

    // Group rows: separate current season from previous
    const current = standings.filter(r => r.is_current);
    const previous = standings.filter(r => !r.is_current);

    // For "previous seasons", group by league + season label
    const prevGroups = previous.reduce((acc, row) => {
        const key = `${row.league} — ${row.season}`;
        acc[key] = acc[key] || [];
        acc[key].push(row);
        return acc;
    }, {});

    const isEmpty = !loading && standings.length === 0;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 League Standings</h1>
                <p className="page-sub">Current and historical standings</p>
            </div>

            {/* Filters */}
            <div className="filters" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                <select value={leagueId} onChange={e => setParams({ league_id: e.target.value, season_id: '' })}>
                    <option value="">All Leagues</option>
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>

                <select value={seasonId} onChange={e => setParams({ season_id: e.target.value })}
                    disabled={seasons.length === 0}>
                    <option value="">All Seasons</option>
                    {seasons.map(s => (
                        <option key={s.season_id} value={s.season_id}>
                            {s.season}{s.is_current ? ' ★ Current' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div style={{ color: 'var(--muted)', padding: '32px 0', textAlign: 'center' }}>Loading…</div>
            )}

            {isEmpty && (
                <div className="empty">No standings data. Sync data from the extension first.</div>
            )}

            {/* ── Current Season ─────────────────────────────────────────────── */}
            {current.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                            {current[0].league}
                        </h2>
                        <span style={{
                            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '.06em',
                            padding: '3px 10px',
                            borderRadius: 20,
                            textTransform: 'uppercase',
                        }}>● Current Season — {current[0].season}</span>
                    </div>
                    <StandingsTable rows={current} highlight />
                </div>
            )}

            {/* ── Previous Seasons ───────────────────────────────────────────── */}
            {Object.keys(prevGroups).length > 0 && (
                <div>
                    {/* Divider only when both sections are visible */}
                    {current.length > 0 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            marginBottom: 24, color: 'var(--muted)',
                        }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                                Previous Seasons
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        </div>
                    )}
                    {Object.entries(prevGroups).map(([key, rows]) => (
                        <PreviousSeasonGroup key={key} label={key} rows={rows} />
                    ))}
                </div>
            )}
        </div>
    );
}


// ── Sub-components ────────────────────────────────────────────────────────────

function StandingsTable({ rows, highlight = false }) {
    return (
        <div className="tbl-wrap" style={highlight ? {
            border: '2px solid #22c55e44',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 0 24px #22c55e18',
        } : {}}>
            <table>
                <thead>
                    <tr>
                        <th>#</th><th>Team</th><th>P</th>
                        <th>W</th><th>D</th><th>L</th>
                        <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={`${r.team}-${i}`} style={i === 0 && highlight ? {
                            background: 'rgba(34,197,94,.06)',
                        } : {}}>
                            <td style={{ color: 'var(--muted)' }}>{r.rank ?? i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{r.team}</td>
                            <td>{r.games}</td>
                            <td style={{ color: '#22c55e' }}>{r.wins}</td>
                            <td style={{ color: '#f59e0b' }}>{r.ties}</td>
                            <td style={{ color: '#ef4444' }}>{r.losses}</td>
                            <td>{r.goals_for}</td>
                            <td>{r.goals_against}</td>
                            <td style={{
                                fontWeight: 600,
                                color: r.goal_diff > 0 ? '#22c55e' : r.goal_diff < 0 ? '#ef4444' : 'var(--muted)',
                            }}>
                                {r.goal_diff > 0 ? '+' : ''}{r.goal_diff}
                            </td>
                            <td style={{ fontWeight: 800, fontSize: 15 }}>{r.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


function PreviousSeasonGroup({ label, rows }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ marginBottom: 20 }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    all: 'unset', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 15, fontWeight: 600, color: 'var(--muted)',
                    marginBottom: open ? 12 : 0,
                    transition: 'color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
                <span style={{
                    display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform .2s', fontSize: 12,
                }}>▶</span>
                {label}
                <span style={{
                    background: 'var(--surface2)', color: 'var(--muted)',
                    fontSize: 11, padding: '2px 8px', borderRadius: 12,
                }}>{rows.length} teams</span>
            </button>
            {open && <StandingsTable rows={rows} />}
        </div>
    );
}
