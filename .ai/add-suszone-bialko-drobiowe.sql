-- ===================================================================
-- Dodanie składnika "suszone białko drobiowe" i jego powiązań
-- ===================================================================

-- KROK 1: Dodaj składnik
INSERT INTO ingredients (name)
VALUES ('suszone białko drobiowe')
ON CONFLICT DO NOTHING
RETURNING id, name;

-- KROK 2: Połącz z alergenami drobiowymi
DO $$
DECLARE
  v_ingredient_id INTEGER;
  v_allergen_id INTEGER;
  v_count INTEGER := 0;
BEGIN
  -- Pobierz ID składnika
  SELECT id INTO v_ingredient_id 
  FROM ingredients 
  WHERE name = 'suszone białko drobiowe';
  
  IF v_ingredient_id IS NULL THEN
    RAISE EXCEPTION 'Składnik "suszone białko drobiowe" nie istnieje!';
  END IF;
  
  RAISE NOTICE 'ID składnika "suszone białko drobiowe": %', v_ingredient_id;
  
  -- Znajdź alergeny drobiowe i połącz
  -- Szukamy: kurczak, indyk, kaczka, gęś, przepiórka + kategoria "drób"
  
  FOR v_allergen_id IN 
    SELECT id FROM allergens 
    WHERE LOWER(name) IN (
      'drób',
      'kurczak', 
      'indyk', 
      'kaczka', 
      'gęś',
      'przepiórka',
      'mięso drobiowe',
      'białko drobiowe'
    )
  LOOP
    -- Dodaj powiązanie
    INSERT INTO ingredient_allergens (ingredient_id, allergen_id)
    VALUES (v_ingredient_id, v_allergen_id)
    ON CONFLICT DO NOTHING;
    
    v_count := v_count + 1;
    
    -- Pokaż co zostało dodane
    RAISE NOTICE '  ✓ Połączono z alergenem ID %: %', 
      v_allergen_id, 
      (SELECT name FROM allergens WHERE id = v_allergen_id);
  END LOOP;
  
  RAISE NOTICE '-------------------------------------------';
  RAISE NOTICE 'Dodano % powiązań z alergenami', v_count;
  
END $$;

-- KROK 3: Dodaj składnik do karmy Josera Sensi Plus
DO $$
DECLARE
  v_ingredient_id INTEGER;
  v_food_id INTEGER;
  v_food_name TEXT;
BEGIN
  -- Pobierz ID składnika
  SELECT id INTO v_ingredient_id 
  FROM ingredients 
  WHERE name = 'suszone białko drobiowe';
  
  -- Znajdź Josera Sensi Plus
  SELECT id, name INTO v_food_id, v_food_name
  FROM foods 
  WHERE name ILIKE '%josera%sensi%plus%'
  LIMIT 1;
  
  IF v_food_id IS NULL THEN
    -- Szukaj alternatywnie
    SELECT id, name INTO v_food_id, v_food_name
    FROM foods 
    WHERE name ILIKE '%josera%sensi%'
    LIMIT 1;
  END IF;
  
  IF v_food_id IS NULL THEN
    RAISE WARNING 'Nie znaleziono karmy Josera Sensi Plus!';
    RAISE NOTICE 'Dostępne karmy Josera:';
    
    FOR v_food_name IN 
      SELECT name FROM foods WHERE brand_id = (SELECT id FROM brands WHERE name ILIKE '%josera%' LIMIT 1)
    LOOP
      RAISE NOTICE '  - %', v_food_name;
    END LOOP;
    
  ELSE
    -- Dodaj powiązanie karma → składnik
    INSERT INTO food_ingredients (food_id, ingredient_id)
    VALUES (v_food_id, v_ingredient_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '-------------------------------------------';
    RAISE NOTICE '✓ Dodano składnik do karmy: %', v_food_name;
    RAISE NOTICE '  Food ID: %', v_food_id;
    RAISE NOTICE '  Ingredient ID: %', v_ingredient_id;
  END IF;
  
END $$;

-- ===================================================================
-- WERYFIKACJA
-- ===================================================================

-- Pokaż składnik i jego alergeny
SELECT 
  i.id AS ingredient_id,
  i.name AS skladnik,
  STRING_AGG(a.name, ', ' ORDER BY a.name) AS alergeny
FROM ingredients i
LEFT JOIN ingredient_allergens ia ON i.id = ia.ingredient_id
LEFT JOIN allergens a ON ia.allergen_id = a.id
WHERE i.name = 'suszone białko drobiowe'
GROUP BY i.id, i.name;

-- Pokaż karmy zawierające ten składnik
SELECT 
  f.id,
  f.name AS karma,
  b.name AS marka,
  STRING_AGG(i.name, ', ') AS skladniki
FROM foods f
JOIN brands b ON f.brand_id = b.id
LEFT JOIN food_ingredients fi ON f.id = fi.food_id
LEFT JOIN ingredients i ON fi.ingredient_id = i.id
WHERE f.id IN (
  SELECT food_id 
  FROM food_ingredients 
  WHERE ingredient_id = (SELECT id FROM ingredients WHERE name = 'suszone białko drobiowe')
)
GROUP BY f.id, f.name, b.name;

-- ===================================================================
-- PODSUMOWANIE
-- ===================================================================

DO $$
DECLARE
  v_ingredient_id INTEGER;
  v_allergen_count INTEGER;
  v_food_count INTEGER;
BEGIN
  SELECT id INTO v_ingredient_id FROM ingredients WHERE name = 'suszone białko drobiowe';
  
  SELECT COUNT(*) INTO v_allergen_count
  FROM ingredient_allergens
  WHERE ingredient_id = v_ingredient_id;
  
  SELECT COUNT(*) INTO v_food_count
  FROM food_ingredients
  WHERE ingredient_id = v_ingredient_id;
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'PODSUMOWANIE: suszone białko drobiowe';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'ID składnika: %', v_ingredient_id;
  RAISE NOTICE 'Połączonych alergenów: %', v_allergen_count;
  RAISE NOTICE 'Karm zawierających składnik: %', v_food_count;
  RAISE NOTICE '===========================================';
END $$;

