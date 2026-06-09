-- ============================================================
-- SCHEDULE FIX v3 - Borra predictions primero para liberar FK
-- luego recarga matches correctamente
-- ============================================================

-- 1. Borrar predicciones de partidos de grupos (aún no empezó)
DELETE FROM predictions
WHERE match_id IN (SELECT id FROM matches WHERE stage = 'group');

-- 2. Ahora sí borrar los partidos de grupos
DELETE FROM matches WHERE stage = 'group';

-- 3. Reinsertar con fechas correctas
INSERT INTO matches (home_team_id, away_team_id, match_date, stage, group_letter, venue, sort_order) VALUES

-- ══ GRUPO A: MEX · RSA · CZE · KOR ══
('MEX','RSA','2026-06-11 19:00:00+00','group','A','Ciudad de México',1),
('KOR','CZE','2026-06-12 02:00:00+00','group','A','Guadalajara',2),
('CZE','RSA','2026-06-18 16:00:00+00','group','A','Atlanta',3),
('MEX','KOR','2026-06-19 03:00:00+00','group','A','Guadalajara',4),
('MEX','CZE','2026-06-24 23:00:00+00','group','A','Ciudad de México',5),
('RSA','KOR','2026-06-24 23:00:00+00','group','A','Kansas City',6),

-- ══ GRUPO B: CAN · SUI · QAT · BIH ══
('CAN','BIH','2026-06-12 19:00:00+00','group','B','Toronto',7),
('QAT','SUI','2026-06-13 19:00:00+00','group','B','San Francisco',8),
('SUI','BIH','2026-06-18 19:00:00+00','group','B','Los Ángeles',9),
('CAN','QAT','2026-06-18 22:00:00+00','group','B','Vancouver',10),
('SUI','CAN','2026-06-24 19:00:00+00','group','B','Vancouver',11),
('BIH','QAT','2026-06-24 19:00:00+00','group','B','Seattle',12),

-- ══ GRUPO C: BRA · MAR · SCO · HAI ══
('BRA','MAR','2026-06-13 22:00:00+00','group','C','Nueva York/NJ',13),
('HAI','SCO','2026-06-14 01:00:00+00','group','C','Boston',14),
('SCO','MAR','2026-06-19 22:00:00+00','group','C','Boston',15),
('BRA','HAI','2026-06-20 01:00:00+00','group','C','Filadelfia',16),
('SCO','BRA','2026-06-24 22:00:00+00','group','C','Miami',17),
('MAR','HAI','2026-06-24 22:00:00+00','group','C','Atlanta',18),

-- ══ GRUPO D: USA · PAR · TUR · AUS ══
('USA','PAR','2026-06-13 01:00:00+00','group','D','Los Ángeles',19),
('AUS','TUR','2026-06-14 04:00:00+00','group','D','Vancouver',20),
('USA','AUS','2026-06-19 19:00:00+00','group','D','Seattle',21),
('TUR','PAR','2026-06-20 04:00:00+00','group','D','San Francisco',22),
('USA','TUR','2026-06-25 19:00:00+00','group','D','Dallas',23),
('PAR','AUS','2026-06-25 19:00:00+00','group','D','Kansas City',24),

-- ══ GRUPO E: GER · ECU · CIV · CUW ══
('GER','CUW','2026-06-14 17:00:00+00','group','E','Houston',25),
('CIV','ECU','2026-06-14 23:00:00+00','group','E','Filadelfia',26),
('GER','CIV','2026-06-20 20:00:00+00','group','E','Toronto',27),
('ECU','CUW','2026-06-21 00:00:00+00','group','E','Kansas City',28),
('GER','ECU','2026-06-25 22:00:00+00','group','E','Houston',29),
('CIV','CUW','2026-06-25 22:00:00+00','group','E','Dallas',30),

-- ══ GRUPO F: NED · JPN · SWE · TUN ══
('NED','JPN','2026-06-14 20:00:00+00','group','F','Dallas',31),
('SWE','TUN','2026-06-15 02:00:00+00','group','F','Guadalajara',32),
('NED','SWE','2026-06-20 17:00:00+00','group','F','Houston',33),
('TUN','JPN','2026-06-21 02:00:00+00','group','F','Guadalajara',34),
('NED','TUN','2026-06-25 22:00:00+00','group','F','Dallas',35),
('JPN','SWE','2026-06-26 01:00:00+00','group','F','Los Ángeles',36),

-- ══ GRUPO G: BEL · EGY · IRN · NZL ══
('BEL','EGY','2026-06-15 22:00:00+00','group','G','Seattle',37),
('IRN','NZL','2026-06-16 04:00:00+00','group','G','Los Ángeles',38),
('BEL','IRN','2026-06-21 17:00:00+00','group','G','Dallas',39),
('NZL','EGY','2026-06-21 20:00:00+00','group','G','Boston',40),
('EGY','IRN','2026-06-27 03:00:00+00','group','G','Seattle',41),
('NZL','BEL','2026-06-27 03:00:00+00','group','G','Vancouver',42),

-- ══ GRUPO H: ESP · URU · KSA · CPV ══
('ESP','CPV','2026-06-15 17:00:00+00','group','H','Atlanta',43),
('KSA','URU','2026-06-15 22:00:00+00','group','H','Miami',44),
('ESP','KSA','2026-06-21 23:00:00+00','group','H','Dallas',45),
('CPV','URU','2026-06-22 02:00:00+00','group','H','Filadelfia',46),
('URU','ESP','2026-06-27 00:00:00+00','group','H','Guadalajara',47),
('CPV','KSA','2026-06-27 00:00:00+00','group','H','Houston',48),

-- ══ GRUPO I: FRA · NOR · IRQ · SEN ══
('FRA','SEN','2026-06-16 19:00:00+00','group','I','Nueva York/NJ',49),
('IRQ','NOR','2026-06-16 22:00:00+00','group','I','Boston',50),
('FRA','IRQ','2026-06-22 21:00:00+00','group','I','Filadelfia',51),
('NOR','SEN','2026-06-23 00:00:00+00','group','I','Nueva York/NJ',52),
('NOR','FRA','2026-06-26 19:00:00+00','group','I','Boston',53),
('SEN','IRQ','2026-06-26 19:00:00+00','group','I','Toronto',54),

-- ══ GRUPO J: ARG · JOR · AUT · ALG ══
('ARG','ALG','2026-06-17 01:00:00+00','group','J','Kansas City',55),
('AUT','JOR','2026-06-17 04:00:00+00','group','J','San Francisco',56),
('ARG','AUT','2026-06-22 17:00:00+00','group','J','Dallas',57),
('JOR','ALG','2026-06-23 03:00:00+00','group','J','San Francisco',58),
('JOR','ARG','2026-06-28 02:00:00+00','group','J','Dallas',59),
('ALG','AUT','2026-06-28 02:00:00+00','group','J','Kansas City',60),

-- ══ GRUPO K: POR · COL · UZB · COD ══
('POR','COD','2026-06-17 17:00:00+00','group','K','Houston',61),
('COL','UZB','2026-06-17 20:00:00+00','group','K','Guadalajara',62),
('POR','UZB','2026-06-23 17:00:00+00','group','K','Houston',63),
('COL','COD','2026-06-24 02:00:00+00','group','K','Guadalajara',64),
('COL','POR','2026-06-27 23:30:00+00','group','K','Miami',65),
('COD','UZB','2026-06-27 23:30:00+00','group','K','Atlanta',66),

-- ══ GRUPO L: ENG · PAN · GHA · CRO ══
('ENG','PAN','2026-06-17 23:00:00+00','group','L','Nueva York/NJ',67),
('GHA','CRO','2026-06-18 02:00:00+00','group','L','Toronto',68),
('ENG','GHA','2026-06-23 20:00:00+00','group','L','Boston',69),
('PAN','CRO','2026-06-23 23:00:00+00','group','L','Toronto',70),
('ENG','CRO','2026-06-27 21:00:00+00','group','L','Nueva York/NJ',71),
('PAN','GHA','2026-06-27 21:00:00+00','group','L','Filadelfia',72);
