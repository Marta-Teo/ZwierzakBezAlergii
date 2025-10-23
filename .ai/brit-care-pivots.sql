-- ===================================================================
-- BRIT CARE - Powiązania ze składnikami (PIVOTS)
-- ===================================================================
-- Ten plik tworzy powiązania między karmami Brit Care a składnikami
-- Uruchom PO wykonaniu brit-care-foods-insert.sql
-- ===================================================================

-- POMOCNICZE: Funkcja do łatwego dodawania powiązań
DO $$
DECLARE
  v_food_id INTEGER;
  v_ingredient_id INTEGER;
BEGIN
  
  -- ===============================================================
  -- 1. Brit Care Puppy All Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Puppy All Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    -- Główne składniki
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Puppy All Breed';
  END IF;

  -- ===============================================================
  -- 2. Brit Care Junior Large Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Junior Large Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna',
      'MSM'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Junior Large';
  END IF;

  -- ===============================================================
  -- 3. Brit Care Adult Small Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Adult Small Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Adult Small';
  END IF;

  -- ===============================================================
  -- 4. Brit Care Adult Medium Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Adult Medium Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Adult Medium';
  END IF;

  -- ===============================================================
  -- 5. Brit Care Adult Large Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Adult Large Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna',
      'MSM'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Adult Large';
  END IF;

  -- ===============================================================
  -- 6. Brit Care Senior All Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Senior All Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna',
      'MSM',
      'małże zielone'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Senior All Breed';
  END IF;

  -- ===============================================================
  -- 7. Brit Care Senior Large Breed Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Senior Large Breed Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'glukozamina',
      'chondroityna',
      'MSM',
      'małże zielone',
      'kolagen'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Senior Large';
  END IF;

  -- ===============================================================
  -- 8. Brit Care Grain-Free Adult Large Breed Salmon & Potato
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Grain-Free Adult Large Breed Salmon & Potato';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'łosoś',
      'mączka z łososia',
      'ziemniaki',
      'tłuszcz z kurczaka',
      'groszek',
      'jabłka',
      'olej z łososia',
      'marchew',
      'burak cukrowy',
      'glukozamina',
      'chondroityna',
      'MSM'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Grain-Free Large';
  END IF;

  -- ===============================================================
  -- 9. Brit Care Hypo-Allergenic Venison & Potato
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Hypo-Allergenic Venison & Potato';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jeleń',
      'dziczyzna',
      'ziemniaki',
      'groszek',
      'tłuszcz z kaczki',
      'jabłka',
      'olej z łososia',
      'marchew',
      'burak cukrowy',
      'glukozamina',
      'chondroityna'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Hypo-Allergenic';
  END IF;

  -- ===============================================================
  -- 10. Brit Care Weight Loss Rabbit & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Weight Loss Rabbit & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'królik',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'błonnik roślinny',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'L-karnityna'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Weight Loss';
  END IF;

  -- ===============================================================
  -- 11. Brit Care Sensitive Digestion Lamb & Rice
  -- ===============================================================
  SELECT id INTO v_food_id FROM foods WHERE name = 'Brit Care Sensitive Digestion Lamb & Rice';
  
  IF v_food_id IS NOT NULL THEN
    INSERT INTO food_ingredients (food_id, ingredient_id)
    SELECT v_food_id, id FROM ingredients WHERE name IN (
      'jagnięcina',
      'ryż',
      'kukurydza',
      'tłuszcze zwierzęce',
      'jabłka',
      'olej z łososia',
      'burak cukrowy',
      'prebiotyki',
      'probiotyki'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✓ Dodano składniki dla: Brit Care Sensitive Digestion';
  END IF;

END $$;

-- ===================================================================
-- STATYSTYKI
-- ===================================================================

DO $$
DECLARE
  total_pivots INTEGER;
  brit_brand_id INTEGER;
BEGIN
  SELECT id INTO brit_brand_id FROM brands WHERE name LIKE 'Brit%' LIMIT 1;
  
  SELECT COUNT(*) INTO total_pivots
  FROM food_ingredients fi
  JOIN foods f ON fi.food_id = f.id
  WHERE f.brand_id = brit_brand_id;
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'BRIT CARE - Pivoty dodane!';
  RAISE NOTICE 'Łączna liczba powiązań składników: %', total_pivots;
  RAISE NOTICE '===========================================';
END $$;

-- Pokaż przykładowe powiązania
SELECT 
  f.name AS karma,
  STRING_AGG(i.name, ', ') AS skladniki
FROM foods f
LEFT JOIN food_ingredients fi ON f.id = fi.food_id
LEFT JOIN ingredients i ON fi.ingredient_id = i.id
WHERE f.brand_id = (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1)
GROUP BY f.id, f.name
ORDER BY f.name
LIMIT 5;

