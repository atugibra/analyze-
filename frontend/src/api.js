// Primary: set VITE_API_URL in your Vercel dashboard (or .env.local for dev)
// Fallback: your Render.com URL (update this once Render gives you a URL)
let API = import.meta.env.VITE_API_URL || 'https://YOUR-APP-NAME.onrender.com';
if (API.startsWith('http://') && !API.includes('localhost')) {
    API = API.replace('http://', 'https://');
}

const req = async (path, opts = {}) => {
    const res = await fetch(`${API}${path}`, opts);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const getLeagues = () => req('/api/leagues');
export const getLeague = (id) => req(`/api/leagues/${id}`);
export const getMatches = (params = {}) => req(`/api/matches?${new URLSearchParams(params)}`);
export const getMatch = (id) => req(`/api/matches/${id}`);
export const updateMatch = (id, data) => req(`/api/matches/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteMatch = (id) => req(`/api/matches/${id}`, { method: 'DELETE' });
export const getTeams = (params = {}) => req(`/api/teams?${new URLSearchParams(params)}`);
export const getTeam = (id) => req(`/api/teams/${id}`);
export const getH2H = (teamId, oppId) => req(`/api/teams/${teamId}/head-to-head/${oppId}`);
export const getStandings = (params = {}) => req(`/api/standings?${new URLSearchParams(params)}`);
export const getSeasons = (params = {}) => req(`/api/standings/seasons?${new URLSearchParams(params)}`);
export const getSquadStats = (params = {}) => req(`/api/squad-stats?${new URLSearchParams(params)}`);
export const getPlayers = (params = {}) => req(`/api/players?${new URLSearchParams(params)}`);
export const getTopScorers = (params = {}) => req(`/api/players/top-scorers?${new URLSearchParams(params)}`);
export const getHealth = () => req('/api/health');
export const syncAll = (payload) => req('/api/sync/all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

// Predictions API
export const getPredictionStatus = () => req('/api/predictions/status');
export const trainPredictionModel = (payload = {}) => req('/api/predictions/train', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
export const predictMatch = (payload) => req('/api/predictions/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
export const getUpcomingPredictions = (params = {}) => req(`/api/predictions/upcoming?${new URLSearchParams(params)}`);
export const getPredictionFixtures = (params = {}) => req(`/api/predictions/fixtures?${new URLSearchParams(params)}`);
