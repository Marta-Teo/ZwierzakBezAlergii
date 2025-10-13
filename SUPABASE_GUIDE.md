# 🚀 Przewodnik po Supabase w ZwierzakBezAlergii

## 📋 Spis treści
1. [Co zostało skonfigurowane](#co-zostało-skonfigurowane)
2. [Jak to działa](#jak-to-działa)
3. [Przykłady użycia](#przykłady-użycia)
4. [Najczęstsze operacje](#najczęstsze-operacje)
5. [Przydatne linki](#przydatne-linki)

---

## 🎯 Co zostało skonfigurowane

### Pliki utworzone/zmodyfikowane:

1. **`src/db/supabase.client.ts`** - Inicjalizacja klienta Supabase
2. **`src/middleware/index.ts`** - Middleware dodające Supabase do kontekstu
3. **`src/env.d.ts`** - Definicje typów TypeScript
4. **`src/pages/api/brands.ts`** - Przykładowy endpoint API
5. **`src/components/BrandsExample.tsx`** - Przykładowy komponent React
6. **`src/pages/index.astro`** - Strona z przykładami

### Zmienne środowiskowe (`.env`):
```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_KEY=twój_klucz_anon
```

---

## 🔄 Jak to działa

### Przepływ danych:

```
┌─────────────────┐
│  .env           │  ← Zmienne środowiskowe
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ supabase.client │  ← Inicjalizacja klienta
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  middleware     │  ← Dodaje do Astro.locals
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Twoje strony    │  ← Używasz przez Astro.locals
│ i API endpoints │
└─────────────────┘
```

---

## 💡 Przykłady użycia

### 1. W plikach `.astro` (Server-Side)

```astro
---
// Pobierz klienta Supabase
const { supabase } = Astro.locals;

// Pobierz dane z bazy
const { data: brands, error } = await supabase
  .from('brands')
  .select('*')
  .order('name');
---

<ul>
  {brands?.map(brand => (
    <li>{brand.name}</li>
  ))}
</ul>
```

### 2. W API endpoints (`src/pages/api/*.ts`)

```typescript
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const { supabase } = locals;
  
  const { data, error } = await supabase
    .from('brands')
    .select('*');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
  });
};
```

### 3. W komponentach React (Client-Side)

```tsx
// Wywołaj API endpoint
const response = await fetch('/api/brands');
const result = await response.json();
```

---

## 🛠️ Najczęstsze operacje

### Pobieranie danych (SELECT)

```typescript
// Wszystkie rekordy
const { data } = await supabase.from('brands').select('*');

// Z filtrem
const { data } = await supabase
  .from('brands')
  .select('*')
  .eq('id', 1);

// Z relacjami (JOIN)
const { data } = await supabase
  .from('foods')
  .select(`
    *,
    brand:brands(name),
    age_category:age_categories(name)
  `);

// Z limitowaniem i sortowaniem
const { data } = await supabase
  .from('brands')
  .select('*')
  .order('name', { ascending: true })
  .limit(10);
```

### Dodawanie danych (INSERT)

```typescript
const { data, error } = await supabase
  .from('brands')
  .insert([
    { name: 'Royal Canin' },
    { name: 'Purina' }
  ])
  .select();
```

### Aktualizacja danych (UPDATE)

```typescript
const { data, error } = await supabase
  .from('brands')
  .update({ name: 'Nowa nazwa' })
  .eq('id', 1)
  .select();
```

### Usuwanie danych (DELETE)

```typescript
const { error } = await supabase
  .from('brands')
  .delete()
  .eq('id', 1);
```

### Wyszukiwanie tekstowe

```typescript
const { data } = await supabase
  .from('brands')
  .select('*')
  .ilike('name', '%royal%');
```

---

## 🎓 Co dalej?

### Następne kroki:

1. **Otwórz przeglądarkę** → `http://localhost:4321`
   - Zobaczysz przykłady działania Supabase na stronie głównej

2. **Sprawdź Supabase Studio** → `http://127.0.0.1:54323`
   - Przeglądarka bazy danych
   - Możesz dodawać/edytować dane ręcznie

3. **Testuj API endpoint** → `http://localhost:4321/api/brands`
   - Zobaczysz surowe dane JSON z bazy

4. **Eksperymentuj z kodem**:
   - Zmodyfikuj `src/pages/index.astro`
   - Utwórz nowe endpointy w `src/pages/api/`
   - Dodaj nowe komponenty

---

## 📚 Przydatne linki

- [Dokumentacja Supabase](https://supabase.com/docs)
- [Dokumentacja Astro](https://docs.astro.build)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Twoje lokalne Supabase Studio](http://127.0.0.1:54323)

---

## ⚡ Skróty klawiszowe i komendy

### Uruchomienie projektu:
```bash
# Uruchom serwer deweloperski Astro
npm run dev

# Sprawdź status Supabase
supabase status

# Uruchom lokalne Supabase (jeśli wyłączone)
supabase start

# Zatrzymaj lokalne Supabase
supabase stop
```

### Praca z bazą danych:
```bash
# Otwórz Supabase Studio
# Przejdź do: http://127.0.0.1:54323

# Utwórz nową migrację
supabase migration new nazwa_migracji

# Zastosuj migracje
supabase db reset
```

---

## 🔥 Gotowe szablony

### Szablon endpointu API z walidacją (Zod):

```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';

const BrandSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
});

export const prerender = false;

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const body = await request.json();
    const validatedData = BrandSchema.parse(body);
    
    const { data, error } = await locals.supabase
      .from('brands')
      .insert([validatedData])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message 
    }), {
      status: 400,
    });
  }
};
```

---

**Powodzenia! 🎉**

