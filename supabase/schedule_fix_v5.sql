-- ============================================================
-- SCHEDULE FIX v5
-- ============================================================

-- BRA vs HAI: 22:00 ART → 21:30 ART 19/06
UPDATE matches SET match_date = '2026-06-20 00:30:00+00' WHERE sort_order = 16;

-- TUR vs PAR: 01:00 ART 20/06 → 00:00 ART 20/06 (medianoche)
UPDATE matches SET match_date = '2026-06-20 03:00:00+00' WHERE sort_order = 22;

-- COL vs UZB: 17:00 ART 17/06 → 23:00 ART 17/06
UPDATE matches SET match_date = '2026-06-18 02:00:00+00' WHERE sort_order = 62;
