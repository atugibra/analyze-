import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, Trophy, Calendar, BarChart2, Users, Shield, TrendingUp, Zap, RefreshCw, Swords } from 'lucide-react';
import './index.css';
import Overview from './pages/Overview';
import Leagues from './pages/Leagues';
import Fixtures from './pages/Fixtures';
import Standings from './pages/Standings';
import TeamProfile from './pages/TeamProfile';
import SquadStats from './pages/SquadStats';
import Players from './pages/Players';
import Predictions from './pages/Predictions';
import SyncManager from './pages/SyncManager';
import HeadToHead from './pages/HeadToHead';

const NAV = [
    { to: '/', label: 'Overview', icon: Home },
    { to: '/leagues', label: 'Leagues', icon: Trophy },
    { to: '/fixtures', label: 'Fixtures', icon: Calendar },
    { to: '/standings', label: 'Standings', icon: BarChart2 },
    { to: '/squad-stats', label: 'Squad Stats', icon: Shield },
    { to: '/players', label: 'Players', icon: Users },
    { to: '/predictions', label: 'Predictions', icon: TrendingUp },
    { to: '/h2h', label: 'Head to Head', icon: Swords },
    { to: '/sync', label: 'Sync / Data', icon: RefreshCw },
];

function Sidebar() {
    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <Zap size={22} color="#3b82f6" />
                <span>FootballIQ</span>
            </div>
            <div className="nav-section">Navigation</div>
            {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                    <Icon size={17} /> {label}
                </NavLink>
            ))}
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="layout">
                <Sidebar />
                <main className="main">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/leagues" element={<Leagues />} />
                        <Route path="/fixtures" element={<Fixtures />} />
                        <Route path="/standings" element={<Standings />} />
                        <Route path="/team/:id" element={<TeamProfile />} />
                        <Route path="/squad-stats" element={<SquadStats />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/predictions" element={<Predictions />} />
                        <Route path="/h2h" element={<HeadToHead />} />
                        <Route path="/sync" element={<SyncManager />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
