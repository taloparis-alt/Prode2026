-- ============================================================
-- SCHEDULE FIX v4 - Corrección completa de horarios y equipos
-- Fuente: rosario3.com fixture oficial Mundial 2026 (hora ART)
-- ============================================================

-- ══ GRUPO A ══
-- MEX vs KOR: 00:00 ART 19/06 → 22:00 ART 18/06
UPDATE matches SET match_date = '2026-06-19 01:00:00+00' WHERE sort_order = 4;
-- CZE vs MEX: 20:00 ART 24/06 → 22:00 ART 24/06
UPDATE matches SET match_date = '2026-06-25 01:00:00+00' WHERE sort_order = 5;
-- RSA vs KOR: 20:00 ART 24/06 → 22:00 ART 24/06
UPDATE matches SET match_date = '2026-06-25 01:00:00+00' WHERE sort_order = 6;

-- ══ GRUPO D ══
-- USA vs TUR: 16:00 ART 25/06 → 23:00 ART 25/06
UPDATE matches SET match_date = '2026-06-26 02:00:00+00' WHERE sort_order = 23;
-- PAR vs AUS: 16:00 ART 25/06 → 23:00 ART 25/06
UPDATE matches SET match_date = '2026-06-26 02:00:00+00' WHERE sort_order = 24;

-- ══ GRUPO E ══
-- GER vs ECU: 19:00 ART 25/06 → 17:00 ART 25/06
UPDATE matches SET match_date = '2026-06-25 20:00:00+00' WHERE sort_order = 29;
-- CIV vs CUW: 19:00 ART 25/06 → 17:00 ART 25/06
UPDATE matches SET match_date = '2026-06-25 20:00:00+00' WHERE sort_order = 30;

-- ══ GRUPO F ══
-- TUN vs JPN: 23:00 ART 20/06 → 01:00 ART 21/06
UPDATE matches SET match_date = '2026-06-21 04:00:00+00' WHERE sort_order = 34;
-- NED vs TUN: 19:00 ART 25/06 → 20:00 ART 25/06
UPDATE matches SET match_date = '2026-06-25 23:00:00+00' WHERE sort_order = 35;
-- JPN vs SWE: 22:00 ART 25/06 → 20:00 ART 25/06
UPDATE matches SET match_date = '2026-06-25 23:00:00+00' WHERE sort_order = 36;

-- ══ GRUPO G ══
-- BEL vs EGY: 19:00 ART → 16:00 ART 15/06
UPDATE matches SET match_date = '2026-06-15 19:00:00+00' WHERE sort_order = 37;
-- IRN vs NZL: 01:00 ART 16/06 → 22:00 ART 15/06
UPDATE matches SET match_date = '2026-06-16 01:00:00+00' WHERE sort_order = 38;
-- BEL vs IRN: 14:00 ART 21/06 → 16:00 ART 21/06
UPDATE matches SET match_date = '2026-06-21 19:00:00+00' WHERE sort_order = 39;
-- NZL vs EGY: 17:00 ART 21/06 → 22:00 ART 21/06
UPDATE matches SET match_date = '2026-06-22 01:00:00+00' WHERE sort_order = 40;

-- ══ GRUPO H ══
-- ESP vs CPV: 14:00 ART → 13:00 ART 15/06
UPDATE matches SET match_date = '2026-06-15 16:00:00+00' WHERE sort_order = 43;
-- ESP vs KSA: 20:00 ART 21/06 → 13:00 ART 21/06
UPDATE matches SET match_date = '2026-06-21 16:00:00+00' WHERE sort_order = 45;
-- CPV vs URU: 23:00 ART 21/06 → 19:00 ART 21/06
UPDATE matches SET match_date = '2026-06-21 22:00:00+00' WHERE sort_order = 46;

-- ══ GRUPO L (equipos equivocados + horarios) ══
-- Primero borrar predicciones de los partidos con equipos incorrectos
DELETE FROM predictions WHERE match_id IN (
  SELECT id FROM matches WHERE sort_order IN (67, 68, 71, 72)
);

-- sort 67: ENG vs PAN (mal) → ENG vs CRO, 17:00 ART 17/06
UPDATE matches
  SET home_team_id = 'ENG', away_team_id = 'CRO',
      match_date = '2026-06-17 20:00:00+00'
  WHERE sort_order = 67;

-- sort 68: GHA vs CRO (mal) → GHA vs PAN, 20:00 ART 17/06
UPDATE matches
  SET home_team_id = 'GHA', away_team_id = 'PAN',
      match_date = '2026-06-17 23:00:00+00'
  WHERE sort_order = 68;

-- sort 71: ENG vs CRO (mal) → PAN vs ENG, 18:00 ART 27/06 (hora ok)
UPDATE matches
  SET home_team_id = 'PAN', away_team_id = 'ENG'
  WHERE sort_order = 71;

-- sort 72: PAN vs GHA (mal) → CRO vs GHA, 18:00 ART 27/06 (hora ok)
UPDATE matches
  SET home_team_id = 'CRO', away_team_id = 'GHA'
  WHERE sort_order = 72;
