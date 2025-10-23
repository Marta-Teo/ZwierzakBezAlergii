-- ============================================
-- TESTOWE ARTYKUŁY DLA WIDOKU /articles
-- ============================================
-- 
-- Ten plik zawiera SQL do dodania 2 testowych artykułów
-- o alergiach pokarmowych u psów.
-- 
-- INSTRUKCJA:
-- 1. Otwórz Supabase Studio: http://127.0.0.1:54323
-- 2. Przejdź do zakładki "SQL Editor"
-- 3. Wklej i wykonaj poniższy kod
-- 4. Odśwież stronę /articles w aplikacji
--
-- ============================================

-- Artykuł 1: Kompleksowy przewodnik o alergiach pokarmowych
INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  author_id,
  published,
  created_at,
  updated_at
) VALUES (
  'Alergie pokarmowe u psów - kompletny przewodnik',
  'alergie-pokarmowe-u-psow-kompletny-przewodnik',
  'Alergie pokarmowe to częsty problem u psów. Dowiedz się, jakie są objawy, przyczyny i jak skutecznie diagnozować oraz leczyć alergie u Twojego pupila.',
  '# Alergie pokarmowe u psów - kompletny przewodnik

## Czym są alergie pokarmowe?

Alergia pokarmowa to nieprawidłowa odpowiedź układu immunologicznego psa na określone białka zawarte w pokarmie. W przeciwieństwie do nietolerancji pokarmowej, która wpływa głównie na przewód pokarmowy, prawdziwa alergia angażuje system odpornościowy i może wywoływać różnorodne objawy.

## Najczęstsze alergeny pokarmowe u psów

Badania wykazują, że najczęstsze alergeny pokarmowe u psów to:

1. **Białko drobiowe (kurczak, indyk)** - mimo że często stosowane w karmach, jest jednym z najczęstszych alergenów
2. **Wołowina** - drugi co do częstości alergen
3. **Produkty mleczne** - laktozą i białka mleka mogą wywoływać reakcje alergiczne
4. **Pszenica i gluten** - niektóre psy źle reagują na zboża
5. **Jaja** - zarówno białko jak i żółtko mogą być alergenami
6. **Soja** - często stosowana jako tańsze źródło białka

## Objawy alergii pokarmowej

### Objawy skórne (najczęstsze):
- Uporczywe drapanie się
- Zaczerwienienia skóry
- Wysypka i krosty
- Wypadanie sierści
- Przewlekłe infekcje uszu
- Liżące się łapy (zwłaszcza między palcami)

### Objawy żołądkowo-jelitowe:
- Biegunka
- Wymioty
- Gazy
- Częste oddawanie stolca
- Utrata apetytu

### Inne objawy:
- Chroniczne infekcje skóry
- Nadmierne łzawienie oczu
- Obrzęk twarzy (rzadziej)

## Jak diagnozować alergię pokarmową?

### Dieta eliminacyjna (gold standard)

Najskuteczniejszą metodą diagnozowania alergii pokarmowej jest **dieta eliminacyjna**:

1. **Faza eliminacji (8-12 tygodni)**
   - Podawanie karmy z nowymi źródłami białka (np. jagnięcina, królik, ryby)
   - Unikanie wszystkich dotychczasowych składników
   - Żadnych smakołyków, kości, czy "resztek ze stołu"

2. **Faza prowokacji**
   - Po ustąpieniu objawów, stopniowe wprowadzanie pojedynczych składników
   - Obserwacja reakcji przez 2 tygodnie po każdym nowym składniku
   - Identyfikacja konkretnych alergenów

### Testy alergiczne

- **Testy skórne** - rzadko stosowane u psów z alergią pokarmową
- **Testy krwi** - mogą wskazać kierunek, ale mają ograniczoną wiarygodność
- **Konsultacja z weterynarzem dermatologue** - zalecana w trudnych przypadkach

## Leczenie alergii pokarmowej

### 1. Dieta wykluczająca

Po zidentyfikowaniu alergenów, najważniejsze jest:
- **Konsekwentne unikanie alergenów** - nawet małe ilości mogą wywołać reakcję
- **Wybór odpowiedniej karmy hipoalergicznej**
- **Kontrola wszystkich źródeł pokarmu** (smakołyki, witaminy, leki)

### 2. Karmy hipoalergiczne

Dostępne opcje:
- **Karmy z ograniczoną liczbą składników** (Limited Ingredient Diet)
- **Karmy z hydrolizowanym białkiem** - białko rozłożone na małe cząsteczki
- **Karmy z nowymi źródłami białka** - np. dziczyzna, królik, ryby morskie

### 3. Wsparcie farmakologiczne (w razie potrzeby)

- **Antybiotyki** - w przypadku wtórnych infekcji skóry
- **Kortykosteroidy** - krótkotrwale, dla złagodzenia silnego świądu
- **Suplementy** - kwasy omega-3/6 dla wsparcia skóry

## Jak wybrać odpowiednią karmę?

### Kluczowe kroki:

1. **Sprawdź skład** - unikaj zidentyfikowanych alergenów
2. **Czytaj etykiety** - uwaga na "ukryte" składniki
3. **Wybierz jedną markę** - i trzymaj się jej konsekwentnie
4. **Wprowadzaj stopniowo** - mieszaj z poprzednią karmą przez 7-10 dni
5. **Obserwuj reakcję** - notuj zmiany w objawach

### Red flags na etykietach:

- Ogólne określenia typu "mięso i produkty pochodzenia zwierzęcego"
- Długa lista składników
- Sztuczne barwniki i konserwanty
- Białka z wielu źródeł

## Profilaktyka

Chociaż nie można w pełni zapobiec alergii, można zminimalizować ryzyko:

- **Urozmaicona dieta** od szczenięcia (pod kontrolą weterynarza)
- **Wysokiej jakości karma** z czystych źródeł
- **Unikanie częstej zmiany karmy** bez uzasadnienia
- **Wsparcie mikrobioty jelitowej** - probiotyki

## Kiedy udać się do weterynarza?

Natychmiast skontaktuj się z weterynarzem jeśli:
- Objawy nasilają się mimo diety eliminacyjnej
- Pies odmawia jedzenia przez >24h
- Pojawia się obrzęk twarzy (reakcja anafilaktyczna)
- Dochodzą objawy ogólne (letarg, gorączka)
- Chroniczne infekcje uszu się powtarzają

## Podsumowanie

Alergie pokarmowe u psów to wyzwanie, ale przy odpowiedniej diagnostyce i konsekwentnej diecie eliminacyjnej, większość psów może żyć komfortowo. Kluczem jest:

✅ Cierpliwość w procesie diagnozowania
✅ Konsekwencja w diecie
✅ Ścisła współpraca z weterynarzem
✅ Uważne czytanie składów karm

Pamiętaj, że każdy pies jest inny - co działa dla jednego, może nie działać dla drugiego. Dlatego indywidualne podejście i obserwacja Twojego pupila są najważniejsze.

---

**Autor:** Zespół ZwierzakBezAlergii  
**Data publikacji:** ' || CURRENT_DATE || '  
**Ostatnia aktualizacja:** ' || CURRENT_DATE || '

> **Zastrzeżenie:** Ten artykuł ma charakter informacyjny i nie zastępuje konsultacji z weterynarzem. W przypadku podejrzenia alergii pokarmowej u Twojego psa, zawsze skonsultuj się z wykwalifikowanym lekarzem weterynarii.',
  1, -- author_id (zakładam że user ID=1 istnieje, jeśli nie - zmień na właściwe ID)
  true, -- published
  NOW() - INTERVAL ''3 days'', -- utworzony 3 dni temu
  NOW() - INTERVAL ''3 days''
);

-- Artykuł 2: Jak rozpoznać alergię pokarmową
INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  author_id,
  published,
  created_at,
  updated_at
) VALUES (
  'Jak rozpoznać alergię pokarmową u psa? 5 objawów ostrzegawczych',
  'jak-rozpoznac-alergie-pokarmowa-u-psa',
  'Czy Twój pies ciągle się drapie? Przewlekłe problemy skórne mogą być oznaką alergii pokarmowej. Poznaj 5 najczęstszych objawów i dowiedz się, kiedy udać się do weterynarza.',
  '# Jak rozpoznać alergię pokarmową u psa? 5 objawów ostrzegawczych

Alergie pokarmowe u psów są często pomijanym problemem zdrowotnym. Właściciele przypisują objawy innym przyczynom, co opóźnia właściwą diagnozę i leczenie. W tym artykule przedstawiamy 5 kluczowych objawów, które powinny Cię zaniepokoić.

## 1. Uporczywe drapanie się i świąd skóry 🐾

### Co obserwować:

- **Ciągłe drapanie** - pies nie może przestać się drapać, nawet po kąpieli
- **Skoncentrowane miejsca** - zwłaszcza:
  - Łapy (liżące się między palcami)
  - Uszy (wewnątrz i dookoła)
  - Brzuch
  - Pysk i okolice oczu
  - Okolice odbytu
- **Nasilenie objawów** - nie zależy od pory roku (w przeciwieństwie do alergii środowiskowej)

### Dlaczego to się dzieje?

Układ immunologiczny reaguje na alergen w pokarmie, uwalniając histaminę, która wywołuje świąd. Pies drapiąc się, dodatkowo uszkadza skórę, co prowadzi do wtórnych infekcji bakteryjnych.

### Co możesz zrobić?

- Prowadź dziennik świądu - notuj nasilenie (skala 1-10)
- Zrób zdjęcia miejsc, które pies drapieje najczęściej
- Sprawdź, czy świąd nasila się po posiłkach (wskazówka na alergię pokarmową)

---

## 2. Przewlekłe infekcje uszu 👂

### Objawy:

- **Częste potrząsanie głową**
- **Czerwone, zapalone uszy** - wewnętrzna strona małżowiny
- **Nieprzyjemny zapach z uszu** - drożdżowy lub gnilny
- **Woskowina** - ciemna, obfita
- **Ból** - pies skomli gdy dotykasz uszu
- **Powtarzające się infekcje** - mimo leczenia antybiotykami

### Dlaczego to się dzieje?

Alergia pokarmowa zaburza równowagę mikroflory w kanale słuchowym, tworząc środowisko sprzyjające rozwojowi bakterii i drożdżaków (najczęściej *Malassezia*).

### Ważna informacja:

Jeśli pies ma **3 lub więcej infekcji uszu rocznie**, mimo leczenia - bardzo prawdopodobna jest alergia pokarmowa lub środowiskowa.

### Co możesz zrobić?

- **Regularne czyszczenie uszu** preparatami weterynaryjnymi
- **Nie używaj płynu do uszu "na zapas"** - może pogorszyć stan
- Skonsultuj się z weterynarzem o dietę eliminacyjną

---

## 3. Problemy żołądkowo-jelitowe 🤢

### Najczęstsze objawy:

- **Przewlekła biegunka** - luźne stolce przez >2 tygodnie
- **Wymioty** - sporadyczne, zwłaszcza rano
- **Częste oddawanie stolca** - >3 razy dziennie
- **Gazy** - nadmierne wzdęcia
- **Bulgotanie w brzuchu** - słyszalne ruchy jelit
- **Śluz w stolcu** - widoczne pasma śluzu

### Różnica między alergią a nietolerancją:

| Alergia pokarmowa | Nietolerancja pokarmowa |
|-------------------|-------------------------|
| Układ immunologiczny zaangażowany | Brak reakcji immunologicznej |
| Objawy skórne + GI | Głównie objawy GI |
| Nawet małe ilości wywołują reakcję | Zależy od dawki |
| Diagnoza: dieta eliminacyjna | Diagnoza: obserwacja |

### Co możesz zrobić?

- **Prowadź dziennik stolców** - konsystencja, częstotliwość, wygląd
- **Zrób zdjęcia** (tak, wiem że to brzmi dziwnie, ale pomaga weterynarzowi)
- **Sprawdź związek z posiłkami** - kiedy występują objawy?

---

## 4. Zmiany w skórze i sierści 🦴

### Na co zwrócić uwagę:

**Skóra:**
- **Hot spots** - lokalne, wilgotne, bolesne zmiany
- **Zaczerwienienia** - zwłaszcza pod pachami, w pachwinach
- **Suchość i łuszczenie się**
- **Przebarwienia** - ciemniejsze plamy na skórze
- **Pogrubienie skóry** (lichenifikacja) - w miejscach przewlekłego drapania

**Sierść:**
- **Wypadanie sierści** - łyse miejsca
- **Matowa, sucha sierść**
- **Przebarwienia sierści** - brązowe plamy (od śliny, przy lizaniu)

### Zdjęcie typowe dla alergii:

Pies z **brązowymi plamami na łapach** (od ciągłego lizania) + **łyse plamy na brzuchu** = czerwona flaga dla alergii pokarmowej.

### Co możesz zrobić?

- Rób **zdjęcia co tydzień** tych samych miejsc - łatwiej zauważysz progresję
- Sprawdź czy po zmianie karmy stan się poprawia
- Unikaj kąpieli zbyt często (max 1x/tydzień) - może wysuszać skórę

---

## 5. Zachowanie psa 🐕

### Objawy behawioralne:

- **Drażliwość** - pies jest mniej cierpliwy
- **Problemy ze snem** - budzi się w nocy, nie może znaleźć wygodnej pozycji
- **Unikanie dotyku** - zwłaszcza w bolesnych miejscach
- **Nadmierna aktywność** - przez świąd, pies nie może usiedzieć w miejscu
- **Liżące i gryzące łapy** - kompulsywne zachowanie
- **Tarcie się o meble** - próba złagodzenia świądu

### Dlaczego to ważne?

Przewlekły świąd to **ogromny dyskomfort** dla psa. Wyobraź sobie swędzenie, którego nie możesz zaspokoić - przez cały dzień, każdego dnia. To wpływa na jakość życia pupila.

### Co możesz zrobić?

- Obserwuj zachowanie psa - czy zmienia się po posiłkach?
- Zapewnij rozrywki umysłowe (zabawki interaktywne) - odwrócą uwagę od świądu
- Rozważ "koszulkę ochronną" zamiast kołnierza weterynaryjnego

---

## Kiedy udać się do weterynarza? 🏥

### Natychmiast:

- ⚠️ Obrzęk twarzy, pyska lub gardła
- ⚠️ Trudności w oddychaniu
- ⚠️ Ostra biegunka z krwią
- ⚠️ Całkowity brak apetytu >24h

### W ciągu tygodnia:

- 3+ wyżej wymienione objawy występują jednocześnie
- Objawy trwają >2 tygodni mimo domowych prób leczenia
- Powtarzające się infekcje uszu (>2x/rok)
- Widoczne pogorszenie stanu skóry

---

## Jak przygotować się do wizyty u weterynarza? 📋

### Zbierz informacje:

1. **Historia żywienia** - jakie karmy pies jadł przez ostatnie 6 miesięcy?
2. **Dziennik objawów** - kiedy się zaczęły, jak się zmieniały?
3. **Zdjęcia** - before/after, obszary zmienione
4. **Lista smakołyków** - wszystko co pies dostaje poza karmą
5. **Próbowane leczenia** - co już próbowałeś? Czy pomogło?

### Pytania do weterynarza:

- Czy to może być alergia pokarmowa?
- Jakie testy są zalecane?
- Czy dieta eliminacyjna jest wskazana?
- Jakie karmy hipoalergiczne poleca?
- Jak długo potrwa proces diagnozowania?

---

## Test domowy: Czy mój pies może mieć alergię pokarmową? ✅

Zaznacz wszystkie objawy, które występują u Twojego psa:

- [ ] Ciągłe drapanie się (>10 razy dziennie)
- [ ] Liżące się łapy
- [ ] Przewlekłe infekcje uszu (>2x/rok)
- [ ] Biegunka trwająca >2 tygodnie
- [ ] Wymioty (>2x/miesiąc)
- [ ] Zaczerwienienia skóry
- [ ] Wypadanie sierści
- [ ] Problemy ze snem
- [ ] Drażliwość, zmiana zachowania

**Wynik:**
- **0-2 objawy** - prawdopodobnie nie alergia, ale obserwuj dalej
- **3-5 objawów** - możliwa alergia pokarmowa - konsultacja z weterynarzem zalecana
- **6+ objawów** - bardzo prawdopodobna alergia - umów wizytę u weterynarza jak najszybciej

---

## Kolejne kroki 🎯

### Jeśli podejrzewasz alergię pokarmową:

1. **Nie panikuj** - alergie można skutecznie leczyć
2. **Dokumentuj** - rób zdjęcia, prowadź dziennik
3. **Umów wizytę** u weterynarza
4. **Przygotuj się na dietę eliminacyjną** (8-12 tygodni)
5. **Bądź konsekwentny** - sukces zależy od dyscypliny

### Zapamiętaj:

- Alergia pokarmowa ≠ koniec świata
- Większość psów świetnie radzi sobie po zmianie diety
- Im wcześniej zdiagnozujesz, tym lepiej dla psa
- Twoja obserwacja jest kluczowa - nikt nie zna Twojego psa lepiej niż Ty

---

**Masz pytania?** Przeczytaj nasz [kompletny przewodnik o alergiach pokarmowych](/articles/alergie-pokarmowe-u-psow-kompletny-przewodnik) lub skorzystaj z naszej bazy karm hipoalergicznych.

---

**Autor:** Zespół ZwierzakBezAlergii  
**Data publikacji:** ' || CURRENT_DATE || '

> **Zastrzeżenie:** Informacje zawarte w artykule mają charakter edukacyjny i nie zastępują porady weterynaryjnej. Zawsze konsultuj zdrowie swojego psa z wykwalifikowanym lekarzem weterynarii.',
  1, -- author_id
  true, -- published
  NOW() - INTERVAL ''1 day'', -- utworzony wczoraj
  NOW() - INTERVAL ''1 day''
);

-- Sprawdzenie czy artykuły zostały dodane
SELECT 
  id,
  title,
  slug,
  published,
  created_at
FROM articles
ORDER BY created_at DESC
LIMIT 2;

-- ============================================
-- GOTOWE! 
-- ============================================
-- Odśwież stronę http://localhost:3001/articles
-- i zobaczysz 2 nowe artykuły w gridzie!

