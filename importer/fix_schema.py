"""
Fix schema: drop all blocking views, widen SMALLINT → INTEGER, recreate views.
Run once before import_excel.py.
"""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../api/.env"))
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur  = conn.cursor()

# ── 1. Drop all views that block ALTER TABLE ──────────────────────────────────
drop_views = """
DROP VIEW IF EXISTS v_top_scorers    CASCADE;
DROP VIEW IF EXISTS v_recent_results CASCADE;
DROP VIEW IF EXISTS v_latest_standings CASCADE;
DROP VIEW IF EXISTS v_head_to_head  CASCADE;
"""
cur.execute(drop_views); conn.commit()
print("  OK  : Dropped all blocking views")

# ── 2. Widen SMALLINT columns to INTEGER ─────────────────────────────────────
alters = [
    # player_stats
    "ALTER TABLE player_stats ALTER COLUMN games        TYPE INTEGER",
    "ALTER TABLE player_stats ALTER COLUMN games_starts TYPE INTEGER",
    "ALTER TABLE player_stats ALTER COLUMN goals        TYPE INTEGER",
    "ALTER TABLE player_stats ALTER COLUMN assists      TYPE INTEGER",
    "ALTER TABLE player_stats ALTER COLUMN age          TYPE INTEGER",
    "ALTER TABLE player_stats ALTER COLUMN birth_year   TYPE INTEGER",
    # matches
    "ALTER TABLE matches ALTER COLUMN home_score   TYPE INTEGER",
    "ALTER TABLE matches ALTER COLUMN away_score   TYPE INTEGER",
    "ALTER TABLE matches ALTER COLUMN gameweek     TYPE INTEGER",
    "ALTER TABLE matches ALTER COLUMN dayofweek    TYPE INTEGER",
    "ALTER TABLE matches ALTER COLUMN attendance   TYPE INTEGER",
    # league_standings
    "ALTER TABLE league_standings ALTER COLUMN rank          TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN games         TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN wins          TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN ties          TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN losses        TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN goals_for     TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN goals_against TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN goal_diff     TYPE INTEGER",
    "ALTER TABLE league_standings ALTER COLUMN points        TYPE INTEGER",
    # team_squad_stats
    "ALTER TABLE team_squad_stats ALTER COLUMN players_used TYPE INTEGER",
    "ALTER TABLE team_squad_stats ALTER COLUMN games        TYPE INTEGER",
    "ALTER TABLE team_squad_stats ALTER COLUMN goals        TYPE INTEGER",
    "ALTER TABLE team_squad_stats ALTER COLUMN assists      TYPE INTEGER",
]
for sql in alters:
    try:
        cur.execute(sql); conn.commit()
        print(f"  OK  : {sql}")
    except Exception as e:
        conn.rollback()
        print(f"  SKIP: {e}")

# ── 3. Recreate views ─────────────────────────────────────────────────────────
views = {
    "v_top_scorers": """
        CREATE OR REPLACE VIEW v_top_scorers AS
        SELECT ps.player_name, ps.nationality, ps.position,
               t.name AS team, s.name AS season,
               ps.goals, ps.assists, ps.games, ps.minutes
        FROM player_stats ps
        LEFT JOIN teams   t ON t.id = ps.team_id
        LEFT JOIN seasons s ON s.id = ps.season_id
        ORDER BY ps.goals DESC NULLS LAST
    """,
    "v_recent_results": """
        CREATE OR REPLACE VIEW v_recent_results AS
        SELECT m.id, m.match_date, m.gameweek,
               ht.name AS home_team, at.name AS away_team,
               m.home_score, m.away_score, m.score_raw,
               m.venue, m.referee, l.name AS league, s.name AS season
        FROM matches m
        JOIN teams   ht ON ht.id = m.home_team_id
        JOIN teams   at ON at.id = m.away_team_id
        JOIN leagues  l ON l.id  = m.league_id
        JOIN seasons  s ON s.id  = m.season_id
        ORDER BY m.match_date DESC NULLS LAST
    """,
    "v_latest_standings": """
        CREATE OR REPLACE VIEW v_latest_standings AS
        SELECT ls.rank, t.name AS team, l.name AS league, s.name AS season,
               ls.games, ls.wins, ls.ties, ls.losses,
               ls.goals_for, ls.goals_against, ls.goal_diff, ls.points
        FROM league_standings ls
        JOIN teams   t ON t.id = ls.team_id
        JOIN leagues l ON l.id = ls.league_id
        JOIN seasons s ON s.id = ls.season_id
        ORDER BY ls.league_id, ls.season_id, ls.rank
    """,
}
for name, sql in views.items():
    try:
        cur.execute(sql); conn.commit()
        print(f"  OK  : Recreated {name}")
    except Exception as e:
        conn.rollback()
        print(f"  WARN: Could not recreate {name}: {e}")

conn.close()
print("\nSchema fix complete. Ready to import.")
