# Dokument wymagań produktu (PRD) - ZwierzakBezAlergii

## 1. Przegląd produktu
1. Nazwa: ZwierzakBezAlergii (MVP)
2. Cel aplikacji: dostarczenie właścicielom psów z alergiami pokarmowymi centralnej bazy karm suchych dostępnych w Polsce z możliwością filtrowania po składnikach i alergenach oraz kompendium wiedzy o żywieniu i alergiach psów.
3. Architektura techniczna:
   - Frontend: Next.js, TypeScript, Tailwind CSS
   - Backend: Python FastAPI
   - Autoryzacja: Supabase Auth (lub alternatywnie Firebase Auth / JWT)
   - Baza danych: Supabase (tabela users z kolumną role)
   - CI/CD: GitHub Actions uruchamiające automatyczne testy po każdym pushu
   - Backup bazy: automatyczny proces tworzenia kopii zapasowej (szczegóły częstotliwości i przechowywania do doprecyzowania)
4. Grupa docelowa: właściciele psów z alergiami pokarmowymi, hodowcy i weterynarze poszukujący rzetelnych informacji o składach karm oraz porad dotyczących żywienia.

## 2. Problem użytkownika
Właściciele psów z alergiami pokarmowymi napotykają następujące trudności:
1. Rozproszone i niejasne informacje o składach karm na opakowaniach i stronach internetowych producentów.
2. Brak centralnego narzędzia do filtrowania karm po alergenach i składnikach bez konieczności zaawansowanej wiedzy.
3. Ryzyko podania pupilowi karmy zawierającej alergeny (np. kurczak, wołowina, pszenica) z powodu nieintuicyjnego interfejsu lub braku wyszukiwarki.
4. Ograniczony dostęp do wiarygodnej wiedzy na temat alergii i żywienia psów w jednym miejscu.

## 3. Wymagania funkcjonalne
3.1. Rejestracja i logowanie użytkownika
   1. Możliwość rejestracji konta z podaniem podstawowych danych.
   2. Logowanie przy użyciu adresu e-mail i hasła.
   3. Role użytkowników: user (użytkownik) i admin (administrator).
   4. Tabela `users` z kolumną `role` przechowującą uprawnienia.

3.2. Role i uprawnienia
   - user: przegląda karmy i artykuły, korzysta z filtrów.
   - admin: dodaje, edytuje i usuwa karmy oraz artykuły (bez dedykowanego panelu, przez bezpośredni import do bazy).

3.3. Lista karm
   1. Przegląd wszystkich karm suchych z bazy Supabase.
   2. Filtrowanie po:
      - marce
      - typie (rozmiar granulatu)
      - wieku psa (junior, adult, senior)
      - składnikach i alergenach (pełna lista białek i podwariantów).

3.4. Poradniki i artykuły edukacyjne
   1. Sekcja z artykułami o żywieniu i alergiach psów.
   2. Użytkownicy mogą przeglądać treści.
   3. Administrator może dodawać, edytować i usuwać artykuły przez bezpośredni import do bazy.

3.5. Logika filtrowania karm po alergenach
   1. Użytkownik wybiera alergeny (checkboxy z listą białek i podwariantów).
   2. System wyklucza karmy zawierające którykolwiek z wybranych alergenów.
   3. Dodatkowe filtry: rozmiar granulatu i wiek psa.

3.6. Testy jednostkowe i integracyjne
   1. Test funkcji `filter_foods_by_allergens`:
      ```python
def test_filter_foods_by_allergens():
    foods = [
        {"name": "Brit Care Lamb", "ingredients_raw": "lamb, rice"},
        {"name": "Brit Chicken", "ingredients_raw": "chicken, rice"}
    ]
    allergens = ["chicken"]
    result = filter_foods_by_allergens(foods, allergens)
    assert len(result) == 1
    assert result[0]["name"] == "Brit Care Lamb"
```
   2. Dodatkowe testy integracyjne dla ścieżek: Auth, CRUD, filtrowanie.

3.7. CI/CD
   - GitHub Actions uruchamiające zestaw testów po każdym pushu.

3.8. Backup bazy danych
   - Automatyczny proces tworzenia kopii zapasowej bazy Supabase (szczegóły do doprecyzowania).

## 4. Granice produktu
W ramach MVP wyłączone są:
1. Integracje ze sklepami i porównywarki cen (scraping, API sklepów).
2. Chatbot lub funkcje AI.
3. System rekomendacji i spersonalizowane powiadomienia.
4. Newsletter i mailingi do użytkowników.
5. Panel komentarzy i system opinii użytkowników.
6. Panel analityczny (raporty i dashboardy użytkowników).

## 5. Metryki sukcesu
1. Czas odpowiedzi filtrowania karm < 200 ms.
2. Poprawność wyników filtrowania (0 fałszywych pozytywów/negatywów w testach jednostkowych i integracyjnych).
3. Liczba aktywnych dziennych użytkowników (wartość bazowa do zdefiniowania przed uruchomieniem).
4. Retencja użytkowników po 7 dniach (wartość bazowa do zdefiniowania).
5. 100% przepuszczalność zestawów testów w CI.
6. Regularne wykonywanie i weryfikacja backupu bazy według ustalonej polityki.
