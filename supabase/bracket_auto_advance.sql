-- ============================================================
-- LLAVES AUTOMÁTICAS - El ganador avanza solo a la ronda siguiente
-- Mundial 2026 · Árbol oficial FIFA (r32 → r16 → qf → sf → final + 3º)
-- ============================================================
--
-- Deja todo el bracket "cableado": cada vez que cargás el resultado
-- de un partido de eliminatoria, el ganador (y el perdedor, para el
-- partido por el 3º puesto) se copia automáticamente al partido que
-- corresponde de la ronda siguiente.
--
-- Las llaves r16..final ya existen como TBD (schedule_fix_v6).
-- La numeración sort_order = número de partido FIFA (73..104).
--
-- PENALES: si un partido de eliminatoria termina EMPATADO, no se puede
-- saber quién avanzó con el marcador. Para esos casos cargás el ganador
-- en la columna winner_team_id (ver el final de este archivo).
--
-- Ejecutar este archivo COMPLETO una sola vez en el SQL Editor.
-- Es idempotente: se puede volver a correr sin romper nada.
-- ============================================================


-- ── 1) Columna para el ganador por penales (empates en eliminatoria) ──
ALTER TABLE matches ADD COLUMN IF NOT EXISTS winner_team_id TEXT REFERENCES teams(id);


-- ── 2) Mapa del árbol: qué partidos alimentan cada llave ──────────────
CREATE TABLE IF NOT EXISTS bracket_links (
  target_sort_order INT  NOT NULL,                       -- partido a completar
  slot              TEXT NOT NULL CHECK (slot IN ('home','away')),
  source_sort_order INT  NOT NULL,                       -- partido de origen
  take              TEXT NOT NULL DEFAULT 'winner' CHECK (take IN ('winner','loser')),
  PRIMARY KEY (target_sort_order, slot)
);

-- Cargar (o recargar) el árbol oficial
TRUNCATE bracket_links;
INSERT INTO bracket_links (target_sort_order, slot, source_sort_order, take) VALUES
-- Octavos (r16) ← ganadores de dieciseisavos
(89,'home',74,'winner'), (89,'away',77,'winner'),
(90,'home',73,'winner'), (90,'away',75,'winner'),
(91,'home',76,'winner'), (91,'away',78,'winner'),
(92,'home',79,'winner'), (92,'away',80,'winner'),
(93,'home',83,'winner'), (93,'away',84,'winner'),
(94,'home',81,'winner'), (94,'away',82,'winner'),
(95,'home',86,'winner'), (95,'away',88,'winner'),
(96,'home',85,'winner'), (96,'away',87,'winner'),
-- Cuartos (qf) ← ganadores de octavos
(97,'home',89,'winner'), (97,'away',90,'winner'),
(98,'home',93,'winner'), (98,'away',94,'winner'),
(99,'home',91,'winner'), (99,'away',92,'winner'),
(100,'home',95,'winner'),(100,'away',96,'winner'),
-- Semifinales (sf) ← ganadores de cuartos
(101,'home',97,'winner'),(101,'away',98,'winner'),
(102,'home',99,'winner'),(102,'away',100,'winner'),
-- Tercer puesto (third) ← PERDEDORES de las semifinales
(103,'home',101,'loser'),(103,'away',102,'loser'),
-- Final ← ganadores de las semifinales
(104,'home',101,'winner'),(104,'away',102,'winner');


-- ── 3) Función que propaga ganador/perdedor a la ronda siguiente ──────
CREATE OR REPLACE FUNCTION propagate_bracket()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_winner TEXT;
  v_loser  TEXT;
  lnk      RECORD;
  v_team   TEXT;
BEGIN
  -- Solo actuar con partido finalizado y marcador cargado
  IF NEW.status <> 'finished' OR NEW.home_score IS NULL OR NEW.away_score IS NULL THEN
    RETURN NEW;
  END IF;

  -- Determinar ganador y perdedor
  IF NEW.home_score > NEW.away_score THEN
    v_winner := NEW.home_team_id; v_loser := NEW.away_team_id;
  ELSIF NEW.away_score > NEW.home_score THEN
    v_winner := NEW.away_team_id; v_loser := NEW.home_team_id;
  ELSE
    -- Empate => definición por penales: requiere winner_team_id
    IF NEW.winner_team_id IS NULL THEN
      RETURN NEW;  -- sin ganador cargado todavía: no se propaga
    END IF;
    v_winner := NEW.winner_team_id;
    v_loser  := CASE WHEN NEW.winner_team_id = NEW.home_team_id
                     THEN NEW.away_team_id ELSE NEW.home_team_id END;
  END IF;

  -- Copiar al/los slot(s) de la ronda siguiente que dependan de este partido
  FOR lnk IN SELECT * FROM bracket_links WHERE source_sort_order = NEW.sort_order LOOP
    v_team := CASE WHEN lnk.take = 'loser' THEN v_loser ELSE v_winner END;
    IF lnk.slot = 'home' THEN
      UPDATE matches SET home_team_id = v_team WHERE sort_order = lnk.target_sort_order;
    ELSE
      UPDATE matches SET away_team_id = v_team WHERE sort_order = lnk.target_sort_order;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_match_finished_propagate ON matches;
CREATE TRIGGER on_match_finished_propagate
  AFTER UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION propagate_bracket();


-- ── 4) Backfill opcional: propagar partidos de KO ya finalizados ──────
-- (No-op si todavía no se jugó ninguna eliminatoria. Reaplica el árbol
--  si ya hubiera resultados cargados antes de instalar el trigger.)
UPDATE matches SET status = status
WHERE status = 'finished'
  AND stage IN ('r32','r16','qf','sf');


-- ============================================================
-- CÓMO CARGAR UN PARTIDO DEFINIDO POR PENALES (marcador empatado)
-- ============================================================
-- 1) Cargá el marcador normal desde el panel admin (ej. 1-1).
-- 2) Después, indicá quién pasó con UNA línea (reemplazá el id y el nº):
--
--    UPDATE matches SET winner_team_id = 'ARG' WHERE sort_order = 92;
--
--    -> El id es el de la tabla teams (ARG, BRA, ESP, ...). Eso dispara
--       la propagación y el ganador avanza solo. Si te equivocás, volvés
--       a correr la línea con el id correcto.
-- ============================================================
