# 📸 Przewodnik: Obrazki karm - gdzie i jak przechowywać?

## 🎯 Twoja sytuacja

Masz pole **`image_url`** (text) w tabeli `foods`. To pole przechowuje **URL** do obrazka, nie sam obrazek.

**Struktura tabeli `foods`:**
```sql
create table public.foods (
  id serial primary key,
  name text not null,
  brand_id integer references brands(id),
  size_type_id integer references size_types(id),
  age_category_id integer references age_categories(id),
  image_url text,  -- ← URL do obrazka
  ingredients_raw text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 📁 Opcje przechowywania obrazków

### Opcja 1: 📂 Lokalne pliki (public/) **← NAJSZYBSZE dla MVP**
### Opcja 2: ☁️ Supabase Storage **← NAJLEPSZE dla produkcji**
### Opcja 3: 🌐 Zewnętrzny CDN (Cloudinary, ImgIX)

---

## 🚀 OPCJA 1: Lokalne pliki w folderze `public/` (POLECAM NA START!)

### ✅ Zalety:
- ✅ Bardzo proste
- ✅ Szybkie dla MVP
- ✅ Nie wymaga dodatkowej konfiguracji
- ✅ Obrazki są częścią projektu (git)
- ✅ Działa od razu bez internetu

### ❌ Wady:
- ❌ Nie skalowalne (wiele obrazków = duży repo)
- ❌ Brak optymalizacji (WebP, resize)
- ❌ Brak upload UI (trzeba ręcznie dodawać pliki)

---

### 📝 Jak to zrobić:

#### Krok 1: Utwórz folder na obrazki

```bash
mkdir public\images
mkdir public\images\foods
```

#### Krok 2: Dodaj obrazki do folderu

**Struktura:**
```
public/
├── favicon.png
└── images/
    └── foods/
        ├── royal-canin-medium-adult.jpg
        ├── brit-care-large-breed.jpg
        ├── purina-pro-plan-sensitive.jpg
        └── ...
```

**Konwencja nazw plików:** (zalecam!)
```
{marka}-{nazwa-karmy}.jpg
```

Przykłady:
- `royal-canin-medium-adult.jpg`
- `brit-care-adult-large.jpg`
- `acana-heritage-puppy.jpg`

#### Krok 3: Dodaj URL do bazy danych

W Supabase Studio lub SQL Editor:

```sql
-- Zaktualizuj istniejące karmy
UPDATE foods 
SET image_url = '/images/foods/royal-canin-medium-adult.jpg'
WHERE id = 1;

UPDATE foods 
SET image_url = '/images/foods/brit-care-large-breed.jpg'
WHERE id = 2;

-- LUB wstaw nowe karmy z obrazkami
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
VALUES (
  'Royal Canin Medium Adult',
  1,  -- ID marki
  2,  -- Medium
  2,  -- Adult
  '/images/foods/royal-canin-medium-adult.jpg',  -- ← Ścieżka relatywna
  'Drób (30%), ryż, kukurydza, tłuszcze zwierzęce'
);
```

**WAŻNE:** URL zaczyna się od `/images/...` (bez `public/`)

#### Krok 4: Gotowe! Obrazki działają

Astro automatycznie serwuje pliki z `public/`:
- Plik: `public/images/foods/karma.jpg`
- URL: `http://localhost:3000/images/foods/karma.jpg`

---

## ☁️ OPCJA 2: Supabase Storage (dla produkcji)

### ✅ Zalety:
- ✅ Skalowalne (nieograniczona liczba obrazków)
- ✅ Upload przez UI/API
- ✅ Publiczny dostęp z CDN
- ✅ Możliwość transformacji obrazów
- ✅ Automatyczne backupy

### ❌ Wady:
- ❌ Wymaga konfiguracji
- ❌ Wymaga UI do uploadu (admin panel)

---

### 📝 Jak to zrobić:

#### Krok 1: Utwórz bucket w Supabase Studio

1. Otwórz **Supabase Studio:** http://127.0.0.1:54323
2. Przejdź do zakładki **"Storage"** (lewa strona)
3. Kliknij **"Create a new bucket"**
4. Nazwij bucket: **`food-images`**
5. Zaznacz **"Public bucket"** (obrazki dostępne bez autoryzacji)
6. Kliknij **"Create bucket"**

#### Krok 2: Upload obrazków przez UI

1. Kliknij na bucket `food-images`
2. Kliknij **"Upload file"**
3. Wybierz obrazki z dysku
4. Pliki zostaną załadowane

#### Krok 3: Skopiuj URL i dodaj do bazy

Po uploadzie kliknij na plik → **"Copy URL"**

URL będzie wyglądać tak:
```
http://127.0.0.1:54321/storage/v1/object/public/food-images/royal-canin.jpg
```

Dodaj do bazy:
```sql
UPDATE foods 
SET image_url = 'http://127.0.0.1:54321/storage/v1/object/public/food-images/royal-canin.jpg'
WHERE id = 1;
```

**⚠️ Problem:** URL zawiera `127.0.0.1:54321` - na produkcji będzie inny!

**Rozwiązanie:** Przechowuj tylko ścieżkę relatywną:

```sql
-- Przechowuj tylko:
UPDATE foods 
SET image_url = 'food-images/royal-canin.jpg'
WHERE id = 1;

-- W API/komponencie dodaj prefix:
const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/${food.image_url}`;
```

#### Krok 4: Zmodyfikuj komponenty aby obsługiwały Supabase Storage

**`src/components/FoodCard.tsx`:**

```tsx
const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return null;
  
  // Jeśli URL zaczyna się od http - użyj jak jest
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Jeśli to ścieżka relatywna - sprawdź czy Supabase Storage
  if (imageUrl.startsWith('food-images/')) {
    return `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/${imageUrl}`;
  }
  
  // Jeśli to /images/ - lokalne pliki
  return imageUrl;
};

// Użycie:
<img src={getImageUrl(food.image_url)} alt={food.name} />
```

---

## 🌐 OPCJA 3: Zewnętrzny CDN (Cloudinary, ImgIX)

### Dla bardziej zaawansowanych projektów

**Przykład z Cloudinary:**
```sql
UPDATE foods 
SET image_url = 'https://res.cloudinary.com/twoje-konto/image/upload/v1/foods/royal-canin.jpg'
WHERE id = 1;
```

**Zalety:**
- Automatyczna optymalizacja (WebP, AVIF)
- Resize, crop, lazy loading
- CDN globalny

**Wady:**
- Koszt (bezpłatny tier jest ograniczony)
- Dodatkowa zależność

---

## 🎯 **MOJA REKOMENDACJA:**

### 👉 **Faza MVP (teraz):** Opcja 1 - `public/images/`
**Dlaczego?**
- ✅ Działasz od razu (5 minut)
- ✅ Nie musisz konfigurować Storage
- ✅ Wystarczy dla 20-50 karm
- ✅ Prosta struktura

### 👉 **Faza produkcyjna (później):** Opcja 2 - Supabase Storage
**Dlaczego?**
- ✅ Upload przez admin panel
- ✅ Skalowalne (setki karm)
- ✅ Automatyczne backupy
- ✅ Możliwość transformacji

---

## 📋 Plan migracji (opcjonalny)

### Krok 1 (teraz): Użyj `public/images/`
```sql
INSERT INTO foods (..., image_url) VALUES 
  (..., '/images/foods/karma-1.jpg');
```

### Krok 2 (za miesiąc): Przenieś do Supabase Storage
1. Upload wszystkich plików z `public/images/foods/` do Storage
2. Uruchom skrypt migracji URL:
```sql
UPDATE foods 
SET image_url = REPLACE(image_url, '/images/foods/', 'food-images/')
WHERE image_url LIKE '/images/foods/%';
```

3. Zaktualizuj komponenty (kod powyżej ↑)

---

## 🚀 Gotowe rozwiązanie dla MVP

### 1. Utwórz folder
```bash
mkdir public\images\foods
```

### 2. Pobierz przykładowe obrazki

**Opcja A: Placeholder (testowe)**
```sql
INSERT INTO foods (name, brand_id, size_type_id, age_category_id, image_url, ingredients_raw)
VALUES (
  'Royal Canin Medium Adult',
  1, 2, 2,
  'https://via.placeholder.com/600x450/3B82F6/FFFFFF?text=Royal+Canin',
  'Drób, ryż, kukurydza'
);
```

**Opcja B: Prawdziwe obrazki**
1. Pobierz zdjęcia opakowań karm z Google Images
2. Zmień rozmiar do 600x450px (aspekt 4:3)
3. Zapisz jako JPG/WebP w `public/images/foods/`
4. Dodaj URL do bazy: `/images/foods/nazwa.jpg`

### 3. Sprawdź czy działa

**Test 1:** Otwórz w przeglądarce
```
http://localhost:3000/images/foods/nazwa.jpg
```

**Test 2:** Sprawdź API
```
http://localhost:3000/api/foods
```

**Test 3:** Otwórz widok
```
http://localhost:3000/foods
```

Obrazki powinny się wyświetlać w kartach!

---

## 💡 Pro tipy

### Optymalizacja obrazków (zalecane rozmiary):

| Użycie | Rozmiar | Aspekt | Format |
|--------|---------|--------|--------|
| **Miniatura (grid)** | 400x300px | 4:3 | WebP/JPG |
| **Modal (duże)** | 800x450px | 16:9 | WebP/JPG |

### Narzędzia do resize:
- **Windows:** Paint, IrfanView
- **Online:** TinyPNG, Squoosh, ImageOptim
- **CLI:** ImageMagick, Sharp

### Konwersja wsadowa (ImageMagick):
```bash
# Resize wszystkich JPG do 600x450
magick mogrify -resize 600x450^ -gravity center -extent 600x450 *.jpg
```

---

## 🆘 Troubleshooting

### Obrazek nie ładuje się (404)
**Przyczyna:** Zły URL w bazie  
**Rozwiązanie:**
1. Sprawdź czy plik istnieje: `public/images/foods/nazwa.jpg`
2. Sprawdź URL w bazie: powinien być `/images/foods/nazwa.jpg` (bez `public/`)
3. Odśwież stronę (Ctrl+Shift+R)

### Obrazek jest rozmazany
**Przyczyna:** Zbyt mała rozdzielczość  
**Rozwiązanie:** Użyj minimum 600x450px dla miniatur

### Obrazki wolno się ładują
**Przyczyna:** Zbyt duży rozmiar pliku  
**Rozwiązanie:** 
1. Kompresuj przez TinyPNG
2. Użyj WebP zamiast JPG
3. Dodaj `loading="lazy"` (już jest w komponencie!)

---

## 📚 Podsumowanie

### Dla MVP (teraz):
1. ✅ Utwórz `public/images/foods/`
2. ✅ Dodaj obrazki JPG/WebP (600x450px)
3. ✅ URL w bazie: `/images/foods/nazwa.jpg`
4. ✅ Gotowe!

### Dla produkcji (później):
1. 🔄 Skonfiguruj Supabase Storage
2. 🔄 Utwórz bucket `food-images`
3. 🔄 Upload przez admin UI
4. 🔄 Migruj URL w bazie
5. 🔄 Zaktualizuj komponenty

**Start z Opcją 1, przejdź na Opcję 2 gdy będziesz miała 50+ karm!** 🚀

