# 🎯 Instrukcja: Jak dodać karmy Brit Care do bazy

## ✅ Co zostało przygotowane:

### 1. **11 karm Brit Care** z podziałem:
- **Puppy & Junior:** 2 karmy (All Breed, Large Breed)
- **Adult:** 3 karmy (Small, Medium, Large)
- **Senior:** 2 karmy (All Breed, Large Breed)
- **Specjalistyczne:** 4 karmy (Grain-Free, Hypo-Allergenic, Weight Loss, Sensitive Digestion)

### 2. **Powiązania (pivoty):**
- Każda karma połączona ze składnikami
- Składniki połączone z alergenami (automatycznie z seed.sql)

---

## 📋 Krok 1: Dodaj karmy do bazy

### Otwórz Supabase Studio:
http://127.0.0.1:54323

### Przejdź do: **SQL Editor** (lewa strona menu)

### Skopiuj i wklej zawartość pliku:
📁 **`.ai/brit-care-foods-insert.sql`**

### Kliknij: **RUN** (lub Ctrl+Enter)

**Rezultat:** Zobaczysz komunikaty:
```
NOTICE: Brit brand_id: 1
NOTICE: =========================================
NOTICE: BRIT CARE - Import zakończony!
NOTICE: Łączna liczba karm Brit Care w bazie: 12-23 (w zależności co już było)
NOTICE: =========================================
```

---

## 📋 Krok 2: Dodaj powiązania (pivoty)

### W tym samym **SQL Editor**:

### Skopiuj i wklej zawartość pliku:
📁 **`.ai/brit-care-pivots.sql`**

### Kliknij: **RUN**

**Rezultat:** Zobaczysz komunikaty:
```
NOTICE: ✓ Dodano składniki dla: Brit Care Puppy All Breed
NOTICE: ✓ Dodano składniki dla: Brit Care Junior Large
... (itd dla wszystkich 11 karm)
NOTICE: =========================================
NOTICE: BRIT CARE - Pivoty dodane!
NOTICE: Łączna liczba powiązań składników: 80+
NOTICE: =========================================
```

---

## ✅ Sprawdź wynik

### W **Table Editor** → wybierz tabelę **`foods`**:
Powinieneś zobaczyć nowe karmy Brit Care!

### Lub w **SQL Editor** wykonaj:
```sql
-- Pokaż wszystkie karmy Brit Care
SELECT 
  f.id,
  f.name,
  st.name as rozmiar,
  ac.name as wiek
FROM foods f
LEFT JOIN size_types st ON f.size_type_id = st.id
LEFT JOIN age_categories ac ON f.age_category_id = ac.id
WHERE f.brand_id = (SELECT id FROM brands WHERE name LIKE 'Brit%' LIMIT 1)
ORDER BY f.name;
```

---

## 🎨 Dodaj obrazki (opcjonalne)

Jeśli chcesz dodać prawdziwe zdjęcia:

1. Pobierz zdjęcia opakowań Brit Care z Google Images
2. Zmień rozmiar do 600x450px
3. Zapisz w `public/images/foods/`
4. Zaktualizuj URL w bazie:

```sql
-- Przykład:
UPDATE foods 
SET image_url = '/images/foods/brit-care-puppy-all-breed.jpg'
WHERE name = 'Brit Care Puppy All Breed Lamb & Rice';
```

**LUB** zostaw placeholder images - już są dodane! 🎨

---

## 🚀 Przetestuj

### Otwórz widok karm:
http://localhost:3000/foods

Powinieneś zobaczyć:
- ✅ Nowe karty z karmami Brit Care
- ✅ Placeholder images (zielone tło)
- ✅ Podział na wielkość i wiek

### Kliknij w kartę → Modal:
- ✅ Szczegóły karmy
- ✅ Lista składników
- ✅ Alergeny (automatycznie wykryte!)

---

## 📊 Podsumowanie

Po wykonaniu tych kroków będziesz mieć:

- ✅ **11 nowych karm Brit Care** (razem ~23 karmy Brit w sumie)
- ✅ **Wszystkie pivoty** ze składnikami
- ✅ **Automatyczne wykrywanie alergenów** przez hierarchię
- ✅ **Podział na:**
  - Rozmiary: Small, Medium, Large, All Breeds
  - Wiek: Puppy, Junior, Adult, Senior
  - Specjalne: Grain-Free, Hypo-Allergenic, Weight Loss, Sensitive

---

## 🆘 Problemy?

### Błąd: "Marka Brit nie istnieje"
**Rozwiązanie:** Najpierw dodaj markę:
```sql
INSERT INTO brands (name) VALUES ('Brit Care');
```

### Błąd: "duplicate key value violates unique constraint"
**Przyczyna:** Karma już istnieje  
**Rozwiązanie:** To OK! SQL ma `WHERE NOT EXISTS` - pomija duplikaty

### Nie widzę nowych karm na /foods
**Rozwiązanie:** 
1. Odśwież stronę (Ctrl+Shift+R)
2. Sprawdź API: http://localhost:3000/api/foods
3. Sprawdź console w przeglądarce (F12)

---

## 🎉 Gotowe!

Ciesz się pełną gamą Brit Care w swojej bazie! 🚀

