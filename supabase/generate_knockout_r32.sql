-- ============================================================
-- GENERAR ELIMINATORIAS - Dieciseisavos de Final (r32)
-- Mundial 2026 · Bracket oficial FIFA
-- ============================================================
--
-- Llena los 16 partidos r32 (sort_order 73-88, hoy TBD vs TBD)
-- con los 32 clasificados, calculados DESDE la DB:
--   - 1º y 2º de cada uno de los 12 grupos (24 equipos)
--   - los 8 mejores 3º de los 12 grupos
--
-- Criterios de orden (FIFA): puntos > diferencia de gol > goles a favor.
-- (El head-to-head y el fair-play NO se resuelven automáticamente; si
--  hubiera un empate exacto en esos 3 criterios, revisá el PASO 1.)
--
-- Cruces oficiales = estructura fija FIFA 2026. La asignación de los 8
-- terceros a cada slot está tomada de la tabla oficial para la
-- combinación real de grupos clasificados: B, D, E, F, I, J, K, L.
--
-- CÓMO USARLO en el SQL Editor de Supabase:
--   1) Ejecutá SOLO el PASO 1 y revisá posiciones y los 8 terceros.
--      Confirmá que los grupos de los terceros sean B,D,E,F,I,J,K,L.
--   2) Si todo cuadra, ejecutá el PASO 2 (UPDATE).
--   3) Ejecutá el PASO 3 para ver el bracket final con nombres.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PASO 1 — REVISIÓN (no modifica nada). Ejecutar y leer la salida.
-- ════════════════════════════════════════════════════════════
WITH gm AS (
  SELECT home_team_id AS team, group_letter AS grp, home_score AS gf, away_score AS ga,
         CASE WHEN home_score > away_score THEN 3 WHEN home_score = away_score THEN 1 ELSE 0 END AS pts
  FROM matches
  WHERE stage = 'group' AND status = 'finished' AND home_score IS NOT NULL AND away_score IS NOT NULL
  UNION ALL
  SELECT away_team_id, group_letter, away_score, home_score,
         CASE WHEN away_score > home_score THEN 3 WHEN away_score = home_score THEN 1 ELSE 0 END
  FROM matches
  WHERE stage = 'group' AND status = 'finished' AND home_score IS NOT NULL AND away_score IS NOT NULL
),
agg AS (
  SELECT team, grp,
         COUNT(*)                AS pj,
         SUM(pts)                AS pts,
         SUM(gf)                 AS gf,
         SUM(ga)                 AS ga,
         SUM(gf - ga)            AS gd
  FROM gm
  GROUP BY team, grp
),
ranked AS (
  SELECT a.*,
         ROW_NUMBER() OVER (PARTITION BY grp ORDER BY pts DESC, gd DESC, gf DESC, team) AS pos
  FROM agg a
),
thirds AS (
  SELECT r.*,
         ROW_NUMBER() OVER (ORDER BY pts DESC, gd DESC, gf DESC, team) AS third_rank
  FROM ranked r
  WHERE pos = 3
)
SELECT
  r.grp                                   AS grupo,
  r.pos                                   AS posicion,
  t.name                                  AS equipo,
  r.pj, r.pts, r.gf, r.ga, r.gd,
  CASE
    WHEN r.pos = 3 AND th.third_rank <= 8 THEN '✅ 3º CLASIFICADO (#' || th.third_rank || ')'
    WHEN r.pos = 3                        THEN '❌ 3º eliminado (#' || th.third_rank || ')'
    ELSE ''
  END                                     AS nota_tercero
FROM ranked r
JOIN teams t   ON t.id = r.team
LEFT JOIN thirds th ON th.team = r.team
ORDER BY r.grp, r.pos;


-- ════════════════════════════════════════════════════════════
-- PASO 2 — APLICAR. Llena los 16 partidos r32 con los clasificados.
-- ════════════════════════════════════════════════════════════
WITH gm AS (
  SELECT home_team_id AS team, group_letter AS grp, home_score AS gf, away_score AS ga,
         CASE WHEN home_score > away_score THEN 3 WHEN home_score = away_score THEN 1 ELSE 0 END AS pts
  FROM matches
  WHERE stage = 'group' AND status = 'finished' AND home_score IS NOT NULL AND away_score IS NOT NULL
  UNION ALL
  SELECT away_team_id, group_letter, away_score, home_score,
         CASE WHEN away_score > home_score THEN 3 WHEN away_score = home_score THEN 1 ELSE 0 END
  FROM matches
  WHERE stage = 'group' AND status = 'finished' AND home_score IS NOT NULL AND away_score IS NOT NULL
),
agg AS (
  SELECT team, grp, SUM(pts) AS pts, SUM(gf) AS gf, SUM(gf - ga) AS gd
  FROM gm GROUP BY team, grp
),
ranked AS (
  SELECT a.*,
         ROW_NUMBER() OVER (PARTITION BY grp ORDER BY pts DESC, gd DESC, gf DESC, team) AS pos
  FROM agg a
),
-- Código tipo '1E' (1º grupo E), '2C' (2º grupo C), '3D' (3º grupo D)
lk AS (
  SELECT (pos::text || grp) AS code, team
  FROM ranked
  WHERE pos <= 3
),
-- Estructura oficial del bracket FIFA 2026.
-- Terceros asignados según la tabla oficial para la combinación B,D,E,F,I,J,K,L.
slots(sort_order, home_code, away_code) AS (
  VALUES
    (73, '2A', '2B'),
    (74, '1E', '3D'),
    (75, '1F', '2C'),
    (76, '1C', '2F'),
    (77, '1I', '3F'),
    (78, '2E', '2I'),
    (79, '1A', '3E'),
    (80, '1L', '3K'),
    (81, '1D', '3B'),
    (82, '1G', '3I'),
    (83, '2K', '2L'),
    (84, '1H', '2J'),
    (85, '1B', '3J'),
    (86, '1J', '2H'),
    (87, '1K', '3L'),
    (88, '2D', '2G')
)
UPDATE matches m
SET home_team_id = lh.team,
    away_team_id = la.team,
    status       = 'scheduled'
FROM slots s
JOIN lk lh ON lh.code = s.home_code
JOIN lk la ON la.code = s.away_code
WHERE m.sort_order = s.sort_order
  AND m.stage = 'r32';


-- ════════════════════════════════════════════════════════════
-- PASO 3 — VERIFICACIÓN. Muestra el bracket final con nombres.
-- ════════════════════════════════════════════════════════════
SELECT
  m.sort_order                         AS partido,
  to_char(m.match_date, 'DD/MM HH24:MI') AS fecha_utc,
  m.venue,
  h.name                               AS local,
  a.name                               AS visitante
FROM matches m
JOIN teams h ON h.id = m.home_team_id
JOIN teams a ON a.id = m.away_team_id
WHERE m.stage = 'r32'
ORDER BY m.sort_order;
