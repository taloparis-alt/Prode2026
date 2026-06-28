-- ============================================================
-- SCHEDULE FIX v7 - Cronograma REAL de eliminatorias (Mundial 2026)
-- Fuente: cronograma oficial por estadio (cada sede con su huso).
-- Se guarda en UTC; la app lo muestra en horario de Argentina (UTC−3).
-- sort_order = número de partido FIFA (73..104).
--
-- Reemplaza los horarios aproximados de v6 (que asumían orden
-- cronológico por número de partido, lo cual NO se cumple).
--
-- A la derecha, entre comentarios, la hora resultante en ARGENTINA.
-- Ejecutar COMPLETO en el SQL Editor de Supabase.
-- ============================================================

-- ── Dieciseisavos (r32) ──────────────────────────────────────
UPDATE matches SET match_date='2026-06-28 19:00:00+00', venue='SoFi Stadium, Los Ángeles'        WHERE sort_order=73; -- ART 16:00 28/06
UPDATE matches SET match_date='2026-06-29 17:00:00+00', venue='NRG Stadium, Houston'              WHERE sort_order=76; -- ART 14:00 29/06
UPDATE matches SET match_date='2026-06-29 20:30:00+00', venue='Gillette Stadium, Boston'          WHERE sort_order=74; -- ART 17:30 29/06
UPDATE matches SET match_date='2026-06-30 01:00:00+00', venue='Estadio BBVA, Monterrey'           WHERE sort_order=75; -- ART 22:00 29/06
UPDATE matches SET match_date='2026-06-30 17:00:00+00', venue='AT&T Stadium, Dallas'              WHERE sort_order=78; -- ART 14:00 30/06
UPDATE matches SET match_date='2026-06-30 21:00:00+00', venue='MetLife Stadium, Nueva York/NJ'    WHERE sort_order=77; -- ART 18:00 30/06
UPDATE matches SET match_date='2026-07-01 01:00:00+00', venue='Estadio Azteca, Ciudad de México'  WHERE sort_order=79; -- ART 22:00 30/06
UPDATE matches SET match_date='2026-07-01 16:00:00+00', venue='Mercedes-Benz Stadium, Atlanta'    WHERE sort_order=80; -- ART 13:00 01/07
UPDATE matches SET match_date='2026-07-01 20:00:00+00', venue='Lumen Field, Seattle'              WHERE sort_order=82; -- ART 17:00 01/07
UPDATE matches SET match_date='2026-07-02 00:00:00+00', venue='Levi''s Stadium, San Francisco'    WHERE sort_order=81; -- ART 21:00 01/07
UPDATE matches SET match_date='2026-07-02 19:00:00+00', venue='SoFi Stadium, Los Ángeles'         WHERE sort_order=84; -- ART 16:00 02/07
UPDATE matches SET match_date='2026-07-02 23:00:00+00', venue='BMO Field, Toronto'                WHERE sort_order=83; -- ART 20:00 02/07
UPDATE matches SET match_date='2026-07-03 03:00:00+00', venue='BC Place, Vancouver'               WHERE sort_order=85; -- ART 00:00 03/07
UPDATE matches SET match_date='2026-07-03 18:00:00+00', venue='AT&T Stadium, Dallas'              WHERE sort_order=88; -- ART 15:00 03/07
UPDATE matches SET match_date='2026-07-03 22:00:00+00', venue='Hard Rock Stadium, Miami'          WHERE sort_order=86; -- ART 19:00 03/07
UPDATE matches SET match_date='2026-07-04 01:30:00+00', venue='Arrowhead Stadium, Kansas City'    WHERE sort_order=87; -- ART 22:30 03/07

-- ── Octavos (r16) ────────────────────────────────────────────
UPDATE matches SET match_date='2026-07-04 17:00:00+00', venue='NRG Stadium, Houston'              WHERE sort_order=90; -- ART 14:00 04/07
UPDATE matches SET match_date='2026-07-04 21:00:00+00', venue='Lincoln Financial Field, Filadelfia' WHERE sort_order=89; -- ART 18:00 04/07
UPDATE matches SET match_date='2026-07-05 20:00:00+00', venue='MetLife Stadium, Nueva York/NJ'    WHERE sort_order=91; -- ART 17:00 05/07
UPDATE matches SET match_date='2026-07-06 00:00:00+00', venue='Estadio Azteca, Ciudad de México'  WHERE sort_order=92; -- ART 21:00 05/07
UPDATE matches SET match_date='2026-07-06 19:00:00+00', venue='AT&T Stadium, Dallas'              WHERE sort_order=93; -- ART 16:00 06/07
UPDATE matches SET match_date='2026-07-07 00:00:00+00', venue='Lumen Field, Seattle'              WHERE sort_order=94; -- ART 21:00 06/07
UPDATE matches SET match_date='2026-07-07 16:00:00+00', venue='Mercedes-Benz Stadium, Atlanta'    WHERE sort_order=95; -- ART 13:00 07/07
UPDATE matches SET match_date='2026-07-07 20:00:00+00', venue='BC Place, Vancouver'               WHERE sort_order=96; -- ART 17:00 07/07

-- ── Cuartos (qf) ─────────────────────────────────────────────
UPDATE matches SET match_date='2026-07-09 20:00:00+00', venue='Gillette Stadium, Boston'          WHERE sort_order=97;  -- ART 17:00 09/07
UPDATE matches SET match_date='2026-07-10 19:00:00+00', venue='SoFi Stadium, Los Ángeles'         WHERE sort_order=98;  -- ART 16:00 10/07
UPDATE matches SET match_date='2026-07-11 21:00:00+00', venue='Hard Rock Stadium, Miami'          WHERE sort_order=99;  -- ART 18:00 11/07
UPDATE matches SET match_date='2026-07-12 01:00:00+00', venue='Arrowhead Stadium, Kansas City'    WHERE sort_order=100; -- ART 22:00 11/07

-- ── Semifinales (sf) ─────────────────────────────────────────
UPDATE matches SET match_date='2026-07-14 19:00:00+00', venue='AT&T Stadium, Dallas'              WHERE sort_order=101; -- ART 16:00 14/07
UPDATE matches SET match_date='2026-07-15 19:00:00+00', venue='Mercedes-Benz Stadium, Atlanta'    WHERE sort_order=102; -- ART 16:00 15/07

-- ── Tercer puesto (third) ────────────────────────────────────
UPDATE matches SET match_date='2026-07-18 21:00:00+00', venue='Hard Rock Stadium, Miami'          WHERE sort_order=103; -- ART 18:00 18/07

-- ── Final ────────────────────────────────────────────────────
UPDATE matches SET match_date='2026-07-19 19:00:00+00', venue='MetLife Stadium, Nueva York/NJ'    WHERE sort_order=104; -- ART 16:00 19/07

-- ── Verificación: ver todo el cronograma en horario de Argentina ──
SELECT
  sort_order AS partido,
  stage,
  to_char(match_date AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM HH24:MI') AS arg,
  venue
FROM matches
WHERE stage IN ('r32','r16','qf','sf','third','final')
ORDER BY match_date;
