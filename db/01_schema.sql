-- ============================================================
-- FOOTBALL ANALYTICS DATABASE SCHEMA
-- PostgreSQL 16 | Supabase compatible
-- ============================================================

-- 1. LEAGUES
CREATE TABLE IF NOT EXISTS leagues (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    country    VARCHAR(100),
    fbref_id   INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEASONS
CREATE TABLE IF NOT EXISTS seasons (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    league_id  INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, league_id)
);
CREATE INDEX IF NOT EXISTS idx_teams_league ON teams(league_id);
CREATE INDEX IF NOT EXISTS idx_teams_name   ON teams(name);

-- 4. MATCHES (Fixtures & Results)
CREATE TABLE IF NOT EXISTS matches (
    id           SERIAL PRIMARY KEY,
    league_id    INTEGER NOT NULL REFERENCES leagues(id)  ON DELETE CASCADE,
    season_id    INTEGER NOT NULL REFERENCES seasons(id)  ON DELETE CASCADE,
    home_team_id INTEGER NOT NULL REFERENCES teams(id)    ON DELETE CASCADE,
    away_team_id INTEGER NOT NULL REFERENCES teams(id)    ON DELETE CASCADE,
    gameweek     SMALLINT,
    dayofweek    SMALLINT,
    match_date   DATE,
    start_time   TIME,
    home_score   SMALLINT,
    away_score   SMALLINT,
    score_raw    VARCHAR(30),
    attendance   INTEGER,
    venue        VARCHAR(255),
    referee      VARCHAR(255),
    round        VARCHAR(50),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(home_team_id, away_team_id, match_date)
);
CREATE INDEX IF NOT EXISTS idx_matches_league      ON matches(league_id);
CREATE INDEX IF NOT EXISTS idx_matches_season      ON matches(season_id);
CREATE INDEX IF NOT EXISTS idx_matches_date        ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_home_team   ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team   ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_league_date ON matches(league_id, match_date DESC);

-- 5. LEAGUE STANDINGS
CREATE TABLE IF NOT EXISTS league_standings (
    id              SERIAL PRIMARY KEY,
    league_id       INTEGER NOT NULL REFERENCES leagues(id)  ON DELETE CASCADE,
    season_id       INTEGER NOT NULL REFERENCES seasons(id)  ON DELETE CASCADE,
    team_id         INTEGER NOT NULL REFERENCES teams(id)    ON DELETE CASCADE,
    rank            SMALLINT,
    games           SMALLINT,
    wins            SMALLINT,
    ties            SMALLINT,
    losses          SMALLINT,
    goals_for       SMALLINT,
    goals_against   SMALLINT,
    goal_diff       SMALLINT,
    points          SMALLINT,
    points_avg      DECIMAL(4,2),
    home_away_split JSONB,
    scraped_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, league_id, season_id)
);
CREATE INDEX IF NOT EXISTS idx_standings_league_season ON league_standings(league_id, season_id);

-- 6. TEAM SQUAD STATS (for & against splits)
CREATE TABLE IF NOT EXISTS team_squad_stats (
    id             SERIAL PRIMARY KEY,
    team_id        INTEGER NOT NULL REFERENCES teams(id)    ON DELETE CASCADE,
    league_id      INTEGER NOT NULL REFERENCES leagues(id)  ON DELETE CASCADE,
    season_id      INTEGER NOT NULL REFERENCES seasons(id)  ON DELETE CASCADE,
    split          VARCHAR(10) NOT NULL CHECK (split IN ('for', 'against')),
    players_used   SMALLINT,
    avg_age        DECIMAL(4,1),
    possession     DECIMAL(4,1),
    games          SMALLINT,
    games_starts   INTEGER,
    minutes        INTEGER,
    minutes_90s    DECIMAL(6,1),
    goals          SMALLINT,
    assists        SMALLINT,
    -- Category payloads as JSONB for full flexibility
    standard_stats JSONB,
    goalkeeping    JSONB,
    shooting       JSONB,
    playing_time   JSONB,
    misc_stats     JSONB,
    scraped_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, season_id, split)
);
CREATE INDEX IF NOT EXISTS idx_squad_stats_team_season ON team_squad_stats(team_id, season_id);
CREATE INDEX IF NOT EXISTS idx_squad_stats_league      ON team_squad_stats(league_id);
CREATE INDEX IF NOT EXISTS idx_squad_stats_goals       ON team_squad_stats(goals DESC);
CREATE INDEX IF NOT EXISTS idx_squad_standard_gin      ON team_squad_stats USING GIN (standard_stats);
CREATE INDEX IF NOT EXISTS idx_squad_goalkeeping_gin   ON team_squad_stats USING GIN (goalkeeping);

-- 7. PLAYER STATS
CREATE TABLE IF NOT EXISTS player_stats (
    id             SERIAL PRIMARY KEY,
    player_name    VARCHAR(255) NOT NULL,
    nationality    VARCHAR(50),
    position       VARCHAR(50),
    team_id        INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    season_id      INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    age            SMALLINT,
    birth_year     SMALLINT,
    games          SMALLINT,
    games_starts   SMALLINT,
    minutes        INTEGER,
    minutes_90s    DECIMAL(5,1),
    goals          SMALLINT,
    assists        SMALLINT,
    standard_stats JSONB,
    scraped_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_name, team_id, season_id)
);
CREATE INDEX IF NOT EXISTS idx_player_team_season ON player_stats(team_id, season_id);
CREATE INDEX IF NOT EXISTS idx_player_name        ON player_stats(player_name);
CREATE INDEX IF NOT EXISTS idx_player_goals       ON player_stats(goals DESC);
CREATE INDEX IF NOT EXISTS idx_player_std_gin     ON player_stats USING GIN (standard_stats);

-- 8. SCRAPE LOG (audit trail)
CREATE TABLE IF NOT EXISTS scrape_log (
    id            SERIAL PRIMARY KEY,
    league_id     INTEGER REFERENCES leagues(id),
    season_id     INTEGER REFERENCES seasons(id),
    source_url    TEXT,
    page_type     VARCHAR(50),
    rows_inserted INTEGER DEFAULT 0,
    rows_updated  INTEGER DEFAULT 0,
    status        VARCHAR(20) DEFAULT 'success',
    error_message TEXT,
    scraped_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scrape_log_league ON scrape_log(league_id, scraped_at DESC);
