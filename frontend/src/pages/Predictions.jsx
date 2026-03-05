import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Server, Activity, AlertTriangle, CheckCircle, Shield, Target } from 'lucide-react';
import { getPredictionStatus, trainPredictionModel, getPredictionFixtures, predictMatch } from '../api';

export default function Predictions() {
    const [status, setStatus] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [training, setTraining] = useState(false);

    // Prediction state
    const [predictingId, setPredictingId] = useState(null);
    const [activePrediction, setActivePrediction] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStatusAndFixtures();
    }, []);

    const loadStatusAndFixtures = async () => {
        setLoadingStats(true);
        try {
            const [statusRes, fixturesRes] = await Promise.all([
                getPredictionStatus().catch(() => null),
                getPredictionFixtures({ limit: 20 }).catch(() => ({ fixtures: [] }))
            ]);
            setStatus(statusRes);
            setFixtures(fixturesRes?.fixtures || []);
        } catch (e) {
            console.error(e);
        }
        setLoadingStats(false);
    };

    const handleTrainModel = async () => {
        setTraining(true);
        setError(null);
        try {
            const res = await trainPredictionModel();
            if (res.success) {
                await loadStatusAndFixtures();
            } else {
                setError(res.error || "Training failed");
            }
        } catch (err) {
            setError(err.message || "Failed to connect to training engine");
        }
        setTraining(false);
    };

    const handlePredict = async (fixture) => {
        setPredictingId(fixture.id);
        setError(null);
        setActivePrediction(null);

        try {
            const result = await predictMatch({
                home_team_id: fixture.home_team_id,
                away_team_id: fixture.away_team_id,
                league_id: fixture.league_id,
                season_id: fixture.season_id
            });
            setActivePrediction(result);
        } catch (err) {
            setError(err.message || "Prediction failed");
        }
        setPredictingId(null);
    };

    if (loadingStats) {
        return <div className="page-header"><h1 className="page-title">🔮 Loading Prediction Engine...</h1></div>;
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">🔮 Predictions</h1>
                    <p className="page-sub">ML-powered match outcome predictions</p>
                </div>
                {status && (
                    <div className="card" style={{ padding: '12px 20px', display: 'flex', gap: 16, alignItems: 'center', margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Server size={18} color={status.model_trained ? "#10b981" : "#f59e0b"} />
                            <div style={{ fontSize: 13, fontWeight: 600 }}>
                                {status.model_trained ? 'Model Active' : 'Model Untrained'}
                            </div>
                        </div>
                        {status.model_trained && (
                            <>
                                <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>
                                <div style={{ fontSize: 13 }}>
                                    <span style={{ color: 'var(--muted)' }}>Accuracy: </span>
                                    <strong>{(status.cv_accuracy * 100).toFixed(1)}%</strong>
                                </div>
                                <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>
                                <div style={{ fontSize: 13 }}>
                                    <span style={{ color: 'var(--muted)' }}>Trained on: </span>
                                    <strong>{status.n_samples} matches</strong>
                                </div>
                            </>
                        )}
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: 13 }}
                            onClick={handleTrainModel}
                            disabled={training}
                        >
                            <Zap size={14} /> {training ? 'Training...' : (status.model_trained ? 'Retrain Engine' : 'Train Engine')}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="card" style={{ marginBottom: 24, borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f87171' }}>
                        <AlertTriangle size={20} />
                        <span style={{ fontWeight: 600 }}>{error}</span>
                    </div>
                </div>
            )}

            {!status?.model_trained && !training && (
                <div className="card" style={{ marginBottom: 24, padding: 32, textAlign: 'center', background: 'linear-gradient(to right, rgba(16,185,129,0.05), rgba(59,130,246,0.05))' }}>
                    <Server size={48} color="var(--primary)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                    <h2 style={{ fontSize: 24, marginBottom: 8 }}>Prediction Engine Ready</h2>
                    <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '0 auto 24px' }}>
                        The ML engine needs to be trained on historical match data before it can generate predictions.
                        This extracts 70+ features per team and trains an XGBoost+RandomForest ensemble.
                    </p>
                    <button className="btn btn-primary" onClick={handleTrainModel} style={{ fontSize: 16, padding: '12px 24px' }}>
                        <Zap size={18} /> Train Model Now
                    </button>
                </div>
            )}

            {status?.model_trained && (
                <div style={{ display: 'grid', gridTemplateColumns: activePrediction ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>

                    {/* Left: Fixtures List */}
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <Target size={20} color="var(--primary)" /> Upcoming Fixtures
                        </h3>

                        {fixtures.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                                No upcoming unplayed fixtures found in the database.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {fixtures.map(f => (
                                    <div key={f.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: 16, background: 'var(--surface2)', borderRadius: 12,
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, display: 'flex', gap: 8 }}>
                                                <span>{f.league}</span>
                                                {f.match_date && <span>• {new Date(f.match_date).toLocaleDateString()}</span>}
                                            </div>
                                            <div style={{ fontSize: 16, fontWeight: 700 }}>
                                                {f.home_team} <span style={{ color: 'var(--muted)', fontWeight: 400, margin: '0 8px' }}>vs</span> {f.away_team}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handlePredict(f)}
                                            disabled={predictingId === f.id}
                                        >
                                            <Zap size={16} /> {predictingId === f.id ? 'Analyzing...' : 'Predict'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Active Prediction Result */}
                    {activePrediction && (
                        <div className="card" style={{ border: '1px solid var(--primary)', position: 'sticky', top: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div>
                                    <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                        Match Prediction
                                    </div>
                                    <h2 style={{ fontSize: 24, margin: 0 }}>
                                        {activePrediction.match.home_team} vs {activePrediction.match.away_team}
                                    </h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
                                        {activePrediction.predicted_outcome}
                                    </div>
                                    <div style={{ fontSize: 14, color: activePrediction.confidence === 'High' ? '#10b981' : '#f59e0b' }}>
                                        {activePrediction.confidence} Confidence ({(activePrediction.confidence_score * 100).toFixed(1)}%)
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                                <div style={{ background: 'var(--surface2)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Home Win</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: activePrediction.probabilities.home_win > 0.4 ? '#60a5fa' : 'var(--text)' }}>
                                        {(activePrediction.probabilities.home_win * 100).toFixed(0)}%
                                    </div>
                                </div>
                                <div style={{ background: 'var(--surface2)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Draw</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: activePrediction.probabilities.draw > 0.35 ? '#a78bfa' : 'var(--text)' }}>
                                        {(activePrediction.probabilities.draw * 100).toFixed(0)}%
                                    </div>
                                </div>
                                <div style={{ background: 'var(--surface2)', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Away Win</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: activePrediction.probabilities.away_win > 0.4 ? '#f472b6' : 'var(--text)' }}>
                                        {(activePrediction.probabilities.away_win * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: 16, borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Activity size={24} color="#3b82f6" />
                                    <div>
                                        <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>Expected Goals (xG)</div>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: '#bfdbfe' }}>
                                            {activePrediction.expected_goals.home_xg} - {activePrediction.expected_goals.away_xg}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>Score Prediction</div>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
                                        {activePrediction.expected_goals.predicted_score}
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Shield size={16} color="var(--primary)" /> Key Deciding Factors
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                                {activePrediction.key_factors.map((factor, idx) => (
                                    <div key={idx} style={{
                                        background: 'var(--surface2)', padding: '10px 14px',
                                        borderRadius: 8, fontSize: 14, display: 'flex', gap: 12, alignItems: 'flex-start'
                                    }}>
                                        <CheckCircle size={16} color={factor.includes('struggles') || factor.includes('collapse') ? '#ef4444' : '#10b981'} style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span>{factor}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 style={{ marginBottom: 12, fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase' }}>
                                Performance Patterns
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{ background: 'var(--surface2)', padding: 12, borderRadius: 8 }}>
                                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Clean Sheet Rate</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                        <span style={{ fontSize: 13 }}>{activePrediction.match.home_team}: <strong>{(activePrediction.team_comparison.home.clean_sheet_rate * 100).toFixed(0)}%</strong></span>
                                        <span style={{ fontSize: 13 }}>{activePrediction.match.away_team}: <strong>{(activePrediction.team_comparison.away.clean_sheet_rate * 100).toFixed(0)}%</strong></span>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--surface2)', padding: 12, borderRadius: 8 }}>
                                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Failure to Score (Blank)</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                        <span style={{ fontSize: 13 }}>{activePrediction.match.home_team}: <strong>{(activePrediction.team_comparison.home.blank_rate * 100).toFixed(0)}%</strong></span>
                                        <span style={{ fontSize: 13 }}>{activePrediction.match.away_team}: <strong>{(activePrediction.team_comparison.away.blank_rate * 100).toFixed(0)}%</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
