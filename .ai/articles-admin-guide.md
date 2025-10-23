# 📚 Przewodnik Administratora - Zarządzanie Artykułami

Dokument dla administratorów projektu ZwierzakBezAlergii - jak dodawać, edytować i publikować artykuły edukacyjne o alergiach pokarmowych u psów.

---

## 📍 Dostęp do Supabase Studio

### 1. Uruchom Supabase lokalnie

```bash
# Terminal w folderze projektu
supabase start
```

### 2. Otwórz Supabase Studio

**URL:** http://127.0.0.1:54323

---

## ✍️ Jak dodać nowy artykuł

### Metoda 1: Przez Table Editor (ZALECANA)

#### Krok 1: Otwórz tabelę articles

1. W Supabase Studio → zakładka **"Table Editor"**
2. Z menu po lewej wybierz tabelę **`articles`**

#### Krok 2: Dodaj nowy rekord

1. Kliknij przycisk **"+ Insert row"**
2. Wypełnij pola (szczegóły poniżej ↓)
3. Kliknij **"Save"**

---

## 📝 Opis pól w tabeli `articles`

### 1. `title` (wymagane) ⭐

**Typ:** Text  
**Opis:** Tytuł artykułu wyświetlany na liście i w szczegółach

**Najlepsze praktyki:**
- ✅ Jasny, konkretny, opisujący treść
- ✅ 50-70 znaków (optymalnie dla SEO)
- ✅ Zawiera słowo kluczowe (np. "alergie pokarmowe")
- ❌ Unikaj clickbait ("Nie uwierzysz co...")
- ❌ Unikaj CAPS LOCK

**Przykłady dobrych tytułów:**
```
✅ "Alergie pokarmowe u psów - kompletny przewodnik"
✅ "Jak rozpoznać alergię pokarmową? 5 objawów"
✅ "Najlepsze karmy hipoalergiczne - ranking 2025"
✅ "Dieta eliminacyjna krok po kroku"
```

---

### 2. `slug` (wymagane) ⭐

**Typ:** Text  
**Opis:** Unikalny identyfikator URL artykułu

**Format:** małe-litery-bez-polskich-znakow

**Zasady:**
- Tylko małe litery (a-z)
- Cyfry (0-9)
- Myślniki `-` zamiast spacji
- Bez polskich znaków (ą→a, ę→e, ł→l, ś→s, ż→z, ź→z, ć→c, ó→o, ń→n)
- Unikalny - nie może się powtarzać!

**Przykłady:**
```
Title: "Alergie pokarmowe u psów - kompletny przewodnik"
Slug:  "alergie-pokarmowe-u-psow-kompletny-przewodnik"

Title: "Jak rozpoznać alergię? 5 objawów"
Slug:  "jak-rozpoznac-alergie-5-objawow"
```

**Narzędzie online do generowania slugów:**
https://slugify.online/

---

### 3. `excerpt` (wymagane) ⭐

**Typ:** Text  
**Opis:** Krótki opis artykułu (lead, zajawka)

**Długość:** 120-200 znaków (idealne)

**Cel:**
- Zachęcić do kliknięcia
- Podsumować główną wartość artykułu
- Wyświetlany na karcie artykułu w gridzie

**Najlepsze praktyki:**
- ✅ 1-2 zdania
- ✅ Konkretne informacje ("Poznaj 5 objawów...")
- ✅ Korzyść dla czytelnika
- ❌ Nie kopiuj początku artykułu
- ❌ Unikaj ogólników ("Artykuł o...")

**Przykłady:**
```
✅ "Alergie pokarmowe to częsty problem u psów. Dowiedz się, 
    jakie są objawy, przyczyny i jak skutecznie diagnozować 
    oraz leczyć alergie u Twojego pupila."

✅ "Czy Twój pies ciągle się drapie? Przewlekłe problemy skórne 
    mogą być oznaką alergii. Poznaj 5 najczęstszych objawów."

❌ "W tym artykule opowiemy o alergiach." (za ogólne)
❌ "Kliknij aby dowiedzieć się więcej!" (clickbait)
```

---

### 4. `content` (wymagane) ⭐

**Typ:** Text (Long)  
**Opis:** Pełna treść artykułu w formacie **Markdown**

**Format:** Markdown (podobny do formatowania w Discord/WhatsApp)

#### Podstawy Markdown:

```markdown
# Nagłówek 1 (H1) - tylko jeden na początku
## Nagłówek 2 (H2) - główne sekcje
### Nagłówek 3 (H3) - podsekcje

**Pogrubienie** - dla ważnych słów

*Kursywa* - dla akcentów

- Lista punktowana
- Drugi element
- Trzeci element

1. Lista numerowana
2. Drugi element
3. Trzeci element

[Link do innego artykułu](/articles/inny-slug)
[Link zewnętrzny](https://example.com)

> Cytat lub ważna informacja

---

Pozioma linia (separator)

`kod inline` - dla komend lub technicznych terminów

### Tabela:

| Kolumna 1 | Kolumna 2 |
|-----------|-----------|
| Wartość 1 | Wartość 2 |
| Wartość 3 | Wartość 4 |
```

#### Struktura dobrego artykułu:

```markdown
# Tytuł artykułu

[Wprowadzenie - 2-3 zdania o czym jest artykuł]

## Główna sekcja 1

[Treść sekcji - akapity, listy]

### Podsekcja 1.1

[Szczegółowe informacje]

## Główna sekcja 2

[Kolejna część artykułu]

## Podsumowanie

[Kluczowe wnioski, call-to-action]

---

**Autor:** [Twoje imię]  
**Data publikacji:** [Data]

> **Zastrzeżenie:** [Disclaimer prawny jeśli dotyczy]
```

#### Wskazówki dotyczące treści:

**✅ Dobre praktyki:**
- Pisz krótkie akapity (2-4 zdania)
- Używaj list punktowanych dla czytelności
- Dodawaj nagłówki co 200-300 słów
- Używaj przykładów i konkretów
- Dodaj podsumowanie na końcu
- Link do powiązanych artykułów

**❌ Unikaj:**
- Długie bloki tekstu (>5 zdań)
- Za dużo tekstu pogrubionego (traci na znaczeniu)
- Pisania "wielkiej książki" - artykuł to nie doktorat
- Kopiowania treści z innych stron (plagiat!)

**Długość:**
- Krótki artykuł: 500-1000 słów
- Średni artykuł: 1000-2000 słów
- Długi przewodnik: 2000-4000 słów

---

### 5. `author_id` (wymagane) ⭐

**Typ:** Integer  
**Opis:** ID użytkownika (autora) z tabeli `users`

**Jak znaleźć swoje author_id:**

1. W Supabase Studio → Table Editor
2. Otwórz tabelę **`users`**
3. Znajdź swój email
4. Skopiuj wartość z kolumny `id` (np. `1`, `2`, `3`)
5. Wklej w pole `author_id`

**Przykład:**
```
User: admin@zwierzakbezalergii.pl
ID: 1

→ author_id = 1
```

---

### 6. `published` (wymagane) ⭐

**Typ:** Boolean (true/false)  
**Opis:** Czy artykuł jest opublikowany (widoczny publicznie)

**Wartości:**
- ✅ `true` - artykuł JEST widoczny na stronie /articles
- ❌ `false` - artykuł jest szkicem (draft), niewidoczny

**Kiedy używać:**
- `false` - gdy piszesz szkic, artykuł nie jest gotowy
- `true` - gdy artykuł jest gotowy do publikacji

**Uwaga:** Tylko artykuły z `published = true` są widoczne!

---

### 7. `created_at` (automatyczne)

**Typ:** Timestamp  
**Opis:** Data i czas utworzenia artykułu

**Nie wypełniaj ręcznie!** Pole wypełnia się automatycznie.

---

### 8. `updated_at` (automatyczne)

**Typ:** Timestamp  
**Opis:** Data i czas ostatniej edycji

**Nie wypełniaj ręcznie!** Aktualizuje się automatycznie przy edycji.

---

## 🔄 Jak edytować istniejący artykuł

### W Table Editor:

1. Otwórz tabelę `articles`
2. **Kliknij w wiersz** artykułu który chcesz edytować
3. Zmień wartości w polach
4. Kliknij **"Save"**

### Co można edytować:
- Tytuł (`title`)
- Treść (`content`)
- Excerpt (`excerpt`)
- Status publikacji (`published`)

### Czego NIE edytować:
- `slug` - zmiana zepsuje linki!
- `id` - identyfikator bazy danych
- `created_at` - data utworzenia
- (Możesz zmienić `slug` tylko jeśli masz pewność że nikt nie linkował do artykułu)

---

## 🗑️ Jak usunąć artykuł

### Opcja 1: Ukrycie (ZALECANE)

Zamiast usuwać, ustaw `published = false`

**Zalety:**
- Artykuł pozostaje w bazie
- Można go przywrócić w przyszłości
- Historia nie jest tracona

### Opcja 2: Trwałe usunięcie

1. Otwórz tabelę `articles`
2. Kliknij w wiersz artykułu
3. Kliknij przycisk **"Delete"** (ikona kosza)
4. Potwierdź usunięcie

**⚠️ Uwaga:** Usunięcie jest trwałe! Nie da się cofnąć!

---

## 📊 Workflow publikacji artykułu

### Krok 1: Przygotowanie (Draft)

```
published = false
```
- Napisz tytuł, slug, excerpt
- Napisz treść w Markdown
- Sprawdź formatting (podgląd poniżej ↓)

### Krok 2: Przegląd wewnętrzny

- Sprawdź ortografię i gramatykę
- Zweryfikuj linki (działają?)
- Sprawdź długość excerpt (120-200 znaków?)
- Upewnij się że slug jest unikalny

### Krok 3: Publikacja

```
published = true
```
- Zmień `published` na `true`
- Kliknij "Save"
- Odśwież stronę /articles
- Sprawdź czy artykuł wyświetla się poprawnie

### Krok 4: Post-publikacja

- Sprawdź czy tytuł wyświetla się dobrze
- Sprawdź czy excerpt jest czytelny
- Kliknij w artykuł i sprawdź pełną treść
- (W przyszłości: udostępnij w social media)

---

## 🎨 Jak sprawdzić jak wygląda Markdown?

### Metoda 1: Online Markdown Editor

Otwórz: https://dillinger.io/
1. Wklej swój Markdown w lewy panel
2. Podgląd na żywo w prawym panelu

### Metoda 2: Bezpośrednio w aplikacji

1. Zapisz artykuł z `published = true`
2. Otwórz `/articles` w przeglądarce
3. Kliknij w artykuł
4. Zobacz jak wygląda na stronie

---

## ✅ Checklist przed publikacją

Przed ustawieniem `published = true`, sprawdź:

- [ ] **Tytuł** - jasny, konkretny, 50-70 znaków?
- [ ] **Slug** - małe-litery-z-myslnikami, unikalny?
- [ ] **Excerpt** - 120-200 znaków, zachęcający?
- [ ] **Content** - pełna treść w Markdown?
- [ ] **Ortografia** - sprawdzona?
- [ ] **Linki** - działają?
- [ ] **Author ID** - prawidłowy?
- [ ] **Nagłówki** - struktura H1 > H2 > H3?
- [ ] **Długość** - minimum 500 słów?
- [ ] **Podsumowanie** - na końcu artykułu?

---

## 🆘 Najczęstsze problemy

### Problem 1: "Artykuł nie wyświetla się na /articles"

**Przyczyna:** `published = false`

**Rozwiązanie:**
1. Otwórz artykuł w Table Editor
2. Zmień `published` na `true`
3. Zapisz

---

### Problem 2: "Duplicate key value violates unique constraint"

**Przyczyna:** Slug już istnieje w bazie (nie jest unikalny)

**Rozwiązanie:**
1. Zmień slug na inny (dodaj np. `-2`, `-updated`, `-2025`)
2. Zapisz ponownie

---

### Problem 3: "Markdown nie wyświetla się poprawnie"

**Przyczyna:** Błędna składnia Markdown

**Rozwiązanie:**
1. Sprawdź w online editorze (dillinger.io)
2. Typowe błędy:
   - Brak pustej linii przed/po nagłówku
   - Brak spacji po `#` w nagłówku (`##Zle` → `## Dobrze`)
   - Niepoprawne formatowanie list (brak spacji po `-`)

---

### Problem 4: "Author Name pokazuje NULL"

**Przyczyna:** Nieprawidłowy `author_id` (nie istnieje w tabeli `users`)

**Rozwiązanie:**
1. Sprawdź listę użytkowników w tabeli `users`
2. Popraw `author_id` na istniejący

---

## 💡 Best Practices - Pisanie artykułów

### 1. Struktura "Odwróconej piramidy"

```
[Najważniejsza informacja na początku]
        ↓
   [Szczegóły i context]
        ↓
    [Podsumowanie]
```

### 2. Używaj storytelling

❌ "Alergie pokarmowe są częste."  
✅ "Czy Twój pies budzi się w nocy, drapiąc się bez końca? To może być alergia pokarmowa..."

### 3. Dodawaj wartość

Każdy artykuł powinien odpowiadać na pytanie:
- Co czytelnik zyska po przeczytaniu?
- Jakie konkretne działania może podjąć?

### 4. Używaj "Ty" i "Twój pies"

❌ "Właściciele psów powinni..."  
✅ "Powinieneś sprawdzić, czy Twój pies..."

### 5. Dodawaj call-to-action na końcu

```markdown
## Co dalej?

Teraz gdy znasz objawy alergii, czas na działanie:

1. **Sprawdź naszą bazę karm** hipoalergicznych → [/foods](/foods)
2. **Przeczytaj o diecie eliminacyjnej** → [link]
3. **Umów wizytę** u weterynarza

**Masz pytania?** Dołącz do naszej społeczności [link]
```

---

## 📅 Zalecana częstotliwość publikacji

**Minimum:** 1 artykuł na miesiąc  
**Optymalnie:** 2-4 artykuły na miesiąc  
**Maksimum:** Tyle ile możesz utrzymać jakość

**Lepiej:** 1 świetny artykuł niż 5 słabych!

---

## 🎯 Pomysły na artykuły

### Tematyka alergii:
- Alergia vs. nietolerancja - różnice
- Top 10 alergenów u psów
- Dieta eliminacyjna krok po kroku
- Jak czytać etykiety karm?
- Karmy hydrolizowane - czy warto?

### Tematyka żywienia:
- Czego unikać w karmie dla psa z alergią?
- Domowa dieta vs. karma przemysłowa
- Suplementy dla psów z alergią
- Smakołyki bez alergenów

### Praktyczne poradniki:
- Dziennik objawów - jak prowadzić?
- Przygotowanie do wizyty u weterynarza
- Koszt leczenia alergii - budżet
- Jak rozmawiać z weterynarzem?

---

## 🚀 Następne kroki

**Teraz gdy znasz podstawy, możesz:**

1. ✅ Przeczytać testowe artykuły w bazie (przykłady)
2. ✅ Napisać swój pierwszy draft (`published = false`)
3. ✅ Przetestować Markdown w online editorze
4. ✅ Opublikować pierwszy artykuł (`published = true`)
5. ✅ Sprawdzić jak wygląda na stronie /articles

---

**Powodzenia!** 🎉

Jeśli masz pytania lub sugestie jak ulepszyć ten przewodnik, skontaktuj się z zespołem technicznym.

