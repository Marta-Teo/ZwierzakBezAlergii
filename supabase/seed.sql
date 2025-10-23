-- Seed data for ZwierzakBezAlergii MVP
-- This file contains test data for local development

-- ============================================================================
-- 0. USERS (Użytkownicy testowi)
-- ============================================================================
-- UWAGA: Użytkownicy są zarządzani przez Supabase Auth (auth.users)
-- Tabela public.users zawiera tylko rozszerzone dane profilu
-- Do czasu wdrożenia auth używamy NULL dla created_by/updated_by

-- ============================================================================
-- 1. BRANDS (Marki karm)
-- ============================================================================

INSERT INTO public.brands (name) VALUES
  ('Brit Care'),
  ('Royal Canin'),
  ('Acana'),
  ('Taste of the Wild'),
  ('Carnilove'),
  ('Josera');

-- ============================================================================
-- 2. SIZE TYPES (Rozmiary granulatu)
-- ============================================================================

INSERT INTO public.size_types (name) VALUES
  ('mały'),
  ('średni'),
  ('duży');

-- ============================================================================
-- 3. AGE CATEGORIES (Kategorie wieku psa)
-- ============================================================================

INSERT INTO public.age_categories (name) VALUES
  ('szczeniak'),
  ('junior'),
  ('dorosły'),
  ('senior');

-- ============================================================================
-- 4. INGREDIENTS (Składniki)
-- ============================================================================

INSERT INTO public.ingredients (name) VALUES
  -- BIAŁKA DROBIOWE (świeże i przetworzone)
  ('kurczak'),
  ('mięso z kurczaka'),
  ('świeży kurczak'),
  ('suszone mięso z kurczaka'),
  ('mączka z kurczaka'),
  ('hydrolizowane białko drobiowe'),
  ('indyk'),
  ('mięso z indyka'),
  ('mączka z indyka'),
  ('kaczka'),
  ('mięso z kaczki'),
  ('gęś'),
  ('przepiórka'),
  
  -- BIAŁKA MIĘSNE (świeże i przetworzone)
  ('wołowina'),
  ('świeża wołowina'),
  ('suszone mięso wołowe'),
  ('mączka wołowa'),
  ('jagnięcina'),
  ('świeża jagnięcina'),
  ('mączka z jagnięciny'),
  ('baranina'),
  ('wieprzowina'),
  ('dzik'),
  ('dziczyzna'),
  ('sarna'),
  ('jeleń'),
  ('renifer'),
  ('kangur'),
  ('królik'),
  ('koń'),
  
  -- BIAŁKA RYBNE (świeże i przetworzone)
  ('łosoś'),
  ('świeży łosoś'),
  ('mączka z łososia'),
  ('pstrąg'),
  ('śledź'),
  ('sardynka'),
  ('dorsz'),
  ('halibut'),
  ('tuńczyk'),
  ('makrela'),
  ('biała ryba'),
  ('mączka rybna'),
  ('hydrolizowane białko rybne'),
  
  -- JAJA I NABIAŁ
  ('jaja'),
  ('całe jaja'),
  ('jajka w proszku'),
  ('mleko'),
  ('ser'),
  ('twaróg'),
  ('jogurt'),
  ('serwatka'),
  
  -- ZBOŻA
  ('pszenica'),
  ('mąka pszenna'),
  ('gluten pszenny'),
  ('kukurydza'),
  ('mąka kukurydziana'),
  ('gluten kukurydziany'),
  ('jęczmień'),
  ('owies'),
  ('ryż'),
  ('ryż brązowy'),
  ('ryż biały'),
  ('sorgo'),
  ('proso'),
  ('żyto'),
  
  -- PSEUDOZBOŻA I BEZGLUTENOWE WĘGLOWODANY
  ('amarantus'),
  ('komosa ryżowa (quinoa)'),
  ('gryka'),
  ('tapioka'),
  ('maniok'),
  
  -- ROŚLINY STRĄCZKOWE
  ('groszek'),
  ('groch'),
  ('białko grochu'),
  ('soczewica'),
  ('ciecierzyca'),
  ('fasola'),
  ('bób'),
  ('łubin'),
  
  -- WARZYWA KORZENIOWE
  ('ziemniak'),
  ('batat'),
  ('marchew'),
  ('burak'),
  ('pasternak'),
  ('topinambur'),
  ('seler'),
  
  -- WARZYWA ZIELONE I INNE
  ('brokuł'),
  ('szpinak'),
  ('jarmuż'),
  ('kapusta'),
  ('kalafior'),
  ('pomidor'),
  ('dynia'),
  ('kabaczek'),
  ('ogórek'),
  ('papryka'),
  ('buraki liściowe'),
  
  -- OWOCE
  ('jabłko'),
  ('gruszka'),
  ('borówki'),
  ('żurawina'),
  ('maliny'),
  ('truskawki'),
  ('czarne jagody'),
  ('banany'),
  ('aronia'),
  ('czarna porzeczka'),
  ('róża (owoce)'),
  
  -- TŁUSZCZE I OLEJE
  ('tłuszcz drobiowy'),
  ('tłuszcz z kurczaka'),
  ('olej z kurczaka'),
  ('tłuszcz wołowy'),
  ('olej z ryb'),
  ('olej z łososia'),
  ('olej lniany'),
  ('olej słonecznikowy'),
  ('olej kokosowy'),
  ('olej z wiesiołka'),
  ('olej z czarnuszki'),
  
  -- ZIOŁA I ROŚLINY LECZNICZE
  ('lucerna'),
  ('pokrzywa'),
  ('rumianek'),
  ('mniszek lekarski'),
  ('mięta'),
  ('rozmaryn'),
  ('tymianek'),
  ('bazylia'),
  ('pietruszka'),
  ('oregano'),
  ('kurkuma'),
  ('imbir'),
  ('czosnek'),
  
  -- SUPLEMENTY I DODATKI FUNKCJONALNE
  ('drożdże piwne'),
  ('pulpa buraczana'),
  ('pulpa z buraków cukrowych'),
  ('FOS (fruktooligosacharydy)'),
  ('MOS (mannanoligosacharydy)'),
  ('inulina'),
  ('beta-glukany'),
  ('chondroityna'),
  ('glukozamina'),
  ('ekstrakt z mięczaka'),
  ('muszle małży'),
  ('algi morskie'),
  ('spirulina'),
  ('chlorella'),
  ('mączka z chrząstki'),
  ('kolagen'),
  ('L-karnityna'),
  ('tauryna'),
  ('glutation'),
  
  -- INNE SKŁADNIKI
  ('sól'),
  ('chlorek sodu'),
  ('chlorek potasu'),
  ('węglan wapnia'),
  ('fosforan dwuwapniowy'),
  ('drożdże suszone'),
  ('zioła mieszane'),
  ('nasiona lnu'),
  ('nasiona chia'),
  ('nasiona dyni'),
  ('owies zwyczajny'),
  ('żelatyna');

-- ============================================================================
-- 5. ALLERGENS (Alergeny z hierarchią)
-- ============================================================================

-- Główne kategorie alergenów (z ręcznymi ID dla łatwiejszego referencowania)
INSERT INTO public.allergens (id, name, parent_id) VALUES
  (1, 'mięso', NULL),
  (2, 'drób', NULL),
  (3, 'ryby', NULL),
  (4, 'zboża', NULL),
  (5, 'nabiał', NULL),
  (6, 'strączkowe', NULL),
  (7, 'jaja', NULL),
  (8, 'inne białka', NULL);

-- Resetuj sekwencję po ręcznych insertach z ID
SELECT setval('public.allergens_id_seq', (SELECT MAX(id) FROM public.allergens));

-- Podkategorie alergenów - DRÓB (parent_id = 2)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('kurczak', 2),
  ('indyk', 2),
  ('kaczka', 2),
  ('gęś', 2),
  ('przepiórka', 2);

-- Podkategorie alergenów - MIĘSO (parent_id = 1)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('wołowina', 1),
  ('jagnięcina', 1),
  ('baranina', 1),
  ('wieprzowina', 1),
  ('dzik', 1),
  ('dziczyzna', 1),
  ('sarna', 1),
  ('jeleń', 1),
  ('renifer', 1),
  ('kangur', 1),
  ('królik', 1),
  ('koń', 1);

-- Podkategorie alergenów - RYBY (parent_id = 3)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('łosoś', 3),
  ('pstrąg', 3),
  ('śledź', 3),
  ('sardynka', 3),
  ('dorsz', 3),
  ('halibut', 3),
  ('tuńczyk', 3),
  ('makrela', 3),
  ('biała ryba', 3);

-- Podkategorie alergenów - ZBOŻA (parent_id = 4)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('pszenica', 4),
  ('kukurydza', 4),
  ('jęczmień', 4),
  ('owies', 4),
  ('ryż', 4),
  ('sorgo', 4),
  ('proso', 4),
  ('żyto', 4);

-- Podkategorie alergenów - NABIAŁ (parent_id = 5)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('mleko', 5),
  ('ser', 5),
  ('twaróg', 5),
  ('jogurt', 5),
  ('serwatka', 5);

-- Podkategorie alergenów - STRĄCZKOWE (parent_id = 6)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('groszek', 6),
  ('groch', 6),
  ('soczewica', 6),
  ('ciecierzyca', 6),
  ('fasola', 6),
  ('bób', 6),
  ('łupin', 6),
  ('soja', 6);

-- Pojedyncze alergeny (bez parent - najwyższy poziom)
INSERT INTO public.allergens (name, parent_id) VALUES
  ('gluten', NULL),
  ('czosnek', NULL);

-- ============================================================================
-- 6. INGREDIENT_ALLERGENS (Powiązania składnik ↔ alergen)
-- ============================================================================
-- Każdy składnik mapowany jest do konkretnego alergenu + kategorii nadrzędnej
-- Format: (ingredient_id, allergen_id)

-- Pomocnicza funkcja do mapowania - pobiera ID składnika i alergenu po nazwie
DO $$
DECLARE
  ingredient_rec RECORD;
  allergen_rec RECORD;
BEGIN
  -- BIAŁKA DROBIOWE → drób + konkretny podtyp
  FOR ingredient_rec IN 
    SELECT id, name FROM public.ingredients 
    WHERE name IN ('kurczak', 'mięso z kurczaka', 'świeży kurczak', 'suszone mięso z kurczaka', 'mączka z kurczaka')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'kurczak' AND parent_id = 2)),
      (ingredient_rec.id, 2); -- drób (kategoria)
  END LOOP;

  -- Hydrolizowane białko drobiowe → TYLKO drób (nie wiemy konkretny ptak)
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT id, 2 FROM public.ingredients WHERE name = 'hydrolizowane białko drobiowe';

  -- Tłuszcz drobiowy → drób + kurczak (najczęściej z kurczaka)
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('tłuszcz drobiowy', 'tłuszcz z kurczaka', 'olej z kurczaka')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'kurczak' AND parent_id = 2)),
      (ingredient_rec.id, 2);
  END LOOP;

  -- Indyk
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('indyk', 'mięso z indyka', 'mączka z indyka')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'indyk' AND parent_id = 2)),
      (ingredient_rec.id, 2);
  END LOOP;

  -- Kaczka
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('kaczka', 'mięso z kaczki')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'kaczka' AND parent_id = 2)),
      (ingredient_rec.id, 2);
  END LOOP;

  -- Gęś, Przepiórka
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT i.id, a.id FROM public.ingredients i
    CROSS JOIN public.allergens a
    WHERE i.name = 'gęś' AND a.name = 'gęś' AND a.parent_id = 2;
  
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT id, 2 FROM public.ingredients WHERE name = 'gęś';

  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT i.id, a.id FROM public.ingredients i
    CROSS JOIN public.allergens a
    WHERE i.name = 'przepiórka' AND a.name = 'przepiórka' AND a.parent_id = 2;
  
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT id, 2 FROM public.ingredients WHERE name = 'przepiórka';

  -- BIAŁKA MIĘSNE → mięso + konkretny podtyp
  -- Wołowina
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('wołowina', 'świeża wołowina', 'suszone mięso wołowe', 'mączka wołowa', 'tłuszcz wołowy')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'wołowina' AND parent_id = 1)),
      (ingredient_rec.id, 1);
  END LOOP;

  -- Jagnięcina
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('jagnięcina', 'świeża jagnięcina', 'mączka z jagnięciny')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'jagnięcina' AND parent_id = 1)),
      (ingredient_rec.id, 1);
  END LOOP;

  -- Pozostałe mięsa (baranina, wieprzowina, dzik, itd.)
  FOR allergen_rec IN 
    SELECT name FROM public.allergens WHERE parent_id = 1 AND name NOT IN ('wołowina', 'jagnięcina')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT i.id, a.id FROM public.ingredients i
      CROSS JOIN public.allergens a
      WHERE i.name = allergen_rec.name AND a.name = allergen_rec.name AND a.parent_id = 1;
    
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT id, 1 FROM public.ingredients WHERE name = allergen_rec.name;
  END LOOP;

  -- BIAŁKA RYBNE → ryby + konkretny podtyp
  -- Łosoś
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('łosoś', 'świeży łosoś', 'mączka z łososia', 'olej z łososia', 'olej z ryb')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'łosoś' AND parent_id = 3)),
      (ingredient_rec.id, 3);
  END LOOP;

  -- Hydrolizowane białko rybne → TYLKO ryby (nie wiemy konkretna ryba)
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT id, 3 FROM public.ingredients WHERE name IN ('hydrolizowane białko rybne', 'mączka rybna');

  -- Pozostałe ryby
  FOR allergen_rec IN 
    SELECT name FROM public.allergens WHERE parent_id = 3 AND name != 'łosoś'
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT i.id, a.id FROM public.ingredients i
      CROSS JOIN public.allergens a
      WHERE i.name = allergen_rec.name AND a.name = allergen_rec.name AND a.parent_id = 3;
    
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT id, 3 FROM public.ingredients WHERE name = allergen_rec.name;
  END LOOP;

  -- JAJA → jaja (kategoria główna)
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('jaja', 'całe jaja', 'jajka w proszku')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, 7);
  END LOOP;

  -- NABIAŁ → nabiał + podtypy
  FOR allergen_rec IN 
    SELECT id, name FROM public.allergens WHERE parent_id = 5
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT i.id, allergen_rec.id FROM public.ingredients i
      WHERE i.name = allergen_rec.name;
    
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT id, 5 FROM public.ingredients WHERE name = allergen_rec.name;
  END LOOP;

  -- ZBOŻA → zboża + konkretne zboże
  -- Pszenica + gluten
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('pszenica', 'mąka pszenna', 'gluten pszenny')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'pszenica' AND parent_id = 4)),
      (ingredient_rec.id, 4), -- zboża
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'gluten' AND parent_id IS NULL)); -- gluten
  END LOOP;

  -- Kukurydza
  FOR ingredient_rec IN 
    SELECT id FROM public.ingredients WHERE name IN ('kukurydza', 'mąka kukurydziana', 'gluten kukurydziany')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
      (ingredient_rec.id, (SELECT id FROM public.allergens WHERE name = 'kukurydza' AND parent_id = 4)),
      (ingredient_rec.id, 4);
  END LOOP;

  -- Pozostałe zboża (jęczmień, owies, ryż, itd.)
  FOR allergen_rec IN 
    SELECT name FROM public.allergens WHERE parent_id = 4 AND name NOT IN ('pszenica', 'kukurydza')
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT i.id, a.id FROM public.ingredients i
      CROSS JOIN public.allergens a
      WHERE i.name LIKE '%' || allergen_rec.name || '%' AND a.name = allergen_rec.name AND a.parent_id = 4;
    
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT id, 4 FROM public.ingredients WHERE name LIKE '%' || allergen_rec.name || '%';
  END LOOP;

  -- ROŚLINY STRĄCZKOWE → strączkowe + konkretny podtyp
  FOR allergen_rec IN 
    SELECT name FROM public.allergens WHERE parent_id = 6
  LOOP
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT i.id, a.id FROM public.ingredients i
      CROSS JOIN public.allergens a
      WHERE (i.name = allergen_rec.name OR i.name LIKE '%' || allergen_rec.name || '%') 
        AND a.name = allergen_rec.name AND a.parent_id = 6;
    
    INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
      SELECT id, 6 FROM public.ingredients 
      WHERE name = allergen_rec.name OR name LIKE '%' || allergen_rec.name || '%';
  END LOOP;

  -- CZOSNEK → czosnek (pojedynczy alergen)
  INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
    SELECT id, (SELECT id FROM public.allergens WHERE name = 'czosnek')
    FROM public.ingredients WHERE name = 'czosnek';

END $$;

-- ============================================================================
-- 7. FOODS (Przykładowe karmy)
-- ============================================================================

INSERT INTO public.foods (name, brand_id, size_type_id, age_category_id, ingredients_raw, image_url) VALUES
  -- Brit Care
  ('Brit Care Adult Jagnięcina z Ryżem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, ryż, tłuszcz z kurczaka, suszone jabłka, olej z łososia',
   '/images/foods/brit-care-jagniecina-medium-adult.jpg'),
  
  ('Brit Care Bezzbożowa Łosoś z Ziemniakiem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'łosoś, ziemniak, groszek, olej z ryb, batat',
   '/images/foods/brit-care-salmon-adult-small.jpg'),
  
  ('Brit Care Puppy Kurczak z Ryżem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'szczeniak'),
   'kurczak, ryż, tłuszcz z kurczaka, olej z ryb',
   NULL),
  
  -- Carnilove
  ('Carnilove Kaczka z Bażantem', 
   (SELECT id FROM public.brands WHERE name = 'Carnilove'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, indyk, groszek, soczewica, olej z ryb',
   NULL),
  
  ('Carnilove Jagnięcina z Dzikiem', 
   (SELECT id FROM public.brands WHERE name = 'Carnilove'),
   (SELECT id FROM public.size_types WHERE name = 'duży'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, wieprzowina, batat, groszek, ciecierzyca',
   NULL),
  
  -- Acana
  ('Acana Heritage Kaczka Wolny Wybieg', 
   (SELECT id FROM public.brands WHERE name = 'Acana'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, jajka, ryba, owies, groszek',
   NULL),
  
  ('Acana Singles Jagnięcina z Jabłkiem', 
   (SELECT id FROM public.brands WHERE name = 'Acana'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, owies, soczewica, olej z ryb',
   '/images/foods/Acana-singles-lamb.jpg'),
  
  -- Royal Canin
  ('Royal Canin Hypoallergenic', 
   (SELECT id FROM public.brands WHERE name = 'Royal Canin'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'ryż, ryba, olej z ryb, ziemniak',
   NULL),
  
  -- Taste of the Wild
  ('Taste of the Wild High Prairie', 
   (SELECT id FROM public.brands WHERE name = 'Taste of the Wild'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'wołowina, jagnięcina, batat, groszek, olej z ryb',
   '/images/foods/taste-of-the-wild-high-prairie.jpg'),
  
  ('Taste of the Wild Pacific Stream', 
   (SELECT id FROM public.brands WHERE name = 'Taste of the Wild'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'łosoś, ryba, batat, groszek',
   '/images/foods/taste-of-the-wild-pacific-stream.jpg'),
  
  -- Josera
  ('Josera SensiPlus', 
   (SELECT id FROM public.brands WHERE name = 'Josera'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, ryż, ziemniak, olej z ryb',
   '/images/foods/josera-sensiplus-adult.jpg'),
  
  ('Josera Optiness', 
   (SELECT id FROM public.brands WHERE name = 'Josera'),
   (SELECT id FROM public.size_types WHERE name = 'duży'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, ryż, kukurydza, tłuszcz z kurczaka',
   '/images/foods/josera-optiness-adult.jpg');

-- ============================================================================
-- 8. FOOD_INGREDIENTS (Powiązania karma ↔ składniki)
-- ============================================================================
-- WAŻNE: Używamy SELECT zamiast hardcoded ID, aby zapewnić poprawne mapowania

-- Brit Care Adult Jagnięcina z Ryżem
-- ingredients_raw: 'jagnięcina, ryż, tłuszcz z kurczaka, suszone jabłka, olej z łososia'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Brit Care Adult Jagnięcina z Ryżem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jagnięcina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ryż')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'tłuszcz z kurczaka')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jabłko')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z łososia'));
END $$;

-- Brit Care Bezzbożowa Łosoś z Ziemniakiem
-- ingredients_raw: 'łosoś, ziemniak, groszek, olej z ryb, batat'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Brit Care Bezzbożowa Łosoś z Ziemniakiem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'łosoś')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ziemniak')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'batat'));
END $$;

-- Brit Care Puppy Kurczak z Ryżem
-- ingredients_raw: 'kurczak, ryż, tłuszcz z kurczaka, olej z ryb'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Brit Care Puppy Kurczak z Ryżem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'kurczak')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ryż')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'tłuszcz z kurczaka')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb'));
END $$;

-- Carnilove Kaczka z Bażantem
-- ingredients_raw: 'kaczka, indyk, groszek, soczewica, olej z ryb'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Carnilove Kaczka z Bażantem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'kaczka')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'indyk')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'soczewica')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb'));
END $$;

-- Carnilove Jagnięcina z Dzikiem
-- ingredients_raw: 'jagnięcina, wieprzowina, batat, groszek, ciecierzyca'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Carnilove Jagnięcina z Dzikiem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jagnięcina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'wieprzowina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'batat')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ciecierzyca'));
END $$;

-- Acana Heritage Kaczka Wolny Wybieg
-- ingredients_raw: 'kaczka, jajka, ryba, owies, groszek'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Acana Heritage Kaczka Wolny Wybieg';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'kaczka')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jaja')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'biała ryba')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'owies')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek'));
END $$;

-- Acana Singles Jagnięcina z Jabłkiem
-- ingredients_raw: 'jagnięcina, owies, soczewica, olej z ryb'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Acana Singles Jagnięcina z Jabłkiem';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jagnięcina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'owies')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'soczewica')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb'));
END $$;

-- Royal Canin Hypoallergenic
-- ingredients_raw: 'ryż, ryba, olej z ryb, ziemniak'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Royal Canin Hypoallergenic';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ryż')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'biała ryba')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ziemniak'));
END $$;

-- Taste of the Wild High Prairie
-- ingredients_raw: 'wołowina, jagnięcina, batat, groszek, olej z ryb'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Taste of the Wild High Prairie';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'wołowina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jagnięcina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'batat')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb'));
END $$;

-- Taste of the Wild Pacific Stream
-- ingredients_raw: 'łosoś, ryba, batat, groszek'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Taste of the Wild Pacific Stream';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'łosoś')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'biała ryba')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'batat')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'groszek'));
END $$;

-- Josera SensiPlus
-- ingredients_raw: 'kaczka, ryż, ziemniak, olej z ryb'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Josera SensiPlus';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'kaczka')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ryż')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ziemniak')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'olej z ryb'));
END $$;

-- Josera Optiness
-- ingredients_raw: 'jagnięcina, ryż, kukurydza, tłuszcz z kurczaka'
DO $$
DECLARE
  food_id_var INT;
BEGIN
  SELECT id INTO food_id_var FROM public.foods WHERE name = 'Josera Optiness';
  
  INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'jagnięcina')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'ryż')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'kukurydza')),
    (food_id_var, (SELECT id FROM public.ingredients WHERE name = 'tłuszcz drobiowy'));
END $$;

-- ============================================================================
-- 9. ARTICLES (Przykładowe artykuły edukacyjne)
-- ============================================================================

INSERT INTO public.articles (title, slug, excerpt, content, published) VALUES
  ('Jak rozpoznać alergię pokarmową u psa?',
   'jak-rozpoznac-alergie-pokarmowa-u-psa',
   'Alergie pokarmowe to częsty problem. Poznaj objawy takie jak swędzenie skóry, problemy żołądkowo-jelitowe i chroniczne infekcje uszu.',
   'Alergie pokarmowe u psów są coraz częstszym problemem. Objawy mogą obejmować swędzenie skóry, problemy żołądkowo-jelitowe, czy chroniczne infekcje uszu. W tym artykule omawiamy najczęstsze symptomy i metody diagnozowania alergii pokarmowych u czworonogów.',
   true),
  
  ('Najczęstsze alergeny w karmach dla psów',
   'najczestsze-alergeny-w-karmach-dla-psow',
   'Kurczak, wołowina, pszenica i kukurydza to najczęstsze alergeny. Dowiedz się, których składników unikać przy wyborze karmy.',
   'Kurczak, wołowina, pszenica i kukurydza to jedne z najczęstszych alergenów występujących w karmach dla psów. Dowiedz się, które składniki najczęściej wywołują reakcje alergiczne i jak je unikać przy wyborze karmy.',
   true),
  
  ('Dieta eliminacyjna - jak ją przeprowadzić?',
   'dieta-eliminacyjna-jak-ja-przeprowadzic',
   'Skuteczna metoda diagnozowania alergii. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-12 tygodni.',
   'Dieta eliminacyjna to skuteczna metoda diagnozowania alergii pokarmowych. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-12 tygodni. W artykule przedstawiamy krok po kroku, jak bezpiecznie przeprowadzić dietę eliminacyjną.',
   true),
  
  ('Karmy hipoalergiczne - co warto wiedzieć?',
   'karmy-hipoalergiczne-co-warto-wiedziec',
   'Karmy z hydrolizowanym białkiem lub rzadkimi źródłami protein minimalizują ryzyko alergii. Zobacz, czym różnią się od zwykłych karm.',
   'Karmy hipoalergiczne zawierają hydrolizowane białka lub rzadkie źródła protein, które minimalizują ryzyko reakcji alergicznych. Dowiedz się, czym różnią się od zwykłych karm i dla których psów są odpowiednie.',
   true),
  
  ('Rola kwasów omega-3 w diecie alergika',
   'rola-kwasow-omega-3-w-diecie-alergika',
   'Kwasy omega-3 mają właściwości przeciwzapalne i pomagają złagodzić objawy alergii skórnych. Poznaj korzyści suplementacji.',
   'Kwasy omega-3 z oleju rybiego mają właściwości przeciwzapalne i mogą pomóc złagodzić objawy alergii skórnych u psów. Poznaj korzyści płynące z suplementacji omega-3 i naturalne źródła tych cennych kwasów.',
   true);

-- ============================================================================
-- Podsumowanie
-- ============================================================================

-- Sprawdzenie ile rekordów zostało dodanych
DO $$
DECLARE
  brands_count INT;
  size_types_count INT;
  age_categories_count INT;
  ingredients_count INT;
  allergens_count INT;
  foods_count INT;
  articles_count INT;
BEGIN
  SELECT COUNT(*) INTO brands_count FROM public.brands;
  SELECT COUNT(*) INTO size_types_count FROM public.size_types;
  SELECT COUNT(*) INTO age_categories_count FROM public.age_categories;
  SELECT COUNT(*) INTO ingredients_count FROM public.ingredients;
  SELECT COUNT(*) INTO allergens_count FROM public.allergens;
  SELECT COUNT(*) INTO foods_count FROM public.foods;
  SELECT COUNT(*) INTO articles_count FROM public.articles;
  
  RAISE NOTICE 'Seed data loaded successfully!';
  RAISE NOTICE '  Brands: %', brands_count;
  RAISE NOTICE '  Size types: %', size_types_count;
  RAISE NOTICE '  Age categories: %', age_categories_count;
  RAISE NOTICE '  Ingredients: %', ingredients_count;
  RAISE NOTICE '  Allergens: %', allergens_count;
  RAISE NOTICE '  Foods: %', foods_count;
  RAISE NOTICE '  Articles: %', articles_count;
END $$;


