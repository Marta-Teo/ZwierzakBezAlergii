-- ===================================================================
-- BRIT CARE - Pełna gama karm z podziałem na wielkość i wiek
-- ===================================================================
-- Data: 2025-01-XX
-- Źródło: https://brit-petfood.com/pl/psy/brit-care
-- ===================================================================

-- KROK 1: Sprawdź ID Brit Care w tabeli brands
DO $$
DECLARE
  brit_brand_id INTEGER;
BEGIN
  SELECT id INTO brit_brand_id FROM brands WHERE name = 'Brit' OR name LIKE 'Brit%' LIMIT 1;
  
  IF brit_brand_id IS NULL THEN
    RAISE EXCEPTION 'Marka Brit nie istnieje w tabeli brands. Najpierw dodaj markę!';
  ELSE
    RAISE NOTICE 'Brit brand_id: %', brit_brand_id;
  END IF;
END $$;

-- ===================================================================
-- BRIT CARE - PUPPY & JUNIOR (Szczenięta i młode psy)
-- ===================================================================

-- 1. Brit Care Puppy All Breed (Wszystkie rasy - szczenięta)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Puppy All Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  NULL,  -- All breeds
  (SELECT id FROM age_categories WHERE name LIKE '%uppy%' OR name LIKE '%cze%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Puppy+All+Breed',
  'Jagnięcina (40%), ryż (15%), tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (2%), suszony burak, drożdże piwne, minerały, glukozamina (260 mg/kg), chondroityna (160 mg/kg), witaminy, probiotyki'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Puppy All Breed Lamb & Rice'
);

-- 2. Brit Care Junior Large Breed (Duże rasy - młode)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Junior Large Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%arge%' OR name LIKE '%uż%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%unior%' OR name LIKE '%oung%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Junior+Large',
  'Jagnięcina (40%), ryż (15%), tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (3%), suszony burak, drożdże piwne, minerały, glukozamina (320 mg/kg), chondroityna (200 mg/kg), MSM (200 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Junior Large Breed Lamb & Rice'
);

-- ===================================================================
-- BRIT CARE - ADULT (Dorosłe psy)
-- ===================================================================

-- 3. Brit Care Adult Small Breed (Małe rasy - dorosłe)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Adult Small Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%mall%' OR name LIKE '%ał%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Adult+Small',
  'Jagnięcina (25%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (2%), suszony burak, drożdże piwne, minerały, glukozamina (220 mg/kg), chondroityna (150 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Adult Small Breed Lamb & Rice'
);

-- 4. Brit Care Adult Medium Breed (Średnie rasy - dorosłe)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Adult Medium Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%edium%' OR name LIKE '%red%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Adult+Medium',
  'Jagnięcina (25%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (2%), suszony burak, drożdże piwne, minerały, glukozamina (260 mg/kg), chondroityna (180 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Adult Medium Breed Lamb & Rice'
);

-- 5. Brit Care Adult Large Breed (Duże rasy - dorosłe)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Adult Large Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%arge%' OR name LIKE '%uż%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Adult+Large',
  'Jagnięcina (25%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (3%), suszony burak, drożdże piwne, minerały, glukozamina (320 mg/kg), chondroityna (220 mg/kg), MSM (220 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Adult Large Breed Lamb & Rice'
);

-- ===================================================================
-- BRIT CARE - SENIOR (Starsze psy)
-- ===================================================================

-- 6. Brit Care Senior All Breed (Wszystkie rasy - senior)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Senior All Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  NULL,  -- All breeds
  (SELECT id FROM age_categories WHERE name LIKE '%enior%' OR name LIKE '%tars%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Senior',
  'Jagnięcina (25%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (2%), suszony burak, drożdże piwne, minerały, glukozamina (350 mg/kg), chondroityna (250 mg/kg), MSM (250 mg/kg), zielone małże (200 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Senior All Breed Lamb & Rice'
);

-- 7. Brit Care Senior Large Breed (Duże rasy - senior)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Senior Large Breed Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%arge%' OR name LIKE '%uż%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%enior%' OR name LIKE '%tars%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Senior+Large',
  'Jagnięcina (25%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (3%), suszony burak, drożdże piwne, minerały, glukozamina (400 mg/kg), chondroityna (300 mg/kg), MSM (300 mg/kg), zielone małże (250 mg/kg), kolagen, witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Senior Large Breed Lamb & Rice'
);

-- ===================================================================
-- BRIT CARE - LINIE SPECJALISTYCZNE
-- ===================================================================

-- 8. Brit Care Grain-Free Adult Large Breed (Bezzbożowa - duże rasy)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Grain-Free Adult Large Breed Salmon & Potato',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  (SELECT id FROM size_types WHERE name LIKE '%arge%' OR name LIKE '%uż%' LIMIT 1),
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Grain-Free+Large',
  'Łosoś (26%), mączka z łososia (22%), ziemniaki suszone, tłuszcz z kurczaka, groszek żółty, suszone jabłka, olej z łososia (3%), marchew suszona, burak cukrowy suszony, minerały, glukozamina (320 mg/kg), chondroityna (220 mg/kg), MSM (220 mg/kg)'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Grain-Free Adult Large Breed Salmon & Potato'
);

-- 9. Brit Care Hypo-Allergenic (Hipoalergiczna - dla alergików)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Hypo-Allergenic Venison & Potato',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  NULL,  -- All sizes
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Hypo-Allergenic',
  'Dziczyzna (jeleń 22%), ziemniaki suszone (20%), groszek żółty, tłuszcz z kaczki, suszone jabłka, olej z łososia (2%), marchew suszona, burak cukrowy suszony, minerały, glukozamina (260 mg/kg), chondroityna (180 mg/kg), witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Hypo-Allergenic Venison & Potato'
);

-- 10. Brit Care Weight Loss (Odchudzająca)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Weight Loss Rabbit & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  NULL,  -- All sizes
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Weight+Loss',
  'Królik (22%), ryż (20%), kukurydza, tłuszcze zwierzęce obniżone, błonnik roślinny (5%), suszone jabłka, hydrolizat białka, olej z łososia (1%), suszony burak, drożdże piwne, L-karnityna (300 mg/kg), minerały, witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Weight Loss Rabbit & Rice'
);

-- 11. Brit Care Sensitive Digestion (Wrażliwe trawienie)
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
SELECT 
  'Brit Care Sensitive Digestion Lamb & Rice',
  (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1),
  NULL,  -- All sizes
  (SELECT id FROM age_categories WHERE name LIKE '%dult%' OR name LIKE '%oros%' LIMIT 1),
  'https://via.placeholder.com/600x450/10B981/FFFFFF?text=Brit+Care+Sensitive',
  'Jagnięcina (20%), ryż (20%), kukurydza, tłuszcze zwierzęce, suszone jabłka, hydrolizat białka drobiowego, olej z łososia (2%), suszony burak, drożdże piwne, prebiotyki (FOS, MOS), probiotyki (Enterococcus faecium), minerały, witaminy'
WHERE NOT EXISTS (
  SELECT 1 FROM foods WHERE name = 'Brit Care Sensitive Digestion Lamb & Rice'
);

-- ===================================================================
-- WYNIK
-- ===================================================================

DO $$
DECLARE
  total_brit_foods INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_brit_foods 
  FROM foods 
  WHERE brand_id = (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1);
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'BRIT CARE - Import zakończony!';
  RAISE NOTICE 'Łączna liczba karm Brit Care w bazie: %', total_brit_foods;
  RAISE NOTICE '===========================================';
END $$;

-- Pokaż wszystkie karmy Brit Care
SELECT 
  f.id,
  f.name,
  st.name as size_type,
  ac.name as age_category
FROM foods f
LEFT JOIN size_types st ON f.size_type_id = st.id
LEFT JOIN age_categories ac ON f.age_category_id = ac.id
WHERE f.brand_id = (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1)
ORDER BY f.id;

