# Lista testów dla widoku /foods

## Instrukcja testowania

**URL:** http://localhost:3000/foods  
**Dev server:** `npm run dev` (port 3000)

---

## ✅ Testy do wykonania

### 1. Test podstawowego ładowania
- [ ] Strona ładuje się bez błędów
- [ ] Loading state (skeleton) jest widoczny podczas ładowania
- [ ] Sidebar z filtrami się renderuje
- [ ] Search bar jest widoczny
- [ ] Grid karm się wyświetla (po załadowaniu danych)

### 2. Test wyszukiwania
- [ ] Wpisz "Brit" w search bar
- [ ] Wyniki filtrują się po ~300ms (debounce)
- [ ] Licznik wyników się aktualizuje
- [ ] Przycisk X (czyszczenie) się pokazuje
- [ ] Kliknięcie X czyści wyszukiwanie
- [ ] Wszystkie karmy wracają

### 3. Test filtrowania po marce
- [ ] Rozwiń dropdown "Marka"
- [ ] Wybierz dowolną markę
- [ ] Lista się filtruje
- [ ] Licznik wyników się aktualizuje
- [ ] Zmień markę
- [ ] Lista się aktualizuje
- [ ] Wybierz "Wszystkie marki"
- [ ] Filtry się czyszczą

### 4. Test filtrowania po rozmiarze granulatu
- [ ] Rozwiń dropdown "Rozmiar granulatu"
- [ ] Wybierz rozmiar
- [ ] Lista się filtruje
- [ ] Zmień rozmiar
- [ ] Wybierz "Wszystkie rozmiary"

### 5. Test filtrowania po wieku psa
- [ ] Rozwiń dropdown "Wiek psa"
- [ ] Wybierz kategorię wiekową
- [ ] Lista się filtruje
- [ ] Zmień kategorię
- [ ] Wybierz "Wszystkie wieki"

### 6. **Test logiki alergenów (KLUCZOWY!)**
- [ ] **Domyślnie:** Wszystkie checkboxy ZAZNACZONE
- [ ] **Domyślnie:** Lista pokazuje WSZYSTKIE karmy
- [ ] **Odznacz "kurczak":**
  - [ ] Checkbox kurczaka: ❌
  - [ ] Lista pokazuje karmy BEZ kurczaka
  - [ ] Licznik wyników spada
- [ ] **Odznacz "wołowina":**
  - [ ] Lista pokazuje karmy BEZ kurczaka I BEZ wołowiny
  - [ ] Licznik wyników spada jeszcze bardziej
- [ ] **Zaznacz z powrotem "kurczak":**
  - [ ] Checkbox kurczaka: ✓
  - [ ] Lista pokazuje karmy BEZ wołowiny (kurczak dozwolony)
  - [ ] Licznik wyników rośnie
- [ ] **Odznacz WSZYSTKIE alergeny:**
  - [ ] Czy empty state się pojawia? (żadna karma nie spełnia kryteriów)
- [ ] **Kliknij "Resetuj":**
  - [ ] Wszystkie checkboxy ZAZNACZONE
  - [ ] Wszystkie karmy widoczne

### 7. Test paginacji
- [ ] Scroll w dół listy
- [ ] Przycisk "Załaduj więcej" jest widoczny
- [ ] Kliknij "Załaduj więcej"
- [ ] Spinner się pojawia
- [ ] Kolejne karmy się ładują
- [ ] Kontynuuj aż przycisk zniknie (brak więcej wyników)
- [ ] Przycisk znika gdy `hasMore === false`

### 8. Test otwarcia modalu
- [ ] Kliknij w kartę karmy
- [ ] Modal się otwiera
- [ ] Loading spinner jest widoczny
- [ ] Dane się ładują
- [ ] Duże zdjęcie (16:9) się wyświetla
- [ ] Informacje podstawowe są widoczne (marka, rozmiar, wiek)
- [ ] Accordion "Składniki" działa
- [ ] Accordion "Alergeny" działa
- [ ] Badge-e alergenów są czerwone (destructive)
- [ ] Accordion "Pełny skład" działa (jeśli dostępny)

### 9. Test zamykania modalu
- [ ] **Przycisk X:** Kliknij X → modal się zamyka
- [ ] **Klawisz ESC:** Otwórz ponownie, naciśnij ESC → modal się zamyka
- [ ] **Overlay:** Otwórz ponownie, kliknij poza modalem → modal się zamyka

### 10. Test kombinacji filtrów
- [ ] Wybierz markę + odznacz alergeny
- [ ] Sprawdź czy licznik wyników jest prawidłowy
- [ ] Dodaj wyszukiwanie
- [ ] Sprawdź czy wszystkie filtry działają razem
- [ ] Kliknij "Resetuj"
- [ ] Wszystkie filtry się czyszczą

### 11. Test keyboard navigation
- [ ] Naciśnij Tab kilka razy
- [ ] Focus indicator jest widoczny (niebieski ring)
- [ ] Tab przez checkboxy alergenów
- [ ] Space na checkboxie → toggle
- [ ] Tab do karty karmy
- [ ] Enter na karcie → otwiera modal
- [ ] Tab w modalu → focus zostaje w środku (focus trap)
- [ ] ESC → zamyka modal
- [ ] Tab do przycisku "Załaduj więcej"
- [ ] Enter → ładuje więcej

### 12. Test empty state
- [ ] Wpisz "xyzabc123" w search (fraza której nie ma)
- [ ] Empty state się pokazuje: "Brak wyników"
- [ ] Podpowiedź "Spróbuj zmienić filtry..." jest widoczna

### 13. Test responsywności
- [ ] **Desktop (>1280px):** 5 kolumn w gridzie
- [ ] **Laptop (1024-1280px):** 4 kolumny
- [ ] **Tablet landscape (768-1024px):** 3 kolumny
- [ ] **Tablet portrait (640-768px):** 2 kolumny
- [ ] **Mobile (<640px):** 1 kolumna
- [ ] Sidebar pozostaje widoczny na deskto

pie
- [ ] Obrazy zachowują proporcję 4:3 (miniatury)
- [ ] Obrazy w modalu zachowują proporcję 16:9

### 14. Test loading states
- [ ] Loading skeleton podczas pierwszego ładowania
- [ ] Loading w sidebarze dla opcji filtrów
- [ ] Loading w modalu podczas pobierania szczegółów
- [ ] Spinner w przycisku "Załaduj więcej"

### 15. Test error handling
- [ ] Wyłącz internet/API
- [ ] Odśwież stronę
- [ ] Error message się pojawia
- [ ] Przycisk "Spróbuj ponownie" jest widoczny
- [ ] Kliknij "Spróbuj ponownie"
- [ ] Włącz internet/API
- [ ] Dane się ładują

### 16. Test accessibility (screen reader)
- [ ] Włącz screen reader (NVDA/JAWS)
- [ ] Nawiguj przez filtry
- [ ] Aria-labels są czytane
- [ ] Checkboxy informują o stanie (zaznaczony/odznaczony)
- [ ] Karty karm mają opisy
- [ ] Modal ma `aria-modal="true"`
- [ ] Focus trap w modalu działa

### 17. Test performance
- [ ] Debounce w search działa (nie wysyła zapytania przy każdym znaku)
- [ ] Obrazy ładują się lazy (nie wszystkie naraz)
- [ ] Scroll jest płynny
- [ ] Animacje shimmer działają płynnie
- [ ] Hover effects są responsywne

---

## 🐛 Znalezione problemy

### Przed naprawą:
| Problem | Priorytet | Status |
|---------|-----------|--------|
| (Pusto - lista będzie uzupełniana podczas testów) | - | - |

### Po naprawie:
| Problem | Rozwiązanie | Data |
|---------|-------------|------|
| (Pusto) | - | - |

---

## 📝 Notatki z testowania

**Data:** ___________  
**Tester:** ___________

**Środowisko:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (Chrome Android)
- [ ] Mobile (Safari iOS)

**Dane testowe:**
- [ ] Baza danych zawiera dane
- [ ] Są dostępne obrazy karm
- [ ] Są dostępne alergeny
- [ ] Są dostępne składniki

**Wynik:**
- [ ] ✅ Wszystkie testy przeszły
- [ ] ⚠️ Niektóre testy nie przeszły (patrz sekcja Problemy)
- [ ] ❌ Większość testów nie przeszła

**Uwagi:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 🚀 Po zakończeniu testów

### Checklist przed production:
- [ ] Wszystkie testy manualne przeszły
- [ ] Testy accessibility przeszły
- [ ] Testy responsywności przeszły
- [ ] Nie ma błędów w console
- [ ] Nie ma warnings TypeScript
- [ ] Build test przeszedł (`npm run build`)
- [ ] Dane testowe w bazie
- [ ] Obrazy są zoptymalizowane
- [ ] Lighthouse score > 90
- [ ] Code review wykonany

### Następne kroki:
1. Dodać testy E2E (Playwright/Cypress)
2. Zoptymalizować bundle size
3. Dodać analytics
4. Deploy na staging
5. QA testing
6. Deploy na production

