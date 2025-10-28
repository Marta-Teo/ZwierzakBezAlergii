# Dokumentacja OpenRouter Service

## Spis treści
1. [Konfiguracja](#konfiguracja)
2. [Użycie podstawowe](#użycie-podstawowe)
3. [Przykłady](#przykłady)
4. [Dostępne modele](#dostępne-modele)
5. [Troubleshooting](#troubleshooting)

---

## Konfiguracja

### 1. Uzyskaj API Key

1. Zarejestruj się na [OpenRouter](https://openrouter.ai/)
2. Przejdź do [Keys](https://openrouter.ai/keys)
3. Utwórz nowy klucz API

### 2. Skonfiguruj zmienne środowiskowe

Utwórz plik `.env` w katalogu głównym projektu:

```bash
# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Public Application Configuration
PUBLIC_APP_NAME=ZwierzakBezAlergii
PUBLIC_SITE_URL=https://zwierzakbezalergii.pl
```

⚠️ **Ważne:** Nigdy nie commituj pliku `.env` do repozytorium!

---

## Użycie podstawowe

### W API Endpoint (Server-side)

```typescript
import { OpenRouterService } from '@/lib/services/openRouter';

const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  appName: import.meta.env.PUBLIC_APP_NAME,
  siteUrl: import.meta.env.PUBLIC_SITE_URL
});

const response = await openRouter.chat({
  messages: [
    { role: 'user', content: 'Witaj!' }
  ],
  systemMessage: 'Jesteś pomocnym asystentem.',
  model: 'openai/gpt-3.5-turbo',
  temperature: 0.7
});

console.log(response.content);
```

### W komponencie React (Client-side)

```typescript
import { useChat } from '@/lib/hooks/useChat';

export function ChatComponent() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    systemMessage: 'Jesteś ekspertem od żywienia psów.',
    model: 'openai/gpt-4',
    temperature: 0.7
  });

  const handleSubmit = async (input: string) => {
    await sendMessage(input);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.role}: {msg.content}</div>
      ))}
      {isLoading && <p>Ładowanie...</p>}
      {error && <p>Błąd: {error}</p>}
    </div>
  );
}
```

---

## Przykłady

### Przykład 1: Podstawowy chat

```typescript
const response = await openRouter.chat({
  messages: [
    { role: 'user', content: 'Jakie są najczęstsze alergeny u psów?' }
  ],
  systemMessage: 'Jesteś weterynarzem specjalizującym się w alergii.'
});
```

### Przykład 2: Chat z historią konwersacji

```typescript
const response = await openRouter.chat({
  messages: [
    { role: 'user', content: 'Wymień 3 alergeny' },
    { role: 'assistant', content: 'Wołowina, kurczak, pszenica' },
    { role: 'user', content: 'Jakie są alternatywy?' }
  ]
});
```

### Przykład 3: Strukturalne odpowiedzi ze schematem Zod

```typescript
import { z } from 'zod';

const FoodAnalysisSchema = z.object({
  allergens: z.array(z.string()),
  safeIngredients: z.array(z.string()),
  recommendation: z.enum(['safe', 'caution', 'avoid']),
  explanation: z.string()
});

const response = await openRouter.chatWithSchema({
  messages: [
    { role: 'user', content: 'Przeanalizuj: kurczak, ryż, kukurydza' }
  ],
  systemMessage: 'Analizujesz karmy dla psów.',
  schema: FoodAnalysisSchema,
  schemaName: 'FoodAnalysis',
  model: 'openai/gpt-4'
});

// Odpowiedź jest automatycznie zwalidowana i typowana!
console.log(response.data.allergens); // string[]
console.log(response.data.recommendation); // 'safe' | 'caution' | 'avoid'
```

### Przykład 4: Streaming odpowiedzi

```typescript
for await (const chunk of openRouter.streamChat({
  messages: [{ role: 'user', content: 'Opowiedz o alergii u psów' }],
  systemMessage: 'Jesteś ekspertem.'
})) {
  process.stdout.write(chunk.delta); // Wyświetl fragment
  
  if (chunk.done) {
    console.log('\n✓ Zakończono');
    console.log('Tokeny:', chunk.usage?.totalTokens);
  }
}
```

### Przykład 5: Obsługa błędów

```typescript
import { 
  APIError, 
  RateLimitError, 
  TimeoutError 
} from '@/lib/services/openRouter';

try {
  const response = await openRouter.chat({
    messages: [{ role: 'user', content: 'Test' }]
  });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error(`Rate limit! Retry po ${error.retryAfter}s`);
  } else if (error instanceof TimeoutError) {
    console.error(`Timeout po ${error.timeoutMs}ms`);
  } else if (error instanceof APIError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else {
    console.error('Nieznany błąd:', error);
  }
}
```

---

## Dostępne modele

### Zalecane modele dla ZwierzakBezAlergii:

| Model | Cena | Szybkość | Jakość | Użycie |
|-------|------|----------|--------|--------|
| `openai/gpt-3.5-turbo` | 💰 | ⚡⚡⚡ | ⭐⭐⭐ | Proste zapytania |
| `openai/gpt-4` | 💰💰💰 | ⚡ | ⭐⭐⭐⭐⭐ | Złożone analizy |
| `anthropic/claude-3-sonnet` | 💰💰 | ⚡⚡ | ⭐⭐⭐⭐ | Długie konteksty |
| `google/gemini-pro` | 💰 | ⚡⚡ | ⭐⭐⭐ | Dobry balans |

### Parametry modelu:

- **temperature** (0-2): Losowość odpowiedzi
  - `0.0-0.3`: Deterministyczne, precyzyjne
  - `0.7`: Zbalansowane (domyślne)
  - `1.5-2.0`: Kreatywne, różnorodne

- **maxTokens**: Maksymalna długość odpowiedzi
  - Krótkie odpowiedzi: `200-500`
  - Średnie: `500-1000`
  - Długie: `1000-2000`

- **topP** (0-1): Alternatywa dla temperature
- **frequencyPenalty** (-2 do 2): Kara za powtarzanie słów
- **presencePenalty** (-2 do 2): Kara za powtarzanie tematów

### Pełna lista modeli:

🔗 [OpenRouter Models](https://openrouter.ai/docs#models)

---

## Troubleshooting

### Błąd: "API key jest wymagany"

**Przyczyna:** Brak zmiennej środowiskowej `OPENROUTER_API_KEY`

**Rozwiązanie:**
1. Sprawdź czy plik `.env` istnieje
2. Sprawdź czy klucz jest poprawny
3. Zrestartuj dev server po dodaniu `.env`

```bash
npm run dev
```

### Błąd: "Nieprawidłowy API key"

**Przyczyna:** Klucz API jest nieprawidłowy lub wygasł

**Rozwiązanie:**
1. Zweryfikuj klucz na [OpenRouter Keys](https://openrouter.ai/keys)
2. Wygeneruj nowy klucz jeśli potrzeba
3. Zaktualizuj `.env`

### Błąd: "Rate Limit"

**Przyczyna:** Przekroczono limit requestów

**Rozwiązanie:**
1. Serwis automatycznie wykona retry
2. Jeśli błąd się powtarza, dodaj opóźnienia między requestami
3. Rozważ upgrade planu na OpenRouter

### Timeout

**Przyczyna:** Request trwa za długo (domyślnie 60s)

**Rozwiązanie:**
```typescript
const openRouter = new OpenRouterService({
  apiKey: '...',
  timeout: 120000 // 2 minuty
});
```

### Błąd CORS

**Przyczyna:** Próba wywołania OpenRouter bezpośrednio z przeglądarki

**Rozwiązanie:**
⚠️ **Zawsze używaj `/api/chat` endpoint!** Nigdy nie wywołuj OpenRouter API bezpośrednio z frontendu (narażenie API key).

---

## Testowanie

### Manualne testowanie z VSCode REST Client

Użyj pliku `test-openrouter.http`:

```bash
# Otwórz test-openrouter.http w VSCode
# Kliknij "Send Request" nad każdym testem
```

### Testowanie w przeglądarce

```bash
npm run dev
# Otwórz http://localhost:4321/chat
```

---

## Najlepsze praktyki

### ✅ DO:
- Używaj `/api/chat` endpoint z frontendu
- Waliduj input przed wysłaniem
- Obsługuj błędy gracefully
- Używaj `systemMessage` do definiowania zachowania
- Monitoruj koszty na OpenRouter dashboard

### ❌ DON'T:
- Nie exposuj API key na frontendzie
- Nie commituj `.env` do git
- Nie wywołuj OpenRouter API bezpośrednio z przeglądarki
- Nie ignoruj błędów rate limiting

---

## Wsparcie

- 📖 [Dokumentacja OpenRouter](https://openrouter.ai/docs)
- 💬 [Discord OpenRouter](https://discord.gg/openrouter)
- 🐛 [Zgłoś bug](https://github.com/your-repo/issues)

---

**Ostatnia aktualizacja:** 2025-01-28

