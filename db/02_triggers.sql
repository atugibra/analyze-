-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leagues_updated
    BEFORE UPDATE ON leagues
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_teams_updated
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_matches_updated
    BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Current season standings view (easy querying)
CREATE OR REPLACE VIEW v_latest_standings AS
SELECT
    ls.rank,
    l.name  AS league,
    s.name  AS season,
    t.name  AS team,
    ls.games, ls.wins, ls.ties, ls.losses,
    ls.goals_for, ls.goals_against, ls.goal_diff, ls.points
FROM league_standings ls
JOIN leagues l ON l.id = ls.league_id
JOIN seasons s ON s.id = ls.season_id
JOIN teams   t ON t.id = ls.team_id
ORDER BY l.name, ls.rank;

-- Recent fixture results view
CREATE OR REPLACE VIEW v_recent_results AS
SELECT
    m.match_date,
    l.name  AS league,
    s.name  AS season,
    m.gameweek,
    ht.name AS home_team,
    m.home_score,
    m.away_score,
    at.name AS away_team,
    m.venue,
    m.referee,
    m.score_raw
FROM matches m
JOIN leagues l ON l.id = m.league_id
JOIN seasons s ON s.id = m.season_id
JOIN teams  ht ON ht.id = m.home_team_id
JOIN teams  at ON at.id = m.away_team_id
WHERE m.home_score IS NOT NULL
ORDER BY m.match_date DESC;

-- Top scorers view
CREATE OR REPLACE VIEW v_top_scorers AS
SELECT
    ps.player_name,
    ps.nationality,
    ps.position,
    t.name   AS team,
    l.name   AS league,
    s.name   AS season,
    ps.goals,
    ps.assists,
    ps.games,
    ps.minutes
FROM player_stats ps
JOIN teams   t ON t.id = ps.team_id
JOIN leagues l ON l.id = t.league_id
JOIN seasons s ON s.id = ps.season_id
ORDER BY ps.goals DESC;
