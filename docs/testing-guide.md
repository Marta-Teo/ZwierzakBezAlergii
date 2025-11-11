# Przewodnik po testowaniu

## Wprowadzenie

Projekt wykorzystuje dwa typy testów:
- **Testy jednostkowe** (Vitest) - do testowania pojedynczych funkcji, komponentów i logiki biznesowej
- **Testy E2E** (Playwright) - do testowania całej aplikacji z perspektywy użytkownika

## Struktura projektu

```
.
├── test/                          # Konfiguracja testów jednostkowych
│   ├── setup.ts                   # Globalna konfiguracja Vitest
│   ├── mocks/                     # Mocki (np. Supabase)
│   └── utils/                     # Narzędzia pomocnicze do testów
│
├── src/
│   ├── components/
│   │   └── __tests__/             # Testy komponentów React
│   └── lib/
│       └── utils/
│           └── __tests__/         # Testy funkcji pomocniczych
│
├── e2e/                           # Testy E2E Playwright
│   ├── example.e2e.ts
│   └── foods.e2e.ts
│
├── vitest.config.ts               # Konfiguracja Vitest
└── playwright.config.ts           # Konfiguracja Playwright
```

## Testy jednostkowe (Vitest)

### Uruchamianie testów

```bash
# Uruchom wszystkie testy jednostkowe
npm run test

# Tryb watch - automatycznie uruchamia testy po zmianach
npm run test:watch

# UI mode - graficzny interfejs do przeglądania testów
npm run test:ui

# Raport coverage
npm run test:coverage
```

### Pisanie testów jednostkowych

#### Testowanie komponentów React

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '@/test/utils/test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('powinien renderować komponent', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('powinien obsłużyć kliknięcie', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { getByRole } = renderWithProviders(
      <MyComponent onClick={handleClick} />
    );
    
    await user.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Testowanie funkcji pomocniczych

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('powinien zwrócić poprawny wynik', () => {
    expect(myFunction(5)).toBe(10);
  });

  it('powinien obsłużyć edge cases', () => {
    expect(myFunction(0)).toBe(0);
    expect(myFunction(-5)).toBe(-10);
  });
});
```

#### Mockowanie Supabase

```typescript
import { vi } from 'vitest';
import { mockSupabaseClient, createSupabaseResponse } from '@/test/mocks/supabase';

vi.mock('@/db/supabase.client', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

// W teście
mockSupabaseClient.from.mockReturnValue({
  select: vi.fn().mockResolvedValue(
    createSupabaseResponse([{ id: 1, name: 'Test' }])
  ),
});
```

### Najlepsze praktyki

1. **Arrange-Act-Assert** - struktura testów
   ```typescript
   it('should do something', () => {
     // Arrange - przygotuj dane
     const input = 5;
     
     // Act - wykonaj akcję
     const result = myFunction(input);
     
     // Assert - sprawdź wynik
     expect(result).toBe(10);
   });
   ```

2. **Opisowe nazwy testów** - używaj pełnych zdań w języku polskim
   ```typescript
   // ✅ Dobrze
   it('powinien zwrócić błąd gdy użytkownik nie jest zalogowany', () => {});
   
   // ❌ Źle
   it('test1', () => {});
   ```

3. **Testuj zachowania, nie implementację**
   ```typescript
   // ✅ Dobrze - testujesz co użytkownik widzi
   expect(getByText('Zaloguj się')).toBeInTheDocument();
   
   // ❌ Źle - testujesz szczegóły implementacji
   expect(component.state.isVisible).toBe(true);
   ```

4. **Jeden test = jedna rzecz**
   ```typescript
   // ✅ Dobrze
   it('powinien walidować email', () => {});
   it('powinien walidować hasło', () => {});
   
   // ❌ Źle
   it('powinien walidować email i hasło', () => {});
   ```

## Testy E2E (Playwright)

### Uruchamianie testów

```bash
# Uruchom wszystkie testy E2E (headless)
npm run test:e2e

# UI mode - interaktywny interfejs
npm run test:e2e:ui

# Debug mode - krok po kroku
npm run test:e2e:debug

# Headed mode - z widoczną przeglądarką
npm run test:e2e:headed

# Pokaż raport z ostatnich testów
npm run test:e2e:report
```

### Pisanie testów E2E

#### Podstawowy test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Nazwa funkcjonalności', () => {
  test.beforeEach(async ({ page }) => {
    // Przygotowanie przed każdym testem
    await page.goto('/');
  });

  test('powinien wykonać akcję', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');

    // Act
    await page.getByRole('button', { name: /kliknij/i }).click();

    // Assert
    await expect(page.getByText('Sukces')).toBeVisible();
  });
});
```

#### Selektory w Playwright

```typescript
// ✅ Preferowane - role-based selectors
await page.getByRole('button', { name: 'Zaloguj się' });
await page.getByRole('textbox', { name: 'Email' });

// ✅ Dobre - test IDs
await page.locator('[data-testid="food-card"]');

// ⚠️ Ostatnia deska ratunku - CSS selectors
await page.locator('.food-card');
```

#### Czekanie na elementy

```typescript
// Czekaj na widoczność
await expect(page.getByText('Ładowanie...')).toBeVisible();

// Czekaj na załadowanie sieci
await page.waitForLoadState('networkidle');

// Czekaj na konkretny request
await page.waitForResponse(response => 
  response.url().includes('/api/foods')
);
```

#### Interakcja z formularzami

```typescript
// Wypełnij formularz
await page.getByLabel('Email').fill('test@example.com');
await page.getByLabel('Hasło').fill('password123');

// Zaznacz checkbox
await page.getByRole('checkbox', { name: 'Zapamiętaj mnie' }).check();

// Wybierz z select
await page.getByRole('combobox').selectOption('opcja1');

// Wyślij formularz
await page.getByRole('button', { name: 'Wyślij' }).click();
```

#### API Testing

```typescript
test('powinien pobrać dane z API', async ({ request }) => {
  const response = await request.get('/api/foods');
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data).toHaveLength(10);
});
```

#### Visual Testing

```typescript
test('powinien wyglądać poprawnie', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Page Object Model

Dla bardziej złożonych testów używaj Page Object Model:

```typescript
// pages/login.page.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Hasło').fill(password);
    await this.page.getByRole('button', { name: 'Zaloguj się' }).click();
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }
}

// W teście
test('powinien zalogować użytkownika', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Najlepsze praktyki

1. **Używaj data-testid dla stabilnych selektorów**
   ```tsx
   <div data-testid="food-card">...</div>
   ```

2. **Izoluj testy** - każdy test powinien być niezależny
   ```typescript
   test.beforeEach(async ({ page }) => {
     // Reset stanu przed każdym testem
     await page.goto('/');
   });
   ```

3. **Używaj context dla różnych użytkowników**
   ```typescript
   test('admin i user widzą różne rzeczy', async ({ browser }) => {
     const adminContext = await browser.newContext({
       storageState: 'admin-state.json'
     });
     const userContext = await browser.newContext({
       storageState: 'user-state.json'
     });
     
     const adminPage = await adminContext.newPage();
     const userPage = await userContext.newPage();
     
     // ... testy
   });
   ```

4. **Debug z trace viewer**
   ```bash
   # Uruchom testy z trace
   npm run test:e2e -- --trace on
   
   # Otwórz trace viewer
   npx playwright show-trace trace.zip
   ```

## Debugging

### Vitest

```bash
# Uruchom konkretny test
npm run test -- SearchBar.test.tsx

# Uruchom testy z konkretnym wzorcem
npm run test -- -t "powinien renderować"

# UI mode - najlepszy do debugowania
npm run test:ui
```

### Playwright

```bash
# Debug mode - krok po kroku
npm run test:e2e:debug

# Uruchom konkretny plik
npm run test:e2e -- foods.e2e.ts

# Uruchom konkretny test
npm run test:e2e -- -g "powinien wyświetlić listę"

# Headed mode - zobacz co się dzieje
npm run test:e2e:headed
```

## CI/CD Integration

### GitHub Actions

Dodaj do `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Przydatne komendy

```bash
# Wszystkie testy
npm run test && npm run test:e2e

# Watch mode podczas development
npm run test:watch

# UI dla obu typów testów
npm run test:ui
npm run test:e2e:ui

# Coverage
npm run test:coverage

# Debug E2E
npm run test:e2e:debug
```

## Troubleshooting

### Vitest

**Problem**: Testy nie znajdują modułów
```typescript
// Sprawdź vitest.config.ts - czy alias jest poprawny
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

**Problem**: "window is not defined"
```typescript
// Sprawdź czy environment: 'jsdom' jest w vitest.config.ts
test: {
  environment: 'jsdom',
}
```

### Playwright

**Problem**: Test timeout
```typescript
// Zwiększ timeout dla wolnych testów
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 sekund
  // ...
});
```

**Problem**: Element nie został znaleziony
```typescript
// Użyj waitFor
await page.waitForSelector('[data-testid="food-card"]');

// Lub czekaj na visible
await expect(page.getByTestId('food-card')).toBeVisible();
```

## Dodatkowe zasoby

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

