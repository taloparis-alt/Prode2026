-- ============================================================
-- SCHEDULE CORREGIDO v2 - Prode Mundial 2026
-- Fuente: ESPN / NBC Sports / FIFA oficial
-- Todos en UTC. Argentina = UTC-3 (restar 3hs)
-- ============================================================

DELETE FROM matches WHERE stage = 'group';

INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES

-- ══ GRUPO A: MEX · RSA · CZE · KOR ══
('MEX','RSA','2026-06-11 19:00:00+00','group','A','Ciudad de México',1),    -- Jue 11 Jun 16:00 ARG
('KOR','CZE','2026-06-12 02:00:00+00','group','A','Guadalajara',2),          -- Jue 11 Jun 23:00 ARG
('CZE','RSA','2026-06-18 16:00:00+00','group','A','Atlanta',3),              -- Jue 18 Jun 13:00 ARG
('MEX','KOR','2026-06-19 03:00:00+00','group','A','Guadalajara',4),          -- Vie 19 Jun 00:00 ARG
('MEX','CZE','2026-06-24 23:00:00+00','group','A','Ciudad de México',5),     -- Mie 24 Jun 20:00 ARG
('RSA','KOR','2026-06-24 23:00:00+00','group','A','Kansas City',6),          -- Mie 24 Jun 20:00 ARG

-- ══ GRUPO B: CAN · SUI · QAT · BIH ══
('CAN','BIH','2026-06-12 19:00:00+00','group','B','Toronto',7),              -- Vie 12 Jun 16:00 ARG
('QAT','SUI','2026-06-13 19:00:00+00','group','B','San Francisco',8),        -- Sab 13 Jun 16:00 ARG
('SUI','BIH','2026-06-18 19:00:00+00','group','B','Los Ángeles',9),          -- Mie 18 Jun 16:00 ARG
('CAN','QAT','2026-06-18 22:00:00+00','group','B','Vancouver',10),           -- Mie 18 Jun 19:00 ARG
('SUI','CAN','2026-06-24 19:00:00+00','group','B','Vancouver',11),           -- Mie 24 Jun 16:00 ARG
('BIH','QAT','2026-06-24 19:00:00+00','group','B','Seattle',12),             -- Mie 24 Jun 16:00 ARG

-- ══ GRUPO C: BRA · MAR · SCO · HAI ══
('BRA','MAR','2026-06-13 22:00:00+00','group','C','Nueva York/NJ',13),       -- Sab 13 Jun 19:00 ARG
('HAI','SCO','2026-06-14 01:00:00+00','group','C','Boston',14),              -- Sab 13 Jun 22:00 ARG
('SCO','MAR','2026-06-19 22:00:00+00','group','C','Boston',15),              -- Jue 19 Jun 19:00 ARG
('BRA','HAI','2026-06-20 01:00:00+00','group','C','Filadelfia',16),          -- Jue 19 Jun 22:00 ARG
('SCO','BRA','2026-06-24 22:00:00+00','group','C','Miami',17),               -- Mie 24 Jun 19:00 ARG
('MAR','HAI','2026-06-24 22:00:00+00','group','C','Atlanta',18),             -- Mie 24 Jun 19:00 ARG

-- ══ GRUPO D: USA · PAR · TUR · AUS ══
('USA','PAR','2026-06-13 01:00:00+00','group','D','Los Ángeles',19),         -- Vie 12 Jun 22:00 ARG
('AUS','TUR','2026-06-14 04:00:00+00','group','D','Vancouver',20),           -- Dom 14 Jun 01:00 ARG
('USA','AUS','2026-06-19 19:00:00+00','group','D','Seattle',21),             -- Jue 19 Jun 16:00 ARG
('TUR','PAR','2026-06-20 04:00:00+00','group','D','San Francisco',22),       -- Vie 20 Jun 01:00 ARG
('USA','TUR','2026-06-25 19:00:00+00','group','D','Dallas',23),              -- Jue 25 Jun 16:00 ARG
('PAR','AUS','2026-06-25 19:00:00+00','group','D','Kansas City',24),         -- Jue 25 Jun 16:00 ARG

-- ══ GRUPO E: GER · ECU · CIV · CUW ══
('GER','CUW','2026-06-14 17:00:00+00','group','E','Houston',25),             -- Dom 14 Jun 14:00 ARG
('CIV','ECU','2026-06-14 23:00:00+00','group','E','Filadelfia',26),          -- Dom 14 Jun 20:00 ARG
('GER','CIV','2026-06-20 20:00:00+00','group','E','Toronto',27),             -- Vie 20 Jun 17:00 ARG
('ECU','CUW','2026-06-21 00:00:00+00','group','E','Kansas City',28),         -- Vie 20 Jun 21:00 ARG
('GER','ECU','2026-06-25 22:00:00+00','group','E','Houston',29),             -- Jue 25 Jun 19:00 ARG
('CIV','CUW','2026-06-25 22:00:00+00','group','E','Dallas',30),              -- Jue 25 Jun 19:00 ARG

-- ══ GRUPO F: NED · JPN · SWE · TUN ══
('NED','JPN','2026-06-14 20:00:00+00','group','F','Dallas',31),              -- Dom 14 Jun 17:00 ARG
('SWE','TUN','2026-06-15 02:00:00+00','group','F','Guadalajara',32),         -- Dom 14 Jun 23:00 ARG
('NED','SWE','2026-06-20 17:00:00+00','group','F','Houston',33),             -- Vie 20 Jun 14:00 ARG
('TUN','JPN','2026-06-21 02:00:00+00','group','F','Guadalajara',34),         -- Vie 20 Jun 23:00 ARG
('NED','TUN','2026-06-25 22:00:00+00','group','F','Dallas',35),              -- Jue 25 Jun 19:00 ARG
('JPN','SWE','2026-06-26 01:00:00+00','group','F','Los Ángeles',36),         -- Jue 25 Jun 22:00 ARG

-- ══ GRUPO G: BEL · EGY · IRN · NZL ══
('BEL','EGY','2026-06-15 22:00:00+00','group','G','Seattle',37),             -- Dom 15 Jun 19:00 ARG
('IRN','NZL','2026-06-16 04:00:00+00','group','G','Los Ángeles',38),         -- Lun 16 Jun 01:00 ARG
('BEL','IRN','2026-06-21 17:00:00+00','group','G','Dallas',39),              -- Sab 21 Jun 14:00 ARG
('NZL','EGY','2026-06-21 20:00:00+00','group','G','Boston',40),              -- Sab 21 Jun 17:00 ARG
('EGY','IRN','2026-06-27 03:00:00+00','group','G','Seattle',41),             -- Vie 27 Jun 00:00 ARG
('NZL','BEL','2026-06-27 03:00:00+00','group','G','Vancouver',42),           -- Vie 27 Jun 00:00 ARG

-- ══ GRUPO H: ESP · URU · KSA · CPV ══
('ESP','CPV','2026-06-15 17:00:00+00','group','H','Atlanta',43),             -- Dom 15 Jun 14:00 ARG
('KSA','URU','2026-06-15 22:00:00+00','group','H','Miami',44),               -- Dom 15 Jun 19:00 ARG
('ESP','KSA','2026-06-21 23:00:00+00','group','H','Dallas',45),              -- Sab 21 Jun 20:00 ARG
('CPV','URU','2026-06-22 02:00:00+00','group','H','Filadelfia',46),          -- Sab 21 Jun 23:00 ARG
('URU','ESP','2026-06-27 00:00:00+00','group','H','Guadalajara',47),         -- Vie 26 Jun 21:00 ARG
('CPV','KSA','2026-06-27 00:00:00+00','group','H','Houston',48),             -- Vie 26 Jun 21:00 ARG

-- ══ GRUPO I: FRA · NOR · IRQ · SEN ══
('FRA','SEN','2026-06-16 19:00:00+00','group','I','Nueva York/NJ',49),       -- Mar 16 Jun 16:00 ARG
('IRQ','NOR','2026-06-16 22:00:00+00','group','I','Boston',50),              -- Mar 16 Jun 19:00 ARG
('FRA','IRQ','2026-06-22 21:00:00+00','group','I','Filadelfia',51),          -- Lun 22 Jun 18:00 ARG
('NOR','SEN','2026-06-23 00:00:00+00','group','I','Nueva York/NJ',52),       -- Lun 22 Jun 21:00 ARG
('NOR','FRA','2026-06-26 19:00:00+00','group','I','Boston',53),              -- Vie 26 Jun 16:00 ARG
('SEN','IRQ','2026-06-26 19:00:00+00','group','I','Toronto',54),             -- Vie 26 Jun 16:00 ARG

-- ══ GRUPO J: ARG · JOR · AUT · ALG ══
('ARG','ALG','2026-06-17 01:00:00+00','group','J','Kansas City',55),         -- Lun 16 Jun 22:00 ARG
('AUT','JOR','2026-06-17 04:00:00+00','group','J','San Francisco',56),       -- Mar 17 Jun 01:00 ARG
('ARG','AUT','2026-06-22 17:00:00+00','group','J','Dallas',57),              -- Lun 22 Jun 14:00 ARG
('JOR','ALG','2026-06-23 03:00:00+00','group','J','San Francisco',58),       -- Lun 22 Jun 24:00 ARG
('JOR','ARG','2026-06-28 02:00:00+00','group','J','Dallas',59),              -- Sab 27 Jun 23:00 ARG
('ALG','AUT','2026-06-28 02:00:00+00','group','J','Kansas City',60),         -- Sab 27 Jun 23:00 ARG

-- ══ GRUPO K: POR · COL · UZB · COD ══
('POR','COD','2026-06-17 17:00:00+00','group','K','Houston',61),             -- Mar 17 Jun 14:00 ARG
('COL','UZB','2026-06-17 20:00:00+00','group','K','Guadalajara',62),         -- Mar 17 Jun 17:00 ARG
('POR','UZB','2026-06-23 17:00:00+00','group','K','Houston',63),             -- Lun 23 Jun 14:00 ARG
('COL','COD','2026-06-24 02:00:00+00','group','K','Guadalajara',64),         -- Lun 23 Jun 23:00 ARG
('COL','POR','2026-06-27 23:30:00+00','group','K','Miami',65),               -- Sab 27 Jun 20:30 ARG
('COD','UZB','2026-06-27 23:30:00+00','group','K','Atlanta',66),             -- Sab 27 Jun 20:30 ARG

-- ══ GRUPO L: ENG · PAN · GHA · CRO ══
('ENG','PAN','2026-06-17 23:00:00+00','group','L','Nueva York/NJ',67),       -- Mar 17 Jun 20:00 ARG
('GHA','CRO','2026-06-18 02:00:00+00','group','L','Toronto',68),             -- Mar 17 Jun 23:00 ARG
('ENG','GHA','2026-06-23 20:00:00+00','group','L','Boston',69),              -- Lun 23 Jun 17:00 ARG
('PAN','CRO','2026-06-23 23:00:00+00','group','L','Toronto',70),             -- Lun 23 Jun 20:00 ARG
('ENG','CRO','2026-06-27 21:00:00+00','group','L','Nueva York/NJ',71),       -- Sab 27 Jun 18:00 ARG
('PAN','GHA','2026-06-27 21:00:00+00','group','L','Filadelfia',72)           -- Sab 27 Jun 18:00 ARG

ON CONFLICT DO NOTHING;
