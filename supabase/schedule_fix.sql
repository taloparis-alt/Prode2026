-- ============================================================
-- ACTUALIZACIÓN DE HORARIOS - Prode Mundial 2026
-- Horarios oficiales FIFA convertidos a UTC
-- Argentina = UTC-3 (restar 3hs para ver hora local)
-- ============================================================

-- 1. Borrar partidos de grupos existentes
DELETE FROM matches WHERE stage = 'group';

-- 2. Reinsertar con horarios correctos
-- Todos los horarios en UTC. Para ver en Argentina restar 3 horas.
-- Ej: 19:00 UTC = 16:00 ARG | 22:00 UTC = 19:00 ARG | 01:00 UTC = 22:00 ARG día anterior

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES

-- ══════════════════════════════════════════
-- GRUPO A: MEX · RSA · CZE · KOR
-- ══════════════════════════════════════════
-- Jornada 1
('MEX','RSA','2026-06-11 19:00:00+00','group','A','Ciudad de México, MEX',1),   -- 16:00 ARG
('KOR','CZE','2026-06-12 02:00:00+00','group','A','Guadalajara, MEX',2),         -- Jun11 23:00 ARG
-- Jornada 2
('CZE','RSA','2026-06-18 16:00:00+00','group','A','Atlanta, USA',3),             -- 13:00 ARG
('MEX','KOR','2026-06-19 03:00:00+00','group','A','Guadalajara, MEX',4),         -- Jun19 00:00 ARG
-- Jornada 3 (simultáneos)
('MEX','CZE','2026-06-24 23:00:00+00','group','A','Ciudad de México, MEX',5),   -- 20:00 ARG
('RSA','KOR','2026-06-24 23:00:00+00','group','A','Kansas City, USA',6),         -- 20:00 ARG

-- ══════════════════════════════════════════
-- GRUPO B: CAN · SUI · QAT · BIH
-- ══════════════════════════════════════════
('CAN','BIH','2026-06-12 19:00:00+00','group','B','Toronto, CAN',7),             -- 16:00 ARG
('QAT','SUI','2026-06-13 19:00:00+00','group','B','San Francisco, USA',8),       -- 16:00 ARG
('CAN','QAT','2026-06-18 22:00:00+00','group','B','Vancouver, CAN',9),           -- 19:00 ARG
('SUI','BIH','2026-06-18 19:00:00+00','group','B','Los Ángeles, USA',10),        -- 16:00 ARG
('SUI','CAN','2026-06-24 19:00:00+00','group','B','Vancouver, CAN',11),          -- 16:00 ARG
('BIH','QAT','2026-06-24 19:00:00+00','group','B','Seattle, USA',12),            -- 16:00 ARG

-- ══════════════════════════════════════════
-- GRUPO C: BRA · MAR · SCO · HAI
-- ══════════════════════════════════════════
('BRA','MAR','2026-06-13 22:00:00+00','group','C','Nueva York/NJ, USA',13),      -- 19:00 ARG
('HAI','SCO','2026-06-14 01:00:00+00','group','C','Boston, USA',14),             -- Jun13 22:00 ARG
('SCO','MAR','2026-06-19 22:00:00+00','group','C','Boston, USA',15),             -- 19:00 ARG
('BRA','HAI','2026-06-20 01:00:00+00','group','C','Filadelfia, USA',16),         -- Jun19 22:00 ARG
('SCO','BRA','2026-06-24 22:00:00+00','group','C','Miami, USA',17),              -- 19:00 ARG
('MAR','HAI','2026-06-24 22:00:00+00','group','C','Atlanta, USA',18),            -- 19:00 ARG

-- ══════════════════════════════════════════
-- GRUPO D: USA · PAR · TUR · AUS
-- ══════════════════════════════════════════
('USA','PAR','2026-06-13 01:00:00+00','group','D','Los Ángeles, USA',19),        -- Jun12 22:00 ARG
('AUS','TUR','2026-06-14 04:00:00+00','group','D','Vancouver, CAN',20),          -- Jun14 01:00 ARG
('USA','AUS','2026-06-19 19:00:00+00','group','D','Seattle, USA',21),            -- 16:00 ARG
('TUR','PAR','2026-06-20 04:00:00+00','group','D','San Francisco, USA',22),      -- Jun20 01:00 ARG
('USA','TUR','2026-06-25 19:00:00+00','group','D','Dallas, USA',23),             -- 16:00 ARG
('PAR','AUS','2026-06-25 19:00:00+00','group','D','Kansas City, USA',24),        -- 16:00 ARG

-- ══════════════════════════════════════════
-- GRUPO E: GER · ECU · CIV · CUW
-- ══════════════════════════════════════════
('GER','CUW','2026-06-14 17:00:00+00','group','E','Houston, USA',25),            -- 14:00 ARG
('CIV','ECU','2026-06-14 23:00:00+00','group','E','Kansas City, USA',26),        -- 20:00 ARG
('GER','CIV','2026-06-20 20:00:00+00','group','E','Toronto, CAN',27),            -- 17:00 ARG
('ECU','CUW','2026-06-21 00:00:00+00','group','E','Kansas City, USA',28),        -- Jun20 21:00 ARG
('GER','ECU','2026-06-25 22:00:00+00','group','E','Houston, USA',29),            -- 19:00 ARG
('CIV','CUW','2026-06-25 22:00:00+00','group','E','Dallas, USA',30),             -- 19:00 ARG

-- ══════════════════════════════════════════
-- GRUPO F: NED · JPN · SWE · TUN
-- ══════════════════════════════════════════
('NED','JPN','2026-06-14 20:00:00+00','group','F','Dallas, USA',31),             -- 17:00 ARG
('SWE','TUN','2026-06-15 01:00:00+00','group','F','Ciudad de México, MEX',32),   -- Jun14 22:00 ARG
('NED','SWE','2026-06-20 17:00:00+00','group','F','Houston, USA',33),            -- 14:00 ARG
('TUN','JPN','2026-06-21 02:00:00+00','group','F','Guadalajara, MEX',34),        -- Jun20 23:00 ARG
('NED','TUN','2026-06-25 22:00:00+00','group','F','Dallas, USA',35),             -- 19:00 ARG
('JPN','SWE','2026-06-26 01:00:00+00','group','F','Los Ángeles, USA',36),        -- Jun25 22:00 ARG

-- ══════════════════════════════════════════
-- GRUPO G: BEL · EGY · IRN · NZL
-- ══════════════════════════════════════════
('BEL','EGY','2026-06-15 17:00:00+00','group','G','Los Ángeles, USA',37),        -- 14:00 ARG
('IRN','NZL','2026-06-15 20:00:00+00','group','G','Seattle, USA',38),            -- 17:00 ARG
('BEL','IRN','2026-06-21 19:00:00+00','group','G','Dallas, USA',39),             -- 16:00 ARG
('NZL','EGY','2026-06-21 22:00:00+00','group','G','Boston, USA',40),             -- 19:00 ARG
('EGY','IRN','2026-06-27 03:00:00+00','group','G','Seattle, USA',41),            -- Jun27 00:00 ARG
('NZL','BEL','2026-06-27 03:00:00+00','group','G','Vancouver, CAN',42),          -- Jun27 00:00 ARG

-- ══════════════════════════════════════════
-- GRUPO H: ESP · URU · KSA · CPV
-- ══════════════════════════════════════════
('ESP','CPV','2026-06-15 23:00:00+00','group','H','Kansas City, USA',43),        -- 20:00 ARG
('URU','KSA','2026-06-16 02:00:00+00','group','H','Nueva York/NJ, USA',44),      -- Jun15 23:00 ARG
('ESP','KSA','2026-06-21 19:00:00+00','group','H','Dallas, USA',45),             -- 16:00 ARG
('CPV','URU','2026-06-21 22:00:00+00','group','H','Filadelfia, USA',46),         -- 19:00 ARG
('URU','ESP','2026-06-27 00:00:00+00','group','H','Guadalajara, MEX',47),        -- Jun26 21:00 ARG
('CPV','KSA','2026-06-27 00:00:00+00','group','H','Houston, USA',48),            -- Jun26 21:00 ARG

-- ══════════════════════════════════════════
-- GRUPO I: FRA · NOR · IRQ · SEN
-- ══════════════════════════════════════════
('FRA','NOR','2026-06-16 19:00:00+00','group','I','Nueva York/NJ, USA',49),      -- 16:00 ARG
('IRQ','SEN','2026-06-16 22:00:00+00','group','I','Los Ángeles, USA',50),        -- 19:00 ARG
('FRA','IRQ','2026-06-22 21:00:00+00','group','I','Filadelfia, USA',51),         -- 18:00 ARG
('NOR','SEN','2026-06-23 00:00:00+00','group','I','Nueva York/NJ, USA',52),      -- Jun22 21:00 ARG
('FRA','SEN','2026-06-26 19:00:00+00','group','I','Boston, USA',53),             -- 16:00 ARG
('NOR','IRQ','2026-06-26 19:00:00+00','group','I','Toronto, CAN',54),            -- 16:00 ARG

-- ══════════════════════════════════════════
-- GRUPO J: ARG · JOR · AUT · ALG
-- ══════════════════════════════════════════
('ARG','ALG','2026-06-17 19:00:00+00','group','J','Dallas, USA',55),             -- 16:00 ARG
('JOR','AUT','2026-06-17 22:00:00+00','group','J','Seattle, USA',56),            -- 19:00 ARG
('ARG','AUT','2026-06-22 17:00:00+00','group','J','Dallas, USA',57),             -- 14:00 ARG
('JOR','ALG','2026-06-23 03:00:00+00','group','J','San Francisco, USA',58),      -- Jun23 00:00 ARG
('JOR','ARG','2026-06-28 02:00:00+00','group','J','Dallas, USA',59),             -- Jun27 23:00 ARG
('ALG','AUT','2026-06-28 02:00:00+00','group','J','Kansas City, USA',60),        -- Jun27 23:00 ARG

-- ══════════════════════════════════════════
-- GRUPO K: POR · COL · UZB · COD
-- ══════════════════════════════════════════
('POR','COD','2026-06-16 23:00:00+00','group','K','Los Ángeles, USA',61),        -- 20:00 ARG
('COL','UZB','2026-06-17 02:00:00+00','group','K','Guadalajara, MEX',62),        -- Jun16 23:00 ARG
('POR','UZB','2026-06-23 17:00:00+00','group','K','Houston, USA',63),            -- 14:00 ARG
('COL','COD','2026-06-24 02:00:00+00','group','K','Guadalajara, MEX',64),        -- Jun23 23:00 ARG
('COL','POR','2026-06-27 23:30:00+00','group','K','Miami, USA',65),              -- 20:30 ARG
('COD','UZB','2026-06-27 23:30:00+00','group','K','Atlanta, USA',66),            -- 20:30 ARG

-- ══════════════════════════════════════════
-- GRUPO L: ENG · PAN · GHA · CRO
-- ══════════════════════════════════════════
('ENG','PAN','2026-06-17 23:00:00+00','group','L','Nueva York/NJ, USA',67),      -- 20:00 ARG
('GHA','CRO','2026-06-18 02:00:00+00','group','L','Toronto, CAN',68),            -- Jun17 23:00 ARG
('ENG','GHA','2026-06-23 20:00:00+00','group','L','Boston, USA',69),             -- 17:00 ARG
('PAN','CRO','2026-06-23 23:00:00+00','group','L','Toronto, CAN',70),            -- 20:00 ARG
('ENG','CRO','2026-06-27 21:00:00+00','group','L','Nueva York/NJ, USA',71),      -- 18:00 ARG
('PAN','GHA','2026-06-27 21:00:00+00','group','L','Filadelfia, USA',72)          -- 18:00 ARG

ON CONFLICT DO NOTHING;
