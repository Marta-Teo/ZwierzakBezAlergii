# 🍖 Aktualizacja Składów Karm

Przewodnik jak aktualizować składy karm w bazie danych używając uniwersalnego skryptu.

## 🎯 Czym jest ten skrypt?

Skrypt `update-food-composition.ts` automatycznie:
- ✅ Parsuje składniki z tekstu
- ✅ Dodaje nowe składniki do bazy
- ✅ Mapuje składniki na alergeny
- ✅ Aktualizuje skład karmy
- ✅ Aktualizuje wszystkie powiązania

## 🚀 Jak używać?

### Podstawowe użycie

```bash
npm run food:update "Nazwa karmy" "Pełny skład"
```

### Przykład

```bash
npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, wytłoki z jabłek, olej z łososia (3%)"
```

## 📋 Krok po kroku

### 1. Znajdź karmę w bazie

Najpierw sprawdź dokładną nazwę karmy w bazie:

```bash
# Otwórz Supabase Studio
http://127.0.0.1:54323/project/default/editor

# Lub zobacz listę w seed.sql
```

Nazwy karm w bazie:
- Brit Care Adult Jagnięcina z Ryżem
- Brit Care Bezzbożowa Łosoś z Ziemniakiem
- Brit Care Puppy Kurczak z Ryżem
- Carnilove Kaczka z Bażantem
- Carnilove Jagnięcina z Dzikiem
- Acana Heritage Kaczka Wolny Wybieg
- Acana Singles Jagnięcina z Jabłkiem
- Royal Canin Hypoallergenic
- Taste of the Wild High Prairie
- Taste of the Wild Pacific Stream
- Josera SensiPlus
- Josera Optiness
- Brit Veterinary Diet Hypoallergenic

### 2. Znajdź pełny skład karmy

**Gdzie szukać:**
- Opakowanie karmy (najlepsze źródło!)
- Zooplus.pl - w zakładce "Skład"
- Apetete.pl - sekcja "Skład analityczny"
- Oficjalna strona producenta

**Co skopiować:**
Skopiuj cały tekst składu, np:
```
Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, 
suszone wytłoki z jabłek, olej z łososia (3%), drożdże piwowarskie, 
naturalny aromat, hydrolizowane drożdże (0,5%), mączka grochowa, 
glukozamina (300 mg/kg), fruktooligosacharydy (230 mg/kg)
```

### 3. Uruchom skrypt

```bash
npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "Suszona jagnięcina (42%), ryż (35%), tłuszcz z kurczaka, wytłoki z jabłek..."
```

**Ważne:** Użyj cudzysłowów `"..."` wokół obu argumentów!

### 4. Sprawdź wynik

Skrypt pokaże:
```
🚀 Rozpoczynam aktualizację karmy...
📦 Karma: Brit Care Adult Jagnięcina z Ryżem
✅ Znaleziono: Brit Care Adult Jagnięcina z Ryżem (ID: 1)
📋 Parsuję składniki...
  ✅ Znaleziono 19 składników
📦 Dodaję 5 nowych składników...
🔗 Dodaję powiązania składnik-alergen...
  ✅ Dodano 12 powiązań z alergenami
✅ Aktualizacja zakończona pomyślnie!
```

### 5. Wyeksportuj do seed.sql

```bash
npm run db:export
```

### 6. Commituj zmiany

```bash
git add supabase/seed.sql
git commit -m "feat: zaktualizowano skład karmy Brit Care"
git push
```

## 🧠 Jak działa skrypt?

### Parsowanie składników

Skrypt automatycznie:
- Usuwa procenty: `"jagnięcina (42%)"` → `"jagnięcina"`
- Usuwa jednostki: `"glukozamina (300 mg/kg)"` → `"glukozamina"`
- Normalizuje nazwy: `"drożdże piwowarskie"` → `"drożdże piwne"`
- Konwertuje na małe litery
- Usuwa duplikaty

### Mapowanie na alergeny

Skrypt wie które składniki są alergenami:

| Składnik | Alergen | Kategoria |
|----------|---------|-----------|
| suszona jagnięcina | jagnięcina | mięso |
| tłuszcz z kurczaka | kurczak | drób |
| ryż | ryż | zboża |
| groszek | groszek | strączkowe |
| łosoś | łosoś | ryby |

**Wspierane kategorie alergenów:**
1. Mięso (wołowina, jagnięcina, wieprzowina, dzik, itp.)
2. Drób (kurczak, indyk, kaczka, gęś)
3. Ryby (łosoś, pstrąg, śledź, itp.)
4. Zboża (pszenica, kukurydza, ryż, owies)
5. Nabiał (mleko, ser, jogurt)
6. Strączkowe (groszek, soja, soczewica)
7. Jaja

### Co jeśli składnik nie ma mapowania?

Nie ma problemu! Skrypt:
- ✅ I tak doda składnik do bazy
- ✅ Połączy go z karmą
- ⚠️ Nie doda powiązania z alergenem (możesz dodać ręcznie później)

## 💡 Wskazówki

### 1. Używaj dokładnych nazw karm

❌ Źle:
```bash
npm run food:update "Brit Care Lamb" "..."
```

✅ Dobrze:
```bash
npm run food:update "Brit Care Adult Jagnięcina z Ryżem" "..."
```

### 2. Skopiuj cały skład

Im więcej szczegółów, tym lepiej! Nie przejmuj się:
- Procentami - skrypt je usunie
- Jednostkami (mg/kg) - skrypt je usunie
- Długimi nazwami łacińskimi - skrypt je zachowa

### 3. Sprawdź wynik w Supabase Studio

Po aktualizacji otwórz:
- http://127.0.0.1:54323/project/default/editor
- Zakładka `foods` → znajdź swoją karmę
- Zakładka `food_ingredients` → zobacz powiązania

### 4. Jeśli coś poszło nie tak

Możesz przywrócić bazę:
```bash
supabase db reset  # resetuje bazę i wczytuje seed.sql
```

## 🔄 Workflow: Aktualizacja wszystkich karm

Jeśli chcesz zaktualizować kilka karm:

```bash
# 1. Aktualizuj pierwszą karmę
npm run food:update "Nazwa karmy 1" "Skład 1"

# 2. Aktualizuj drugą karmę
npm run food:update "Nazwa karmy 2" "Skład 2"

# 3. Aktualizuj trzecią karmę
npm run food:update "Nazwa karmy 3" "Skład 3"

# 4. Wyeksportuj wszystkie zmiany do seed.sql
npm run db:export

# 5. Commituj
git add supabase/seed.sql
git commit -m "feat: zaktualizowano składy 3 karm"
```

## ❓ Rozwiązywanie problemów

### Błąd: "Nie znaleziono karmy"

Sprawdź dokładną nazwę w bazie:
```bash
# Skrypt pokaże listę dostępnych karm
npm run food:update "Nieprawidłowa nazwa" "test"
```

### Błąd: "Brak zmiennych środowiskowych"

Upewnij się, że masz plik `.env` z:
```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

### Składnik nie został zmapowany na alergen?

To normalne dla:
- Witamin i minerałów
- Ziół i dodatków
- Konserwantów

Możesz dodać mapowanie ręcznie przez Supabase Studio lub edytując skrypt.

## 📝 Przykłady użycia

### Przykład 1: Carnilove

```bash
npm run food:update "Carnilove Kaczka z Bażantem" "kaczka suszona (30%), indyk suszone (28%), żółty groch (20%), tłuszcz z kurczaka (konserwowany tokoferolem, 6%), suszony ciecierzyca (5%), olej z łososia (3%)"
```

### Przykład 2: Taste of the Wild

```bash
npm run food:update "Taste of the Wild High Prairie" "Bizon, wołowina, jagnięcina suszona, soczewica, groszek, tłuszcz wołowy, białko ziemniaczane, bataty"
```

### Przykład 3: Royal Canin

```bash
npm run food:update "Royal Canin Hypoallergenic" "ryż (46%), hydrolizowane białka drobiowe, olejek kokosowy, olej sojowy, minerały, pulpa buraczana"
```

## 🔗 Zobacz też

- [database-export.md](database-export.md) - Export bazy danych
- [quick-start-export-bazy.md](quick-start-export-bazy.md) - Szybki start
- [SUPABASE_GUIDE.md](../SUPABASE_GUIDE.md) - Ogólny przewodnik Supabase

---

**Pytania?** Sprawdź [issues](https://github.com/Marta-Teo/ZwierzakBezAlergii/issues) lub zadaj nowe! 🐕

