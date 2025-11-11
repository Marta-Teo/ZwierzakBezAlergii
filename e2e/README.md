# Testy E2E - Quick Start

## 📁 Struktura

```
e2e/
├── example.e2e.ts       # Przykładowe testy podstawowe
├── foods.e2e.ts         # Testy dla strony z karmami
└── README.md            # Ten plik
```

## 🚀 Szybki start

### 1. Uruchom testy

```bash
# UI mode - interaktywny interfejs (POLECANE)
npm run test:e2e:ui

# Uruchom wszystkie testy (headless)
npm run test:e2e

# Headed mode - z widoczną przeglądarką
npm run test:e2e:headed

# Debug mode - krok po kroku
npm run test:e2e:debug
```

### 2. Napisz swój pierwszy test

```typescript
// e2e/login.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('powinien zalogować użytkownika', async ({ page }) => {
    // Przejdź do strony logowania
    await page.goto('/login');

    // Wypełnij formularz
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Hasło').fill('password123');
    
    // Kliknij przycisk
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    // Sprawdź czy przekierowano
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## 🎯 Najlepsze praktyki

### 1. Używaj data-testid

W komponencie:
```tsx
<div data-testid="food-card">...</div>
```

W teście:
```typescript
await page.getByTestId('food-card').click();
```

### 2. Preferuj role-based selectors

```typescript
// ✅ Dobrze
await page.getByRole('button', { name: 'Zaloguj' });
await page.getByLabel('Email');

// ❌ Unikaj
await page.locator('.button');
await page.locator('#email-input');
```

### 3. Czekaj na elementy

```typescript
// Czekaj na widoczność
await expect(page.getByText('Ładowanie...')).toBeVisible();

// Czekaj na załadowanie sieci
await page.waitForLoadState('networkidle');
```

### 4. Izoluj testy

```typescript
test.beforeEach(async ({ page }) => {
  // Każdy test zaczyna od czystego stanu
  await page.goto('/');
});
```

## 🐛 Debugging

### Tryb debug

```bash
# Krok po kroku przez test
npm run test:e2e:debug
```

### UI Mode

```bash
# Interaktywny interfejs z time travel
npm run test:e2e:ui
```

### Trace Viewer

Po niepowodzeniu testu, otwórz trace:
```bash
npm run test:e2e:report
```

### Headed Mode

Zobacz co dzieje się w przeglądarce:
```bash
npm run test:e2e:headed
```

## 🔍 Przydatne komendy

```bash
# Uruchom konkretny plik
npm run test:e2e -- foods.e2e.ts

# Uruchom konkretny test
npm run test:e2e -- -g "powinien zalogować"

# Uruchom w trybie debug
npm run test:e2e:debug foods.e2e.ts

# Generuj testy automatycznie
npx playwright codegen http://localhost:4321
```

## 📖 Więcej informacji

Zobacz [pełny przewodnik testowania](../docs/testing-guide.md) dla:
- Page Object Model
- API Testing
- Visual Testing
- Best practices
- CI/CD integration

