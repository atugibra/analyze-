-- ============================================================
-- SEED DATA: Leagues & Seasons
-- ============================================================

INSERT INTO leagues (name, country, fbref_id) VALUES
    ('Premier League',    'England',   9),
    ('Championship',      'England',  10),
    ('League One',        'England',  15),
    ('League Two',        'England',  16),
    ('Bundesliga',        'Germany',  20),
    ('2. Bundesliga',     'Germany',  33),
    ('La Liga',           'Spain',    12),
    ('Segunda Division',  'Spain',    17),
    ('Ligue 1',           'France',   13),
    ('Ligue 2',           'France',   60),
    ('Serie A',           'Italy',    11),
    ('Serie B',           'Italy',    18),
    ('Eredivisie',        'Netherlands', 23),
    ('Belgian Pro League','Belgium',  37),
    ('Super Lig',         'Turkey',   26)
ON CONFLICT (name) DO NOTHING;

INSERT INTO seasons (name) VALUES
    ('2025-2026'),
    ('2024-2025'),
    ('2023-2024'),
    ('2022-2023'),
    ('2021-2022'),
    ('2020-2021')
ON CONFLICT (name) DO NOTHING;
