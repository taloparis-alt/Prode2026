-- ============================================================
-- SCHEDULE FIX v6 - Fase eliminatoria completa
-- Fuente: rosario3.com / 0221.com.ar (hora ART = UTC-3)
-- ============================================================

-- ── Corregir tiempos r32 (actualmente genéricos 20:00/23:00 UTC) ──

UPDATE matches SET match_date = '2026-06-28 19:00:00+00' WHERE sort_order = 73;  -- 16:00 ART 28/06
UPDATE matches SET match_date = '2026-06-29 17:00:00+00' WHERE sort_order = 74;  -- 14:00 ART 29/06
UPDATE matches SET match_date = '2026-06-29 20:30:00+00' WHERE sort_order = 75;  -- 17:30 ART 29/06
UPDATE matches SET match_date = '2026-06-30 01:00:00+00' WHERE sort_order = 76;  -- 22:00 ART 29/06
UPDATE matches SET match_date = '2026-06-30 17:00:00+00' WHERE sort_order = 77;  -- 14:00 ART 30/06
UPDATE matches SET match_date = '2026-06-30 21:00:00+00' WHERE sort_order = 78;  -- 18:00 ART 30/06
UPDATE matches SET match_date = '2026-07-01 01:00:00+00' WHERE sort_order = 79;  -- 22:00 ART 30/06
UPDATE matches SET match_date = '2026-07-01 16:00:00+00' WHERE sort_order = 80;  -- 13:00 ART 01/07
UPDATE matches SET match_date = '2026-07-01 20:00:00+00' WHERE sort_order = 81;  -- 17:00 ART 01/07
UPDATE matches SET match_date = '2026-07-02 00:00:00+00' WHERE sort_order = 82;  -- 21:00 ART 01/07
UPDATE matches SET match_date = '2026-07-02 19:00:00+00' WHERE sort_order = 83;  -- 16:00 ART 02/07
UPDATE matches SET match_date = '2026-07-02 23:00:00+00' WHERE sort_order = 84;  -- 20:00 ART 02/07
UPDATE matches SET match_date = '2026-07-03 03:00:00+00' WHERE sort_order = 85;  -- 00:00 ART 03/07
UPDATE matches SET match_date = '2026-07-03 18:00:00+00' WHERE sort_order = 86;  -- 15:00 ART 03/07
UPDATE matches SET match_date = '2026-07-03 22:00:00+00' WHERE sort_order = 87;  -- 19:00 ART 03/07
UPDATE matches SET match_date = '2026-07-04 01:30:00+00' WHERE sort_order = 88;  -- 22:30 ART 03/07

-- ── Insertar Octavos de Final (r16) ──

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES
('TBD','TBD','2026-07-04 17:00:00+00','r16',NULL,'Houston',89),        -- 14:00 ART 04/07
('TBD','TBD','2026-07-04 21:00:00+00','r16',NULL,'Filadelfia',90),     -- 18:00 ART 04/07
('TBD','TBD','2026-07-05 20:00:00+00','r16',NULL,'Nueva York/NJ',91),  -- 17:00 ART 05/07
('TBD','TBD','2026-07-06 00:00:00+00','r16',NULL,'Ciudad de México',92),-- 21:00 ART 05/07
('TBD','TBD','2026-07-06 19:00:00+00','r16',NULL,'Dallas',93),         -- 16:00 ART 06/07
('TBD','TBD','2026-07-07 00:00:00+00','r16',NULL,'Seattle',94),        -- 21:00 ART 06/07
('TBD','TBD','2026-07-07 16:00:00+00','r16',NULL,'Atlanta',95),        -- 13:00 ART 07/07
('TBD','TBD','2026-07-07 20:00:00+00','r16',NULL,'Vancouver',96)       -- 17:00 ART 07/07
ON CONFLICT DO NOTHING;

-- ── Insertar Cuartos de Final (qf) ──

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES
('TBD','TBD','2026-07-09 20:00:00+00','qf',NULL,'Boston',97),          -- 17:00 ART 09/07
('TBD','TBD','2026-07-10 19:00:00+00','qf',NULL,'Los Ángeles',98),     -- 16:00 ART 10/07
('TBD','TBD','2026-07-11 21:00:00+00','qf',NULL,'Miami',99),           -- 18:00 ART 11/07
('TBD','TBD','2026-07-12 01:00:00+00','qf',NULL,'Kansas City',100)     -- 22:00 ART 11/07
ON CONFLICT DO NOTHING;

-- ── Insertar Semifinales (sf) ──

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES
('TBD','TBD','2026-07-14 19:00:00+00','sf',NULL,'Dallas',101),         -- 16:00 ART 14/07
('TBD','TBD','2026-07-15 19:00:00+00','sf',NULL,'Atlanta',102)         -- 16:00 ART 15/07
ON CONFLICT DO NOTHING;

-- ── Insertar Tercer Puesto (third) ──

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES
('TBD','TBD','2026-07-18 21:00:00+00','third',NULL,'Miami',103)        -- 18:00 ART 18/07
ON CONFLICT DO NOTHING;

-- ── Insertar Final ──

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES
('TBD','TBD','2026-07-19 19:00:00+00','final',NULL,'Nueva York/NJ',104) -- 16:00 ART 19/07
ON CONFLICT DO NOTHING;
