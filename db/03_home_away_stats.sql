-- Migration: Add team_venue_stats table for home/away split tracking
-- Source: FBref stats page Table 2 (results_{season}_{fbref_id}_home_away)
-- Columns from FBref: rank, team, home_games, home_wins, home_ties, home_losses,
--   home_goals_for, home_goals_against, home_goal_diff, home_points,
--   away_games, away_wins, away_ties, away_losses, away_goals_for,
--   away_goals_against, away_goal_diff, away_points

CREATE TABLE IF NOT EXISTS team_venue_stats (
    id           SERIAL PRIMARY KEY,
    team_id      INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    league_id    INTEGER REFERENCES leagues(id),
    season_id    INTEGER REFERENCES seasons(id),
    venue        VARCHAR(10) NOT NULL CHECK (venue IN ('home', 'away')),
    games        SMALLINT,
    wins         SMALLINT,
    draws        SMALLINT,
    losses       SMALLINT,
    goals_for    SMALLINT,
    goals_against SMALLINT,
    goal_diff    SMALLINT,
    points       SMALLINT,
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (team_id, season_id, venue)
);

-- Index for fast league/season queries
CREATE INDEX IF NOT EXISTS idx_tvs_league_season ON team_venue_stats (league_id, season_id);
CREATE INDEX IF NOT EXISTS idx_tvs_team ON team_venue_stats (team_id);

-- Comment
COMMENT ON TABLE team_venue_stats IS
  'Home/away split from FBref Table 2 (results_home_away). Two rows per team per season: venue=home and venue=away.';
