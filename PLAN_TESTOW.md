# Plan Testów - ZwierzakBezAlergii

## 1. Wprowadzenie i cele testowania

### 1.1. Cel dokumentu
Niniejszy plan testów określa kompleksową strategię testowania aplikacji ZwierzakBezAlergii - centralnej bazy karm dla psów z alergiami pokarmowymi dostępnych w Polsce.

### 1.2. Cele testowania
- **Funkcjonalność**: Weryfikacja poprawności działania wszystkich funkcjonalności aplikacji, ze szczególnym uwzględnieniem krytycznego filtrowania po alergenach
- **Bezpieczeństwo**: Zapewnienie właściwej autoryzacji i ochrony danych użytkowników poprzez Row Level Security (RLS)
- **Wydajność**: Potwierdzenie odpowiednich czasów odpowiedzi przy filtrowaniu dużych zbiorów danych
- **Użyteczność**: Sprawdzenie intuicyjności interfejsu, szczególnie dla użytkowników bez doświadczenia technicznego
- **Integracje**: Weryfikacja poprawności komunikacji z Supabase, OpenRouter.ai i innymi serwisami zewnętrznymi
- **Zgodność**: Upewnienie się, że aplikacja działa poprawnie na różnych przeglądarkach i urządzeniach (desktop, mobile)

### 1.3. Zakres dokumentu
Plan obejmuje testowanie:
- Warstwy prezentacji (Astro + React)
- API endpointów
- Logiki biznesowej (filtrowanie, walidacja)
- Integracji zewnętrznych (Supabase, OpenRouter.ai)
- Bezpieczeństwa (autentykacja, autoryzacja, RLS)
- Wydajności krytycznych operacji

---

## 2. Zakres testów

### 2.1. Funkcjonalności w zakresie testów

#### 2.1.1. Moduł Karm (/foods)
- ✅ Wyświetlanie listy karm w układzie grid (5 kolumn)
- ✅ Filtrowanie po marce, rozmiarze granulatu, wieku psa
- ✅ **KRYTYCZNE**: Filtrowanie po alergenach z obsługą hierarchii (np. wykluczenie "drób" wyklucza "kurczak", "indyk", "kaczka")
- ✅ Wyszukiwanie pełnotekstowe po nazwie i składnikach
- ✅ Paginacja wyników (domyślnie 20 elementów na stronę)
- ✅ Wyświetlanie szczegółów karmy w modalu
- ✅ Dodawanie karm do ulubionych (dla zalogowanych użytkowników)
- ✅ Oznaczenie ulubionych karm na liście

#### 2.1.2. Moduł Autentykacji
- ✅ Rejestracja użytkownika (email + hasło)
- ✅ Logowanie użytkownika
- ✅ Wylogowanie
- ✅ Reset hasła przez email
- ✅ Aktualizacja hasła
- ✅ Walidacja formularzy (client-side i server-side)
- ✅ Automatyczne tworzenie rekordu w public.users przy rejestracji (trigger)
- ✅ Ochrona chronionych stron przez middleware

#### 2.1.3. Moduł Profili Psów (/dogs)
- ✅ Tworzenie profilu psa (imię, rozmiar, wiek, alergeny)
- ✅ Edycja profilu psa
- ✅ Usuwanie profilu psa
- ✅ Wyświetlanie listy profili użytkownika
- ✅ Automatyczne filtrowanie karm na podstawie profilu psa
- ✅ Walidacja danych (imię: 1-50 znaków, tylko litery/spacje/myślniki)

#### 2.1.4. Moduł Ulubionych Karm (/favorites)
- ✅ Dodawanie karmy do ulubionych
- ✅ Usuwanie karmy z ulubionych
- ✅ Wyświetlanie listy ulubionych karm
- ✅ Sprawdzanie statusu ulubionej dla każdej karmy (idsOnly endpoint)
- ✅ Synchronizacja z UI (ikona gwiazdki)

#### 2.1.5. Moduł Artykułów (/articles)
- ✅ Wyświetlanie listy artykułów
- ✅ Filtrowanie po tagach
- ✅ Wyświetlanie szczegółów artykułu
- ✅ Renderowanie treści Markdown
- ✅ Wyświetlanie autora i daty publikacji

#### 2.1.6. Asystent AI (/asystent)
- ✅ Wysyłanie wiadomości do asystenta
- ✅ Otrzymywanie odpowiedzi z modelu AI
- ✅ Historia konwersacji (przechowywanie w stanie)
- ✅ Czyszczenie historii
- ✅ Przykładowe pytania do szybkiego startu
- ✅ Obsługa błędów API

#### 2.1.7. API Endpoints
- ✅ GET /api/foods - lista karm z filtrowaniem
- ✅ POST /api/foods - tworzenie nowej karmy (tylko admin)
- ✅ GET /api/foods/:id - szczegóły karmy
- ✅ PUT /api/foods/:id - aktualizacja karmy (tylko admin)
- ✅ DELETE /api/foods/:id - usunięcie karmy (tylko admin)
- ✅ GET /api/brands - lista marek
- ✅ GET /api/allergens - lista alergenów (hierarchiczna struktura)
- ✅ GET /api/ingredients - lista składników
- ✅ GET /api/favorites - lista ulubionych karm
- ✅ POST /api/favorites/:foodId - dodanie do ulubionych
- ✅ DELETE /api/favorites/:foodId - usunięcie z ulubionych
- ✅ POST /api/chat - komunikacja z asystentem AI

### 2.2. Funkcjonalności poza zakresem testów
- ❌ Integracje z zewnętrznymi sklepami (nie są w MVP)
- ❌ System ocen i komentarzy użytkowników (nie w MVP)
- ❌ Newsletter i email marketing (nie w MVP)
- ❌ Dashboard administracyjny (obecnie zarządzanie przez Supabase Dashboard)
- ❌ Logowanie przez OAuth (Google, Facebook) - w MVP tylko email/hasło

---

## 3. Typy testów do przeprowadzenia

### 3.1. Testy jednostkowe (Unit Tests)

#### 3.1.1. Walidacja danych
- **Cel**: Weryfikacja poprawności schematów walidacji Zod
- **Narzędzia**: Vitest, Zod
- **Priorytet**: ⭐⭐⭐ Wysoki

**Przypadki testowe**:
```typescript
// src/lib/schemas/foodSchema.ts
describe('CreateFoodSchema', () => {
  test('Powinna akceptować poprawne dane karmy', () => {
    const validData = {
      name: 'Acana Heritage Adult',
      brand_id: 1,
      size_type_id: 2,
      age_category_id: 1,
      ingredients_raw: 'Kurczak, ryż, ...'
    };
    expect(() => CreateFoodSchema.parse(validData)).not.toThrow();
  });

  test('Powinna odrzucić pustą nazwę', () => {
    const invalidData = { name: '', brand_id: 1 };
    expect(() => CreateFoodSchema.parse(invalidData)).toThrow();
  });

  test('Powinna odrzucić brand_id jako string', () => {
    const invalidData = { name: 'Acana', brand_id: '1' };
    expect(() => CreateFoodSchema.parse(invalidData)).toThrow();
  });
});

// src/lib/auth/validation.ts
describe('validatePassword', () => {
  test('Powinna akceptować silne hasło', () => {
    expect(validatePassword('MyStr0ng!Pass')).toHaveProperty('isValid', true);
  });

  test('Powinna odrzucić hasło < 8 znaków', () => {
    const result = validatePassword('Short1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Hasło musi mieć minimum 8 znaków');
  });

  test('Powinna odrzucić hasło bez cyfry', () => {
    const result = validatePassword('NoNumbersPass');
    expect(result.isValid).toBe(false);
  });
});

// src/lib/dogs/validation.ts
describe('validateDogForm', () => {
  test('Powinna zaakceptować poprawne dane psa', () => {
    const data = { name: 'Burek', allergenIds: [1, 2], notes: null };
    expect(validateDogForm(data)).toBeNull();
  });

  test('Powinna odrzucić imię > 50 znaków', () => {
    const data = { name: 'A'.repeat(51), allergenIds: [] };
    expect(validateDogForm(data)).toBe('Imię psa może mieć maksymalnie 50 znaków');
  });

  test('Powinna odrzucić imię ze znakami specjalnymi', () => {
    const data = { name: 'Burek123', allergenIds: [] };
    expect(validateDogForm(data)).toContain('tylko litery');
  });
});
```

#### 3.1.2. Utility Functions
- **Cel**: Testowanie pomocniczych funkcji (np. sortowanie alergenów)
- **Priorytet**: ⭐⭐ Średni

```typescript
// src/lib/utils/allergenSorting.ts
describe('sortAllergensByPriority', () => {
  test('Powinna sortować alergeny według priorytetu', () => {
    const allergens = [
      { id: 1, name: 'Kukurydza', parent_id: null },
      { id: 2, name: 'Drób', parent_id: null },
      { id: 3, name: 'Kurczak', parent_id: 2 }
    ];
    const sorted = sortAllergensByPriority(allergens);
    expect(sorted[0].name).toBe('Drób'); // Kategoria główna najpierw
  });
});
```

#### 3.1.3. OpenRouter Service
- **Cel**: Testowanie logiki komunikacji z API OpenRouter
- **Priorytet**: ⭐⭐⭐ Wysoki

```typescript
describe('OpenRouterService', () => {
  test('Powinna rzucić błąd gdy brak API key', () => {
    expect(() => new OpenRouterService({ apiKey: '' })).toThrow(ConfigurationError);
  });

  test('Powinna walidować opcje chatu', async () => {
    const service = new OpenRouterService({ apiKey: 'test-key' });
    await expect(service.chat({ messages: [] })).rejects.toThrow(ValidationError);
  });

  test('Powinna poprawnie zbudować request body', () => {
    // Test prywatnej metody przez mockowanie
  });
});
```

### 3.2. Testy integracyjne (Integration Tests)

#### 3.2.1. API Endpoints
- **Cel**: Weryfikacja poprawności działania endpointów API
- **Narzędzia**: Vitest + Supertest (lub fetch w Astro)
- **Priorytet**: ⭐⭐⭐ Krytyczny

**Kluczowe scenariusze**:

```typescript
// Test: GET /api/foods
describe('GET /api/foods', () => {
  test('Powinna zwrócić listę karm bez filtrów', async () => {
    const response = await fetch('/api/foods?limit=10&offset=0');
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('success', true);
    expect(json.data).toBeInstanceOf(Array);
    expect(json.pagination.limit).toBe(10);
  });

  test('Powinna filtrować po marce', async () => {
    const response = await fetch('/api/foods?brandId=1');
    const json = await response.json();
    expect(json.data.every(food => food.brand_id === 1)).toBe(true);
  });

  test('KRYTYCZNE: Powinna wykluczać karmy z alergenami', async () => {
    // Exclude "kurczak" (id: 9)
    const response = await fetch('/api/foods?excludeAllergens=kurczak');
    const json = await response.json();
    
    // Sprawdź, że żadna karma nie zawiera kurczaka w składnikach
    for (const food of json.data) {
      const detailsResponse = await fetch(`/api/foods/${food.id}`);
      const details = await detailsResponse.json();
      const allergenNames = details.data.allergens.map(a => a.name);
      expect(allergenNames).not.toContain('kurczak');
      expect(allergenNames).not.toContain('Kurczak');
    }
  });

  test('KRYTYCZNE: Powinna wykluczać dzieci w hierarchii alergenów', async () => {
    // Exclude "drób" (parent) - powinno wykluczyć też "kurczak", "indyk", "kaczka"
    const response = await fetch('/api/foods?excludeAllergens=drób');
    const json = await response.json();
    
    for (const food of json.data) {
      const detailsResponse = await fetch(`/api/foods/${food.id}`);
      const details = await detailsResponse.json();
      const allergenNames = details.data.allergens.map(a => a.name.toLowerCase());
      expect(allergenNames).not.toContain('drób');
      expect(allergenNames).not.toContain('kurczak');
      expect(allergenNames).not.toContain('indyk');
      expect(allergenNames).not.toContain('kaczka');
    }
  });

  test('Powinna zwrócić 400 dla nieprawidłowych parametrów', async () => {
    const response = await fetch('/api/foods?limit=abc');
    expect(response.status).toBe(400);
  });
});

// Test: POST /api/foods (wymagana autentykacja admin)
describe('POST /api/foods', () => {
  test('Powinna utworzyć nową karmę jako admin', async () => {
    const response = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminSessionCookie },
      body: JSON.stringify({
        name: 'Test Food',
        brand_id: 1,
        ingredients_raw: 'Test ingredients'
      })
    });
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.data).toHaveProperty('id');
    expect(json.data.name).toBe('Test Food');
  });

  test('Powinna odrzucić request bez autentykacji', async () => {
    const response = await fetch('/api/foods', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' })
    });
    expect(response.status).toBe(401);
  });

  test('Powinna odrzucić request jako user (nie admin)', async () => {
    const response = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Cookie': userSessionCookie },
      body: JSON.stringify({ name: 'Test', brand_id: 1 })
    });
    expect(response.status).toBe(403); // Forbidden (RLS policy)
  });
});

// Test: Favorites API
describe('Favorites API', () => {
  test('Powinna dodać karmę do ulubionych', async () => {
    const response = await fetch('/api/favorites/1', {
      method: 'POST',
      headers: { 'Cookie': userSessionCookie }
    });
    expect(response.status).toBe(201);
  });

  test('Powinna zwrócić listę ulubionych użytkownika', async () => {
    const response = await fetch('/api/favorites', {
      headers: { 'Cookie': userSessionCookie }
    });
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
  });

  test('Powinna odrzucić dostęp bez autentykacji', async () => {
    const response = await fetch('/api/favorites');
    expect(response.status).toBe(401);
  });
});

// Test: Chat API
describe('POST /api/chat', () => {
  test('Powinna zwrócić odpowiedź asystenta', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Jakie są najczęstsze alergeny?' }],
        systemMessage: 'Jesteś ekspertem od żywienia psów',
        model: 'openai/gpt-3.5-turbo'
      })
    });
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toHaveProperty('content');
    expect(typeof json.content).toBe('string');
  });

  test('Powinna odrzucić request bez API key', async () => {
    // Mockowanie braku OPENROUTER_API_KEY
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] })
    });
    expect(response.status).toBe(500);
  });
});
```

#### 3.2.2. Middleware i Authorization
- **Cel**: Weryfikacja ochrony chronionych stron
- **Priorytet**: ⭐⭐⭐ Krytyczny

```typescript
describe('Middleware Protection', () => {
  test('Powinna przekierować niezalogowanego użytkownika z /dogs do /login', async () => {
    const response = await fetch('/dogs', { redirect: 'manual' });
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('/login');
  });

  test('Powinna przekazać return URL w query', async () => {
    const response = await fetch('/dogs', { redirect: 'manual' });
    const location = response.headers.get('location');
    expect(location).toContain('redirect=%2Fdogs');
  });

  test('Powinna zezwolić zalogowanemu użytkownikowi na /dogs', async () => {
    const response = await fetch('/dogs', {
      headers: { 'Cookie': userSessionCookie }
    });
    expect(response.status).toBe(200);
  });
});
```

#### 3.2.3. Database Queries (Supabase)
- **Cel**: Testowanie zapytań do bazy danych
- **Priorytet**: ⭐⭐⭐ Wysoki

```typescript
describe('Food Service', () => {
  test('Powinna pobrać listę karm z relacjami', async () => {
    const { data, error } = await foodService.list(supabase, {
      limit: 10,
      offset: 0,
      excludeAllergens: [],
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toHaveProperty('brandName');
  });

  test('Powinna poprawnie wykluczać karmy z alergenami', async () => {
    const { data } = await foodService.list(supabase, {
      excludeAllergens: ['kurczak'],
      limit: 100,
      offset: 0
    });
    
    // Verify no food contains chicken
    for (const food of data) {
      const { data: detail } = await foodService.getById(supabase, food.id);
      expect(detail.allergens.every(a => a.name !== 'kurczak')).toBe(true);
    }
  });
});

describe('Dog Profiles Service', () => {
  test('Powinna utworzyć profil psa z alergenami', async () => {
    const dto = {
      name: 'Burek',
      size_type_id: 1,
      age_category_id: 2,
      allergen_ids: [1, 2, 3]
    };
    const { data, error } = await dogService.create(supabase, userId, dto);
    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.allergens).toHaveLength(3);
  });

  test('Powinna usunąć profil psa wraz z alergenami (CASCADE)', async () => {
    await dogService.delete(supabase, dogId);
    const { data: allergens } = await supabase
      .from('dog_allergens')
      .select('*')
      .eq('dog_id', dogId);
    expect(allergens).toHaveLength(0);
  });
});
```

### 3.3. Testy komponentów (Component Tests)

#### 3.3.1. React Components
- **Cel**: Testowanie izolowanych komponentów React
- **Narzędzia**: Vitest + React Testing Library
- **Priorytet**: ⭐⭐ Średni

**Kluczowe komponenty do przetestowania**:

```typescript
// FilterSidebar.tsx
describe('FilterSidebar', () => {
  test('Powinna renderować wszystkie sekcje filtrów', () => {
    render(<FilterSidebar {...props} />);
    expect(screen.getByText('Alergeny')).toBeInTheDocument();
    expect(screen.getByText('Marka')).toBeInTheDocument();
    expect(screen.getByText('Rozmiar granulatu')).toBeInTheDocument();
  });

  test('KRYTYCZNE: Powinna domyślnie zaznaczyć wszystkie alergeny', () => {
    render(<FilterSidebar {...props} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.every(cb => cb.checked)).toBe(true);
  });

  test('KRYTYCZNE: Odznaczenie alergenu powinno dodać go do excludeAllergens', () => {
    const onChange = vi.fn();
    render(<FilterSidebar filters={{excludeAllergens: []}} onChange={onChange} {...props} />);
    
    const kurczakCheckbox = screen.getByLabelText('Kurczak');
    fireEvent.click(kurczakCheckbox);
    
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ excludeAllergens: ['kurczak'] })
    );
  });

  test('Powinna resetować filtry do stanu domyślnego', () => {
    const onReset = vi.fn();
    render(<FilterSidebar onReset={onReset} {...props} />);
    
    const resetButton = screen.getByText('Resetuj filtry');
    fireEvent.click(resetButton);
    
    expect(onReset).toHaveBeenCalled();
  });
});

// FoodsPage.tsx
describe('FoodsPage', () => {
  test('Powinna wyświetlić loading state', () => {
    render(<FoodsPage isLoggedIn={false} />);
    expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();
  });

  test('Powinna wyświetlić listę karm po załadowaniu', async () => {
    mockUseFoods.mockReturnValue({
      data: mockFoods,
      isLoading: false
    });
    
    render(<FoodsPage isLoggedIn={false} />);
    await waitFor(() => {
      expect(screen.getByText('Acana Heritage Adult')).toBeInTheDocument();
    });
  });

  test('Powinna wyświetlić ikonę gwiazdki dla zalogowanego użytkownika', () => {
    render(<FoodsPage isLoggedIn={true} />);
    expect(screen.getAllByLabelText(/dodaj do ulubionych/i)).toHaveLength(mockFoods.length);
  });
});

// PetFoodAssistant.tsx
describe('PetFoodAssistant', () => {
  test('Powinna wysłać wiadomość po kliknięciu Submit', async () => {
    const sendMessage = vi.fn();
    mockUseChat.mockReturnValue({ sendMessage, messages: [], isLoading: false });
    
    render(<PetFoodAssistant />);
    const input = screen.getByPlaceholderText(/wpisz wiadomość/i);
    const submitButton = screen.getByRole('button', { name: /wyślij/i });
    
    fireEvent.change(input, { target: { value: 'Test pytanie' } });
    fireEvent.click(submitButton);
    
    expect(sendMessage).toHaveBeenCalledWith('Test pytanie');
  });

  test('Powinna wyświetlić historię konwersacji', () => {
    mockUseChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'Pytanie' },
        { role: 'assistant', content: 'Odpowiedź' }
      ]
    });
    
    render(<PetFoodAssistant />);
    expect(screen.getByText('Pytanie')).toBeInTheDocument();
    expect(screen.getByText('Odpowiedź')).toBeInTheDocument();
  });
});

// Auth Forms
describe('LoginForm', () => {
  test('Powinna walidować email', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /zaloguj/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy format email/i)).toBeInTheDocument();
    });
  });

  test('Powinna wymagać minimum 8 znaków hasła', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/hasło/i);
    
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/minimum 8 znaków/i)).toBeInTheDocument();
    });
  });
});
```

### 3.4. Testy end-to-end (E2E Tests)

#### 3.4.1. User Journeys
- **Cel**: Symulacja rzeczywistych scenariuszy użytkownika
- **Narzędzia**: Playwright lub Cypress
- **Priorytet**: ⭐⭐⭐ Wysoki

**Kluczowe przepływy**:

```typescript
// E2E: Pełny przepływ filtrowania karm
test('User Story: Właściciel psa z alergią na kurczaka znajduje odpowiednią karmę', async ({ page }) => {
  // 1. Wejście na stronę główną
  await page.goto('/');
  expect(await page.title()).toContain('ZwierzakBezAlergii');
  
  // 2. Przejście do listy karm
  await page.click('text=Przeglądaj karmy');
  await page.waitForURL('/foods');
  
  // 3. Odznaczenie alergenu "kurczak"
  await page.getByLabel('Kurczak').uncheck();
  
  // 4. Poczekanie na przefiltrowanie
  await page.waitForTimeout(1000); // Debounce
  
  // 5. Sprawdzenie, że żadna karma nie zawiera kurczaka
  const foodCards = page.locator('[data-testid="food-card"]');
  const count = await foodCards.count();
  
  for (let i = 0; i < count; i++) {
    await foodCards.nth(i).click();
    await page.waitForSelector('[data-testid="food-modal"]');
    
    const allergens = await page.locator('[data-testid="allergen-badge"]').allTextContents();
    expect(allergens).not.toContain('Kurczak');
    expect(allergens).not.toContain('kurczak');
    
    await page.keyboard.press('Escape'); // Zamknij modal
  }
});

// E2E: Rejestracja, logowanie i tworzenie profilu psa
test('User Story: Nowy użytkownik rejestruje się i tworzy profil psa', async ({ page }) => {
  // 1. Rejestracja
  await page.goto('/register');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Strong123!');
  await page.fill('input[name="confirmPassword"]', 'Strong123!');
  await page.click('button[type="submit"]');
  
  // 2. Przekierowanie po rejestracji
  await page.waitForURL('/foods');
  
  // 3. Przejście do profili psów
  await page.click('text=Moje psy');
  await page.waitForURL('/dogs');
  
  // 4. Utworzenie profilu psa
  await page.click('text=Dodaj psa');
  await page.fill('input[name="name"]', 'Burek');
  await page.selectOption('select[name="sizeType"]', '2'); // Średni
  await page.selectOption('select[name="ageCategory"]', '1'); // Adult
  await page.getByLabel('Kurczak').check();
  await page.getByLabel('Pszenica').check();
  await page.click('button[type="submit"]');
  
  // 5. Weryfikacja utworzenia
  await page.waitForURL('/dogs');
  expect(await page.textContent('body')).toContain('Burek');
});

// E2E: Korzystanie z asystenta AI
test('User Story: Użytkownik pyta asystenta o alergeny', async ({ page }) => {
  await page.goto('/asystent');
  
  // 1. Wysłanie pytania
  await page.fill('textarea[placeholder*="wiadomość"]', 'Jakie są najczęstsze alergeny u psów?');
  await page.click('button[type="submit"]');
  
  // 2. Oczekiwanie na odpowiedź
  await page.waitForSelector('[data-role="assistant"]', { timeout: 15000 });
  
  // 3. Sprawdzenie, czy odpowiedź zawiera sensowne informacje
  const response = await page.locator('[data-role="assistant"]').first().textContent();
  expect(response).toMatch(/(kurczak|wołowina|pszenica|kukurydza)/i);
});

// E2E: Dodawanie do ulubionych
test('User Story: Zalogowany użytkownik dodaje karmę do ulubionych', async ({ page, context }) => {
  // Przygotowanie: zaloguj się
  await context.addCookies([{ name: 'supabase-auth-token', value: validToken, domain: 'localhost', path: '/' }]);
  
  await page.goto('/foods');
  
  // 1. Kliknięcie gwiazdki
  const firstFoodCard = page.locator('[data-testid="food-card"]').first();
  await firstFoodCard.locator('[aria-label="Dodaj do ulubionych"]').click();
  
  // 2. Sprawdzenie, czy gwiazdka zmieniła stan
  await page.waitForTimeout(500);
  const favoriteIcon = firstFoodCard.locator('[aria-label="Usuń z ulubionych"]');
  expect(await favoriteIcon.count()).toBe(1);
  
  // 3. Przejście do ulubionych
  await page.click('text=Ulubione');
  await page.waitForURL('/favorites');
  
  // 4. Sprawdzenie, czy karma jest na liście
  expect(await page.locator('[data-testid="food-card"]').count()).toBeGreaterThan(0);
});
```

### 3.5. Testy wydajnościowe (Performance Tests)

#### 3.5.1. Czas odpowiedzi API
- **Cel**: Zapewnienie szybkiego działania krytycznych endpointów
- **Narzędzia**: k6, Lighthouse
- **Priorytet**: ⭐⭐ Średni

**Kryteria akceptacji**:
- GET /api/foods (bez filtrów): < 500ms
- GET /api/foods (z filtrem po alergenach): < 1000ms
- POST /api/chat: < 5000ms (zależy od OpenRouter)
- GET /api/foods/:id: < 300ms

```javascript
// k6 load test
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up do 20 użytkowników
    { duration: '1m', target: 50 },  // Utrzymanie 50 użytkowników
    { duration: '30s', target: 0 }   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% requestów < 1s
  }
};

export default function () {
  // Test 1: Pobieranie listy karm
  let res = http.get('https://zwierzakbezalergii.pl/api/foods?limit=20');
  check(res, { 'status was 200': (r) => r.status == 200 });
  
  // Test 2: Filtrowanie po alergenach
  res = http.get('https://zwierzakbezalergii.pl/api/foods?excludeAllergens=kurczak,pszenica');
  check(res, { 'filtered foods status 200': (r) => r.status == 200 });
  
  sleep(1);
}
```

#### 3.5.2. Optymalizacja zapytań bazy danych
- **Cel**: Weryfikacja wykorzystania indeksów
- **Priorytet**: ⭐⭐ Średni

```sql
-- Sprawdzenie planu zapytania dla filtrowania po alergenach
EXPLAIN ANALYZE
SELECT f.*
FROM foods f
WHERE NOT EXISTS (
  SELECT 1 FROM food_ingredients fi
  INNER JOIN ingredient_allergens ia ON fi.ingredient_id = ia.ingredient_id
  WHERE fi.food_id = f.id AND ia.allergen_id IN (1, 2, 3)
);

-- Oczekiwane: wykorzystanie indeksów idx_food_ingredients_food_id, idx_ingredient_allergens_ingredient_id
```

### 3.6. Testy bezpieczeństwa (Security Tests)

#### 3.6.1. Row Level Security (RLS)
- **Cel**: Weryfikacja polityk bezpieczeństwa Supabase
- **Priorytet**: ⭐⭐⭐ Krytyczny

**Scenariusze testowe**:

```typescript
describe('RLS Policies - Dog Profiles', () => {
  test('Użytkownik A nie może zobaczyć profili użytkownika B', async () => {
    // Login jako user A
    const { data: profilesA } = await supabaseUserA
      .from('dog_profiles')
      .select('*');
    
    // Login jako user B
    const { data: profilesB } = await supabaseUserB
      .from('dog_profiles')
      .select('*');
    
    // Sprawdzenie rozłączności
    const idsA = profilesA.map(p => p.id);
    const idsB = profilesB.map(p => p.id);
    expect(idsA.some(id => idsB.includes(id))).toBe(false);
  });

  test('Użytkownik nie może usunąć cudzego profilu psa', async () => {
    const { error } = await supabaseUserA
      .from('dog_profiles')
      .delete()
      .eq('id', dogProfileOwnedByUserB);
    
    expect(error).not.toBeNull();
    expect(error.code).toBe('PGRST301'); // RLS policy violation
  });
});

describe('RLS Policies - Favorites', () => {
  test('Użytkownik widzi tylko swoje ulubione', async () => {
    const { data } = await supabaseUserA
      .from('favorite_foods')
      .select('*');
    
    expect(data.every(fav => fav.user_id === userAId)).toBe(true);
  });
});

describe('RLS Policies - Admin Operations', () => {
  test('User nie może utworzyć karmy', async () => {
    const { error } = await supabaseUser
      .from('foods')
      .insert({ name: 'Hack Food', brand_id: 1 });
    
    expect(error).not.toBeNull();
  });

  test('Admin może utworzyć karmę', async () => {
    const { data, error } = await supabaseAdmin
      .from('foods')
      .insert({ name: 'New Food', brand_id: 1 })
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
  });
});
```

#### 3.6.2. SQL Injection
- **Cel**: Weryfikacja odporności na SQL Injection
- **Priorytet**: ⭐⭐⭐ Krytyczny

```typescript
describe('SQL Injection Prevention', () => {
  test('Parametry query nie powinny umożliwiać SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE foods; --";
    const response = await fetch(`/api/foods?search=${encodeURIComponent(maliciousInput)}`);
    
    expect(response.status).toBe(200); // Nie powinno rzucić błędem
    
    // Sprawdzenie, że tabela nadal istnieje
    const checkResponse = await fetch('/api/foods');
    expect(checkResponse.status).toBe(200);
  });
});
```

#### 3.6.3. XSS (Cross-Site Scripting)
- **Cel**: Weryfikacja sanityzacji danych wejściowych
- **Priorytet**: ⭐⭐⭐ Wysoki

```typescript
describe('XSS Prevention', () => {
  test('Nazwa psa nie powinna wykonać skryptu', async ({ page }) => {
    await page.goto('/dogs/new');
    
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[name="name"]', xssPayload);
    await page.click('button[type="submit"]');
    
    // Sprawdzenie, że alert się nie wykonał
    expect(await page.locator('text=<script>').count()).toBe(0);
  });
});
```

### 3.7. Testy accessibility (a11y)

#### 3.7.1. WCAG Compliance
- **Cel**: Zapewnienie dostępności dla osób z niepełnosprawnościami
- **Narzędzia**: axe-core, Lighthouse
- **Priorytet**: ⭐⭐ Średni

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

describe('Accessibility Tests', () => {
  test('Strona /foods powinna być zgodna z WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/foods');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('FilterSidebar powinna mieć właściwe aria-labels', async ({ page }) => {
    await page.goto('/foods');
    
    const sidebar = page.locator('aside[aria-label="Filtry karm"]');
    expect(await sidebar.count()).toBe(1);
    
    const allergenCheckboxes = page.locator('input[type="checkbox"][name^="allergen"]');
    for (const checkbox of await allergenCheckboxes.all()) {
      expect(await checkbox.getAttribute('id')).toBeTruthy();
      expect(await page.locator(`label[for="${await checkbox.getAttribute('id')}"]`).count()).toBe(1);
    }
  });

  test('Modal szczegółów karmy powinien mieć focus trap', async ({ page }) => {
    await page.goto('/foods');
    await page.click('[data-testid="food-card"]:first');
    
    // Sprawdzenie aria-modal
    const modal = page.locator('[role="dialog"]');
    expect(await modal.getAttribute('aria-modal')).toBe('true');
    
    // Sprawdzenie focus trap (Tab nie wychodzi poza modal)
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(await modal.locator('*').allTextContents()).toContain(focusedElement);
  });
});
```

---

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Filtrowanie karm po alergenach (KRYTYCZNE)

**ID**: TC-FILTER-001  
**Priorytet**: ⭐⭐⭐ Krytyczny  
**Moduł**: Filtrowanie karm

#### Opis
Weryfikacja poprawności wykluczania karm zawierających wybrane alergeny, z obsługą hierarchii (wykluczenie kategorii nadrzędnej wyklucza też podkategorie).

#### Warunki wstępne
- Użytkownik znajduje się na stronie /foods
- Baza danych zawiera co najmniej 20 karm z różnymi alergenami
- Hierarchia alergenów poprawnie skonfigurowana (np. Drób → Kurczak, Indyk, Kaczka)

#### Kroki testowe

| Krok | Akcja | Oczekiwany rezultat |
|------|-------|---------------------|
| 1 | Wejdź na /foods | Lista wszystkich karm wyświetlona, wszystkie checkboxy alergenów zaznaczone |
| 2 | Odznacz checkbox "Kurczak" | Lista odświeżona, karmy zawierające kurczaka usunięte z wyników |
| 3 | Kliknij losową karmę z listy | Modal szczegółów otwiera się, w sekcji "Alergeny" brak "Kurczak" |
| 4 | Zamknij modal, zaznacz z powrotem "Kurczak" | Karmy z kurczakiem ponownie widoczne na liście |
| 5 | Odznacz checkbox "Drób" (kategoria nadrzędna) | Wszystkie karmy z drobiem (kurczak, indyk, kaczka) usunięte z listy |
| 6 | Sprawdź 5 losowych karm z listy | Żadna z nich nie zawiera: drób, kurczak, indyk, kaczka |
| 7 | Odznacz dodatkowo "Pszenica" | Lista zawiera tylko karmy bez drobiu i pszenicy |
| 8 | Kliknij "Resetuj filtry" | Wszystkie checkboxy ponownie zaznaczone, pełna lista karm |

#### Kryteria akceptacji
- ✅ Odznaczenie alergenu usuwa karmy z tego składnika w czasie < 1s
- ✅ Wykluczenie kategorii nadrzędnej działa rekurencyjnie dla podkategorii
- ✅ Możliwość wykluczenia wielu alergenów jednocześnie
- ✅ URL query params odzwierciedlają filtry (deep linking)
- ✅ Stan filtrów persystowany w localStorage

---

### 4.2. Tworzenie profilu psa z automatycznym filtrowaniem

**ID**: TC-DOG-001  
**Priorytet**: ⭐⭐⭐ Wysoki  
**Moduł**: Profile psów

#### Opis
Weryfikacja tworzenia profilu psa i automatycznego filtrowania karm na podstawie jego alergii.

#### Warunki wstępne
- Użytkownik zalogowany
- Użytkownik nie ma jeszcze profilu psa

#### Kroki testowe

| Krok | Akcja | Oczekiwany rezultat |
|------|-------|---------------------|
| 1 | Wejdź na /dogs | Pusty stan z przyciskiem "Dodaj profil psa" |
| 2 | Kliknij "Dodaj profil psa" | Formularz tworzenia profilu wyświetlony |
| 3 | Wpisz imię "Burek" | Pole zaakceptowane |
| 4 | Wpisz imię "Burek123" | Walidacja: "Imię może zawierać tylko litery" |
| 5 | Wpisz poprawne imię, wybierz rozmiar "Średni", wiek "Adult" | Pola zaakceptowane |
| 6 | Zaznacz alergeny: Kurczak, Pszenica | Checkboxy zaznaczone |
| 7 | Kliknij "Zapisz" | Profil utworzony, przekierowanie do /dogs |
| 8 | Kliknij "Zobacz odpowiednie karmy" | Przekierowanie do /foods z preselected filters |
| 9 | Sprawdź URL | Zawiera `?dogId=1` lub podobne |
| 10 | Sprawdź filtry | Kurczak i Pszenica odznaczone, rozmiar i wiek ustawione |

#### Kryteria akceptacji
- ✅ Walidacja imienia działa client-side i server-side
- ✅ Profil zapisany w bazie z relacjami dog_allergens
- ✅ Automatyczne filtrowanie karm na podstawie profilu
- ✅ RLS: użytkownik widzi tylko swoje profile

---

### 4.3. Autentykacja i autoryzacja

**ID**: TC-AUTH-001  
**Priorytet**: ⭐⭐⭐ Krytyczny  
**Moduł**: Autentykacja

#### Opis
Weryfikacja procesu rejestracji, logowania i ochrony chronionych zasobów.

#### Kroki testowe

| Krok | Akcja | Oczekiwany rezultat |
|------|-------|---------------------|
| 1 | Wejdź na /register | Formularz rejestracji wyświetlony |
| 2 | Wpisz email "test@example.com", hasło "Short1" | Walidacja: "Hasło musi mieć min 8 znaków" |
| 3 | Wpisz hasło "ValidPass123", confirmPassword "DifferentPass" | Walidacja: "Hasła nie są identyczne" |
| 4 | Wpisz poprawne dane i wyślij formularz | Konto utworzone, automatyczne zalogowanie, przekierowanie do /foods |
| 5 | Sprawdź Header | Wyświetlone avatar użytkownika i menu dropdown |
| 6 | Wyloguj się | Przekierowanie do /, Header pokazuje "Zaloguj się" |
| 7 | Spróbuj wejść na /dogs bez logowania | Przekierowanie do /login?redirect=%2Fdogs |
| 8 | Zaloguj się | Po zalogowaniu przekierowanie do /dogs (return URL) |
| 9 | Jako user spróbuj POST /api/foods | 403 Forbidden (RLS policy) |
| 10 | Jako admin spróbuj POST /api/foods | 201 Created, karma dodana |

#### Kryteria akceptacji
- ✅ Walidacja hasła: min 8 znaków, litera + cyfra
- ✅ Sesja persystowana w cookies (Supabase Auth)
- ✅ Middleware chroni strony: /dogs, /favorites
- ✅ RLS policies wymuszają uprawnienia

---

### 4.4. Asystent AI - podstawowa konwersacja

**ID**: TC-AI-001  
**Priorytet**: ⭐⭐ Średni  
**Moduł**: Asystent AI

#### Opis
Weryfikacja poprawności komunikacji z asystentem AI i obsługi błędów.

#### Kroki testowe

| Krok | Akcja | Oczekiwany rezultat |
|------|-------|---------------------|
| 1 | Wejdź na /asystent | Komponent czatu wyświetlony, pole tekstowe i przykładowe pytania |
| 2 | Kliknij przykładowe pytanie "Jakie są najczęstsze alergeny?" | Pytanie wklejone do pola tekstowego |
| 3 | Kliknij "Wyślij" | Loading indicator, po < 10s odpowiedź asystenta |
| 4 | Sprawdź treść odpowiedzi | Zawiera słowa kluczowe: kurczak, wołowina, pszenica |
| 5 | Wyślij kolejne pytanie "A kukurydza?" | Kontekst zachowany, odpowiedź nawiązuje do poprzedniej |
| 6 | Kliknij "Wyczyść historię" | Historia wyczyszczona, chat pusty |
| 7 | Wyślij pytanie z usuniętym OPENROUTER_API_KEY (symulacja) | Error message: "API key jest wymagany" |

#### Kryteria akceptacji
- ✅ Odpowiedź asystenta w < 10s (GPT-3.5-turbo)
- ✅ Historia konwersacji przechowywana w stanie
- ✅ Obsługa błędów API (brak klucza, timeout, rate limit)
- ✅ Auto-scroll do najnowszej wiadomości

---

### 4.5. Ulubione karmy

**ID**: TC-FAV-001  
**Priorytet**: ⭐⭐ Średni  
**Moduł**: Ulubione

#### Kroki testowe

| Krok | Akcja | Oczekiwany rezultat |
|------|-------|---------------------|
| 1 | Zaloguj się i wejdź na /foods | Lista karm z ikonami gwiazdek |
| 2 | Kliknij gwiazdkę przy karmie "Acana Heritage" | Gwiazdka wypełniona, toast "Dodano do ulubionych" |
| 3 | Odśwież stronę | Gwiazdka nadal wypełniona (dane z bazy) |
| 4 | Wejdź na /favorites | Lista zawiera "Acana Heritage" |
| 5 | Kliknij gwiazdkę ponownie | Gwiazdka pusta, toast "Usunięto z ulubionych" |
| 6 | Sprawdź /favorites | "Acana Heritage" usunięta z listy |
| 7 | Sprawdź API call | POST /api/favorites/1 zwraca 201, DELETE zwraca 200 |

#### Kryteria akceptacji
- ✅ Synchronizacja z bazą danych (RLS)
- ✅ Optymistyczne UI (natychmiastowa zmiana ikony)
- ✅ Constraint UNIQUE (user_id, food_id) zapobiega duplikatom

---

## 5. Środowisko testowe

### 5.1. Konfiguracja środowisk

#### 5.1.1. Środowisko lokalne (Development)
- **Cel**: Testowanie podczas developmentu
- **Baza danych**: Supabase Local (Docker) lub Supabase Dev Project
- **URL**: http://localhost:4321
- **OpenRouter API**: Test API key z limitem budżetu

**Setup**:
```bash
# .env.local
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
OPENROUTER_API_KEY=test-key
PUBLIC_APP_NAME=ZwierzakBezAlergii (Local)
```

#### 5.1.2. Środowisko testowe (Staging)
- **Cel**: Integracyjne i E2E testy przed produkcją
- **Baza danych**: Supabase Staging Project (oddzielny projekt)
- **URL**: https://staging.zwierzakbezalergii.pl
- **Dane**: Seed data z supabase/seed.sql

**Setup**:
```bash
# .env.staging
SUPABASE_URL=https://staging-project.supabase.co
SUPABASE_ANON_KEY=staging-anon-key
OPENROUTER_API_KEY=staging-key
```

#### 5.1.3. Środowisko produkcyjne (Production)
- **Cel**: Smoke tests po wdrożeniu
- **Baza danych**: Supabase Production Project
- **URL**: https://zwierzakbezalergii.pl
- **Monitoring**: Supabase Dashboard, Sentry (opcjonalnie)

### 5.2. Dane testowe

#### 5.2.1. Użytkownicy testowi
```sql
-- User (zwykły użytkownik)
INSERT INTO auth.users (id, email) VALUES 
  ('test-user-uuid', 'testuser@example.com');
INSERT INTO public.users (id, role) VALUES 
  ('test-user-uuid', 'user');

-- Admin
INSERT INTO auth.users (id, email) VALUES 
  ('test-admin-uuid', 'admin@example.com');
INSERT INTO public.users (id, role) VALUES 
  ('test-admin-uuid', 'admin');
```

#### 5.2.2. Karmy testowe
- Co najmniej 50 karm z różnymi alergenami
- Co najmniej 5 marek
- Pokrycie wszystkich kombinacji: size_type, age_category, allergens

```sql
-- Przykładowe karmy
INSERT INTO foods (name, brand_id, size_type_id, age_category_id) VALUES
  ('Test Food Chicken', 1, 1, 1),
  ('Test Food Lamb', 2, 2, 2),
  ('Test Food Fish', 3, 3, 1);

-- Powiązanie z alergenami
INSERT INTO food_ingredients (food_id, ingredient_id) VALUES (1, 1); -- Kurczak
INSERT INTO ingredient_allergens (ingredient_id, allergen_id) VALUES (1, 9); -- Kurczak -> Drób
```

#### 5.2.3. Hierarchia alergenów
```
Drób (parent_id: NULL)
├── Kurczak (parent_id: 2)
├── Indyk (parent_id: 2)
└── Kaczka (parent_id: 2)

Zboża (parent_id: NULL)
├── Pszenica (parent_id: 4)
├── Kukurydza (parent_id: 4)
└── Jęczmień (parent_id: 4)
```

### 5.3. Przeglądarki i urządzenia

#### 5.3.1. Przeglądarki desktop
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest, macOS)
- ✅ Edge (latest)

#### 5.3.2. Przeglądarki mobile
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

#### 5.3.3. Rozdzielczości
- Desktop: 1920x1080, 1366x768
- Tablet: 768x1024
- Mobile: 375x667 (iPhone SE), 412x915 (Pixel)

---

## 6. Narzędzia do testowania

### 6.1. Framework testowy

#### 6.1.1. Vitest
- **Zastosowanie**: Testy jednostkowe i integracyjne
- **Dlaczego**: Natywna integracja z Vite, szybkie wykonywanie
- **Konfiguracja**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});
```

#### 6.1.2. React Testing Library
- **Zastosowanie**: Testy komponentów React
- **Dlaczego**: Best practices, user-centric approach
- **Instalacja**:
```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

#### 6.1.3. Playwright
- **Zastosowanie**: Testy E2E
- **Dlaczego**: Szybsze niż Cypress, lepsze API, multi-browser
- **Konfiguracja**:
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

### 6.2. Narzędzia pomocnicze

#### 6.2.1. MSW (Mock Service Worker)
- **Zastosowanie**: Mockowanie API w testach
- **Przykład**:
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/foods', (req, res, ctx) => {
    return res(ctx.json({ success: true, data: mockFoods }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### 6.2.2. Faker.js
- **Zastosowanie**: Generowanie danych testowych
```typescript
import { faker } from '@faker-js/faker';

const generateMockFood = () => ({
  name: faker.commerce.productName(),
  brand_id: faker.number.int({ min: 1, max: 10 }),
  ingredients_raw: faker.lorem.sentence()
});
```

#### 6.2.3. axe-core
- **Zastosowanie**: Automatyczne testy accessibility
```bash
npm install -D @axe-core/playwright
```

### 6.3. Monitoring i raportowanie

#### 6.3.1. Coverage
- **Cel**: Min. 70% code coverage dla krytycznych modułów
- **Narzędzie**: Vitest coverage
- **Raport**: HTML coverage report w CI/CD

#### 6.3.2. Test reporting
- **Format**: JUnit XML dla integracji z CI/CD
- **Dashboard**: GitHub Actions Test Results

---

## 7. Harmonogram testów

### 7.1. Faza 1: Setup i testy jednostkowe (Tydzień 1-2)

**Zadania**:
- [x] Konfiguracja Vitest + React Testing Library
- [x] Napisanie testów dla schematów walidacji (Zod)
- [x] Testy utility functions (allergenSorting, etc.)
- [ ] Testy OpenRouterService
- [ ] Coverage: min 80% dla `/lib/schemas`, `/lib/utils`

**Odpowiedzialny**: QA Engineer + Backend Developer  
**Deliverables**: Test suite z min. 50 testami jednostkowymi

---

### 7.2. Faza 2: Testy API i integracyjne (Tydzień 3-4)

**Zadania**:
- [ ] Testy GET /api/foods (wszystkie filtry)
- [ ] Testy CRUD /api/foods/:id (admin only)
- [ ] Testy favorites API
- [ ] Testy RLS policies (dog_profiles, favorites)
- [ ] Setup MSW dla mocków

**Odpowiedzialny**: Backend Developer + QA Engineer  
**Deliverables**: 30+ testów API, dokumentacja błędów

---

### 7.3. Faza 3: Testy komponentów React (Tydzień 5)

**Zadania**:
- [ ] Testy FilterSidebar (krytyczne)
- [ ] Testy FoodsPage
- [ ] Testy PetFoodAssistant
- [ ] Testy formularzy auth
- [ ] Testy DogForm

**Odpowiedzialny**: Frontend Developer + QA Engineer  
**Deliverables**: 40+ testów komponentów

---

### 7.4. Faza 4: Testy E2E (Tydzień 6-7)

**Zadania**:
- [ ] Setup Playwright
- [ ] Test: Pełny przepływ filtrowania karm
- [ ] Test: Rejestracja + tworzenie profilu psa
- [ ] Test: Dodawanie do ulubionych
- [ ] Test: Konwersacja z asystentem

**Odpowiedzialny**: QA Engineer  
**Deliverables**: 15+ scenariuszy E2E, nagrania wideo

---

### 7.5. Faza 5: Testy wydajnościowe i bezpieczeństwa (Tydzień 8)

**Zadania**:
- [ ] Load testing z k6 (50 concurrent users)
- [ ] Sprawdzenie planów zapytań SQL (EXPLAIN ANALYZE)
- [ ] Testy RLS policies (penetracja)
- [ ] Testy SQL Injection, XSS
- [ ] Lighthouse audit (Performance, Accessibility)

**Odpowiedzialny**: DevOps + Security Engineer  
**Deliverables**: Raport wydajności, raport bezpieczeństwa

---

### 7.6. Faza 6: Testy regresyjne i smoke tests (Tydzień 9)

**Zadania**:
- [ ] Uruchomienie pełnej suity testów na staging
- [ ] Smoke tests na produkcji po wdrożeniu
- [ ] Weryfikacja backupu bazy danych
- [ ] Testy przeglądarek (Chrome, Firefox, Safari)

**Odpowiedzialny**: Cały zespół  
**Deliverables**: Go/No-Go decision dla produkcji

---

## 8. Kryteria akceptacji testów

### 8.1. Kryteria dla poszczególnych typów testów

#### 8.1.1. Testy jednostkowe
- ✅ Min. 80% code coverage dla modułów: `/lib/schemas`, `/lib/utils`, `/lib/services`
- ✅ Wszystkie testy przechodzą w < 5s
- ✅ Żadnych skippowanych testów (`test.skip`)
- ✅ Brak testów flaky (niestabilnych)

#### 8.1.2. Testy integracyjne
- ✅ Wszystkie endpointy API przetestowane (min. happy path + error cases)
- ✅ RLS policies zweryfikowane dla każdej tabeli
- ✅ Testowane na środowisku staging z seed data

#### 8.1.3. Testy E2E
- ✅ Min. 5 krytycznych user journeys pokrytych
- ✅ Testy wykonywane na Chrome, Firefox, Safari Mobile
- ✅ Nagrania wideo przy błędach (Playwright trace)

#### 8.1.4. Testy wydajnościowe
- ✅ GET /api/foods: p95 < 1000ms
- ✅ GET /api/foods (z filtrem alergenów): p95 < 1500ms
- ✅ Lighthouse Performance score > 85

#### 8.1.5. Testy bezpieczeństwa
- ✅ Brak podatności na SQL Injection, XSS
- ✅ RLS policies działają poprawnie (0 leaków danych między użytkownikami)
- ✅ Hasła hashowane (Supabase Auth)
- ✅ HTTPS wymuszony na produkcji

### 8.2. Kryteria akceptacji dla MVP

**Aby uznać aplikację za gotową do wdrożenia, muszą być spełnione:**

| Kryterium | Wymagana wartość | Status |
|-----------|------------------|--------|
| Code coverage (krytyczne moduły) | ≥ 80% | ⬜ |
| Testy jednostkowe | 100% pass | ⬜ |
| Testy API | 100% pass | ⬜ |
| Testy E2E (krytyczne flows) | 100% pass | ⬜ |
| Performance (GET /api/foods) | p95 < 1s | ⬜ |
| RLS policies | 0 leaków | ⬜ |
| Accessibility (WCAG 2.1 AA) | 0 krytycznych błędów | ⬜ |
| Browser compatibility | Chrome, Firefox, Safari ✅ | ⬜ |
| Mobile compatibility | iOS Safari, Chrome Mobile ✅ | ⬜ |

**Kryteria blokujące wdrożenie (blockers)**:
- 🔴 Filtrowanie po alergenach nie działa poprawnie (TC-FILTER-001)
- 🔴 RLS leak (użytkownik widzi cudze dane)
- 🔴 Podatność na SQL Injection
- 🔴 API foods zwraca błąd 500 (reliability)

---

## 9. Role i odpowiedzialności w procesie testowania

### 9.1. Zespół testowy

#### 9.1.1. QA Engineer (Lead)
**Odpowiedzialności**:
- Koordynacja procesu testowania
- Tworzenie i utrzymanie testów E2E (Playwright)
- Raportowanie błędów (GitHub Issues)
- Weryfikacja kryteriów akceptacji
- Przegląd pull requestów z testami

**Wymagane umiejętności**:
- Znajomość Playwright/Cypress
- TypeScript
- Znajomość testowania API (REST)

#### 9.1.2. Frontend Developer
**Odpowiedzialności**:
- Pisanie testów komponentów React (React Testing Library)
- Testy jednostkowe dla utility functions
- Weryfikacja accessibility (axe-core)
- Code review testów frontendowych

**Wymagane umiejętności**:
- React Testing Library
- Vitest
- Znajomość ARIA, WCAG

#### 9.1.3. Backend Developer
**Odpowiedzialności**:
- Testy API endpointów
- Testy integracyjne (Supabase queries)
- Weryfikacja RLS policies
- Optymalizacja zapytań SQL (indeksy)

**Wymagane umiejętności**:
- Supabase
- PostgreSQL (RLS, triggers)
- Vitest

#### 9.1.4. DevOps Engineer
**Odpowiedzialności**:
- Konfiguracja CI/CD pipeline (GitHub Actions)
- Setup środowiska staging
- Testy wydajnościowe (k6)
- Monitoring produkcji (Supabase Dashboard)

**Wymagane umiejętności**:
- GitHub Actions
- Docker
- k6 lub JMeter

### 9.2. Workflow

#### 9.2.1. Proces dodawania nowej funkcjonalności
1. **Tworzenie ticket** (GitHub Issue) z kryteriami akceptacji
2. **Development** (branch feature/nazwa)
3. **Pisanie testów** (jednostkowych, komponentów, API)
4. **Code review** (min. 1 approval)
5. **Merge do main** (automatyczne uruchomienie testów w CI)
6. **Deploy na staging** (smoke tests)
7. **QA verification** (manualne testy E2E)
8. **Deploy na production**

#### 9.2.2. Proces raportowania błędów
1. **Wykrycie błędu** (testy lub manualne testy)
2. **Utworzenie Issue** w GitHub z labelką `bug`
3. **Priorytet**:
   - 🔴 Critical: Blokuje główną funkcjonalność (np. filtrowanie nie działa)
   - 🟠 High: Ważna funkcjonalność nie działa (np. favorites crash)
   - 🟡 Medium: Bug wizualny lub edge case
   - 🟢 Low: Drobne usprawnienie

**Template Issue**:
```markdown
## 🐛 Opis błędu
Krótki opis problemu

## 📋 Kroki do reprodukcji
1. Wejdź na /foods
2. Odznacz "Kurczak"
3. ...

## ✅ Oczekiwane zachowanie
Co powinno się wydarzyć

## ❌ Aktualne zachowanie
Co faktycznie się dzieje

## 📷 Screenshot / Video
[załącznik]

## 🌍 Środowisko
- Przeglądarka: Chrome 120
- OS: Windows 11
- URL: https://staging.zwierzakbezalergii.pl

## 🔍 Logi / Error messages
```

---

## 10. Procedury raportowania błędów

### 10.1. Klasyfikacja błędów

#### 10.1.1. Severity (dotkliwość)
- **Critical**: Aplikacja się crashuje, dane tracone, bezpieczeństwo naruszone
- **High**: Główna funkcjonalność nie działa (np. filtrowanie, logowanie)
- **Medium**: Funkcjonalność działa, ale niepoprawnie (np. sortowanie odwrotne)
- **Low**: Problemy kosmetyczne (np. nieprawidłowy kolor przycisku)

#### 10.1.2. Priority (priorytet naprawy)
- **P0**: Natychmiastowa naprawa (hotfix)
- **P1**: Naprawa w bieżącym sprincie
- **P2**: Naprawa w następnym sprincie
- **P3**: Backlog (gdy będzie czas)

### 10.2. Workflow naprawy błędów

```
[Bug wykryty]
     ↓
[Issue utworzone w GitHub]
     ↓
[Triage: Priorytet + Severity]
     ↓
[Assign do developera]
     ↓
[Fix + napisanie testu regresyjnego]
     ↓
[Code review]
     ↓
[Merge + deploy na staging]
     ↓
[QA verification: test ponownie bug]
     ↓
[Issue zamknięte]
```

### 10.3. Metryki jakości

#### 10.3.1. KPI dla testów
- **Test pass rate**: % testów przechodzących (cel: > 95%)
- **Code coverage**: % pokrycia kodu (cel: > 80%)
- **Bug escape rate**: % bugów wykrytych na produkcji (cel: < 5%)
- **Time to fix (Critical)**: Średni czas naprawy bugów Critical (cel: < 24h)

#### 10.3.2. Dashboardy
- **GitHub Actions**: Status testów przy każdym PR
- **Codecov**: Wizualizacja code coverage
- **Supabase Dashboard**: Monitoring wydajności zapytań

---

## 11. Ryzyka i plan mitigation

### 11.1. Identyfikowane ryzyka

#### Ryzyko 1: Filtrowanie po alergenach działa niepoprawnie
- **Prawdopodobieństwo**: Średnie
- **Wpływ**: Krytyczny (główna funkcjonalność aplikacji)
- **Mitigation**:
  - Priorytet testów: TC-FILTER-001
  - Testy jednostkowe dla `getAllergenIdsWithChildren()`
  - Testy E2E z weryfikacją każdej karmy
  - Manual testing przez QA Engineer

#### Ryzyko 2: RLS policies leakują dane między użytkownikami
- **Prawdopodobieństwo**: Niskie (Supabase dobrze to obsługuje)
- **Wpływ**: Krytyczny (naruszenie GDPR)
- **Mitigation**:
  - Dedykowane testy RLS dla każdej tabeli
  - Penetration testing (próba dostępu do cudzych danych)
  - Code review RLS policies przez Backend + Security

#### Ryzyko 3: OpenRouter API rate limit lub timeout
- **Prawdopodobieństwo**: Średnie
- **Wpływ**: Średni (asystent nie działa, ale nie blokuje głównej funkcjonalności)
- **Mitigation**:
  - Retry logic w OpenRouterService (3x)
  - User-friendly error messages ("Spróbuj ponownie za chwilę")
  - Monitoring kosztów API (Openrouter Dashboard)

#### Ryzyko 4: Wydajność filtrowania przy dużej bazie danych
- **Prawdopodobieństwo**: Średnie (po dodaniu > 1000 karm)
- **Wpływ**: Wysoki (UX cierpi)
- **Mitigation**:
  - Indeksy na kluczowych kolumnach (już zrobione w migracji)
  - Load testing z k6 (symulacja 1000+ karm)
  - EXPLAIN ANALYZE dla każdego zapytania
  - Cache'owanie wyników (Redis w przyszłości)

#### Ryzyko 5: Brak pokrycia testami mobile
- **Prawdopodobieństwo**: Niskie
- **Wpływ**: Średni (część użytkowników na mobile)
- **Mitigation**:
  - Playwright z konfiguracją mobile devices
  - Manual testing na rzeczywistych urządzeniach (iOS, Android)
  - Responsive design review w każdym PR

---

## 12. Podsumowanie i następne kroki

### 12.1. Kluczowe punkty planu

1. **Priorytet testów**: Filtrowanie po alergenach (TC-FILTER-001) i RLS policies
2. **Narzędzia**: Vitest + React Testing Library + Playwright
3. **Harmonogram**: 9 tygodni (setup → jednostkowe → API → komponenty → E2E → wydajność → regresja)
4. **Kryteria akceptacji**: 80% coverage, 100% pass rate, 0 leaków RLS
5. **Zespół**: QA Lead, Frontend Dev, Backend Dev, DevOps

### 12.2. Natychmiastowe akcje

#### Tydzień 1 (Priorytet: Setup)
- [ ] Zainstalować Vitest, React Testing Library, Playwright
- [ ] Skonfigurować vitest.config.ts, playwright.config.ts
- [ ] Utworzyć katalogi: `/tests/unit`, `/tests/integration`, `/tests/e2e`
- [ ] Napisać 5 pierwszych testów (proof of concept)

#### Tydzień 2 (Priorytet: Krytyczne testy)
- [ ] Napisać testy dla TC-FILTER-001 (filtrowanie alergenów)
- [ ] Napisać testy RLS policies (dog_profiles, favorites)
- [ ] Uruchomić testy w CI/CD (GitHub Actions)

### 12.3. Metryki sukcesu

**Po zakończeniu planu testów, powinniśmy osiągnąć**:
- ✅ Min. 150 testów (jednostkowe + integracyjne + E2E)
- ✅ 80% code coverage dla krytycznych modułów
- ✅ 0 Critical bugów w backlogu
- ✅ Performance: p95 < 1s dla kluczowych API
- ✅ Security: 0 podatności OWASP Top 10
- ✅ Accessibility: WCAG 2.1 AA compliance

---

## Załączniki

### A. Checklist przed wdrożeniem na produkcję

**Funkcjonalność**:
- [ ] Filtrowanie po alergenach działa poprawnie (hierarchia)
- [ ] Tworzenie profili psów działa
- [ ] Ulubione karmy działają (dodaj/usuń)
- [ ] Asystent AI odpowiada poprawnie
- [ ] Autentykacja (rejestracja, logowanie, reset hasła) działa

**Testy**:
- [ ] Wszystkie testy jednostkowe przechodzą (100%)
- [ ] Wszystkie testy API przechodzą (100%)
- [ ] Wszystkie testy E2E przechodzą (100%)
- [ ] Code coverage ≥ 80%

**Wydajność**:
- [ ] GET /api/foods: p95 < 1s
- [ ] Lighthouse Performance score > 85

**Bezpieczeństwo**:
- [ ] RLS policies zweryfikowane (0 leaków)
- [ ] HTTPS wymuszony
- [ ] Brak podatności na SQL Injection, XSS

**Dostępność**:
- [ ] WCAG 2.1 AA (0 krytycznych błędów axe-core)
- [ ] Keyboard navigation działa
- [ ] Focus trap w modalach

**Kompatybilność**:
- [ ] Chrome, Firefox, Safari (desktop) ✅
- [ ] Chrome Mobile, Safari Mobile ✅

**Monitoring**:
- [ ] Supabase Dashboard skonfigurowany
- [ ] Backup bazy danych automatyczny (Supabase)
- [ ] Error logging (console.error lub Sentry)

### B. Linki do dokumentacji

- **Vitest**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev/
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **axe-core**: https://github.com/dequelabs/axe-core
- **k6**: https://k6.io/docs/

### C. Przykładowy plik konfiguracyjny CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

**Koniec dokumentu**

*Wersja: 1.0*  
*Data utworzenia: 2025-01-11*  
*Autor: AI QA Engineer*  
*Projekt: ZwierzakBezAlergii*

