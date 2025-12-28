-- ============================================================================
-- PRZYROSTOWY UPDATE DANYCH
-- ============================================================================
-- Wygenerowano: 28.12.2025, 19:19:41
-- 
-- INSTRUKCJA UŻYCIA:
-- 1. Skopiuj całą zawartość tego pliku
-- 2. Otwórz Supabase Dashboard → SQL Editor
-- 3. Wklej zawartość i kliknij "Run"
--
-- UWAGA: Ten skrypt używa UPSERT (INSERT ... ON CONFLICT DO UPDATE),
-- więc bezpiecznie zaktualizuje istniejące dane i doda nowe.
-- ============================================================================

-- ============================================================================
-- BRANDS (UPSERT)
-- ============================================================================

-- Upsert 8 record(s)
INSERT INTO public.brands (id, name) VALUES
  (1, 'Brit Care'),
  (2, 'Royal Canin'),
  (3, 'Acana'),
  (4, 'Taste of the Wild'),
  (5, 'Carnilove'),
  (6, 'Josera'),
  (7, 'Wolf of Wilderness'),
  (8, 'Purizon')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- ============================================================================
-- SIZE_TYPES (UPSERT)
-- ============================================================================

-- Upsert 3 record(s)
INSERT INTO public.size_types (id, name) VALUES
  (1, 'mały'),
  (2, 'średni'),
  (3, 'duży')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- ============================================================================
-- AGE_CATEGORIES (UPSERT)
-- ============================================================================

-- Upsert 4 record(s)
INSERT INTO public.age_categories (id, name) VALUES
  (1, 'szczeniak'),
  (2, 'junior'),
  (3, 'dorosły'),
  (4, 'senior')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- ============================================================================
-- INGREDIENTS (UPSERT)
-- ============================================================================

-- Upsert 292 record(s)
INSERT INTO public.ingredients (id, name) VALUES
  (1, 'kurczak'),
  (2, 'mięso z kurczaka'),
  (3, 'świeży kurczak'),
  (4, 'suszone mięso z kurczaka'),
  (5, 'mączka z kurczaka'),
  (6, 'hydrolizowane białko drobiowe'),
  (7, 'indyk'),
  (8, 'mięso z indyka'),
  (9, 'mączka z indyka'),
  (10, 'kaczka'),
  (11, 'mięso z kaczki'),
  (12, 'gęś'),
  (13, 'przepiórka'),
  (14, 'wołowina'),
  (15, 'świeża wołowina'),
  (16, 'suszone mięso wołowe'),
  (17, 'mączka wołowa'),
  (18, 'jagnięcina'),
  (19, 'świeża jagnięcina'),
  (20, 'mączka z jagnięciny'),
  (21, 'baranina'),
  (22, 'wieprzowina'),
  (23, 'dzik'),
  (24, 'dziczyzna'),
  (25, 'sarna'),
  (26, 'jeleń'),
  (27, 'renifer'),
  (28, 'kangur'),
  (29, 'królik'),
  (30, 'koń'),
  (31, 'łosoś'),
  (32, 'świeży łosoś'),
  (33, 'mączka z łososia'),
  (34, 'pstrąg'),
  (35, 'śledź'),
  (36, 'sardynka'),
  (37, 'dorsz'),
  (38, 'halibut'),
  (39, 'tuńczyk'),
  (40, 'makrela'),
  (41, 'biała ryba'),
  (42, 'mączka rybna'),
  (43, 'hydrolizowane białko rybne'),
  (44, 'jaja'),
  (45, 'całe jaja'),
  (46, 'jajka w proszku'),
  (47, 'mleko'),
  (48, 'ser'),
  (49, 'twaróg'),
  (50, 'jogurt'),
  (51, 'serwatka'),
  (52, 'pszenica'),
  (53, 'mąka pszenna'),
  (54, 'gluten pszenny'),
  (55, 'kukurydza'),
  (56, 'mąka kukurydziana'),
  (57, 'gluten kukurydziany'),
  (58, 'jęczmień'),
  (59, 'owies'),
  (60, 'ryż'),
  (61, 'ryż brązowy'),
  (62, 'ryż biały'),
  (63, 'sorgo'),
  (64, 'proso'),
  (65, 'żyto'),
  (66, 'amarantus'),
  (67, 'komosa ryżowa (quinoa)'),
  (68, 'gryka'),
  (69, 'tapioka'),
  (70, 'maniok'),
  (71, 'groszek'),
  (72, 'groch'),
  (73, 'białko grochu'),
  (74, 'soczewica'),
  (75, 'ciecierzyca'),
  (76, 'fasola'),
  (77, 'bób'),
  (78, 'łubin'),
  (79, 'ziemniak'),
  (80, 'batat'),
  (81, 'marchew'),
  (82, 'burak'),
  (83, 'pasternak'),
  (84, 'topinambur'),
  (85, 'seler'),
  (86, 'brokuł'),
  (87, 'szpinak'),
  (88, 'jarmuż'),
  (89, 'kapusta'),
  (90, 'kalafior'),
  (91, 'pomidor'),
  (92, 'dynia'),
  (93, 'kabaczek'),
  (94, 'ogórek'),
  (95, 'papryka'),
  (96, 'buraki liściowe'),
  (97, 'jabłko'),
  (98, 'gruszka'),
  (99, 'borówki'),
  (100, 'żurawina'),
  (101, 'maliny'),
  (102, 'truskawki'),
  (103, 'czarne jagody'),
  (104, 'banany'),
  (105, 'aronia'),
  (106, 'czarna porzeczka'),
  (107, 'róża (owoce)'),
  (108, 'tłuszcz drobiowy'),
  (109, 'tłuszcz z kurczaka'),
  (110, 'olej z kurczaka'),
  (111, 'tłuszcz wołowy'),
  (112, 'olej z ryb'),
  (113, 'olej z łososia'),
  (114, 'olej lniany'),
  (115, 'olej słonecznikowy'),
  (116, 'olej kokosowy'),
  (117, 'olej z wiesiołka'),
  (118, 'olej z czarnuszki'),
  (119, 'lucerna'),
  (120, 'pokrzywa'),
  (121, 'rumianek'),
  (122, 'mniszek lekarski'),
  (123, 'mięta'),
  (124, 'rozmaryn'),
  (125, 'tymianek'),
  (126, 'bazylia'),
  (127, 'pietruszka'),
  (128, 'oregano'),
  (129, 'kurkuma'),
  (130, 'imbir'),
  (131, 'czosnek'),
  (132, 'drożdże piwne'),
  (133, 'pulpa buraczana'),
  (134, 'pulpa z buraków cukrowych'),
  (135, 'FOS (fruktooligosacharydy)'),
  (136, 'MOS (mannanoligosacharydy)'),
  (137, 'inulina'),
  (138, 'beta-glukany'),
  (139, 'chondroityna'),
  (140, 'glukozamina'),
  (141, 'ekstrakt z mięczaka'),
  (142, 'muszle małży'),
  (143, 'algi morskie'),
  (144, 'spirulina'),
  (145, 'chlorella'),
  (146, 'mączka z chrząstki'),
  (147, 'kolagen'),
  (148, 'L-karnityna'),
  (149, 'tauryna'),
  (150, 'glutation'),
  (151, 'sól'),
  (152, 'chlorek sodu'),
  (153, 'chlorek potasu'),
  (154, 'węglan wapnia'),
  (155, 'fosforan dwuwapniowy'),
  (156, 'drożdże suszone'),
  (157, 'zioła mieszane'),
  (158, 'nasiona lnu'),
  (159, 'nasiona chia'),
  (160, 'nasiona dyni'),
  (161, 'owies zwyczajny'),
  (162, 'żelatyna'),
  (163, 'suszona jagnięcina'),
  (164, 'wytłoki z jabłek'),
  (165, 'naturalny aromat'),
  (166, 'hydrolizowane drożdże'),
  (167, 'mączka grochowa'),
  (168, 'siarczan chondroityny'),
  (169, 'jukka'),
  (170, 'ostropest plamisty'),
  (171, 'serdecznik'),
  (172, 'rokitnik'),
  (173, 'probiotyki'),
  (174, 'bizon'),
  (176, 'jagnięcina suszona'),
  (178, 'białko ziemniaczane'),
  (179, 'bataty'),
  (180, 'losos'),
  (181, 'ziemniaki'),
  (182, 'suszona pulpa jablkowa'),
  (183, 'tluszcz z kurczaka'),
  (184, 'olej z lososia'),
  (185, 'maczka grochowa'),
  (189, 'suszona pulpa jabłkowa'),
  (190, 'mączka z kaczki'),
  (191, 'mączka z bażanta'),
  (192, 'groch żółty'),
  (193, 'kaczka bez kości'),
  (194, 'wątroba kurczęca'),
  (195, 'jabłka'),
  (196, 'skrobia z tapioki'),
  (197, 'siemię lniane'),
  (198, 'ciecierzyc'),
  (199, 'drożdże browarnicze'),
  (200, 'korzeń cykorii'),
  (201, 'juka'),
  (202, 'algi'),
  (203, 'psylium'),
  (204, 'mączka z dziczyzny'),
  (205, 'wątróbka z kurczaka'),
  (206, 'skrobie z manioku'),
  (207, 'juka schidigera'),
  (208, 'psylium  tymianek'),
  (209, 'jagody'),
  (210, 'surowa kaczka'),
  (211, 'dehydratyzowana kaczka'),
  (212, 'cały groch zielony'),
  (213, 'cała czerwona soczewica'),
  (214, 'surowa wątroba kaczki'),
  (215, 'tłuszcz kaczki'),
  (216, 'świeże gruszki'),
  (217, 'cała ciecierzyca'),
  (218, 'cała zielona soczewica'),
  (219, 'cały groch żółty'),
  (220, 'skrobia grochowa'),
  (221, 'włókno soczewicy'),
  (222, 'świeża cała dynia piżmowa'),
  (223, 'świeża cała dynia'),
  (224, 'suszony kelp'),
  (225, 'suszony korzeń cykorii'),
  (226, 'całe borówki'),
  (227, 'całe jagody'),
  (228, 'korzeń łopianu'),
  (229, 'lawenda'),
  (230, 'korzeń prawoślazu lekarskiego'),
  (231, 'owoce dzikiej róży'),
  (232, 'surowa jagnięcina'),
  (233, 'dehydratyzowana jagnięcina'),
  (234, 'surowa wątroba jagnięca'),
  (235, 'olej rzepakowy'),
  (236, 'świeże jabłka'),
  (237, 'surowe flaki jagnięce'),
  (238, 'surowe nerki jagnięce'),
  (239, 'mączka drobiowa'),
  (240, 'jajka'),
  (241, 'pieczony jeleń'),
  (242, 'pulpa pomidorowa'),
  (243, 'mączka z ryb morskich'),
  (244, 'składniki mineralne'),
  (245, 'pomidory'),
  (246, 'ekstrakt z jukki schidigera'),
  (247, 'wędzony łosoś'),
  (248, 'włókno ziemniaczane'),
  (249, 'suszone białko drobiowe'),
  (250, 'kukurydza pełnoziarnista'),
  (251, 'włókno buraczane'),
  (252, 'minerały'),
  (253, 'mielony korzeń cykorii'),
  (254, 'suszony ziemniak'),
  (255, 'suszone białko jagnięce'),
  (256, 'suszone białko z nowozelandzkiej małży zielonowargowej (perna canaliculus)'),
  (257, 'dehydratyzowany łosoś'),
  (258, 'żółty groszek'),
  (259, 'hydrolizowane białko łososia'),
  (260, 'pulpa jabłkowa'),
  (261, 'hydrolizowany sos z łososia'),
  (262, 'wyciąg z drożdży'),
  (263, 'rokitnik zwyczajny'),
  (265, 'dehydratyzowany kurczak'),
  (266, 'świeże organy kurczaka'),
  (267, 'dehydratyzowany indyk'),
  (268, 'świeże jaja'),
  (269, 'surowy morszczuk'),
  (270, 'dehydratyzowany śledź'),
  (271, 'olej rybny'),
  (272, 'włókno z ciecierzycy'),
  (273, 'gruszki'),
  (274, 'cukinia'),
  (275, 'świeże liście rzepy'),
  (276, 'świeże liście buraków'),
  (277, 'cała żurawina'),
  (278, 'całe jagody saskatoon'),
  (279, 'owady dehydratyzowane'),
  (280, 'suszone algi'),
  (281, 'mąka grochowa'),
  (282, 'ekstrakt drożdżowy'),
  (283, 'suszony rokitnik zwyczajny'),
  (285, 'białko jagnięce'),
  (286, 'płatki ziemniaczane'),
  (287, 'tłuszcz jagnięcy'),
  (288, 'śledź (suszony)'),
  (289, 'gładzica (suszona)'),
  (290, 'dorsz (suszony)'),
  (291, 'czarniak (suszony)'),
  (292, 'batat (suszony)'),
  (293, 'ziemniak (suszony)'),
  (294, 'łuski nasion babki płesznik'),
  (295, 'jabłka suszone'),
  (296, 'marchew suszona'),
  (297, 'żurawina suszona'),
  (298, 'zioła suszone'),
  (299, 'inulina z cykorii')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- ============================================================================
-- ALLERGENS (Main categories)
-- ============================================================================

-- ============================================================================
-- ALLERGENS (UPSERT)
-- ============================================================================

-- Upsert 10 record(s)
INSERT INTO public.allergens (id, name, parent_id) VALUES
  (1, 'mięso', NULL),
  (2, 'drób', NULL),
  (3, 'ryby', NULL),
  (4, 'zboża', NULL),
  (5, 'nabiał', NULL),
  (6, 'strączkowe', NULL),
  (7, 'jaja', NULL),
  (8, 'inne białka', NULL),
  (56, 'gluten', NULL),
  (57, 'czosnek', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id;

-- ============================================================================
-- ALLERGENS (Sub-categories)
-- ============================================================================

-- ============================================================================
-- ALLERGENS (UPSERT)
-- ============================================================================

-- Upsert 49 record(s)
INSERT INTO public.allergens (id, name, parent_id) VALUES
  (9, 'kurczak', 2),
  (10, 'indyk', 2),
  (11, 'kaczka', 2),
  (12, 'gęś', 2),
  (13, 'przepiórka', 2),
  (14, 'wołowina', 1),
  (15, 'jagnięcina', 1),
  (16, 'baranina', 1),
  (17, 'wieprzowina', 1),
  (18, 'dzik', 1),
  (19, 'dziczyzna', 1),
  (20, 'sarna', 1),
  (21, 'jeleń', 1),
  (22, 'renifer', 1),
  (23, 'kangur', 1),
  (24, 'królik', 1),
  (25, 'koń', 1),
  (26, 'łosoś', 3),
  (27, 'pstrąg', 3),
  (28, 'śledź', 3),
  (29, 'sardynka', 3),
  (30, 'dorsz', 3),
  (31, 'halibut', 3),
  (32, 'tuńczyk', 3),
  (33, 'makrela', 3),
  (34, 'biała ryba', 3),
  (35, 'pszenica', 4),
  (36, 'kukurydza', 4),
  (37, 'jęczmień', 4),
  (38, 'owies', 4),
  (39, 'ryż', 4),
  (40, 'sorgo', 4),
  (41, 'proso', 4),
  (42, 'żyto', 4),
  (43, 'mleko', 5),
  (44, 'ser', 5),
  (45, 'twaróg', 5),
  (46, 'jogurt', 5),
  (47, 'serwatka', 5),
  (48, 'groszek', 6),
  (49, 'groch', 6),
  (50, 'soczewica', 6),
  (51, 'ciecierzyca', 6),
  (52, 'fasola', 6),
  (53, 'bób', 6),
  (54, 'łupin', 6),
  (55, 'soja', 6),
  (58, 'bażant', 2),
  (59, 'morszczuk', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id;

-- ============================================================================
-- INGREDIENT_ALLERGENS (INSERT IGNORE)
-- ============================================================================

-- Insert 276 record(s) (ignoring duplicates)
INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
  (1, 2),
  (1, 9),
  (2, 2),
  (2, 9),
  (3, 2),
  (3, 9),
  (4, 2),
  (4, 9),
  (5, 2),
  (5, 9),
  (6, 2),
  (7, 2),
  (7, 10),
  (8, 2),
  (8, 10),
  (9, 2),
  (9, 10),
  (10, 2),
  (10, 11),
  (11, 2),
  (11, 11),
  (12, 2),
  (12, 12),
  (13, 2),
  (13, 13),
  (14, 1),
  (14, 14),
  (15, 1),
  (15, 14),
  (16, 1),
  (16, 14),
  (17, 1),
  (17, 14),
  (18, 1),
  (18, 15),
  (19, 1),
  (19, 15),
  (20, 1),
  (20, 15),
  (21, 1),
  (21, 16),
  (22, 1),
  (22, 17),
  (23, 1),
  (23, 18),
  (24, 1),
  (24, 19),
  (25, 1),
  (25, 20),
  (26, 1),
  (26, 21),
  (27, 1),
  (27, 22),
  (28, 1),
  (28, 23),
  (29, 1),
  (29, 24),
  (30, 1),
  (30, 25),
  (31, 3),
  (31, 26),
  (32, 3),
  (32, 26),
  (33, 3),
  (33, 26),
  (34, 3),
  (34, 27),
  (35, 3),
  (35, 28),
  (36, 3),
  (36, 29),
  (37, 3),
  (37, 30),
  (38, 3),
  (38, 31),
  (39, 3),
  (39, 32),
  (40, 3),
  (40, 33),
  (41, 3),
  (41, 34),
  (42, 3),
  (43, 3),
  (44, 7),
  (45, 7),
  (46, 7),
  (47, 5),
  (47, 43),
  (48, 5),
  (48, 44),
  (49, 5),
  (49, 45),
  (50, 5),
  (50, 46),
  (51, 5),
  (51, 47),
  (52, 4),
  (52, 35),
  (52, 56),
  (53, 4),
  (53, 35),
  (53, 56),
  (54, 4),
  (54, 35),
  (54, 56),
  (55, 4),
  (55, 36),
  (56, 4),
  (56, 36),
  (57, 4),
  (57, 36),
  (58, 4),
  (58, 37),
  (59, 4),
  (59, 38),
  (60, 4),
  (60, 39),
  (61, 4),
  (61, 39),
  (62, 4),
  (62, 39),
  (63, 4),
  (63, 40),
  (64, 4),
  (64, 41),
  (65, 4),
  (65, 42),
  (67, 4),
  (67, 39),
  (71, 6),
  (71, 48),
  (72, 6),
  (72, 49),
  (73, 6),
  (73, 49),
  (74, 6),
  (74, 50),
  (75, 6),
  (75, 51),
  (76, 6),
  (76, 52),
  (77, 6),
  (77, 53),
  (108, 2),
  (108, 9),
  (109, 2),
  (109, 9),
  (110, 2),
  (110, 9),
  (111, 1),
  (111, 14),
  (112, 3),
  (112, 26),
  (113, 3),
  (113, 26),
  (131, 57),
  (161, 4),
  (161, 38),
  (163, 1),
  (163, 15),
  (167, 6),
  (167, 49),
  (184, 3),
  (185, 6),
  (185, 49),
  (190, 1),
  (190, 2),
  (190, 11),
  (191, 1),
  (191, 2),
  (192, 6),
  (192, 49),
  (193, 1),
  (193, 2),
  (193, 11),
  (194, 1),
  (194, 2),
  (194, 9),
  (194, 26),
  (198, 6),
  (198, 51),
  (204, 1),
  (204, 18),
  (204, 19),
  (204, 20),
  (204, 21),
  (205, 1),
  (205, 2),
  (205, 9),
  (210, 1),
  (210, 2),
  (210, 11),
  (211, 1),
  (211, 2),
  (211, 11),
  (212, 6),
  (212, 49),
  (213, 6),
  (213, 50),
  (214, 1),
  (214, 2),
  (214, 11),
  (215, 1),
  (215, 2),
  (215, 11),
  (217, 6),
  (217, 51),
  (218, 6),
  (218, 50),
  (219, 6),
  (219, 49),
  (220, 6),
  (220, 49),
  (221, 6),
  (221, 50),
  (232, 1),
  (232, 15),
  (233, 1),
  (233, 15),
  (234, 1),
  (234, 15),
  (237, 1),
  (237, 15),
  (238, 1),
  (238, 15),
  (239, 1),
  (239, 2),
  (240, 7),
  (241, 1),
  (241, 21),
  (243, 3),
  (247, 3),
  (247, 26),
  (249, 1),
  (249, 2),
  (250, 4),
  (250, 36),
  (255, 1),
  (255, 15),
  (256, 3),
  (256, 8),
  (257, 3),
  (257, 26),
  (258, 6),
  (258, 49),
  (259, 3),
  (259, 26),
  (261, 3),
  (261, 26),
  (265, 1),
  (265, 2),
  (265, 9),
  (267, 1),
  (267, 2),
  (267, 10),
  (268, 7),
  (269, 3),
  (269, 59),
  (270, 3),
  (270, 28),
  (271, 3),
  (272, 6),
  (272, 51),
  (281, 6),
  (281, 49),
  (285, 1),
  (285, 15),
  (287, 1),
  (287, 15),
  (288, 3),
  (288, 28),
  (289, 3),
  (290, 3),
  (290, 30),
  (291, 3),
  (291, 30)
ON CONFLICT (ingredient_id, allergen_id) DO NOTHING;

-- ============================================================================
-- FOODS (UPSERT)
-- ============================================================================

-- Upsert 16 record(s)
INSERT INTO public.foods (id, name, brand_id, size_type_id, age_category_id, ingredients_raw, image_url) VALUES
  (1, 'Brit Care Adult Jagnięcina z Ryżem', 1, 2, 3, 'Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, wytłoki z jabłek, olej z łososia (3%), drożdże piwowarskie, naturalny aromat, hydrolizowane drożdże (0,5%), mączka grochowa, glukozamina (300 mg/kg), fruktooligosacharydy (230 mg/kg), siarczan chondroityny (230 mg/kg), mannan-oligosacharydy (180 mg/kg), jukka (180 mg/kg), ostropest plamisty (110 mg/kg), beta-glukany (60 mg/kg), serdecznik (60 mg/kg), rokitnik (60 mg/kg), probiotyki Lactobacillus helveticus (15x109 komórek/kg)', '/images/foods/brit-care-jagniecina-medium-adult.jpg'),
  (2, 'Brit Care Bezzbożowa Łosoś z Ziemniakiem', 1, 1, 3, 'Łosoś (50%, odwodniony, hydrolizowany), ziemniaki (26%), suszona pulpa jabłkowa, tłuszcz z kurczaka, olej z łososia (3%), naturalny aromat, mączka grochowa, glukozamina (260 mg/kg), fruktooligosacharydy (200 mg/kg), siarczan chondroityny (200 mg/kg), mannan-oligosacharydy (150 mg/kg), Mojave yucca (150 mg/kg), nasiona ostropestu plamistego (90 mg/kg), β-glukany (50 mg/kg), suszone ziele serdecznika (50 mg/kg), suszony rokitnik (50 mg/kg), probiotyk Lactobacillus helveticus HA - 122 inaktywowany (15x109 komórek/kg).', '/images/foods/brit-care-salmon-adult-small.jpg'),
  (4, 'Carnilove Kaczka z Bażantem', 5, 2, 3, 'mączka z kaczki (30%), mączka z bażanta (22%), groch żółty (20%), tłuszcz kurczęcy (źródło tokoferoli, 8%), kaczka bez kości (5%), wątroba kurczęca (3%), jabłka (3%), skrobia z tapioki (3%), olej z łososia (2%), marchew (1%), siemię lniane (1%), ciecierzyca (1%), hydrolizowane skorupiaki (źródło glukozaminy, 0,026%), ekstrakt z chrząstki (źródło chondroityny, 0,016%), drożdże browarnicze (źródło mannanooligosacharydów, 0,015%), korzeń cykorii (źródło fruktooligosacharydów, 0,01%), juka (0,01 %), algi (0,01%), psylium (0,01%), tymianek (0,01%), rozmaryn (0,01%), oregano (0,01%), żurawina (0,0008%), borówki (0,0008%), maliny ( 0,0008%)', '/images/foods/Carnilove-kaczka-z-bazantem.jpg'),
  (5, 'Carnilove Jagnięcina z Dzikiem', 5, 3, 3, 'mączka z dziczyzny (30%), mączka z jagnięciny z wolnego wybiegu (25%), groch żółty (20%), tłuszcz drobiowy (konserwowany tokoferolami) (10%), wątróbka z kurczaka (3%), jabłka (3%), skrobie z manioku (3%), olej z łososia (2%), marchew (1%), siemię lniane (1%), ciecierzyca (1%), hydrolizowane pancerze skorupiaków (źródło glukozaminy ) (0,026%), ekstrakt z chrząstki (źródło chondroityny) (0,016%), drożdże piwne (źródło mannanooligosacharydów) (0,015%), korzeń cykorii (źródło fruktooligosacharydów) (0,01%), juka schidigera (0,01%), algi (0,01%), łupiny psyllium (0,01%), tymianek (0,01%), rozmaryn (0,01%), oregano (0,01%), żurawina (0,0008%), jagody (0,0008%), maliny (0,0008%)', '/images/foods/Carnilove-jagniecina-i-dzik.jpg'),
  (6, 'Acana Heritage Kaczka Wolny Wybieg', 3, 2, 3, 'Surowa kaczka (18%), dehydratyzowana kaczka (17%), cały groch zielony, cała czerwona soczewica, surowa wątroba kaczki (9%), tłuszcz kaczki (6%), świeże gruszki (4%), cała ciecierzyca, cała zielona soczewica, cały groch żółty, skrobia grochowa, włókno soczewicy, algi (źródło EPA i DHA) (1,2%), świeża cała dynia piżmowa, świeża cała dynia, suszony kelp, sól, suszony korzeń cykorii, całe borówki, całe jagody, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży', 'images/foods/acana-heritage-kaczka.jpg'),
  (7, 'Acana Singles Jagnięcina z Jabłkiem', 3, 2, 3, 'Surowa jagnięcina (21%), dehydratyzowana jagnięcina (19%), cały groch zielony, cała czerwona soczewica, surowa wątroba jagnięca (8%), olej rzepakowy, świeże jabłka (4%), cała ciecierzyca, cała zielona soczewica, cały groch żółty, włókno soczewicy, skrobia grochowa, olej słonecznikowy, algi (źródło EPA i DHA), surowe flaki jagnięce (1%), surowe nerki jagnięce (1%), świeża cała dynia piżmowa, świeża cała dynia, suszony kelp, sól, suszony korzeń cykorii, całe borówki, całe jagody, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży.', '/images/foods/Acana-singles-lamb.jpg'),
  (8, 'Royal Canin Hypoallergenic', 2, 1, 3, 'Mąka ryżowa, hydrolizat białka sojowego, tłuszcz zwierzęcy, ryż, minerały, hydrolizat wątroby drobiowej, pulpa buraczana, olej sojowy, fruktooligosacharydy, olej rybny, olej z ogórecznika, mączka z nagietka.', '/images/foods/royal-canin-hypoallergenic.jpg'),
  (9, 'Taste of the Wild High Prairie', 4, 2, 3, 'Bizon (12%), mączka z jagnięciny, mączka drobiowa, bataty, groszek, ziemniaki, tłuszcz drobiowy (z dodatkiem mieszaniny tokoferoli jako przeciwutleniaczy), produkty jajeczne, wołowina, pieczony jeleń (4%), pulpa pomidorowa, białko ziemniaczane, białko grochu, mączka z ryb morskich, składniki mineralne, suszony korzeń cykorii, pomidory, borówki, maliny, ekstrakt z jukki Schidigera.', '/images/foods/taste-of-the-wild-high-prairie.jpg'),
  (10, 'Taste of the Wild Pacific Stream', 4, 2, 3, 'Łosoś (21%), mączka z ryb morskich, bataty, ziemniaki, groszek, olej rzepakowy, soczewica, mączka z łososia, wędzony łosoś (4%), włókno ziemniaczane, składniki mineralne, suszony korzeń cykorii, pomidory, borówki, maliny, ekstrakt z jukki Schidigera.', '/images/foods/taste-of-the-wild-pacific-stream.jpg'),
  (11, 'Josera SensiPlus', 6, 2, 3, 'Suszone białko drobiowe (drób 24,0%, kaczka 4,0%), kukurydza pełnoziarnista, ryż, tłuszcz drobiowy, włókno buraczane, hydrolizowane białko drobiowe, minerały, mielony korzeń cykorii (naturalne źródło inuliny).', '/images/foods/josera-sensiplus-adult.jpg'),
  (12, 'Josera Optiness', 6, 3, 3, 'Suszone białko drobiowe, ryż, jęczmień, suszony ziemniak, włókno buraczane, tłuszcz drobiowy, suszone białko jagnięce (4,5%), hydrolizowane białko drobiowe, minerały, mielony korzeń cykorii (naturalne źródło inuliny), suszone białko z nowozelandzkiej małży zielonowargowej (perna canaliculus).', '/images/foods/josera-optiness-adult.jpg'),
  (13, 'Brit Veterinary Diet Hypoallergenic', 1, 2, 3, 'dehydratyzowany łosoś (30%), żółty groszek (25%), hydrolizowane białko łososia (18%), gryka, olej kokosowy, pulpa jabłkowa, olej z łososia (3%), hydrolizowany sos z łososia (2%), minerały, suszone algi (0,5%, Ascophyllum nodosum), suszone algi (0,4%, Schizochytrium limacinum), wyciąg z drożdży (źródło mannooligosacharydów, 0,02%), beta-glukany (0,02%), rokitnik zwyczajny (0,015%), fruktooligosacharydy (0,013%), jukka Mojave (0,013%).', '/images/foods/Brit-veterinary-hypoallergenic.jpg'),
  (14, 'ACANA DOG Puppy Small Breed', 3, 1, 1, 'świeży kurczak (18%), dehydratyzowany kurczak (18%), cała czerwona soczewica, cały groch zielony, świeże organy kurczaka (wątroba, serce) (7%), tłuszcz z kurczaka (7%), dehydratyzowany indyk (4%), świeże jaja (4%), surowy morszczuk (4%), dehydratyzowany śledź (4%), olej rybny (3%), cała zielona soczewica, cała ciecierzyca, cały groch żółty, włókno z ciecierzycy, skrobia grochowa, surowa wątroba indyka (1%), sól, suszony kelp, świeża cała dynia, świeża cała dynia piżmowa, świeża cała marchew, świeże całe jabłka, świeże całe gruszki, świeża cała cukinia, suszony korzeń cykorii, świeży jarmuż, świeży szpinak, świeże liście rzepy, świeże liście buraków, cała żurawina, całe borówki, całe jagody saskatoon, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży.', '/images/foods/Acana-puppy-small-breed.jpg'),
  (15, 'Brit Grain Free Veterinary Diets Dog Ultra-Hypoallergenic', 1, 2, 3, 'owady dehydratyzowane (30%), groch żółty, suszona pulpa jabłkowa, olej kokosowy, białko grochu, siemię lniane (4%), węglan wapnia, suszone algi (2,5%, Schizochytrium limacinum), mąka grochowa, hydrolizowane drożdże (0,5% – źródło inozytolu i aminokwasów), ekstrakt drożdżowy (źródło mannanooligosacharydów, 0,02%), β-glukany (0,02%), suszony rokitnik zwyczajny (0,015%), fruktooligosacharydy (0,013%), Jukka Mojave (0,013%), Lactobacillus helveticus HA – 122 inaktywowane (15x109 komórek/kg).', '/images/foods/brit-vet-ultrahypoallergenic.jpg'),
  (16, 'Wolf of Wilderness Sensitive Fiery Volcanoes- jagnięcina', 7, 2, 3, 'Świeża jagnięcina (40%), białko jagnięce (suszone, 14,8%), płatki ziemniaczane, groszek (suszony), tłuszcz jagnięcy (4,5%), skrobia ziemniaczana, suszona pulpa buraczana, hydrolizat białka (z drożdży), białko ziemniaczane, siemię lniane, olej słonecznikowy, drożdże piwne (suszone), lignoceluloza, olej z łososia (0,7%), ściany komórkowe drożdży (suszone, 0,2%: Beta-glukany i mannan-oligosacharydy), dzikie jagody (suszone, 0,2%: porzeczki, jagody aronii), zioła (suszone, 0,2%: krwawnik pospolity, korzeń mniszka lekarskiego, rumianek pospolity, liść pokrzywy, żebrzyca, dziurawiec zwyczajny), inulina z cykorii (0,1%).', '/images/foods/Wolf-of-Wilderness-Fiery-Volcanoes.jpg'),
  (17, 'Purizon Adult, ryba', 8, 2, 3, '36% świeżego łososia, 12% śledzia (suszonego), 9% gładzicy (suszonej), 8% dorsza (suszonego), 8% czarniaka (suszonego), batat (suszony), ziemniak (suszony), 7% oleju z łososia, groch, siemię lniane, łuski nasion babki płesznik, jabłka suszone, marchew suszona, żurawina suszona, zioła suszone (szpinak, tymianek, oregano, szałwia, pietruszka, majeranek, rumianek, anyż, kozieradka, nagietek, mięta pieprzowa), inulina z cykorii.', '/images/foods/purizon-adult-ryba.jpg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand_id = EXCLUDED.brand_id,
  size_type_id = EXCLUDED.size_type_id,
  age_category_id = EXCLUDED.age_category_id,
  ingredients_raw = EXCLUDED.ingredients_raw,
  image_url = EXCLUDED.image_url;

-- ============================================================================
-- FOOD_INGREDIENTS (INSERT IGNORE)
-- ============================================================================

-- Insert 278 record(s) (ignoring duplicates)
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (1, 60),
  (1, 109),
  (1, 113),
  (1, 132),
  (1, 135),
  (1, 136),
  (1, 138),
  (1, 140),
  (1, 163),
  (1, 164),
  (1, 165),
  (1, 166),
  (1, 167),
  (1, 168),
  (1, 169),
  (1, 170),
  (1, 171),
  (1, 172),
  (1, 173),
  (2, 31),
  (2, 109),
  (2, 113),
  (2, 140),
  (2, 167),
  (2, 168),
  (2, 173),
  (2, 181),
  (2, 189),
  (4, 81),
  (4, 99),
  (4, 100),
  (4, 101),
  (4, 109),
  (4, 113),
  (4, 124),
  (4, 125),
  (4, 128),
  (4, 190),
  (4, 191),
  (4, 192),
  (4, 193),
  (4, 194),
  (4, 195),
  (4, 196),
  (4, 197),
  (4, 198),
  (4, 199),
  (4, 200),
  (4, 201),
  (4, 202),
  (4, 203),
  (5, 20),
  (5, 75),
  (5, 81),
  (5, 100),
  (5, 101),
  (5, 108),
  (5, 113),
  (5, 124),
  (5, 128),
  (5, 132),
  (5, 139),
  (5, 140),
  (5, 192),
  (5, 195),
  (5, 197),
  (5, 200),
  (5, 202),
  (5, 204),
  (5, 205),
  (5, 206),
  (5, 207),
  (5, 208),
  (5, 209),
  (6, 129),
  (6, 151),
  (6, 170),
  (6, 202),
  (6, 210),
  (6, 211),
  (6, 212),
  (6, 213),
  (6, 214),
  (6, 215),
  (6, 216),
  (6, 217),
  (6, 218),
  (6, 219),
  (6, 220),
  (6, 221),
  (6, 222),
  (6, 223),
  (6, 224),
  (6, 225),
  (6, 226),
  (6, 227),
  (6, 228),
  (6, 229),
  (6, 230),
  (6, 231),
  (7, 115),
  (7, 129),
  (7, 151),
  (7, 170),
  (7, 202),
  (7, 212),
  (7, 213),
  (7, 217),
  (7, 218),
  (7, 219),
  (7, 220),
  (7, 221),
  (7, 222),
  (7, 223),
  (7, 224),
  (7, 225),
  (7, 226),
  (7, 227),
  (7, 228),
  (7, 229),
  (7, 230),
  (7, 231),
  (7, 232),
  (7, 233),
  (7, 234),
  (7, 235),
  (7, 236),
  (7, 237),
  (7, 238),
  (8, 41),
  (8, 60),
  (8, 79),
  (8, 112),
  (9, 14),
  (9, 20),
  (9, 71),
  (9, 73),
  (9, 99),
  (9, 101),
  (9, 108),
  (9, 174),
  (9, 178),
  (9, 179),
  (9, 181),
  (9, 225),
  (9, 239),
  (9, 240),
  (9, 241),
  (9, 242),
  (9, 243),
  (9, 244),
  (9, 245),
  (9, 246),
  (10, 31),
  (10, 33),
  (10, 71),
  (10, 74),
  (10, 99),
  (10, 101),
  (10, 179),
  (10, 181),
  (10, 225),
  (10, 235),
  (10, 243),
  (10, 244),
  (10, 245),
  (10, 246),
  (10, 247),
  (10, 248),
  (11, 6),
  (11, 60),
  (11, 108),
  (11, 249),
  (11, 250),
  (11, 251),
  (11, 252),
  (11, 253),
  (12, 6),
  (12, 58),
  (12, 60),
  (12, 108),
  (12, 249),
  (12, 251),
  (12, 252),
  (12, 253),
  (12, 254),
  (12, 255),
  (12, 256),
  (13, 68),
  (13, 113),
  (13, 116),
  (13, 135),
  (13, 138),
  (13, 169),
  (13, 202),
  (13, 252),
  (13, 257),
  (13, 258),
  (13, 259),
  (13, 260),
  (13, 261),
  (13, 262),
  (13, 263),
  (14, 3),
  (14, 81),
  (14, 87),
  (14, 88),
  (14, 109),
  (14, 129),
  (14, 151),
  (14, 170),
  (14, 195),
  (14, 212),
  (14, 213),
  (14, 217),
  (14, 218),
  (14, 219),
  (14, 220),
  (14, 222),
  (14, 223),
  (14, 224),
  (14, 225),
  (14, 226),
  (14, 228),
  (14, 229),
  (14, 230),
  (14, 231),
  (14, 265),
  (14, 266),
  (14, 267),
  (14, 268),
  (14, 269),
  (14, 270),
  (14, 271),
  (14, 272),
  (14, 273),
  (14, 274),
  (14, 275),
  (14, 276),
  (14, 277),
  (14, 278),
  (15, 73),
  (15, 116),
  (15, 135),
  (15, 138),
  (15, 154),
  (15, 166),
  (15, 169),
  (15, 173),
  (15, 189),
  (15, 192),
  (15, 197),
  (15, 279),
  (15, 280),
  (15, 281),
  (15, 282),
  (15, 283),
  (16, 19),
  (16, 71),
  (16, 285),
  (16, 286),
  (16, 287),
  (17, 32),
  (17, 72),
  (17, 113),
  (17, 197),
  (17, 288),
  (17, 289),
  (17, 290),
  (17, 291),
  (17, 292),
  (17, 293),
  (17, 294),
  (17, 295),
  (17, 296),
  (17, 297),
  (17, 298),
  (17, 299)
ON CONFLICT (food_id, ingredient_id) DO NOTHING;

-- ============================================================================
-- ARTICLES (UPSERT)
-- ============================================================================

-- Upsert 5 record(s)
INSERT INTO public.articles (id, title, slug, excerpt, content, published) VALUES
  (1, 'Alergie pokarmowe u psów – jak je rozpoznać i co najczęściej je powoduje?', 'alergie-pokarmowe-u-psow-jak-je-rozpoznac-i-co-najczesciej-je-powoduje', 'Alergie pokarmowe to częsty problem. Poznaj objawy takie jak swędzenie skóry, problemy żołądkowo-jelitowe i chroniczne infekcje uszu.', '**Czym są alergie pokarmowe u psów?**
```markdown

```


Coraz więcej właścicieli psów zauważa, że ich pupile nie zawsze dobrze reagują na wszystko, co znajdzie się w misce. Drapanie się, problemy z sierścią czy biegunki to często pierwsze sygnały, że coś jest nie tak. Jednym z powodów takich reakcji może być alergia pokarmowa – czyli nadwrażliwość organizmu psa na konkretny składnik w jedzeniu.
```markdown

```



Alergia pokarmowa to reakcja układu odpornościowego psa na pewne białka obecne w pożywieniu. Organizm psa traktuje dane białko jak „intruza” i zaczyna z nim walczyć – podobnie jak w przypadku infekcji. W efekcie pojawiają się objawy skórne, trawienne lub obie grupy jednocześnie.
```markdown

```


Warto pamiętać, że alergia to nie to samo co nietolerancja pokarmowa. Nietolerancja dotyczy problemów z trawieniem, a nie reakcji układu odpornościowego. Objawy bywają podobne, ale przyczyna jest inna.
```markdown

```


**Najczęstsze alergeny u psów**
```markdown

```
Wbrew pozorom, alergie u psów najczęściej wywołują składniki, które pojawiają się w karmach najczęściej. To właśnie częsty kontakt z danym białkiem może prowadzić do nadwrażliwości.
```markdown

```
Do najczęstszych alergenów u psów należą:
```markdown

```

🐔 **Kurczak**– najczęstszy winowajca alergii pokarmowych.

🐄 **Wołowina**– wartościowe mięso, ale często uczulające.

🧀 **Nabiał** – mleko i sery mogą powodować problemy skórne i żołądkowe.

🥚 **Jajka** – szczególnie białko kurzego jajka.

🌾 **Zboża**– pszenica, kukurydza czy soja.

🐟 **Ryby** – rzadziej, ale również mogą uczulać.
```markdown

```

**Objawy alergii pokarmowej u psów**
```markdown

```

Objawy alergii pokarmowej potrafią być bardzo różne i czasem trudno je jednoznacznie powiązać z dietą. Najczęściej jednak dotyczą skóry i układu pokarmowego.
```markdown

```


►**Objawy skórne:**
```markdown

```
▪ intensywne drapanie się i lizanie łap, brzucha lub pyska,

▪ czerwone plamy, krostki lub łupież,

▪ nadmierne wypadanie sierści,

▪ częste potrząsanie głową lub drapanie uszu (może wskazywać na zapalenie ucha).
```markdown

```
►**Objawy ze strony układu pokarmowego:**
```markdown

```
▪ biegunki lub wymioty,

▪ śluzy w kale, wzdęcia, gazy,

▪ nieprzyjemny zapach z pyska,

▪ utrata apetytu lub chęci do jedzenia.
```markdown

```

Objawy alergii nie muszą pojawić się od razu – czasem reakcja występuje dopiero po dłuższym czasie spożywania uczulającego składnika.

```markdown

```
**Co robić, gdy podejrzewasz alergię u psa?**
```markdown

```

Jeśli Twój pies się drapie, ma problemy z trawieniem lub jego sierść wygląda gorzej niż zwykle – warto działać.
```markdown

```

Pierwszym krokiem powinna być wizyta u weterynarza, który może zaproponować dietę eliminacyjną. Polega ona na stopniowym wykluczaniu potencjalnych alergenów i obserwowaniu reakcji organizmu psa.
```markdown

```

Nie warto zmieniać karmy co kilka dni – wtedy trudno ustalić, co szkodzi. Proces diagnozy wymaga cierpliwości, ale efekty są tego warte.
```markdown

```

**Czy alergię pokarmową da się wyleczyć?**
```markdown

```
Alergii pokarmowych nie da się całkowicie wyleczyć, ale można skutecznie nad nimi zapanować. Najważniejsze to unikać alergenów i dobrać karmę lub dietę, która nie zawiera szkodliwych składników.
```markdown

```
Dobrze dobrane jedzenie potrafi zdziałać cuda – pies staje się spokojniejszy, ma zdrowszą sierść, a jego skóra przestaje swędzieć.
```markdown

```
**Podsumowanie**
```markdown

```
Alergie pokarmowe u psów to coraz częstszy problem, ale też coraz łatwiejszy do opanowania. Obserwacja pupila, odpowiednia dieta i współpraca z weterynarzem to klucz do sukcesu.
```markdown

```
Jeśli Twój pies drapie się, ma problemy z żołądkiem lub często potrząsa głową – być może to nie przypadek, tylko reakcja alergiczna. Gdy już uda się ustalić, co dokładnie szkodzi, życie psa (i Twoje) stanie się o wiele spokojniejsze.', true),
  (2, 'Najczęstsze alergeny w karmach dla psów', 'najczestsze-alergeny-w-karmach-dla-psow', 'Kurczak, wołowina, pszenica i kukurydza to najczęstsze alergeny. Dowiedz się, których składników unikać przy wyborze karmy.', '**🐾 Najczęstsze alergeny w karmach dla psów – na co uważać?**
```markdown

```
Coraz więcej psów zmaga się dziś z alergiami pokarmowymi. Drapanie się, lizanie łap, problemy z uszami, biegunki czy matowa sierść – to tylko część objawów, które mogą świadczyć o tym, że coś w misce Twojego pupila mu nie służy. Ale jak właściwie rozpoznać, co szkodzi psu? I czego unikać w składach karm?
```markdown

```
Zacznijmy od początku – czyli od najczęstszych alergenów w psich karmach.
```markdown

```

**🐔 1. Kurczak – król alergenów**
```markdown

```
Kurczak to jedno z najczęściej używanych mięs w karmach. Nic dziwnego – jest tani, łatwo dostępny i lubiany przez psy. Ale... właśnie dlatego często staje się też przyczyną alergii.
```markdown

```
Układ odpornościowy psa, narażony przez lata na to samo białko, zaczyna je „rozpoznawać” jako coś obcego i reaguje stanem zapalnym.
```markdown

```
W składach karm kurczak może kryć się pod różnymi nazwami:
```markdown

```
▪ **mączka drobiowa** – to suszone i zmielone resztki mięsa, kości i tłuszczu drobiowego (zazwyczaj z kurczaka lub indyka);
```markdown

```
▪ **Mączka z kurczaka** – to samo, ale bezpośrednio z kurczaka. 
```markdown

```
▪ **białko drobiowe, hydrolizowane białko drobiowe, hydrolizat białka drobiowego** – białko rozbite na mniejsze cząsteczki, dzięki czemu ma być łatwiej przyswajalne, ale wciąż może uczulać;
```markdown

```
▪ **mięso z kurczaka, tłuszcz drobiowy, podroby drobiowe.**
```markdown

```
👉 Jeśli Twój pies ma alergię na kurczaka, **unikać należy wszystkich tych form,** nawet jeśli nazwa brzmi „niewinnie”.
```markdown

```

**🐄 2. Wołowina – popularna, ale problematyczna**
```markdown

```
Kolejnym często uczulającym mięsem jest **wołowina**. Choć wielu właścicieli uważa ją za „mocne, zdrowe” mięso, u psów z wrażliwym układem pokarmowym może powodować sporo kłopotów – od świądu po luźne stolce.
```markdown

```
W składach karm znajdziesz ją jako:
```markdown

```
▪ **mięso wołowe, mączka wołowa, białko wołowe,**
```markdown

```
▪ **produkty pochodzenia zwierzęcego (wołowe)** – to ogólne określenie, za którym może kryć się różna jakość składników.
```markdown

```
🐕‍🦺 Jeśli chcesz sprawdzić, czy to wołowina szkodzi Twojemu psu, wybierz karmę **monobiałkową** (czyli z jednym źródłem białka) – np. z jagnięciną albo rybą.
```markdown

```

**🐟 3. Ryby i oleje rybne**
```markdown

```
Zaskakująco, nawet **ryby** potrafią uczulać! Choć często poleca się je psom z alergiami (bo to źródło kwasów omega-3 i łatwo przyswajalnego białka), niektóre psy nie tolerują np. **łososia** czy **śledzia**.
```markdown

```
Warto wiedzieć, że rybie składniki kryją się nie tylko pod nazwą „ryba”, ale też:
```markdown

```
▪ **mączka rybna** – suszone i zmielone mięso ryb;
```markdown

```
▪ **olej z łososia, olej rybny** – źródło tłuszczu, ale też potencjalny alergen;
```markdown

```
▪ **hydrolizowane białko rybne** – rozbite białko z ryb.
```markdown

```
🐠 Jeśli Twój pies reaguje źle na karmę z rybami, zwróć uwagę również na suplementy – wiele z nich zawiera olej rybny!

```markdown

```

**🐑 4. Jagnięcina – rzadziej, ale jednak**
```markdown

```
Przez wiele lat jagnięcina była „bezpiecznym” wyborem dla psów alergików. Niestety, im częściej zaczęła pojawiać się w karmach, tym częściej też uczula.
```markdown

```
Warto pamiętać, że **reakcja alergiczna zależy nie tylko od rodzaju mięsa, ale i od jego przetworzenia** – w tanich karmach białko bywa gorszej jakości i bardziej alergizujące.
```markdown

```
W składach karm jagnięcinę znajdziesz jako:
```markdown

```
▪ **mączka jagnięca, białko jagnięce, mięso jagnięce.**
```markdown

```
Jeśli Twój pies reaguje na kurczaka, a chcesz spróbować czegoś nowego – jagnięcina często jest pierwszym wyborem, ale obserwuj reakcję pupila.

```markdown

```

**🥛 5. Nabiał i produkty mleczne**
```markdown

```
Nie każdy pies toleruje laktozę. U niektórych wystarczy odrobina mleka, żeby pojawiły się gazy, biegunka czy drapanie się.
```markdown
```
W karmach mleko lub jego pochodne występują pod nazwami:
```markdown
```
▪ **białko mleka, serwatka, mleko w proszku, kazeina.**
```markdown

```
🐶 Lepiej unikać karm z dodatkiem nabiału, jeśli pies ma wrażliwy żołądek lub już kiedyś miał problemy po zjedzeniu produktów mlecznych.
```markdown

```

**🌾 6. Zboża i gluten**
```markdown

```
To temat, który budzi emocje. Nie wszystkie psy źle reagują na zboża, ale niektóre rzeczywiście źle znoszą gluten (białko pszenicy).
```markdown
```
Najczęściej uczulają:
```markdown

```
▪ **pszenica, kukurydza, soja, jęczmień, żyto.**
```markdown

```
Warto wiedzieć, że karmy bezzbożowe często używają innych źródeł węglowodanów, np. ziemniaków, batatów czy grochu. Ale i te składniki mogą czasem uczulać – dlatego **nie ma jednej karmy dobrej dla wszystkich psów.**
```markdown

```

**🥩 7. Inne potencjalne alergeny**
```markdown

```
Niektóre psy reagują też na mniej oczywiste składniki, np.:
```markdown

```
▪ **jajka** (białko jaja kurzego),
```markdown

```
▪ **wieprzowinę,**
```markdown

```
▪ **kaczkę,**
```markdown

```
▪ **konserwanty i barwniki** – np. sztuczne aromaty czy utwardzacze tłuszczu.
```markdown

```
Właśnie dlatego warto wybierać karmy **z krótkim i prostym składem** – im mniej dodatków, tym mniejsze ryzyko uczulenia.
```markdown

```

**📋 Jak czytać skład karmy?**
```markdown

```
Oto kilka prostych zasad:
```markdown

```
1.**Pierwsze trzy składniki** – to zwykle główne źródła białka i tłuszczu. Jeśli na początku jest „mączka drobiowa” – to znaczy, że karma zawiera kurczaka.
```markdown

```
2.**„Produkty pochodzenia zwierzęcego”** – to bardzo ogólne określenie, które nie mówi nic o jakości ani rodzaju mięsa. Lepiej, gdy producent jasno podaje źródło białka.
```markdown

```
3.**Hydrolizowane białko** – brzmi „naukowo”, ale to po prostu rozbite białko, które czasem uczula mniej, a czasem wcale.
```markdown

```
4.**Unikaj sztucznych dodatków** – jeśli skład zawiera dużo trudnych do wymówienia nazw, to zwykle nie jest dobry znak.
```markdown


```
**🧐 Na co uważać w składach karm?**
```markdown

```
🔸 Im **bardziej ogólna** nazwa składnika, tym większe prawdopodobieństwo, że kryje się za nią drób.
```markdown

```
🔸 Jeśli karma ma w nazwie „z jagnięciną”, „z rybą” czy „z dziczyzną”, to **nie znaczy**, że nie ma w niej kurczaka-  podany na etykiecie rodzaj mięsa jest tylko dodatkiem do pozostałych gatunków mięsa, często nawet nieokreślonych, jak „produkty pochodzenia zwierzęcego”.
```markdown

```



**🐾 Podsumowanie**
```markdown

```
Najczęstsze alergeny w psich karmach to:
```markdown

```
🐔 kurczak
```markdown

```
🐄 wołowina
```markdown

```
🐟 ryby (łosoś, śledź)
```markdown

```
🐑 jagnięcina
```markdown

```
🥛 nabiał
```markdown

```
🌾 zboża (pszenica, kukurydza, soja)
```markdown

```
🥚 jajka
```markdown

```
Jeśli Twój pies ma problemy skórne lub trawienne, warto spojrzeć na etykietę karmy z nowej perspektywy. Czasem wystarczy **zmiana jednego składnika**, by wrócił komfort i zdrowie Twojego pupila 🐶❤️
', true),
  (3, 'Dieta eliminacyjna - jak ją przeprowadzić?', 'dieta-eliminacyjna-jak-ja-przeprowadzic', 'Skuteczna metoda diagnozowania alergii. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-10 tygodni.', '**Dieta eliminacyjna u psów – co to jest i kiedy warto ją wprowadzić?**
```markdown

```
Zdarza się, że nasz pies zaczyna się drapać bez końca, ma problemy skórne, łzawiące oczy, a czasem nawet kłopoty z żołądkiem. Wtedy wielu właścicieli zastanawia się: „czy to może być alergia?”. Bardzo możliwe! 
Jednym ze sposobów, by to sprawdzić i pomóc pupilowi, jest **dieta eliminacyjna**. Brzmi poważnie, ale spokojnie — to nic trudnego. Poniżej wyjaśnię, o co w niej chodzi i jak wprowadzić ją krok po kroku.
```markdown

```

```markdown

```
**Co to jest dieta eliminacyjna?**
```markdown

```
Dieta eliminacyjna to sposób żywienia psa, który ma pomóc ustalić, **na co dokładnie pies jest uczulony**. Mówiąc prosto — chodzi o to, żeby usunąć z diety wszystkie możliwe alergeny (czyli składniki, które mogą powodować reakcję alergiczną), a potem stopniowo sprawdzać, które z nich wywołują problemy.
```markdown

```
Najczęściej alergię powoduje **białko pochodzenia zwierzęcego**, np. z kurczaka 🐔 , wołowiny 🐄 , ryby 🐟 czy jaj 🥚 .  Ale winowajcą mogą być też dodatki w karmie, konserwanty czy nawet niektóre zboża. Dieta eliminacyjna pozwala to wszystko uporządkować i dowiedzieć się, co naprawdę szkodzi naszemu psu.
```markdown

```

**Kiedy warto zastosować dietę eliminacyjną?**
```markdown

```
Jeśli Twój pies:
```markdown

```
▪  często się drapie, ma łupież lub zaczerwienioną skórę,
```markdown

```
▪ wylizuje łapy, uszy lub ogon,
```markdown

```
▪ ma nawracające zapalenia uszu,
```markdown

```
▪ wymiotuje, ma biegunki lub wzdęcia bez wyraźnej przyczyny,
```markdown

```
▪ albo po prostu „coś mu nie służy”, mimo że weterynarz nie znajduje infekcji —
```markdown

```
to znak, że **dieta eliminacyjna może być dobrym krokiem.**
```markdown

```
Oczywiście zawsze warto wcześniej skonsultować się z weterynarzem. Czasem podobne objawy mogą mieć inne przyczyny, np. pasożyty, infekcje skórne czy problemy hormonalne. Ale jeśli badania nic nie pokazują – dieta eliminacyjna to kolejny logiczny krok.
```markdown

```

**Jak przeprowadzić dietę eliminacyjną krok po kroku?**
```markdown

```
Są dwa główne podejścia, w zależności od tego, jak silne są objawy u psa.
```markdown

```

**1. Klasyczna dieta eliminacyjna – krok po kroku**
```markdown

```
To najczęściej stosowana metoda.
```markdown

```
Polega na tym, że przez **8–10 tygodni pies je tylko jeden rodzaj białka i jeden rodzaj węglowodanów,** których wcześniej **nie dostawał.**
Na przykład:
```markdown

```
▪ mięso z królika + bataty,
```markdown

```
▪ kaczka + ryż,
```markdown

```
▪ jagnięcina + ziemniaki.
```markdown

```
Ważne, żeby nie podawać absolutnie nic innego – żadnych smaczków, resztek ze stołu, ani przekąsek, nawet jeśli „to tylko kawałeczek”. Każdy taki „kawałeczek” może zepsuć cały test.
```markdown

```
Po tym okresie, jeśli objawy alergii ustąpią, można zacząć **stopniowo wprowadzać nowe źródła białka,** jedno po drugim.
Przykład:
```markdown

```
1.Przez 8 tygodni pies je królika + bataty.
```markdown

```
2.Potem dodajesz np. trochę kurczaka – i obserwujesz psa przez 1–2 tygodnie.
```markdown

```
3.Jeśli wszystko jest OK – kurczak zostaje. Jeśli objawy wracają – kurczak odpada.
```markdown

```
Tak krok po kroku budujesz listę „dozwolonych” i „zakazanych” produktów dla swojego psa.
```markdown

```

**2. Dieta oparta na karmie weterynaryjnej z białkiem hydrolizowanym lub roślinnym**
```markdown

```
Czasem pies ma tak silne objawy (np. ciągłe drapanie, ranki, owrzodzenia, biegunki), że **nie da się od razu sprawdzać konkretnych białek.** Wtedy warto najpierw **uspokoić organizm.**
W takiej sytuacji weterynarz może zalecić **specjalną karmę weterynaryjną,** która nie zawiera typowych białek zwierzęcych. 
```markdown

```
Często są to karmy:
```markdown

```
▪   z **hydrolizowanym białkiem** – czyli takim rozbitym na bardzo małe cząsteczki, których układ odpornościowy nie rozpoznaje jako „alergenów”,
```markdown

```
▪   z **białkiem roślinnym**, np. z soi lub ziemniaka.
```markdown

```
**Alternatywa: karma z białkiem z insektów**
```markdown

```
Coraz większą popularność zdobywają karmy oparte na białku z owadów, np. z larw muchy Hermetia illucens. To tzw. „nowe białko”, którego większość psów wcześniej nie jadła, dzięki czemu świetnie sprawdza się w diecie eliminacyjnej. Białko z insektów jest pełnowartościowe, lekkostrawne i bardzo rzadko uczula. Warto rozważyć takie karmy jako alternatywę, szczególnie jeśli pies reaguje źle na większość tradycyjnych mięs. 
```markdown

```

Celem takiej diety jest **wyciszenie reakcji alergicznej.**
Zazwyczaj trwa to 6–8 tygodni.
Dopiero po tym czasie, kiedy objawy znikną, można powoli przechodzić do klasycznej diety eliminacyjnej, czyli zaczynać testowanie nowych białek.
```markdown

```
To podejście bywa skuteczniejsze w przypadkach mocnych alergii, bo daje psu czas na regenerację i odciążenie układu odpornościowego.
```markdown

```

**Jakie korzyści daje dieta eliminacyjna?**
```markdown

```
Dobrze przeprowadzona dieta eliminacyjna:
```markdown

```
▪   pomaga ustalić dokładną przyczynę alergii,
```markdown

```
▪   poprawia kondycję skóry i sierści,
```markdown

```
▪   redukuje świąd i drapanie,
```markdown

```
▪   uspokaja układ trawienny,
```markdown

```
▪   poprawia ogólne samopoczucie psa.

```markdown

```
Dodatkowo właściciel zyskuje **świadomość, co naprawdę służy jego psu,** a co lepiej omijać szerokim łukiem.
```markdown

```

**Na co uważać podczas diety eliminacyjnej?**
```markdown

```
▪   **Cierpliwość to podstawa.** Pierwsze efekty mogą być widoczne dopiero po kilku tygodniach.
```markdown

```
▪   **Nie kombinuj zbyt wcześnie.** Jeśli pies dobrze reaguje na daną karmę – nie zmieniaj jej bez powodu.
```markdown

```
▪   **Zawsze czytaj etykiety.** Wiele karm zawiera „niespodzianki” w postaci białek drobiowych czy rybnych, nawet jeśli w nazwie widnieje „z jagnięciną”.
```markdown

```
▪   **Pamiętaj o suplementacji.** Przy dłuższej diecie domowej warto zadbać o witaminy i minerały – najlepiej po konsultacji z weterynarzem.
```markdown

```

Poniżej przedstawiam kilka gotowych karm bez typowego mięsa, które właściciel może rozważyć w wariancie uspokojenia organizmu — pamiętaj jednak, by skonsultować wybór z weterynarzem.
```markdown

```
▪  **Yarrah Organic Vegan Dog Food**– pełnoporcjowa karma wegańska, zawierająca białka roślinne (np. soja, białko z ryżu) i bez typowego mięsa.
```markdown

```
▪  **GREEN PETFOOD VeggieDog Grainfree** – sucha karma wegańska, bez mięsa, alternatywa dla psów z alergiami na białka zwierzęce.
```markdown

```
▪  **Brit Care Free Veterinary Diets Dog Ultra-Hypoallergic**– sucha karma z owadami jako główne i jedyne białko „zwierzęce”
```markdown

```
▪  **WOW Dog Vegan**– karma wegańska dla dorosłych psów – kolejna wegańska propozycja, na rynku polskim, dla dorosłych psów.
```markdown

```
▪  **Brit GF Veterinary Care Dog Veg Fibre** – karma weterynaryjna typu „vege”, zaprojektowana dla psów z wrażliwością pokarmową.
```markdown

```
▪  **VEGDOG Simply Crunch** wegańska sucha karma – sucha karma wegańska, dobra opcja jako długotrwała dieta eliminacyjna bez białka zwierzęcego.
```markdown

```

**Podsumowanie**
```markdown

```
Dieta eliminacyjna to jedno z najlepszych narzędzi w walce z alergiami u psów. Nie wymaga skomplikowanej wiedzy ani kosztownych badań, ale za to wymaga **konsekwencji i cierpliwości.**
```markdown

```
Jeśli Twój pies cierpi na alergię, spróbuj podejść do tematu spokojnie. Czasem wystarczy kilka tygodni, by jego skóra się uspokoiła, sierść nabrała blasku, a pies znów cieszył się życiem.
```markdown

```
Dzięki diecie eliminacyjnej nie tylko poprawisz komfort życia swojego pupila, ale też poznasz go lepiej niż kiedykolwiek wcześniej.
', true),
  (4, 'Karmy hipoalergiczne - co warto wiedzieć?', 'karmy-hipoalergiczne-co-warto-wiedziec', 'Karmy z hydrolizowanym białkiem lub rzadkimi źródłami protein minimalizują ryzyko alergii. Zobacz, czym różnią się od zwykłych karm.', '**🐾 Karmy hipoalergiczne dla psów – kiedy warto po nie sięgnąć?🐾**
```markdown

```
Coraz więcej psów zmaga się dziś z alergiami pokarmowymi. Jeśli Twój pupil często się drapie, ma problemy z sierścią, biegunką lub wymiotami, bardzo możliwe, że winny jest właśnie jego posiłek. W takiej sytuacji wielu właścicieli słyszy od weterynarza jedno hasło: **karma hipoalergiczna.**
```markdown
``` 
Ale co to właściwie znaczy i czy naprawdę działa?
```markdown

```

**Czym jest karma hipoalergiczna?**
```markdown

```
Karma hipoalergiczna to specjalny rodzaj pożywienia opracowany z myślą o psach, które źle reagują na niektóre składniki pokarmowe. W odróżnieniu od zwykłej karmy, zawiera **ograniczoną liczbę składników** – tylko te, które rzadko uczulają i są łatwe do strawienia.
```markdown

```
Najczęściej w takich karmach używa się **jednego rodzaju białka** (tzw. formuła monobiałkowa), np. z jagnięciny, łososia czy królika. Dzięki temu łatwiej zidentyfikować, który składnik powoduje reakcję alergiczną, a organizm psa może się „uspokoić”.
```markdown

```

**Dlaczego psy mają alergie pokarmowe?**
```markdown

```
Alergia pokarmowa to **nadmierna reakcja układu odpornościowego** na konkretny składnik w jedzeniu. Najczęściej uczulają białka zwierzęce – np. z kurczaka, wołowiny, jaj czy nabiału, ale też zboża jak pszenica czy kukurydza.
```markdown

```
Objawy alergii mogą być różne: świąd skóry, drapanie się, łzawiące oczy, biegunki, wzdęcia czy problemy z uszami. Co ciekawe, alergia może się pojawić nawet po latach jedzenia tej samej karmy – organizm po prostu przestaje ją dobrze tolerować.
```markdown

```

**Kiedy warto sięgnąć po karmę hipoalergiczną?**
```markdown

```
Karmy hipoalergiczne poleca się psom, które:
```markdown

```
▪  mają objawy alergii (świąd, wysypki, łupież, problemy trawienne),
```markdown

```
▪  cierpią na nietolerancję pokarmową,
```markdown

```
▪  mają przewlekłe zapalenie uszu lub skóry,
```markdown

```
▪  wymagają tzw. diety eliminacyjnej (czyli testowania, co im szkodzi).
```markdown

```
Ale po takie karmy sięga się też profilaktycznie – np. u psów o wrażliwym żołądku, po antybiotykach lub u szczeniąt, które dopiero uczą się trawić nowe pokarmy.
```markdown

```

**Jakie są rodzaje karm hipoalergicznych?**
```markdown

```
Karmy hipoalergiczne można podzielić według sposobu przygotowania i rodzaju użytego białka. To właśnie **białko** jest najczęściej powodem alergii, dlatego jego źródło ma ogromne znaczenie.
```markdown

```
1.**Karmy monobiałkowe (jednobiałkowe)**
```markdown

```
Zawierają tylko **jedno źródło białka zwierzęcego**, np. tylko z królika, jagnięciny, ryby lub kaczki.
```markdown
```
Dzięki temu łatwo sprawdzić, czy pies dobrze toleruje dany rodzaj mięsa. Takie karmy są idealne do diety eliminacyjnej – jeśli pies po kilku tygodniach czuje się lepiej, wiadomo, że wcześniejsze białko mu nie służyło.
```markdown

```
Najczęściej spotykane białka w karmach monobiałkowych:
```markdown

```
▪  **Jagnięcina** – delikatna, lekkostrawna, bogata w żelazo i witaminy z grupy B.
```markdown

```
▪  **Królik** – jedno z najbezpieczniejszych mięs dla alergików, niskotłuszczowe i dobrze przyswajalne.
```markdown

```
▪  **Kaczka** – aromatyczna i smakowita, dobra alternatywa dla psów, które nie mogą jeść kurczaka.
```markdown

```
▪  **Indyk**– lekkostrawny i łagodny dla żołądka.
```markdown

```
▪  **Ryby (łosoś, pstrąg, tuńczyk)**– oprócz białka dostarczają też cennych kwasów omega-3, które wspierają skórę i sierść.
```markdown

```
▪  **Dziczyzna, konina, koźlina** – rzadko uczulają, dlatego są częstym wyborem w karmach premium.
```markdown

```

2.**Karmy z hydrolizowanym białkiem**
```markdown

```
W tego typu karmach białko jest **rozbite na bardzo małe cząsteczki** (hydrolizowane), które układ odpornościowy psa „nie rozpoznaje” jako zagrożenie.
```markdown
```
Dzięki temu nie wywołują one reakcji alergicznej, nawet u bardzo wrażliwych psów.
```markdown
```
Tego rodzaju karmy są często stosowane w leczeniu alergii, zwłaszcza gdy trudno jest ustalić, na co dokładnie pies jest uczulony. Zazwyczaj są to produkty weterynaryjne, dostępne w gabinetach lub aptekach zoologicznych.
```markdown

```

3.**Karmy z alternatywnymi źródłami białka (np. z insektów)**
```markdown

```
To coraz popularniejsza nowość na rynku. **Karmy z owadów** są nie tylko hipoalergiczne, ale też ekologiczne i bardzo odżywcze.
```markdown

```
Białko owadzie (najczęściej z larw muchy czarnego żołnierza – Black Soldier Fly – lub mącznika młynarka) jest **doskonale przyswajalne** i zawiera wszystkie niezbędne aminokwasy, tak jak mięso drobiowe czy rybie.
```markdown
```
Dodatkowo nie powoduje typowych reakcji alergicznych, bo psy rzadko miały wcześniej kontakt z takim białkiem – ich układ odpornościowy go „nie zna”, więc nie reaguje agresywnie.
```markdown
```
Zalety karm z insektów:
```markdown

```
▪  bardzo wysoka strawność,
```markdown

```
▪  bogactwo aminokwasów, witamin i minerałów,
```markdown

```
▪  wspierają środowisko – produkcja białka z owadów wymaga mniej wody i ziemi niż hodowla zwierząt,
```markdown

```
▪  praktycznie zerowe ryzyko alergii.
```markdown

```
Dla wielu właścicieli może brzmieć to nietypowo, ale psy nie mają uprzedzeń – większość z nich zjada takie karmy z apetytem.

```markdown

```

**Czym różni się karma hipoalergiczna od zwykłej?**
```markdown

```
Zwykła karma dla psów często zawiera wiele różnych rodzajów mięsa, zbóż i dodatków smakowych. Dla psa z alergią to prawdziwe wyzwanie.
```markdown
```
Karmy hipoalergiczne mają prosty, przejrzysty skład – bez zbędnych konserwantów, barwników czy wypełniaczy. Dzięki temu są:
```markdown
```
▪  bezpieczniejsze dla układu pokarmowego,
```markdown

```
▪  łatwiejsze do strawienia,
```markdown

```
▪  mniej obciążające dla skóry i sierści.
```markdown

```
Efekt? Mniej drapania, mniej problemów żołądkowych, a więcej energii i komfortu dla pupila.
```markdown

```



**Dla jakich psów karma hipoalergiczna będzie odpowiednia?**
```markdown

```
Nie tylko dla alergików!
```markdown

```
Świetnie sprawdzi się także u psów:
```markdown

```
▪  z wrażliwym układem pokarmowym,
```markdown

```
▪  po chorobach i antybiotykoterapii,
```markdown

```
▪  o delikatnej skórze i matowej sierści,
```markdown

```
▪  z problemami trawiennymi (wzdęcia, biegunki).
```markdown

```
Dzięki lekkostrawnym składnikom i braku alergenów, taka karma pomaga wrócić do równowagi i poprawia ogólne samopoczucie zwierzaka.
```markdown

```

**Podsumowanie**
```markdown

```
Karma hipoalergiczna to nie chwilowa moda, ale realna pomoc dla psów z alergiami i wrażliwym żołądkiem.
```markdown

```
Wybierając odpowiednią – czy to z jagnięciny, królika, ryby, czy nawet z insektów – możesz znacząco poprawić komfort życia swojego pupila.
```markdown

```
Zdrowe jedzenie to zdrowy pies – a zdrowy pies to szczęśliwy opiekun. 🐾
', true),
  (5, 'Rola kwasów omega-3 w diecie alergika', 'rola-kwasow-omega-3-w-diecie-alergika', 'Kwasy omega-3 mają właściwości przeciwzapalne i pomagają złagodzić objawy alergii skórnych. Poznaj korzyści suplementacji.', '**Kwasy Omega-3 a alergie pokarmowe u psów – dlaczego warto je suplementować?**
```markdown

```
Coraz więcej psów zmaga się dziś z alergiami pokarmowymi. Swędzenie skóry, drapanie, lizanie łap, łupież, wypadanie sierści czy nawracające infekcje uszu – to tylko kilka z objawów, które mogą świadczyć o tym, że Twój pupil reaguje źle na któryś ze składników karmy. 
```markdown

```
W walce z alergiami u psów bardzo pomocne okazują się **kwasy tłuszczowe omega-3**. Choć brzmią jak coś, co znajdziesz w sklepie dla kulturystów, to w rzeczywistości są jednym z najprostszych i najbardziej naturalnych sposobów na wsparcie skóry, sierści i układu odpornościowego psa.
```markdown

```
**Dlaczego kwasy omega-3 są tak ważne?**
```markdown

```
Kwasy omega-3 to zdrowe tłuszcze, które mają silne działanie przeciwzapalne. U psów z alergiami pokarmowymi w organizmie często dochodzi do stanu zapalnego – głównie skóry i jelit. Właśnie wtedy omega-3 potrafią zdziałać cuda.
```markdown

```
Działają one jak „strażacy” – gaszą zapalenie od środka, łagodząc świąd, zmniejszając zaczerwienienia i wspierając regenerację skóry.
```markdown

```
W naturze psy otrzymywały omega-3 z jedzenia – np. z tłustych ryb, takich jak łosoś czy sardynki. Niestety większość gotowych karm (nawet tych droższych) zawiera zbyt mało tych kwasów, bo są one bardzo delikatne i łatwo ulegają utlenieniu w procesie produkcji. Dlatego warto dostarczać je dodatkowo, w formie suplementu.
```markdown

```
**Jak kwasy omega-3 pomagają przy alergiach pokarmowych?**
```markdown

```
U psów z alergią pokarmową układ odpornościowy przesadnie reaguje na pewne białka lub składniki w jedzeniu. Prowadzi to do stanu zapalnego, który objawia się na skórze i w jelitach.
Kwasy omega-3 (głównie EPA i DHA) pomagają w trzech głównych obszarach:
```markdown

```
**▪ Zmniejszają stan zapalny** – ograniczają produkcję substancji odpowiedzialnych za świąd i podrażnienia skóry.
```markdown

```
**▪ Poprawiają wygląd sierści i skóry** – regularne stosowanie omega-3 sprawia, że sierść staje się błyszcząca, a skóra mniej sucha.
```markdown

```
**▪ Wspierają jelita** – a to bardzo ważne, bo większość odporności psa „mieszka” właśnie w układzie pokarmowym.
```markdown

```
Efekty suplementacji nie są natychmiastowe, ale zazwyczaj po 4–6 tygodniach można zauważyć wyraźną poprawę kondycji skóry i sierści, a także mniejsze nasilenie objawów alergii.
```markdown

```
**W jakiej formie podawać omega-3 psu?**
```markdown

```
Najczęściej spotykane formy suplementów z omega-3 dla psów to:
```markdown

```
**▪  Olej z łososia** – najpopularniejszy i zwykle najlepiej tolerowany. Ma łagodny smak, który większości psów bardzo odpowiada.
```markdown

```
**▪  Olej z kryla**– bogaty w przeciwutleniacze, trochę droższy, ale bardzo skuteczny.
```markdown

```
**▪  Olej z sardeli, makreli lub śledzia** – alternatywa dla psów uczulonych na łososia.
```markdown

```
**▪  Kapsułki z omega-3** – dobre rozwiązanie, jeśli pies nie lubi smaku rybnych olejów, ale łatwiej podać je większym psom niż małym.
```markdown

```
Ważne, by wybierać produkty przeznaczone specjalnie dla zwierząt, z czystych źródeł i przebadane pod kątem zawartości metali ciężkich. Oleje przeznaczone dla ludzi często mają dodatki smakowe lub witaminy w dawkach, które nie są odpowiednie dla psa.
```markdown

```
**Jak dawkować omega-3 u psów?**
```markdown

```
Dawkowanie zależy od **wagi, wieku i ogólnego stanu zdrowia** psa, ale można kierować się ogólnymi zasadami:
```markdown

```
▪ Małe psy (do 10 kg): ok. 250–500 mg EPA + DHA dziennie
```markdown

```
▪ Średnie psy (10–25 kg): 500–1000 mg EPA + DHA dziennie
```markdown

```
▪ Duże psy (25–40 kg): 1000–1500 mg EPA + DHA dziennie
```markdown

```
▪ Bardzo duże psy (powyżej 40 kg): 1500–2000 mg EPA + DHA dziennie
```markdown

```
Jeśli Twój pies cierpi na silne alergie, weterynarz może zalecić wyższe dawki na początku, a potem przejście na dawkę podtrzymującą. Warto zacząć od mniejszej ilości i stopniowo ją zwiększać – by układ pokarmowy psa miał czas się przyzwyczaić.
```markdown

```
U szczeniąt i starszych psów omega-3 są również bardzo wskazane, ale dawkę warto omówić z weterynarzem – u młodych pomagają w rozwoju mózgu, a u seniorów wspierają stawy i serce.
```markdown

```
**Jak podawać suplementy, żeby pies chętnie je zjadł?**
```markdown

```
Większość psów uwielbia smak oleju z łososia, więc wystarczy kilka kropel na karmę. Olej najlepiej podawać **raz dziennie z posiłkiem** – tłuszcz w jedzeniu ułatwia jego wchłanianie.
Uważaj tylko, żeby nie przechowywać oleju w cieple ani na słońcu. Omega-3 są bardzo wrażliwe i szybko się utleniają, więc najlepiej trzymać butelkę w lodówce i zużyć w ciągu kilku tygodni od otwarcia.
```markdown

```
**Na co zwrócić uwagę przy wyborze suplementu?**
```markdown

```
Kupując omega-3 dla psa, zwróć uwagę na:
```markdown

```
▪ **Zawartość EPA i DHA** – to właśnie one mają największe znaczenie dla skóry i odporności.
```markdown

```
▪ **Źródło ryb** – im czystsze wody, tym lepiej (np. Islandia, Norwegia).
```markdown

```
▪ **Forma podania**– czy olej, kapsułki, czy smakowy spray – wybierz tę, którą pies najlepiej akceptuje.
```markdown

```
▪ **Certyfikaty jakości** – np. IFOS, które potwierdzają czystość produktu.
```markdown

```
**Podsumowanie**
```markdown

```
Kwasy omega-3 to jeden z najprostszych, a zarazem najskuteczniejszych sposobów, by wspomóc psa z alergią pokarmową. Regularna suplementacja łagodzi stany zapalne, poprawia wygląd sierści, wzmacnia odporność i wspiera układ pokarmowy.
```markdown

```
Nie zastąpi oczywiście eliminacyjnej diety czy leczenia weterynaryjnego, ale może być ogromnym wsparciem w procesie powrotu do komfortowego życia bez ciągłego drapania i podrażnień.
```markdown

```
Warto pamiętać, że każdy pies jest inny – dlatego najlepiej skonsultować suplementację z weterynarzem, szczególnie jeśli pies przyjmuje leki lub ma inne schorzenia.
```markdown

```
Jeśli chcesz pomóc swojemu pupilowi czuć się lepiej, wprowadzenie kwasów omega-3 do jego codziennej diety to krok w dobrą stronę. Jego sierść, skóra – i samopoczucie – na pewno Ci za to podziękują.
', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  published = EXCLUDED.published;

-- ============================================================================
-- PODSUMOWANIE
-- ============================================================================

-- Wygenerowano: 28.12.2025, 19:19:41
-- Brands: 8
-- Size types: 3
-- Age categories: 4
-- Ingredients: 292
-- Allergens: 59
-- Ingredient-Allergen mappings: 276
-- Foods: 16
-- Food-Ingredient mappings: 278
-- Articles: 5

-- ✅ Plik gotowy do wklejenia do Supabase Dashboard → SQL Editor
