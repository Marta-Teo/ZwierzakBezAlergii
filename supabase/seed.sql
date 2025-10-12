-- Seed data for ZwierzakBezAlergii MVP
-- This file contains test data for local development

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
  -- Białka zwierzęce
  ('kurczak'),
  ('wołowina'),
  ('jagnięcina'),
  ('indyk'),
  ('kaczka'),
  ('łosoś'),
  ('ryba'),
  ('wieprzowina'),
  ('królik'),
  ('dziczyzna'),
  -- Węglowodany i warzywa
  ('ryż'),
  ('ziemniak'),
  ('batat'),
  ('owies'),
  ('pszenica'),
  ('kukurydza'),
  ('groszek'),
  ('soczewica'),
  ('ciecierzyca'),
  -- Dodatki
  ('jajka'),
  ('olej z ryb'),
  ('tłuszcz z kurczaka');

-- ============================================================================
-- 5. ALLERGENS (Alergeny z hierarchią)
-- ============================================================================

-- Główne kategorie alergenów
INSERT INTO public.allergens (id, name, parent_id) VALUES
  (1, 'mięso', NULL),
  (2, 'drób', NULL),
  (3, 'ryby', NULL),
  (4, 'zboża', NULL),
  (5, 'nabiał', NULL);

-- Resetuj sekwencję po ręcznych insertach z ID
SELECT setval('public.allergens_id_seq', (SELECT MAX(id) FROM public.allergens));

-- Podkategorie alergenów (z parent_id)
INSERT INTO public.allergens (name, parent_id) VALUES
  -- Drób
  ('kurczak', 2),
  ('indyk', 2),
  ('kaczka', 2),
  -- Mięso
  ('wołowina', 1),
  ('jagnięcina', 1),
  ('wieprzowina', 1),
  ('królik', 1),
  ('dziczyzna', 1),
  -- Ryby
  ('łosoś', 3),
  ('biała ryba', 3),
  -- Zboża
  ('pszenica', 4),
  ('kukurydza', 4),
  ('owies', 4),
  -- Inne
  ('jajka', NULL),
  ('soja', NULL);

-- ============================================================================
-- 6. INGREDIENT_ALLERGENS (Powiązania składnik ↔ alergen)
-- ============================================================================

INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id) VALUES
  -- Kurczak
  (1, (SELECT id FROM public.allergens WHERE name = 'kurczak' AND parent_id IS NOT NULL)),
  (1, 2), -- drób (kategoria nadrzędna)
  -- Wołowina
  (2, (SELECT id FROM public.allergens WHERE name = 'wołowina')),
  (2, 1), -- mięso (kategoria nadrzędna)
  -- Jagnięcina
  (3, (SELECT id FROM public.allergens WHERE name = 'jagnięcina')),
  (3, 1), -- mięso
  -- Indyk
  (4, (SELECT id FROM public.allergens WHERE name = 'indyk')),
  (4, 2), -- drób
  -- Kaczka
  (5, (SELECT id FROM public.allergens WHERE name = 'kaczka')),
  (5, 2), -- drób
  -- Łosoś
  (6, (SELECT id FROM public.allergens WHERE name = 'łosoś')),
  (6, 3), -- ryby (kategoria)
  -- Ryba ogólnie
  (7, (SELECT id FROM public.allergens WHERE name = 'biała ryba')),
  (7, 3), -- ryby
  -- Wieprzowina
  (8, (SELECT id FROM public.allergens WHERE name = 'wieprzowina')),
  (8, 1), -- mięso
  -- Królik
  (9, (SELECT id FROM public.allergens WHERE name = 'królik')),
  (9, 1), -- mięso
  -- Dziczyzna
  (10, (SELECT id FROM public.allergens WHERE name = 'dziczyzna')),
  (10, 1), -- mięso
  -- Pszenica
  (15, (SELECT id FROM public.allergens WHERE name = 'pszenica')),
  (15, 4), -- zboża
  -- Kukurydza
  (16, (SELECT id FROM public.allergens WHERE name = 'kukurydza')),
  (16, 4), -- zboża
  -- Owies
  (14, (SELECT id FROM public.allergens WHERE name = 'owies')),
  (14, 4), -- zboża
  -- Jajka
  (20, (SELECT id FROM public.allergens WHERE name = 'jajka'));

-- ============================================================================
-- 7. FOODS (Przykładowe karmy)
-- ============================================================================

INSERT INTO public.foods (name, brand_id, size_type_id, age_category_id, ingredients_raw) VALUES
  -- Brit Care
  ('Brit Care Adult Jagnięcina z Ryżem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, ryż, tłuszcz z kurczaka, suszone jabłka, olej z łososia'),
  
  ('Brit Care Bezzbożowa Łosoś z Ziemniakiem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'łosoś, ziemniak, groszek, olej z ryb, batat'),
  
  ('Brit Care Puppy Kurczak z Ryżem', 
   (SELECT id FROM public.brands WHERE name = 'Brit Care'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'szczeniak'),
   'kurczak, ryż, tłuszcz z kurczaka, olej z ryb'),
  
  -- Carnilove
  ('Carnilove Kaczka z Bażantem', 
   (SELECT id FROM public.brands WHERE name = 'Carnilove'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, indyk, groszek, soczewica, olej z ryb'),
  
  ('Carnilove Jagnięcina z Dzikiem', 
   (SELECT id FROM public.brands WHERE name = 'Carnilove'),
   (SELECT id FROM public.size_types WHERE name = 'duży'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, wieprzowina, batat, groszek, ciecierzyca'),
  
  -- Acana
  ('Acana Heritage Kaczka Wolny Wybieg', 
   (SELECT id FROM public.brands WHERE name = 'Acana'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, jajka, ryba, owies, groszek'),
  
  ('Acana Singles Jagnięcina z Jabłkiem', 
   (SELECT id FROM public.brands WHERE name = 'Acana'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, owies, soczewica, olej z ryb'),
  
  -- Royal Canin
  ('Royal Canin Hypoallergenic', 
   (SELECT id FROM public.brands WHERE name = 'Royal Canin'),
   (SELECT id FROM public.size_types WHERE name = 'mały'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'ryż, ryba, olej z ryb, ziemniak'),
  
  -- Taste of the Wild
  ('Taste of the Wild High Prairie', 
   (SELECT id FROM public.brands WHERE name = 'Taste of the Wild'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'wołowina, jagnięcina, batat, groszek, olej z ryb'),
  
  ('Taste of the Wild Pacific Stream', 
   (SELECT id FROM public.brands WHERE name = 'Taste of the Wild'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'łosoś, ryba, batat, groszek'),
  
  -- Josera
  ('Josera SensiPlus', 
   (SELECT id FROM public.brands WHERE name = 'Josera'),
   (SELECT id FROM public.size_types WHERE name = 'średni'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'kaczka, ryż, ziemniak, olej z ryb'),
  
  ('Josera Optiness', 
   (SELECT id FROM public.brands WHERE name = 'Josera'),
   (SELECT id FROM public.size_types WHERE name = 'duży'),
   (SELECT id FROM public.age_categories WHERE name = 'dorosły'),
   'jagnięcina, ryż, kukurydza, tłuszcz z kurczaka');

-- ============================================================================
-- 8. FOOD_INGREDIENTS (Powiązania karma ↔ składniki)
-- ============================================================================

-- Brit Care Adult Jagnięcina z Ryżem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (1, 3), -- jagnięcina
  (1, 11), -- ryż
  (1, 22), -- tłuszcz z kurczaka
  (1, 6); -- łosoś (w postaci oleju)

-- Brit Care Bezzbożowa Łosoś z Ziemniakiem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (2, 6), -- łosoś
  (2, 12), -- ziemniak
  (2, 17), -- groszek
  (2, 21); -- olej z ryb

-- Brit Care Puppy Kurczak z Ryżem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (3, 1), -- kurczak
  (3, 11), -- ryż
  (3, 22), -- tłuszcz z kurczaka
  (3, 21); -- olej z ryb

-- Carnilove Kaczka z Bażantem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (4, 5), -- kaczka
  (4, 4), -- indyk
  (4, 17), -- groszek
  (4, 18), -- soczewica
  (4, 21); -- olej z ryb

-- Carnilove Jagnięcina z Dzikiem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (5, 3), -- jagnięcina
  (5, 8), -- wieprzowina
  (5, 13), -- batat
  (5, 17), -- groszek
  (5, 19); -- ciecierzyca

-- Acana Heritage Kaczka Wolny Wybieg
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (6, 5), -- kaczka
  (6, 20), -- jajka
  (6, 7), -- ryba
  (6, 14), -- owies
  (6, 17); -- groszek

-- Acana Singles Jagnięcina z Jabłkiem
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (7, 3), -- jagnięcina
  (7, 14), -- owies
  (7, 18), -- soczewica
  (7, 21); -- olej z ryb

-- Royal Canin Hypoallergenic
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (8, 11), -- ryż
  (8, 7), -- ryba
  (8, 21), -- olej z ryb
  (8, 12); -- ziemniak

-- Taste of the Wild High Prairie
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (9, 2), -- wołowina
  (9, 3), -- jagnięcina
  (9, 13), -- batat
  (9, 17), -- groszek
  (9, 21); -- olej z ryb

-- Taste of the Wild Pacific Stream
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (10, 6), -- łosoś
  (10, 7), -- ryba
  (10, 13), -- batat
  (10, 17); -- groszek

-- Josera SensiPlus
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (11, 5), -- kaczka
  (11, 11), -- ryż
  (11, 12), -- ziemniak
  (11, 21); -- olej z ryb

-- Josera Optiness
INSERT INTO public.food_ingredients (food_id, ingredient_id) VALUES
  (12, 3), -- jagnięcina
  (12, 11), -- ryż
  (12, 16), -- kukurydza
  (12, 22); -- tłuszcz z kurczaka

-- ============================================================================
-- 9. ARTICLES (Przykładowe artykuły edukacyjne)
-- ============================================================================

INSERT INTO public.articles (title, slug, content) VALUES
  ('Jak rozpoznać alergię pokarmową u psa?',
   'jak-rozpoznac-alergie-pokarmowa-u-psa',
   'Alergie pokarmowe u psów są coraz częstszym problemem. Objawy mogą obejmować swędzenie skóry, problemy żołądkowo-jelitowe, czy chroniczne infekcje uszu. W tym artykule omawiamy najczęstsze symptomy i metody diagnozowania alergii pokarmowych u czworonogów.'),
  
  ('Najczęstsze alergeny w karmach dla psów',
   'najczestsze-alergeny-w-karmach-dla-psow',
   'Kurczak, wołowina, pszenica i kukurydza to jedne z najczęstszych alergenów występujących w karmach dla psów. Dowiedz się, które składniki najczęściej wywołują reakcje alergiczne i jak je unikać przy wyborze karmy.'),
  
  ('Dieta eliminacyjna - jak ją przeprowadzić?',
   'dieta-eliminacyjna-jak-ja-przeprowadzic',
   'Dieta eliminacyjna to skuteczna metoda diagnozowania alergii pokarmowych. Polega na karmieniu psa karmą z jednym źródłem białka przez 8-12 tygodni. W artykule przedstawiamy krok po kroku, jak bezpiecznie przeprowadzić dietę eliminacyjną.'),
  
  ('Karmy hipoalergiczne - co warto wiedzieć?',
   'karmy-hipoalergiczne-co-warto-wiedziec',
   'Karmy hipoalergiczne zawierają hydrolizowane białka lub rzadkie źródła protein, które minimalizują ryzyko reakcji alergicznych. Dowiedz się, czym różnią się od zwykłych karm i dla których psów są odpowiednie.'),
  
  ('Rola kwasów omega-3 w diecie alergika',
   'rola-kwasow-omega-3-w-diecie-alergika',
   'Kwasy omega-3 z oleju rybiego mają właściwości przeciwzapalne i mogą pomóc złagodzić objawy alergii skórnych u psów. Poznaj korzyści płynące z suplementacji omega-3 i naturalne źródła tych cennych kwasów.');

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


