# 📝 Przewodnik: Formatowanie artykułów

Artykuły w ZwierzakBezAlergii używają **Markdown** do formatowania tekstu.

## 🎨 Podstawowa składnia

### Nagłówki

```markdown
## Nagłówek poziomu 2 (duży)
### Nagłówek poziomu 3 (średni)
#### Nagłówek poziomu 4 (mały)
```

**Efekt:**
- Tworzy hierarchię sekcji w artykule
- Automatycznie pogrubione i większe
- Dzieli artykuł na logiczne części

---

### Pogrubienie

```markdown
**To jest pogrubiony tekst**
```

**Kiedy używać:**
- Ważne informacje
- Kluczowe pojęcia
- Wnioski

---

### Kursywa

```markdown
*To jest tekst kursywą*
```

**Kiedy używać:**
- Delikatny akcent
- Pojęcia obcojęzyczne
- Nazwy własne

---

### Akapity

```markdown
To jest pierwszy akapit. Wystarczy pisać normalnie.

To jest drugi akapit. WAŻNE: musi być pusta linia między nimi!

To jest trzeci akapit.
```

**Zasada:** Zawsze zostawiaj **pustą linię** między akapitami!

---

### Listy

#### Lista punktowana:

```markdown
- Pierwszy element
- Drugi element
- Trzeci element
```

#### Lista numerowana:

```markdown
1. Pierwszy krok
2. Drugi krok
3. Trzeci krok
```

**Lista zagnieżdżona:**

```markdown
- Główny punkt
  - Pod-punkt (2 spacje wcięcia)
  - Kolejny pod-punkt
- Kolejny główny punkt
```

---

### Cytaty / Ważne informacje

```markdown
> To jest cytat lub ważna informacja.
> Może być w wielu liniach.
```

**Efekt:** Wyróżnione, wcięte pole z lewą krawędzią

---

### Linia pozioma (separator)

```markdown
---
```

**Efekt:** Pozioma linia oddzielająca sekcje

---

### Linki

```markdown
[Tekst który będzie klikalny](https://example.com)
```

**Przykład:**
```markdown
Przeczytaj więcej o [dietach eliminacyjnych](/articles/dieta-eliminacyjna)
```

---

### Tabele

```markdown
| Kolumna 1 | Kolumna 2 | Kolumna 3 |
|-----------|-----------|-----------|
| Wartość 1 | Wartość 2 | Wartość 3 |
| Wartość 4 | Wartość 5 | Wartość 6 |
```

**Efekt:** Ładnie sformatowana tabela

---

## 💡 Praktyczny przykład

### ❌ Źle (bez formatowania):

```
Alergie pokarmowe u psów
Alergie pokarmowe to częsty problem. Objawy mogą obejmować swędzenie skóry, problemy żołądkowo-jelitowe, czy chroniczne infekcje uszu.
Najczęstsze alergeny
Kurczak, wołowina, pszenica, kukurydza
```

### ✅ Dobrze (z formatowaniem):

```markdown
## Alergie pokarmowe u psów

Alergie pokarmowe to coraz częstszy problem u czworonogów. 

**Najczęstsze objawy:**

- Swędzenie skóry
- Problemy żołądkowo-jelitowe  
- Chroniczne infekcje uszu

---

## Najczęstsze alergeny

Psy najczęściej reagują alergicznie na:

1. **Kurczak** - najpopularniejsze białko w karmach
2. **Wołowina** - drugie co do częstości
3. **Pszenica** - problem z glutenem
4. **Kukurydza** - popularne źródło węglowodanów

> **Ważne!** Zawsze skonsultuj się z weterynarzem przed zmianą diety.
```

---

## 🔧 Jak edytować artykuł w bazie?

### Opcja 1: Przez Supabase Studio

1. Otwórz http://127.0.0.1:54323/project/default/editor
2. Tabela `articles` → znajdź swój artykuł
3. Kliknij w pole `content`
4. Edytuj używając składni Markdown
5. Zapisz

### Opcja 2: Przez edytor tekstu

1. Skopiuj treść z bazy
2. Edytuj w swoim ulubionym edytorze (np. VS Code, Notepad++)
3. Wklej z powrotem do bazy

---

## 📚 Dodatkowe zasoby

### Markdown Cheatsheet

- [Oficjalny przewodnik Markdown](https://www.markdownguide.org/basic-syntax/)
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Testowanie Markdown online

- [StackEdit](https://stackedit.io/) - edytor online z podglądem
- [Dillinger](https://dillinger.io/) - inny edytor z podglądem

---

## 💡 Pro Tips

1. **Zawsze używaj pustych linii między akapitami**
   - ❌ Bez pustej linii = tekst sklejony
   - ✅ Z pustą linią = czytelne akapity

2. **Używaj nagłówków do struktury**
   - `##` dla głównych sekcji
   - `###` dla podsekcji
   - `####` dla szczegółów

3. **Pogrubienie dla ważnych informacji**
   - Nie przesadzaj! Za dużo pogrubienia = nic nie jest ważne
   - Używaj dla 3-5 kluczowych punktów

4. **Listy dla czytelności**
   - Zamiast długich zdań, użyj list
   - Łatwiej przeczytać i zrozumieć

5. **Cytaty dla ostrzeżeń**
   ```markdown
   > ⚠️ **Uwaga!** Zawsze konsultuj się z weterynarzem.
   ```

---

## 🎯 Gotowy szablon artykułu

```markdown
## Wstęp

Krótki wstęp do tematu (1-2 akapity).

---

## Główna sekcja 1

### Podsekcja 1.1

Treść z **pogrubieniami** dla ważnych punktów.

- Lista punktów
- Kolejny punkt
- Jeszcze jeden

### Podsekcja 1.2

Kolejna treść.

> **Ważne!** Informacja, którą czytelnik powinien zapamiętać.

---

## Główna sekcja 2

Więcej treści...

---

## Podsumowanie

**Kluczowe wnioski:**

1. Pierwszy wniosek
2. Drugi wniosek  
3. Trzeci wniosek

Zachęta do działania.
```

---

Pytania? Zobacz [przykładowy artykuł](przyklad-artykulu-markdown.md) z pełnym formatowaniem! 🐕

