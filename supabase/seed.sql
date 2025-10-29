-- Seed data for ZwierzakBezAlergii
-- Auto-generated on 2025-10-29T21:29:02.908Z
-- This file contains all data exported from Supabase database

-- ============================================================================
-- BRANDS
-- ============================================================================

INSERT INTO public.brands (id, name) VALUES
  (1, 'Brit Care'),
  (2, 'Royal Canin'),
  (3, 'Acana'),
  (4, 'Taste of the Wild'),
  (5, 'Carnilove'),
  (6, 'Josera');

-- ============================================================================
-- SIZE_TYPES
-- ============================================================================

INSERT INTO public.size_types (id, name) VALUES
  (1, 'mały'),
  (2, 'średni'),
  (3, 'duży');

-- ============================================================================
-- AGE_CATEGORIES
-- ============================================================================

INSERT INTO public.age_categories (id, name) VALUES
  (1, 'szczeniak'),
  (2, 'junior'),
  (3, 'dorosły'),
  (4, 'senior');

-- ============================================================================
-- INGREDIENTS
-- ============================================================================

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
  (175, 'woĺ‚owina'),
  (176, 'jagniä™cina suszona'),
  (177, 'tłuszcz wołowy'),
  (178, 'białko ziemniaczane'),
  (179, 'bataty');

-- ============================================================================
-- ALLERGENS (Main categories)
-- ============================================================================

-- ============================================================================
-- ALLERGENS
-- ============================================================================

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
  (57, 'czosnek', NULL);

-- Reset sequence for allergens
SELECT setval('public.allergens_id_seq', (SELECT MAX(id) FROM public.allergens));

-- ============================================================================
-- ALLERGENS (Sub-categories)
-- ============================================================================

-- ============================================================================
-- ALLERGENS
-- ============================================================================

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
  (55, 'soja', 6);

-- ============================================================================
-- INGREDIENT_ALLERGENS
-- ============================================================================

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
  (167, 49);

-- ============================================================================
-- FOODS
-- ============================================================================

INSERT INTO public.foods (id, name, brand_id, size_type_id, age_category_id, ingredients_raw, image_url) VALUES
  (1, 'Brit Care Adult Jagnięcina z Ryżem', 1, 2, 3, 'Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, wytłoki z jabłek, olej z łososia (3%), drożdże piwowarskie, naturalny aromat, hydrolizowane drożdże (0,5%), mączka grochowa, glukozamina (300 mg/kg), fruktooligosacharydy (230 mg/kg), siarczan chondroityny (230 mg/kg), mannan-oligosacharydy (180 mg/kg), jukka (180 mg/kg), ostropest plamisty (110 mg/kg), beta-glukany (60 mg/kg), serdecznik (60 mg/kg), rokitnik (60 mg/kg), probiotyki Lactobacillus helveticus (15x109 komórek/kg)', '/images/foods/brit-care-jagniecina-medium-adult.jpg'),
  (2, 'Brit Care Bezzbożowa Łosoś z Ziemniakiem', 1, 1, 3, 'Łosoś (50%, odwodniony, hydrolizowany), ziemniaki (26%), suszona pulpa jabłkowa, tłuszcz z kurczaka, olej z łososia (3%), naturalny aromat, mączka grochowa, glukozamina (260 mg/kg), fruktooligosacharydy (200 mg/kg), siarczan chondroityny (200 mg/kg), mannan-oligosacharydy (150 mg/kg), Mojave yucca (150 mg/kg), nasiona ostropestu plamistego (90 mg/kg), β-glukany (50 mg/kg), suszone ziele serdecznika (50 mg/kg), suszony rokitnik (50 mg/kg), probiotyk Lactobacillus helveticus HA - 122 inaktywowany (15x109 komórek/kg).', '/images/foods/brit-care-salmon-adult-small.jpg'),
  (4, 'Carnilove Kaczka z Bażantem', 5, 2, 3, 'mączka z kaczki (30%), mączka z bażanta (22%), groch żółty (20%), tłuszcz kurczęcy (źródło tokoferoli, 8%), kaczka bez kości (5%), wątroba kurczęca (3%), jabłka (3%), skrobia z tapioki (3%), olej z łososia (2%), marchew (1%), siemię lniane (1%), ciecierzyca (1%), hydrolizowane skorupiaki (źródło glukozaminy, 0,026%), ekstrakt z chrząstki (źródło chondroityny, 0,016%), drożdże browarnicze (źródło mannanooligosacharydów, 0,015%), korzeń cykorii (źródło fruktooligosacharydów, 0,01%), juka (0,01 %), algi (0,01%), psylium (0,01%), tymianek (0,01%), rozmaryn (0,01%), oregano (0,01%), żurawina (0,0008%), borówki (0,0008%), maliny ( 0,0008%)', '/images/foods/Carnilove-kaczka-z-bazantem.jpg'),
  (5, 'Carnilove Jagnięcina z Dzikiem', 5, 3, 3, 'mączka z dziczyzny (30%), mączka z jagnięciny z wolnego wybiegu (25%), groch żółty (20%), tłuszcz drobiowy (konserwowany tokoferolami) (10%), wątróbka z kurczaka (3%), jabłka (3%), skrobie z manioku (3%), olej z łososia (2%), marchew (1%), siemię lniane (1%), ciecierzyca (1%), hydrolizowane pancerze skorupiaków (źródło glukozaminy ) (0,026%), ekstrakt z chrząstki (źródło chondroityny) (0,016%), drożdże piwne (źródło mannanooligosacharydów) (0,015%), korzeń cykorii (źródło fruktooligosacharydów) (0,01%), juka schidigera (0,01%), algi (0,01%), łupiny psyllium (0,01%), tymianek (0,01%), rozmaryn (0,01%), oregano (0,01%), żurawina (0,0008%), jagody (0,0008%), maliny (0,0008%)', '/images/foods/Carnilove-jagniecina-i-dzik.jpg'),
  (6, 'Acana Heritage Kaczka Wolny Wybieg', 3, 2, 3, 'Surowa kaczka (18%), dehydratyzowana kaczka (17%), cały groch zielony, cała czerwona soczewica, surowa wątroba kaczki (9%), tłuszcz kaczki (6%), świeże gruszki (4%), cała ciecierzyca, cała zielona soczewica, cały groch żółty, skrobia grochowa, włókno soczewicy, algi (źródło EPA i DHA) (1,2%), świeża cała dynia piżmowa, świeża cała dynia, suszony kelp, sól, suszony korzeń cykorii, całe borówki, całe jagody, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży.', 'images/foods/acana-heritage-kaczka.jpg'),
  (7, 'Acana Singles Jagnięcina z Jabłkiem', 3, 2, 3, 'Surowa jagnięcina (21%), dehydratyzowana jagnięcina (19%), cały groch zielony, cała czerwona soczewica, surowa wątroba jagnięca (8%), olej rzepakowy, świeże jabłka (4%), cała ciecierzyca, cała zielona soczewica, cały groch żółty, włókno soczewicy, skrobia grochowa, olej słonecznikowy, algi (źródło EPA i DHA), surowe flaki jagnięce (1%), surowe nerki jagnięce (1%), świeża cała dynia piżmowa, świeża cała dynia, suszony kelp, sól, suszony korzeń cykorii, całe borówki, całe jagody, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży.', '/images/foods/Acana-singles-lamb.jpg'),
  (8, 'Royal Canin Hypoallergenic', 2, 1, 3, 'Mąka ryżowa, hydrolizat białka sojowego, tłuszcz zwierzęcy, ryż, minerały, hydrolizat wątroby drobiowej, pulpa buraczana, olej sojowy, fruktooligosacharydy, olej rybny, olej z ogórecznika, mączka z nagietka.', '/images/foods/royal-canin-hypoallergenic.jpg'),
  (9, 'Taste of the Wild High Prairie', 4, 2, 3, 'Bizon (12%), mączka z jagnięciny, mączka drobiowa, bataty, groszek, ziemniaki, tłuszcz drobiowy (z dodatkiem mieszaniny tokoferoli jako przeciwutleniaczy), produkty jajeczne, wołowina, pieczony jeleń (4%), pulpa pomidorowa, białko ziemniaczane, białko grochu, mączka z ryb morskich, składniki mineralne, suszony korzeń cykorii, pomidory, borówki, maliny, ekstrakt z jukki Schidigera.', '/images/foods/taste-of-the-wild-high-prairie.jpg'),
  (10, 'Taste of the Wild Pacific Stream', 4, 2, 3, 'Łosoś (21%), mączka z ryb morskich, bataty, ziemniaki, groszek, olej rzepakowy, soczewica, mączka z łososia, wędzony łosoś (4%), włókno ziemniaczane, składniki mineralne, suszony korzeń cykorii, pomidory, borówki, maliny, ekstrakt z jukki Schidigera.', '/images/foods/taste-of-the-wild-pacific-stream.jpg'),
  (11, 'Josera SensiPlus', 6, 2, 3, 'Suszone białko drobiowe (drób 24,0%, kaczka 4,0%), kukurydza pełnoziarnista, ryż, tłuszcz drobiowy, włókno buraczane, hydrolizowane białko drobiowe, minerały, mielony korzeń cykorii (naturalne źródło inuliny).', '/images/foods/josera-sensiplus-adult.jpg'),
  (12, 'Josera Optiness', 6, 3, 3, 'Suszone białko drobiowe, ryż, jęczmień, suszony ziemniak, włókno buraczane, tłuszcz drobiowy, suszone białko jagnięce (4,5%), hydrolizowane białko drobiowe, minerały, mielony korzeń cykorii (naturalne źródło inuliny), suszone białko z nowozelandzkiej małży zielonowargowej (perna canaliculus).', '/images/foods/josera-optiness-adult.jpg'),
  (13, 'Brit Veterinary Diet Hypoallergenic', 1, 2, 3, 'dehydratyzowany łosoś (30%), żółty groszek (25%), hydrolizowane białko łososia (18%), gryka, olej kokosowy, pulpa jabłkowa, olej z łososia (3%), hydrolizowany sos z łososia (2%), minerały, suszone algi (0,5%, Ascophyllum nodosum), suszone algi (0,4%, Schizochytrium limacinum), wyciąg z drożdży (źródło mannooligosacharydów, 0,02%), beta-glukany (0,02%), rokitnik zwyczajny (0,015%), fruktooligosacharydy (0,013%), jukka Mojave (0,013%).', '/images/foods/Brit-veterinary-hypoallergenic.jpg'),
  (14, 'ACANA DOG Puppy Small Breed', 3, 1, 1, 'świeży kurczak (18%), dehydratyzowany kurczak (18%), cała czerwona soczewica, cały groch zielony, świeże organy kurczaka (wątroba, serce) (7%), tłuszcz z kurczaka (7%), dehydratyzowany indyk (4%), świeże jaja (4%), surowy morszczuk (4%), dehydratyzowany śledź (4%), olej rybny (3%), cała zielona soczewica, cała ciecierzyca, cały groch żółty, włókno z ciecierzycy, skrobia grochowa, surowa wątroba indyka (1%), sól, suszony kelp, świeża cała dynia, świeża cała dynia piżmowa, świeża cała marchew, świeże całe jabłka, świeże całe gruszki, świeża cała cukinia, suszony korzeń cykorii, świeży jarmuż, świeży szpinak, świeże liście rzepy, świeże liście buraków, cała żurawina, całe borówki, całe jagody saskatoon, kurkuma, ostropest plamisty, korzeń łopianu, lawenda, korzeń prawoślazu lekarskiego, owoce dzikiej róży.', '/images/foods/Acana-puppy-small-breed.jpg'),
  (15, 'Brit Grain Free Veterinary Diets Dog Ultra-Hypoallergenic', 1, 2, 3, 'owady dehydratyzowane (30%), groch żółty, suszona pulpa jabłkowa, olej kokosowy, białko grochu, siemię lniane (4%), węglan wapnia, suszone algi (2,5%, Schizochytrium limacinum), mąka grochowa, hydrolizowane drożdże (0,5% – źródło inozytolu i aminokwasów), ekstrakt drożdżowy (źródło mannanooligosacharydów, 0,02%), β-glukany (0,02%), suszony rokitnik zwyczajny (0,015%), fruktooligosacharydy (0,013%), Jukka Mojave (0,013%), Lactobacillus helveticus HA – 122 inaktywowane (15x109 komórek/kg).', '/images/foods/brit-vet-ultrahypoallergenic.jpg');

-- ============================================================================
-- FOOD_INGREDIENTS
-- ============================================================================

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
  (2, 71),
  (2, 79),
  (2, 80),
  (2, 112),
  (4, 7),
  (4, 10),
  (4, 71),
  (4, 74),
  (4, 112),
  (5, 18),
  (5, 22),
  (5, 71),
  (5, 75),
  (5, 80),
  (6, 10),
  (6, 41),
  (6, 44),
  (6, 59),
  (6, 71),
  (7, 18),
  (7, 59),
  (7, 74),
  (7, 112),
  (8, 41),
  (8, 60),
  (8, 79),
  (8, 112),
  (9, 71),
  (9, 74),
  (9, 112),
  (9, 174),
  (9, 175),
  (9, 176),
  (9, 177),
  (9, 178),
  (9, 179),
  (10, 31),
  (10, 41),
  (10, 71),
  (10, 80),
  (11, 10),
  (11, 60),
  (11, 79),
  (11, 112),
  (12, 18),
  (12, 55),
  (12, 60),
  (12, 108);

-- ============================================================================
-- ARTICLES
-- ============================================================================

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
  (2, 'Najczęstsze alergeny w karmach dla psów', 'najczestsze-alergeny-w-karmach-dla-psow', 'Kurczak, wołowina, pszenica i kukurydza to najczęstsze alergeny. Dowiedz się, których składników unikać przy wyborze karmy.', 'Kurczak, wołowina, pszenica i kukurydza to jedne z najczęstszych alergenów występujących w karmach dla psów. Dowiedz się, które składniki najczęściej wywołują reakcje alergiczne i jak je unikać przy wyborze karmy.', true),
  (3, 'Dieta eliminacyjna - jak ją przeprowadzić?', 'dieta-eliminacyjna-jak-ja-przeprowadzic', 'Skuteczna metoda diagnozowania alergii. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-12 tygodni.', 'Dieta eliminacyjna to skuteczna metoda diagnozowania alergii pokarmowych. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-12 tygodni. W artykule przedstawiamy krok po kroku, jak bezpiecznie przeprowadzić dietę eliminacyjną.', true),
  (4, 'Karmy hipoalergiczne - co warto wiedzieć?', 'karmy-hipoalergiczne-co-warto-wiedziec', 'Karmy z hydrolizowanym białkiem lub rzadkimi źródłami protein minimalizują ryzyko alergii. Zobacz, czym różnią się od zwykłych karm.', 'Karmy hipoalergiczne zawierają hydrolizowane białka lub rzadkie źródła protein, które minimalizują ryzyko reakcji alergicznych. Dowiedz się, czym różnią się od zwykłych karm i dla których psów są odpowiednie.', true),
  (5, 'Rola kwasów omega-3 w diecie alergika', 'rola-kwasow-omega-3-w-diecie-alergika', 'Kwasy omega-3 mają właściwości przeciwzapalne i pomagają złagodzić objawy alergii skórnych. Poznaj korzyści suplementacji.', 'Kwasy Omega-3 a alergie pokarmowe u psów – dlaczego warto je suplementować?

Coraz więcej psów zmaga się dziś z alergiami pokarmowymi. Swędzenie skóry, drapanie, lizanie łap, łupież, wypadanie sierści czy nawracające infekcje uszu – to tylko kilka z objawów, które mogą świadczyć o tym, że Twój pupil reaguje źle na któryś ze składników karmy. W walce z alergiami u psów bardzo pomocne okazują się kwasy tłuszczowe omega-3. Choć brzmią jak coś, co znajdziesz w sklepie dla kulturystów, to w rzeczywistości są jednym z najprostszych i najbardziej naturalnych sposobów na wsparcie skóry, sierści i układu odpornościowego psa.

Dlaczego kwasy omega-3 są tak ważne?

Kwasy omega-3 to zdrowe tłuszcze, które mają silne działanie przeciwzapalne. U psów z alergiami pokarmowymi w organizmie często dochodzi do stanu zapalnego – głównie skóry i jelit. Właśnie wtedy omega-3 potrafią zdziałać cuda.
Działają one jak „strażacy” – gaszą zapalenie od środka, łagodząc świąd, zmniejszając zaczerwienienia i wspierając regenerację skóry.

W naturze psy otrzymywały omega-3 z jedzenia – np. z tłustych ryb, takich jak łosoś czy sardynki. Niestety większość gotowych karm (nawet tych droższych) zawiera zbyt mało tych kwasów, bo są one bardzo delikatne i łatwo ulegają utlenieniu w procesie produkcji. Dlatego warto dostarczać je dodatkowo, w formie suplementu.

Jak kwasy omega-3 pomagają przy alergiach pokarmowych?

U psów z alergią pokarmową układ odpornościowy przesadnie reaguje na pewne białka lub składniki w jedzeniu. Prowadzi to do stanu zapalnego, który objawia się na skórze i w jelitach.
Kwasy omega-3 (głównie EPA i DHA) pomagają w trzech głównych obszarach:

Zmniejszają stan zapalny – ograniczają produkcję substancji odpowiedzialnych za świąd i podrażnienia skóry.

Poprawiają wygląd sierści i skóry – regularne stosowanie omega-3 sprawia, że sierść staje się błyszcząca, a skóra mniej sucha.

Wspierają jelita – a to bardzo ważne, bo większość odporności psa „mieszka” właśnie w układzie pokarmowym.

Efekty suplementacji nie są natychmiastowe, ale zazwyczaj po 4–6 tygodniach można zauważyć wyraźną poprawę kondycji skóry i sierści, a także mniejsze nasilenie objawów alergii.

W jakiej formie podawać omega-3 psu?

Najczęściej spotykane formy suplementów z omega-3 dla psów to:

Olej z łososia – najpopularniejszy i zwykle najlepiej tolerowany. Ma łagodny smak, który większości psów bardzo odpowiada.

Olej z kryla – bogaty w przeciwutleniacze, trochę droższy, ale bardzo skuteczny.

Olej z sardeli, makreli lub śledzia – alternatywa dla psów uczulonych na łososia.

Kapsułki z omega-3 – dobre rozwiązanie, jeśli pies nie lubi smaku rybnych olejów, ale łatwiej podać je większym psom niż małym.

Ważne, by wybierać produkty przeznaczone specjalnie dla zwierząt, z czystych źródeł i przebadane pod kątem zawartości metali ciężkich. Oleje przeznaczone dla ludzi często mają dodatki smakowe lub witaminy w dawkach, które nie są odpowiednie dla psa.

Jak dawkować omega-3 u psów?

Dawkowanie zależy od wagi, wieku i ogólnego stanu zdrowia psa, ale można kierować się ogólnymi zasadami:

Małe psy (do 10 kg): ok. 250–500 mg EPA + DHA dziennie

Średnie psy (10–25 kg): 500–1000 mg EPA + DHA dziennie

Duże psy (25–40 kg): 1000–1500 mg EPA + DHA dziennie

Bardzo duże psy (powyżej 40 kg): 1500–2000 mg EPA + DHA dziennie

Jeśli Twój pies cierpi na silne alergie, weterynarz może zalecić wyższe dawki na początku, a potem przejście na dawkę podtrzymującą. Warto zacząć od mniejszej ilości i stopniowo ją zwiększać – by układ pokarmowy psa miał czas się przyzwyczaić.

U szczeniąt i starszych psów omega-3 są również bardzo wskazane, ale dawkę warto omówić z weterynarzem – u młodych pomagają w rozwoju mózgu, a u seniorów wspierają stawy i serce.

Jak podawać suplementy, żeby pies chętnie je zjadł?

Większość psów uwielbia smak oleju z łososia, więc wystarczy kilka kropel na karmę. Olej najlepiej podawać raz dziennie z posiłkiem – tłuszcz w jedzeniu ułatwia jego wchłanianie.
Uważaj tylko, żeby nie przechowywać oleju w cieple ani na słońcu. Omega-3 są bardzo wrażliwe i szybko się utleniają, więc najlepiej trzymać butelkę w lodówce i zużyć w ciągu kilku tygodni od otwarcia.

Na co zwrócić uwagę przy wyborze suplementu?

Kupując omega-3 dla psa, zwróć uwagę na:

Zawartość EPA i DHA – to właśnie one mają największe znaczenie dla skóry i odporności.

Źródło ryb – im czystsze wody, tym lepiej (np. Islandia, Norwegia).

Forma podania – czy olej, kapsułki, czy smakowy spray – wybierz tę, którą pies najlepiej akceptuje.

Certyfikaty jakości – np. IFOS, które potwierdzają czystość produktu.

Podsumowanie

Kwasy omega-3 to jeden z najprostszych, a zarazem najskuteczniejszych sposobów, by wspomóc psa z alergią pokarmową. Regularna suplementacja łagodzi stany zapalne, poprawia wygląd sierści, wzmacnia odporność i wspiera układ pokarmowy.
Nie zastąpi oczywiście eliminacyjnej diety czy leczenia weterynaryjnego, ale może być ogromnym wsparciem w procesie powrotu do komfortowego życia bez ciągłego drapania i podrażnień.

Warto pamiętać, że każdy pies jest inny – dlatego najlepiej skonsultować suplementację z weterynarzem, szczególnie jeśli pies przyjmuje leki lub ma inne schorzenia.

Jeśli chcesz pomóc swojemu pupilowi czuć się lepiej, wprowadzenie kwasów omega-3 do jego codziennej diety to krok w dobrą stronę. Jego sierść, skóra – i samopoczucie – na pewno Ci za to podziękują.', true);

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Export completed on 29.10.2025, 22:29:03
-- Brands: 6
-- Size types: 3
-- Age categories: 4
-- Ingredients: 179
-- Allergens: 57
-- Ingredient-Allergen mappings: 162
-- Foods: 14
-- Food-Ingredient mappings: 68
-- Articles: 5
