-- ===================================================================
-- SZYBKI START: Dodaj obrazki do karm
-- ===================================================================
-- 
-- KROK 1: Dodaj pliki JPG/WebP do folderu: public/images/foods/
-- KROK 2: Wykonaj poniższe zapytania w Supabase Studio (SQL Editor)
--
-- ===================================================================

-- OPCJA A: Placeholder images (testowe) --------------------------------
-- Użyj tego jeśli nie masz jeszcze prawdziwych zdjęć

UPDATE foods SET image_url = 'https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=' || REPLACE(name, ' ', '+')
WHERE image_url IS NULL;

-- Sprawdź wynik:
SELECT id, name, image_url FROM foods LIMIT 5;


-- OPCJA B: Lokalne pliki (produkcyjne) ---------------------------------
-- Użyj tego gdy dodasz prawdziwe zdjęcia do public/images/foods/

-- Przykład 1: Aktualizuj pojedynczo
UPDATE foods 
SET image_url = '/images/foods/royal-canin-medium-adult.jpg'
WHERE name = 'Royal Canin Medium Adult';

-- Przykład 2: Aktualizuj wiele naraz (zaktualizuj ID i nazwy plików!)
UPDATE foods SET image_url = '/images/foods/royal-canin-medium.jpg' WHERE id = 1;
UPDATE foods SET image_url = '/images/foods/brit-care-large.jpg' WHERE id = 2;
UPDATE foods SET image_url = '/images/foods/purina-pro-plan.jpg' WHERE id = 3;
UPDATE foods SET image_url = '/images/foods/acana-heritage.jpg' WHERE id = 4;
UPDATE foods SET image_url = '/images/foods/hills-science.jpg' WHERE id = 5;

-- Sprawdź wynik:
SELECT id, name, image_url FROM foods ORDER BY id;


-- OPCJA C: Mix placeholder + prawdziwe obrazy -------------------------
-- Placeholder dla karm bez zdjęcia, prawdziwe dla reszty

-- Ustaw placeholder dla wszystkich bez obrazka
UPDATE foods 
SET image_url = 'https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=' || REPLACE(name, ' ', '+')
WHERE image_url IS NULL;

-- Zaktualizuj konkretne karmy na prawdziwe obrazki
UPDATE foods SET image_url = '/images/foods/royal-canin-medium.jpg' WHERE id = 1;
UPDATE foods SET image_url = '/images/foods/brit-care-large.jpg' WHERE id = 2;
-- ... dodaj więcej według potrzeb


-- ===================================================================
-- POMOCNE ZAPYTANIA
-- ===================================================================

-- Pokaż wszystkie karmy z obrazkami
SELECT id, name, brand_id, image_url 
FROM foods 
WHERE image_url IS NOT NULL
ORDER BY id;

-- Pokaż karmy BEZ obrazków
SELECT id, name, brand_id 
FROM foods 
WHERE image_url IS NULL
ORDER BY id;

-- Policz karmy z/bez obrazków
SELECT 
  COUNT(*) FILTER (WHERE image_url IS NOT NULL) AS with_images,
  COUNT(*) FILTER (WHERE image_url IS NULL) AS without_images,
  COUNT(*) AS total
FROM foods;

-- Usuń wszystkie obrazki (jeśli chcesz zacząć od nowa)
-- UPDATE foods SET image_url = NULL;  -- UWAGA: To usuwa wszystkie URL!


-- ===================================================================
-- TESTOWANIE
-- ===================================================================

-- Po dodaniu URL, przetestuj w przeglądarce:
-- 
-- 1. API endpoint:
--    http://localhost:3000/api/foods
--    (sprawdź czy image_url jest w odpowiedzi)
--
-- 2. Bezpośredni link (dla lokalnych plików):
--    http://localhost:3000/images/foods/nazwa-pliku.jpg
--    (jeśli 404 = plik nie istnieje w public/images/foods/)
--
-- 3. Widok karm:
--    http://localhost:3000/foods
--    (obrazki powinny się wyświetlać w kartach)

-- ===================================================================
-- PRZYKŁAD: PEŁNY WORKFLOW
-- ===================================================================

-- 1. Sprawdź jakie karmy masz:
SELECT id, name FROM foods ORDER BY id;

-- 2. Dla każdej karmy dodaj URL:
--    - Jeśli masz plik: '/images/foods/nazwa.jpg'
--    - Jeśli nie masz: 'https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=Nazwa'

-- 3. Sprawdź wynik:
SELECT id, name, image_url FROM foods ORDER BY id;

-- 4. Otwórz w przeglądarce: http://localhost:3000/foods
--    Powinieneś zobaczyć karty karm z obrazkami!

-- ===================================================================
-- GOTOWE! 🎉
-- ===================================================================

