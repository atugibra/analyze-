-- ============================================================
-- MIGRATION 02: Improvements based on FBref format analysis
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add is_played flag to distinguish completed vs upcoming fixtures
ALTER TABLE matches ADD COLUMN IF NOT EXISTS is_played BOOLEAN DEFAULT FALSE;

-- 2. Backfill: mark already-scored matches as played
UPDATE matches
SET is_played = TRUE
WHERE home_score IS NOT NULL AND away_score IS NOT NULL;

-- 3. Index for efficient "upcoming fixtures" queries
CREATE INDEX IF NOT EXISTS idx_matches_upcoming
    ON matches(match_date, is_played, league_id);

-- ============================================================
-- OPTIONAL: Remove stale seasons from a previous import
-- (run the SELECT first to verify which rows would be deleted)
-- ============================================================

-- Preview:
-- SELECT name FROM seasons WHERE name IN ('2020-2021','2021-2022','2022-2023','2023-2024');

-- Delete (safe — only removes rows with no child data):
-- DELETE FROM seasons
-- WHERE name IN ('2020-2021','2021-2022','2022-2023','2023-2024')
--   AND NOT EXISTS (SELECT 1 FROM matches m WHERE m.season_id = seasons.id)
--   AND NOT EXISTS (SELECT 1 FROM league_standings ls WHERE ls.season_id = seasons.id)
--   AND NOT EXISTS (SELECT 1 FROM team_squad_stats ts WHERE ts.season_id = seasons.id)
--   AND NOT EXISTS (SELECT 1 FROM player_stats p WHERE p.season_id = seasons.id);
