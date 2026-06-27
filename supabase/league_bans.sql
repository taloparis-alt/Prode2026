-- ============================================================
-- LISTA DE BLOQUEO DE LIGAS - Prode Mundial 2026
-- Impide que un usuario eliminado vuelva a unirse a la liga
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ── Tabla de bloqueos ──
CREATE TABLE IF NOT EXISTS league_bans (
  league_id  UUID REFERENCES leagues(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  banned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (league_id, user_id)
);

ALTER TABLE league_bans ENABLE ROW LEVEL SECURITY;

-- El creador de la liga puede ver (y administrar vía service role) los bloqueos
DROP POLICY IF EXISTS "Creador ve bloqueos de su liga" ON league_bans;
CREATE POLICY "Creador ve bloqueos de su liga" ON league_bans
  FOR SELECT USING (
    auth.uid() IN (SELECT created_by FROM leagues WHERE id = league_id)
  );

-- Cada usuario puede ver sus propios bloqueos (para mostrar el mensaje al unirse)
DROP POLICY IF EXISTS "Usuario ve sus propios bloqueos" ON league_bans;
CREATE POLICY "Usuario ve sus propios bloqueos" ON league_bans
  FOR SELECT USING (auth.uid() = user_id);

-- ── Trigger: impedir que un usuario bloqueado se una ──
-- Funciona para cualquier vía de inserción (cliente, server, deep link).
CREATE OR REPLACE FUNCTION prevent_banned_join()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM league_bans
    WHERE league_id = NEW.league_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'BANNED: usuario bloqueado de esta liga';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_league_member_insert ON league_members;
CREATE TRIGGER on_league_member_insert
  BEFORE INSERT ON league_members
  FOR EACH ROW EXECUTE FUNCTION prevent_banned_join();
