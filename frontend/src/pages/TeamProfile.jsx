import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeam, getSquadStats, getMatches } from '../api';
import { ArrowLeft } from 'lucide-react';

export default function TeamProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [stats, setStats] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        getTeam(id).then(setTeam);
        getSquadStats({ team_id: id }).then(setStats);
        getMatches({ team: '' }).then(r => setMatches(r.filter(m => m.home_team === team?.name || m.away_team === team?.name).slice(0, 10)));
    }, [id]);

    const forStats = stats.find(s => s.split === 'for');
    const againstStats = stats.find(s => s.split === 'against');

    return (
        <div>
            <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
                <ArrowLeft size={14} /> Back
            </button>
            {team && (
                <div className="page-header">
                    <h1 className="page-title">{team.name}</h1>
                    <p className="page-sub">{team.league} · ID: {team.id}</p>
                </div>
            )}
            <div className="grid grid-2" style={{ marginBottom: 24 }}>
                {[{ label: 'Attacking', data: forStats, color: '#22c55e' }, { label: 'Defensive (vs)', data: againstStats, color: '#ef4444' }].map(({ label, data, color }) => (
                    <div key={label} className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 16, color }}>{label} Stats</h3>
                        {data ? (
                            <table style={{ width: '100%', fontSize: 14 }}>
                                <tbody>
                                    {[['Games', data.games], ['Goals', data.goals], ['Assists', data.assists],
                                    ['Possession', data.possession ? data.possession + '%' : '—'],
                                    ['Minutes', data.minutes ? Number(data.minutes).toLocaleString() : '—'],
                                    ['Players Used', data.players_used], ['Avg Age', data.avg_age]
                                    ].map(([k, v]) => (
                                        <tr key={k}>
                                            <td style={{ color: 'var(--muted)', paddingBottom: 8 }}>{k}</td>
                                            <td style={{ fontWeight: 600, textAlign: 'right' }}>{v ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div style={{ color: 'var(--muted)' }}>No data</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
