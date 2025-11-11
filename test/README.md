# Testy jednostkowe - Quick Start

## 📁 Struktura

```
test/
├── setup.ts              # Globalna konfiguracja Vitest
├── mocks/               # Mocki współdzielone między testami
│   └── supabase.ts      # Mock klienta Supabase
└── utils/               # Narzędzia pomocnicze
    └── test-utils.tsx   # Custom render z providerami
```

## 🚀 Szybki start

### 1. Uruchom testy

```bash
# Tryb watch - najlepszy podczas developmentu
npm run test:watch

# Uruchom wszystkie testy
npm run test

# UI mode - przeglądarka graficzna
npm run test:ui
```

### 2. Napisz swój pierwszy test

**Testowanie komponentu:**

```typescript
// src/components/__tests__/MyButton.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '@/test/utils/test-utils';
import { MyButton } from '../MyButton';

describe('MyButton', () => {
  it('powinien renderować tekst', () => {
    const { getByText } = renderWithProviders(
      <MyButton>Kliknij mnie</MyButton>
    );
    
    expect(getByText('Kliknij mnie')).toBeInTheDocument();
  });

  it('powinien wywołać onClick po kliknięciu', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { getByRole } = renderWithProviders(
      <MyButton onClick={handleClick}>Kliknij</MyButton>
    );
    
    await user.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Testowanie funkcji:**

```typescript
// src/lib/utils/__tests__/math.test.ts
import { describe, it, expect } from 'vitest';
import { add } from '../math';

describe('add', () => {
  it('powinien dodać dwie liczby', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('powinien obsłużyć liczby ujemne', () => {
    expect(add(-5, 3)).toBe(-2);
  });
});
```

## 🔧 Narzędzia pomocnicze

### renderWithProviders

Automatycznie opakowuje komponent w React Query Provider:

```typescript
const { getByText, queryClient } = renderWithProviders(<MyComponent />);
```

### mockSupabaseClient

Gotowy mock dla klienta Supabase:

```typescript
import { mockSupabaseClient, createSupabaseResponse } from '@/test/mocks/supabase';

vi.mock('@/db/supabase.client', () => ({
  createClient: () => mockSupabaseClient
}));

// Mockuj odpowiedź
mockSupabaseClient.from().select.mockResolvedValue(
  createSupabaseResponse([{ id: 1, name: 'Test' }])
);
```

## 📖 Więcej informacji

Zobacz [pełny przewodnik testowania](../docs/testing-guide.md) dla:
- Zaawansowanych przykładów
- Best practices
- Debugowanie
- CI/CD integration

