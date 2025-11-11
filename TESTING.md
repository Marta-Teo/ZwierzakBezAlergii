# 🧪 Środowisko testowe - Podsumowanie

## ✅ Co zostało zainstalowane i skonfigurowane

### Testy jednostkowe (Vitest)

- ✅ **Vitest** - framework do testów jednostkowych
- ✅ **@testing-library/react** - narzędzia do testowania komponentów React
- ✅ **@testing-library/user-event** - symulacja interakcji użytkownika
- ✅ **@testing-library/jest-dom** - dodatkowe matchery dla DOM
- ✅ **jsdom** - symulacja środowiska przeglądarki
- ✅ **@vitest/ui** - graficzny interfejs do przeglądania testów
- ✅ **@vitest/coverage-v8** - raportowanie pokrycia kodu testami

### Testy E2E (Playwright)

- ✅ **@playwright/test** - framework do testów end-to-end
- ✅ **Chromium** - przeglądarka do uruchamiania testów

## 📁 Struktura projektu

```
.
├── vitest.config.ts           # Konfiguracja Vitest
├── playwright.config.ts       # Konfiguracja Playwright
│
├── test/                      # Setup dla testów jednostkowych
│   ├── setup.ts              # Globalna konfiguracja
│   ├── mocks/
│   │   └── supabase.ts       # Mock Supabase
│   └── utils/
│       └── test-utils.tsx    # Helpery do testów
│
├── e2e/                       # Testy E2E
│   ├── example.e2e.ts        # Przykładowe testy podstawowe
│   ├── foods.e2e.ts          # Testy strony z karmami
│   └── README.md
│
└── src/
    ├── components/
    │   └── __tests__/         # Testy komponentów
    │       └── SearchBar.test.tsx
    └── lib/
        └── utils/
            └── __tests__/     # Testy funkcji
                └── formatters.test.ts
```

## 🚀 Dostępne komendy

### Testy jednostkowe

```bash
# Uruchom wszystkie testy jednostkowe
npm run test

# Tryb watch - automatyczne uruchamianie po zmianach (POLECANE podczas developmentu)
npm run test:watch

# Graficzny interfejs do przeglądania testów
npm run test:ui

# Raport pokrycia kodu testami
npm run test:coverage
```

### Testy E2E

```bash
# Uruchom wszystkie testy E2E (headless)
npm run test:e2e

# Interaktywny interfejs (POLECANE)
npm run test:e2e:ui

# Tryb debug - krok po kroku
npm run test:e2e:debug

# Z widoczną przeglądarką
npm run test:e2e:headed

# Pokaż raport z ostatnich testów
npm run test:e2e:report
```

## ⭐ Testy User Journey

**Wymaganie projektu:** "Test weryfikujący działanie z perspektywy użytkownika"

✅ **SPEŁNIONE!** Projekt zawiera kompleksowe testy user journey w pliku `e2e/user-journey.e2e.ts`

Szczegóły: **[docs/wymaganie-testy-uzytkownika.md](docs/wymaganie-testy-uzytkownika.md)**

```bash
# Uruchom testy user journey
npx playwright test user-journey.e2e.ts

# Wynik: 3 passed ✅
```

---

## 📚 Quick Start

### 1. Napisz test jednostkowy

```typescript
// src/components/__tests__/MyButton.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '@/test/utils/test-utils';
import { MyButton } from '../MyButton';

describe('MyButton', () => {
  it('powinien wywołać onClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { getByRole } = renderWithProviders(
      <MyButton onClick={handleClick}>Kliknij</MyButton>
    );
    
    await user.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

**Uruchom:**
```bash
npm run test:watch
```

### 2. Napisz test E2E

```typescript
// e2e/login.e2e.ts
import { test, expect } from '@playwright/test';

test('powinien zalogować użytkownika', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Hasło').fill('password123');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  
  await expect(page).toHaveURL('/dashboard');
});
```

**Uruchom:**
```bash
npm run test:e2e:ui
```

## 🎯 Najlepsze praktyki

### Testy jednostkowe

1. **Testuj zachowania, nie implementację**
   ```typescript
   // ✅ Dobrze
   expect(getByText('Zaloguj się')).toBeInTheDocument();
   
   // ❌ Źle
   expect(component.state.isVisible).toBe(true);
   ```

2. **Używaj `renderWithProviders` dla komponentów React**
   - Automatycznie dodaje React Query Provider
   - Umożliwia mockowanie danych

3. **Mockuj Supabase gdy potrzeba**
   ```typescript
   import { mockSupabaseClient } from '@/test/mocks/supabase';
   ```

### Testy E2E

1. **Używaj data-testid dla stabilnych selektorów**
   ```tsx
   <div data-testid="food-card">...</div>
   ```

2. **Preferuj role-based selectors**
   ```typescript
   await page.getByRole('button', { name: 'Zaloguj' });
   await page.getByLabel('Email');
   ```

3. **Czekaj na elementy**
   ```typescript
   await expect(page.getByText('Ładowanie...')).toBeVisible();
   await page.waitForLoadState('networkidle');
   ```

## 📖 Pełna dokumentacja

Szczegółowe informacje znajdziesz w:

- **[docs/testing-guide.md](docs/testing-guide.md)** - Kompletny przewodnik z zaawansowanymi technikami
- **[test/README.md](test/README.md)** - Quick start dla testów jednostkowych
- **[e2e/README.md](e2e/README.md)** - Quick start dla testów E2E

## ✨ Co dalej?

1. **Uruchom przykładowe testy:**
   ```bash
   npm run test
   npm run test:e2e:ui
   ```

2. **Przejrzyj przykłady:**
   
   **Testy User Journey (najbardziej realistyczne):**
   - `e2e/user-journey.e2e.ts` - ⭐ **KOMPLEKSOWE TESTY Z PERSPEKTYWY UŻYTKOWNIKA**
   
   **Testy jednostkowe:**
   - `src/components/__tests__/Button.example.test.tsx` - test komponentu React
   - `src/lib/utils/__tests__/formatters.test.ts` - test funkcji pomocniczej
   
   **Testy E2E funkcjonalności:**
   - `e2e/example.e2e.ts` - podstawowe testy E2E
   - `e2e/foods.e2e.ts` - zaawansowane testy E2E
   - `e2e/login-with-pom.e2e.ts` - Page Object Model
   
   **Page Object Models:**
   - `e2e/pages/` - modele dla wszystkich stron

3. **Zacznij pisać własne testy!**

## 🐛 Troubleshooting

### Vitest

**Problem:** "window is not defined"  
**Rozwiązanie:** Sprawdź czy `environment: 'jsdom'` jest w `vitest.config.ts`

**Problem:** Testy nie znajdują modułów z `@/*`  
**Rozwiązanie:** Sprawdź konfigurację `resolve.alias` w `vitest.config.ts`

### Playwright

**Problem:** Test timeout  
**Rozwiązanie:** Zwiększ timeout: `test.setTimeout(60000);`

**Problem:** Element nie został znaleziony  
**Rozwiązanie:** Użyj `await page.waitForSelector()` lub `await expect().toBeVisible()`

## 🤝 Pomoc

Jeśli masz pytania lub problemy:
1. Sprawdź [docs/testing-guide.md](docs/testing-guide.md)
2. Uruchom testy w trybie debug: `npm run test:e2e:debug`
3. Użyj UI mode: `npm run test:ui` lub `npm run test:e2e:ui`

---

**Gotowe do użycia! 🎉**

Środowisko testowe jest w pełni skonfigurowane i gotowe do pracy. Możesz zacząć pisać testy już teraz!

