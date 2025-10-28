# Plan Wdrożenia Usługi OpenRouter

## 1. Opis Usługi

Usługa OpenRouter jest serwisem odpowiedzialnym za komunikację z API OpenRouter w celu obsługi czatów opartych na dużych modelach językowych (LLM). Usługa zapewnia:

- Bezpieczną komunikację z API OpenRouter
- Zarządzanie konfiguracją modeli i parametrów
- Konstruowanie wiadomości zgodnych z formatem API
- Obsługę strukturalnych odpowiedzi JSON (response_format)
- Kompleksową obsługę błędów i retry logic
- Type-safe interfejsy dzięki TypeScript

### Główne Zadania Usługi:

1. **Abstrakcja API** - Ukrycie szczegółów implementacji OpenRouter API za prostym interfejsem
2. **Zarządzanie Stanem** - Przechowywanie historii konwersacji i kontekstu
3. **Bezpieczeństwo** - Ochrona kluczy API i walidacja danych wejściowych
4. **Niezawodność** - Obsługa błędów, retry logic, timeout handling
5. **Elastyczność** - Wsparcie dla różnych modeli i parametrów

---

## 2. Opis Konstruktora

### Sygnatura:

```typescript
constructor(config: OpenRouterConfig)
```

### Parametry Konfiguracji:

```typescript
interface OpenRouterConfig {
  // Wymagane
  apiKey: string;
  
  // Opcjonalne z wartościami domyślnymi
  baseUrl?: string;                    // domyślnie: 'https://openrouter.ai/api/v1'
  defaultModel?: string;               // domyślnie: 'openai/gpt-3.5-turbo'
  defaultTemperature?: number;         // domyślnie: 0.7
  defaultMaxTokens?: number;           // domyślnie: 1000
  timeout?: number;                    // domyślnie: 60000 (60s)
  maxRetries?: number;                 // domyślnie: 3
  retryDelay?: number;                 // domyślnie: 1000 (1s)
  
  // Wymagane dla OpenRouter (identyfikacja aplikacji)
  appName?: string;                    // nazwa aplikacji (dla X-Title header)
  siteUrl?: string;                    // URL strony (dla HTTP-Referer header)
}
```

### Zadania Konstruktora:

1. **Walidacja Konfiguracji**:
   - Sprawdzenie obecności wymaganego `apiKey`
   - Walidacja formatu URL dla `baseUrl` i `siteUrl`
   - Walidacja zakresów wartości liczbowych (temperature 0-2, maxTokens > 0)

2. **Inicjalizacja Stanu**:
   - Utworzenie klienta HTTP (fetch lub axios)
   - Ustawienie domyślnych headers
   - Inicjalizacja pustej historii konwersacji

3. **Obsługa Błędów**:
   - Rzucenie `ConfigurationError` przy brakujących lub nieprawidłowych parametrach
   - Walidacja środowiskowa (sprawdzenie czy apiKey nie jest hardcoded w kodzie)

### Przykład Użycia:

```typescript
const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  appName: 'ZwierzakBezAlergii',
  siteUrl: 'https://zwierzakbezalergii.pl',
  defaultModel: 'openai/gpt-4',
  defaultTemperature: 0.8,
  defaultMaxTokens: 2000
});
```

---

## 3. Publiczne Metody i Pola

### 3.1. Metoda: `chat()`

**Sygnatura:**
```typescript
async chat(options: ChatOptions): Promise<ChatResponse>
```

**Parametry:**
```typescript
interface ChatOptions {
  // Wiadomości
  messages: Message[];              // tablica wiadomości w konwersacji
  systemMessage?: string;           // opcjonalna wiadomość systemowa
  
  // Konfiguracja modelu
  model?: string;                   // nadpisuje defaultModel
  temperature?: number;             // nadpisuje defaultTemperature
  maxTokens?: number;               // nadpisuje defaultMaxTokens
  topP?: number;                    // top_p sampling (0-1)
  frequencyPenalty?: number;        // (-2.0 - 2.0)
  presencePenalty?: number;         // (-2.0 - 2.0)
  
  // Response format
  responseFormat?: ResponseFormat;  // strukturalna odpowiedź JSON
  
  // Inne
  stream?: boolean;                 // czy streamować odpowiedź
  userId?: string;                  // identyfikator użytkownika dla logowania
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
}

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}
```

**Zwraca:**
```typescript
interface ChatResponse {
  id: string;                       // ID odpowiedzi z OpenRouter
  model: string;                    // użyty model
  content: string;                  // treść odpowiedzi
  structuredData?: unknown;         // sparsowane dane JSON (jeśli responseFormat był użyty)
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  metadata: {
    created: number;                // timestamp
    latency: number;                // czas odpowiedzi w ms
  };
}
```

**Funkcjonalność:**
- Konstruuje request do OpenRouter API
- Dodaje systemMessage na początek tablicy messages (jeśli podany)
- Merguje parametry z domyślnymi wartościami
- Wykonuje request z retry logic
- Parsuje odpowiedź i zwraca ustrukturyzowany obiekt
- Zapisuje wiadomość w historii konwersacji (opcjonalnie)

**Przykład Użycia:**
```typescript
const response = await openRouter.chat({
  messages: [
    { role: 'user', content: 'Jakie składniki karmy są najczęściej alergenami u psów?' }
  ],
  systemMessage: 'Jesteś ekspertem od żywienia psów i alergii pokarmowych.',
  model: 'anthropic/claude-3-opus',
  temperature: 0.7
});

console.log(response.content);
```

### 3.2. Metoda: `chatWithSchema()`

**Sygnatura:**
```typescript
async chatWithSchema<T>(options: ChatWithSchemaOptions<T>): Promise<ChatSchemaResponse<T>>
```

**Parametry:**
```typescript
interface ChatWithSchemaOptions<T> extends Omit<ChatOptions, 'responseFormat'> {
  schema: z.ZodSchema<T>;           // Zod schema definiujący strukturę odpowiedzi
  schemaName: string;               // nazwa schematu (wymagana przez OpenRouter)
}
```

**Zwraca:**
```typescript
interface ChatSchemaResponse<T> extends ChatResponse {
  data: T;                          // sparsowane i zwalidowane dane zgodne ze schematem
}
```

**Funkcjonalność:**
- Konwertuje Zod schema na JSON Schema zgodny z OpenRouter
- Ustawia `response_format` z typem `json_schema`
- Parsuje odpowiedź jako JSON
- Waliduje odpowiedź względem Zod schema
- Rzuca `SchemaValidationError` jeśli walidacja się nie powiedzie

**Przykład Użycia:**
```typescript
// Definicja schematu
const FoodAnalysisSchema = z.object({
  allergens: z.array(z.string()),
  safeIngredients: z.array(z.string()),
  recommendation: z.enum(['safe', 'caution', 'avoid']),
  explanation: z.string()
});

// Użycie
const response = await openRouter.chatWithSchema({
  messages: [
    { role: 'user', content: 'Przeanalizuj skład karmy: kurczak, ryż, kukurydza, pszenica' }
  ],
  systemMessage: 'Analizujesz karmy dla psów pod kątem alergenów.',
  schema: FoodAnalysisSchema,
  schemaName: 'FoodAnalysis'
});

console.log(response.data.allergens);        // ['kukurydza', 'pszenica']
console.log(response.data.recommendation);   // 'caution'
```

### 3.3. Metoda: `streamChat()`

**Sygnatura:**
```typescript
async *streamChat(options: ChatOptions): AsyncGenerator<StreamChunk, void, unknown>
```

**Zwraca:**
```typescript
interface StreamChunk {
  delta: string;                    // fragment tekstu
  accumulated: string;              // skumulowany tekst do tej pory
  done: boolean;                    // czy stream się zakończył
  usage?: {                         // dostępne tylko w ostatnim chunk
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

**Funkcjonalność:**
- Otwiera stream połączenie z OpenRouter
- Parsuje Server-Sent Events (SSE)
- Generuje chunki z fragmentami odpowiedzi
- Obsługuje błędy w trakcie streamowania

**Przykład Użycia:**
```typescript
for await (const chunk of openRouter.streamChat({
  messages: [{ role: 'user', content: 'Opowiedz o alergii u psów' }],
  systemMessage: 'Jesteś ekspertem od zdrowia psów.'
})) {
  process.stdout.write(chunk.delta);
  
  if (chunk.done) {
    console.log('\nTokeny użyte:', chunk.usage?.totalTokens);
  }
}
```

### 3.4. Metoda: `clearHistory()`

**Sygnatura:**
```typescript
clearHistory(): void
```

**Funkcjonalność:**
- Czyści wewnętrzną historię konwersacji
- Przydatne przy rozpoczynaniu nowej sesji czatu

### 3.5. Metoda: `getHistory()`

**Sygnatura:**
```typescript
getHistory(): Message[]
```

**Funkcjonalność:**
- Zwraca kopię historii konwersacji
- Używane do debugowania lub persistencji stanu

### 3.6. Pole: `config` (read-only)

**Typ:**
```typescript
readonly config: Readonly<OpenRouterConfig>
```

**Funkcjonalność:**
- Dostęp do aktualnej konfiguracji usługi
- Przydatne do debugowania lub dynamicznej rekonfiguracji

---

## 4. Prywatne Metody i Pola

### 4.1. Pole: `history`

**Typ:**
```typescript
private history: Message[] = []
```

**Funkcjonalność:**
- Przechowuje historię konwersacji
- Aktualizowana po każdym wywołaniu `chat()`

### 4.2. Pole: `httpClient`

**Typ:**
```typescript
private httpClient: typeof fetch
```

**Funkcjonalność:**
- Klient HTTP do wykonywania requestów
- Może być mockowany w testach

### 4.3. Metoda: `buildRequestBody()`

**Sygnatura:**
```typescript
private buildRequestBody(options: ChatOptions): OpenRouterRequest
```

**Funkcjonalność:**
- Konstruuje body requesta zgodnie z OpenRouter API
- Merguje parametry użytkownika z domyślnymi
- Dodaje systemMessage jako pierwszy message
- Konwertuje responseFormat do odpowiedniego formatu

**Przykładowy Output:**
```typescript
{
  model: 'openai/gpt-4',
  messages: [
    { role: 'system', content: 'Jesteś ekspertem od żywienia psów.' },
    { role: 'user', content: 'Jakie są najczęstsze alergeny?' }
  ],
  temperature: 0.7,
  max_tokens: 2000,
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'AllergenAnalysis',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          allergens: { type: 'array', items: { type: 'string' } }
        },
        required: ['allergens'],
        additionalProperties: false
      }
    }
  }
}
```

### 4.4. Metoda: `buildHeaders()`

**Sygnatura:**
```typescript
private buildHeaders(): Record<string, string>
```

**Funkcjonalność:**
- Konstruuje headers dla requestu
- Dodaje Authorization Bearer token
- Dodaje HTTP-Referer i X-Title dla OpenRouter

**Output:**
```typescript
{
  'Authorization': `Bearer ${this.config.apiKey}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': this.config.siteUrl || '',
  'X-Title': this.config.appName || 'ZwierzakBezAlergii'
}
```

### 4.5. Metoda: `executeRequest()`

**Sygnatura:**
```typescript
private async executeRequest(
  body: OpenRouterRequest,
  attempt: number = 1
): Promise<OpenRouterResponse>
```

**Funkcjonalność:**
- Wykonuje HTTP POST request do OpenRouter
- Implementuje retry logic z exponential backoff
- Obsługuje timeout
- Loguje błędy

**Retry Logic:**
1. Sprawdza czy `attempt <= maxRetries`
2. Wykonuje request z timeout
3. Jeśli błąd 429 (rate limit) lub 5xx: czeka `retryDelay * 2^(attempt-1)` ms i retry
4. Jeśli błąd 4xx (poza 429): rzuca błąd bez retry
5. Jeśli sukces: zwraca odpowiedź

### 4.6. Metoda: `parseResponse()`

**Sygnatura:**
```typescript
private parseResponse(
  raw: OpenRouterResponse,
  startTime: number
): ChatResponse
```

**Funkcjonalność:**
- Parsuje surową odpowiedź z OpenRouter
- Ekstraktuje content z pierwszego choice
- Parsuje usage statistics
- Oblicza latency
- Jeśli response_format był JSON: parsuje content jako JSON do structuredData

### 4.7. Metoda: `zodToJsonSchema()`

**Sygnatura:**
```typescript
private zodToJsonSchema(schema: z.ZodSchema): JSONSchema
```

**Funkcjonalność:**
- Konwertuje Zod schema na JSON Schema
- Używa biblioteki `zod-to-json-schema`
- Usuwa dodatkowe właściwości (`additionalProperties: false`)
- Ustawia `strict: true` dla OpenRouter

### 4.8. Metoda: `validateConfig()`

**Sygnatura:**
```typescript
private validateConfig(config: OpenRouterConfig): void
```

**Funkcjonalność:**
- Waliduje konfigurację w konstruktorze
- Rzuca `ConfigurationError` przy błędach
- Sprawdza:
  - Obecność apiKey
  - Poprawność URL
  - Zakresy wartości numerycznych
  - Czy apiKey nie wygląda na hardcoded (nie zaczyna się od 'sk-')

---

## 5. Obsługa Błędów

### 5.1. Hierarchia Błędów

```typescript
// Bazowy błąd usługi
class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

// Błąd konfiguracji
class ConfigurationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIGURATION_ERROR', undefined, details);
    this.name = 'ConfigurationError';
  }
}

// Błąd walidacji schematu
class SchemaValidationError extends OpenRouterError {
  constructor(message: string, public validationErrors: z.ZodError) {
    super(message, 'SCHEMA_VALIDATION_ERROR', undefined, validationErrors);
    this.name = 'SchemaValidationError';
  }
}

// Błąd API
class APIError extends OpenRouterError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'APIError';
  }
}

// Błąd rate limit
class RateLimitError extends OpenRouterError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

// Błąd timeout
class TimeoutError extends OpenRouterError {
  constructor(message: string, public timeoutMs: number) {
    super(message, 'TIMEOUT_ERROR', undefined, { timeoutMs });
    this.name = 'TimeoutError';
  }
}

// Błąd sieci
class NetworkError extends OpenRouterError {
  constructor(message: string, public originalError: Error) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
  }
}
```

### 5.2. Scenariusze Błędów i Ich Obsługa

#### Scenariusz 1: Brak lub nieprawidłowy API Key
**Kiedy:** Podczas inicjalizacji lub gdy API zwraca 401
**Obsługa:**
```typescript
if (!config.apiKey) {
  throw new ConfigurationError(
    'API key jest wymagany. Ustaw OPENROUTER_API_KEY w zmiennych środowiskowych.'
  );
}

// W executeRequest():
if (response.status === 401) {
  throw new APIError(
    'Nieprawidłowy API key. Sprawdź OPENROUTER_API_KEY.',
    401,
    await response.json()
  );
}
```

#### Scenariusz 2: Rate Limiting (429)
**Kiedy:** Przekroczono limit requestów
**Obsługa:**
```typescript
if (response.status === 429) {
  const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
  
  if (attempt < this.config.maxRetries) {
    await this.sleep(retryAfter * 1000);
    return this.executeRequest(body, attempt + 1);
  }
  
  throw new RateLimitError(
    `Przekroczono limit requestów. Spróbuj ponownie za ${retryAfter}s.`,
    retryAfter
  );
}
```

#### Scenariusz 3: Timeout
**Kiedy:** Request trwa dłużej niż `config.timeout`
**Obsługa:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  if (error.name === 'AbortError') {
    throw new TimeoutError(
      `Request przekroczył timeout (${this.config.timeout}ms)`,
      this.config.timeout
    );
  }
  throw error;
}
```

#### Scenariusz 4: Błąd walidacji schematu
**Kiedy:** Odpowiedź nie pasuje do zdefiniowanego Zod schema
**Obsługa:**
```typescript
try {
  const parsed = schema.parse(JSON.parse(content));
  return { ...response, data: parsed };
} catch (error) {
  if (error instanceof z.ZodError) {
    throw new SchemaValidationError(
      'Odpowiedź nie pasuje do oczekiwanego schematu',
      error
    );
  }
  throw error;
}
```

#### Scenariusz 5: Błąd sieci
**Kiedy:** Brak połączenia internetowego, DNS error, itp.
**Obsługa:**
```typescript
try {
  return await fetch(url, options);
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new NetworkError(
      'Nie można połączyć się z OpenRouter API. Sprawdź połączenie internetowe.',
      error
    );
  }
  throw error;
}
```

#### Scenariusz 6: Błędy 4xx (inne niż 401, 429)
**Kiedy:** Nieprawidłowy request, brakujące parametry, itp.
**Obsługa:**
```typescript
if (response.status >= 400 && response.status < 500) {
  const errorData = await response.json();
  throw new APIError(
    `Błąd API (${response.status}): ${errorData.error?.message || 'Nieznany błąd'}`,
    response.status,
    errorData
  );
}
```

#### Scenariusz 7: Błędy 5xx
**Kiedy:** Problemy po stronie OpenRouter
**Obsługa:**
```typescript
if (response.status >= 500) {
  if (attempt < this.config.maxRetries) {
    const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
    await this.sleep(delay);
    return this.executeRequest(body, attempt + 1);
  }
  
  throw new APIError(
    'OpenRouter API jest tymczasowo niedostępne. Spróbuj ponownie później.',
    response.status
  );
}
```

#### Scenariusz 8: Nieprawidłowy JSON w odpowiedzi
**Kiedy:** OpenRouter zwraca nieparsowalne dane
**Obsługa:**
```typescript
try {
  return await response.json();
} catch (error) {
  throw new APIError(
    'Otrzymano nieprawidłową odpowiedź JSON z OpenRouter',
    response.status,
    { rawResponse: await response.text() }
  );
}
```

### 5.3. Logowanie Błędów

```typescript
private logError(error: Error, context: Record<string, unknown>): void {
  console.error('[OpenRouter Error]', {
    name: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
    ...context
  });
  
  // W produkcji: wysłanie do systemu monitoringu (Sentry, DataDog, itp.)
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: context });
  }
}
```

---

## 6. Kwestie Bezpieczeństwa

### 6.1. Ochrona API Key

#### Problem:
API key jest wrażliwym tokenem dostępowym, który nie może być ujawniony publicznie.

#### Rozwiązania:

**1. Zmienne Środowiskowe:**
```typescript
// .env (NIE commitować do git!)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

// astro.config.mjs lub vite.config.ts
export default defineConfig({
  // ...
});

// Użycie w kodzie
const apiKey = import.meta.env.OPENROUTER_API_KEY;
```

**2. Backend Proxy:**
Zamiast wywoływać OpenRouter bezpośrednio z frontendu, stwórz endpoint API:

```typescript
// src/pages/api/chat.ts
import type { APIRoute } from 'astro';
import { OpenRouterService } from '@/lib/services/openRouterService';

export const POST: APIRoute = async ({ request }) => {
  // API key jest bezpiecznie przechowywany po stronie serwera
  const openRouter = new OpenRouterService({
    apiKey: import.meta.env.OPENROUTER_API_KEY,
    appName: 'ZwierzakBezAlergii',
    siteUrl: 'https://zwierzakbezalergii.pl'
  });
  
  const { messages, systemMessage } = await request.json();
  
  // Walidacja input
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Nieprawidłowe wiadomości' }), {
      status: 400
    });
  }
  
  try {
    const response = await openRouter.chat({
      messages,
      systemMessage
    });
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Błąd serwera' }), {
      status: 500
    });
  }
};
```

**3. .gitignore:**
```gitignore
# Environment variables
.env
.env.local
.env.production

# Konfiguracja z secretami
config/secrets.json
```

### 6.2. Rate Limiting po Stronie Aplikacji

Aby uniknąć nadmiernego zużycia API i kosztów:

```typescript
class RateLimiter {
  private requests: number[] = [];
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await this.sleep(waitTime);
      return this.acquire();
    }
    
    this.requests.push(now);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// W OpenRouterService:
private rateLimiter = new RateLimiter(10, 60000); // 10 requestów na minutę

async chat(options: ChatOptions): Promise<ChatResponse> {
  await this.rateLimiter.acquire();
  // ... reszta implementacji
}
```

### 6.3. Sanityzacja Input

Walidacja i oczyszczanie danych wejściowych od użytkownika:

```typescript
private sanitizeMessage(content: string): string {
  // Usuń potencjalnie niebezpieczne znaki
  const sanitized = content
    .trim()
    .replace(/[<>]/g, '') // usuń < i >
    .slice(0, 4000); // ogranicz długość
  
  if (sanitized.length === 0) {
    throw new ValidationError('Wiadomość nie może być pusta');
  }
  
  return sanitized;
}

async chat(options: ChatOptions): Promise<ChatResponse> {
  // Sanityzuj wszystkie wiadomości użytkownika
  const sanitizedMessages = options.messages.map(msg => ({
    ...msg,
    content: typeof msg.content === 'string' 
      ? this.sanitizeMessage(msg.content)
      : msg.content
  }));
  
  // ... reszta implementacji
}
```

### 6.4. Content Moderation

Filtrowanie nieodpowiednich treści:

```typescript
private async moderateContent(content: string): Promise<boolean> {
  // Opcja 1: Prosta lista zakazanych słów
  const bannedWords = ['spam', 'abuse', ...];
  const hasBannedWord = bannedWords.some(word => 
    content.toLowerCase().includes(word)
  );
  
  if (hasBannedWord) {
    throw new ContentModerationError('Wiadomość zawiera niedozwoloną treść');
  }
  
  // Opcja 2: Użycie OpenAI Moderation API
  // const moderationResult = await openai.moderations.create({ input: content });
  // if (moderationResult.results[0].flagged) {
  //   throw new ContentModerationError('Wiadomość została oflagowana');
  // }
  
  return true;
}
```

### 6.5. HTTPS i CORS

**HTTPS:**
- Zawsze używaj HTTPS w produkcji
- Konfiguracja w hosting (DigitalOcean, Vercel, etc.)

**CORS:**
```typescript
// src/middleware/index.ts
export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Tylko dla API endpoints
  if (context.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', 'https://zwierzakbezalergii.pl');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  return response;
};
```

### 6.6. Monitoring i Auditing

Logowanie wszystkich wywołań API:

```typescript
private async auditLog(
  userId: string | undefined,
  action: string,
  details: Record<string, unknown>
): Promise<void> {
  const log = {
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous',
    action,
    details,
    ip: '...', // z request headers
  };
  
  // Zapisz do bazy lub systemu logowania
  await supabase.from('api_audit_logs').insert(log);
}

async chat(options: ChatOptions): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    const response = await this.executeChat(options);
    
    await this.auditLog(options.userId, 'chat_success', {
      model: options.model,
      tokensUsed: response.usage.totalTokens,
      latency: Date.now() - startTime
    });
    
    return response;
  } catch (error) {
    await this.auditLog(options.userId, 'chat_error', {
      error: error.message
    });
    throw error;
  }
}
```

---

## 7. Plan Wdrożenia Krok po Kroku

### Faza 1: Przygotowanie Środowiska

#### Krok 1.1: Instalacja Zależności

```bash
npm install zod zod-to-json-schema
npm install -D @types/node
```

#### Krok 1.2: Konfiguracja Zmiennych Środowiskowych

Utwórz plik `.env` w katalogu głównym:
```bash
# .env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
PUBLIC_APP_NAME=ZwierzakBezAlergii
PUBLIC_SITE_URL=https://zwierzakbezalergii.pl
```

Dodaj do `.gitignore`:
```gitignore
.env
.env.local
.env.production
```

#### Krok 1.3: Konfiguracja TypeScript

Upewnij się, że `tsconfig.json` zawiera:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Faza 2: Implementacja Typów

#### Krok 2.1: Utwórz `src/lib/services/openRouter/types.ts`

```typescript
import type { z } from 'zod';

// ===== Konfiguracja =====
export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  appName?: string;
  siteUrl?: string;
}

// ===== Wiadomości =====
export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
}

// ===== Response Format =====
export interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
}

// ===== Chat Options =====
export interface ChatOptions {
  messages: Message[];
  systemMessage?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  responseFormat?: ResponseFormat;
  stream?: boolean;
  userId?: string;
}

// ===== Odpowiedzi =====
export interface ChatResponse {
  id: string;
  model: string;
  content: string;
  structuredData?: unknown;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  metadata: {
    created: number;
    latency: number;
  };
}

export interface ChatSchemaResponse<T> extends ChatResponse {
  data: T;
}

export interface StreamChunk {
  delta: string;
  accumulated: string;
  done: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// ===== OpenRouter API Types =====
export interface OpenRouterRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: ResponseFormat;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ===== Schema Types =====
export interface ChatWithSchemaOptions<T> extends Omit<ChatOptions, 'responseFormat'> {
  schema: z.ZodSchema<T>;
  schemaName: string;
}
```

### Faza 3: Implementacja Błędów

#### Krok 3.1: Utwórz `src/lib/services/openRouter/errors.ts`

```typescript
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
    Object.setPrototypeOf(this, OpenRouterError.prototype);
  }
}

export class ConfigurationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIGURATION_ERROR', undefined, details);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class SchemaValidationError extends OpenRouterError {
  constructor(message: string, public validationErrors: unknown) {
    super(message, 'SCHEMA_VALIDATION_ERROR', undefined, validationErrors);
    this.name = 'SchemaValidationError';
    Object.setPrototypeOf(this, SchemaValidationError.prototype);
  }
}

export class APIError extends OpenRouterError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'APIError';
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429, { retryAfter });
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class TimeoutError extends OpenRouterError {
  constructor(message: string, public timeoutMs: number) {
    super(message, 'TIMEOUT_ERROR', undefined, { timeoutMs });
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class NetworkError extends OpenRouterError {
  constructor(message: string, public originalError: Error) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ContentModerationError extends OpenRouterError {
  constructor(message: string) {
    super(message, 'CONTENT_MODERATION_ERROR', 400);
    this.name = 'ContentModerationError';
    Object.setPrototypeOf(this, ContentModerationError.prototype);
  }
}
```

### Faza 4: Implementacja Głównej Usługi

#### Krok 4.1: Utwórz `src/lib/services/openRouter/OpenRouterService.ts` (Część 1)

```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { z } from 'zod';
import type {
  OpenRouterConfig,
  ChatOptions,
  ChatResponse,
  Message,
  OpenRouterRequest,
  OpenRouterResponse,
  ChatWithSchemaOptions,
  ChatSchemaResponse,
  StreamChunk,
  ResponseFormat
} from './types';
import {
  ConfigurationError,
  APIError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  SchemaValidationError,
  ValidationError
} from './errors';

export class OpenRouterService {
  private readonly config: Readonly<Required<OpenRouterConfig>>;
  private history: Message[] = [];

  constructor(config: OpenRouterConfig) {
    // Walidacja i ustawienie domyślnych wartości
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://openrouter.ai/api/v1',
      defaultModel: config.defaultModel || 'openai/gpt-3.5-turbo',
      defaultTemperature: config.defaultTemperature ?? 0.7,
      defaultMaxTokens: config.defaultMaxTokens || 1000,
      timeout: config.timeout || 60000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      appName: config.appName || 'ZwierzakBezAlergii',
      siteUrl: config.siteUrl || ''
    };

    this.validateConfig();
  }

  // ===== Publiczne Metody =====

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const startTime = Date.now();

    try {
      // Walidacja input
      this.validateChatOptions(options);

      // Budowanie request body
      const requestBody = this.buildRequestBody(options);

      // Wykonanie requestu z retry logic
      const response = await this.executeRequest(requestBody);

      // Parsowanie odpowiedzi
      const chatResponse = this.parseResponse(response, startTime);

      // Opcjonalnie: dodaj do historii
      // this.addToHistory(options.messages, chatResponse.content);

      return chatResponse;
    } catch (error) {
      this.logError(error as Error, {
        method: 'chat',
        model: options.model || this.config.defaultModel,
        messageCount: options.messages.length
      });
      throw error;
    }
  }

  async chatWithSchema<T>(
    options: ChatWithSchemaOptions<T>
  ): Promise<ChatSchemaResponse<T>> {
    const { schema, schemaName, ...chatOptions } = options;

    // Konwertuj Zod schema na JSON Schema
    const jsonSchema = this.zodToJsonSchema(schema);

    // Ustaw response_format
    const responseFormat: ResponseFormat = {
      type: 'json_schema',
      json_schema: {
        name: schemaName,
        strict: true,
        schema: jsonSchema
      }
    };

    // Wykonaj chat z response_format
    const response = await this.chat({
      ...chatOptions,
      responseFormat
    });

    // Waliduj odpowiedź względem schematu
    try {
      const parsedData = JSON.parse(response.content);
      const validatedData = schema.parse(parsedData);

      return {
        ...response,
        data: validatedData,
        structuredData: validatedData
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new SchemaValidationError(
          'Odpowiedź nie pasuje do oczekiwanego schematu',
          error
        );
      }
      throw error;
    }
  }

  async *streamChat(options: ChatOptions): AsyncGenerator<StreamChunk, void, unknown> {
    // Walidacja
    this.validateChatOptions(options);

    // Budowanie request body ze streamem
    const requestBody = this.buildRequestBody({ ...options, stream: true });

    // Wykonaj streaming request
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    // Parsuj SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new NetworkError('Nie można odczytać stream', new Error('No reader'));
    }

    const decoder = new TextDecoder();
    let accumulated = '';
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield {
                delta: '',
                accumulated,
                done: true
              };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content || '';
              accumulated += delta;

              yield {
                delta,
                accumulated,
                done: false,
                usage: parsed.usage
              };
            } catch (e) {
              // Ignoruj błędy parsowania pojedynczych chunków
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  clearHistory(): void {
    this.history = [];
  }

  getHistory(): Message[] {
    return [...this.history];
  }

  get configuration(): Readonly<Required<OpenRouterConfig>> {
    return this.config;
  }

  // Kontynuacja w następnym kroku...
}
```

#### Krok 4.2: Utwórz `src/lib/services/openRouter/OpenRouterService.ts` (Część 2)

Kontynuacja klasy - prywatne metody:

```typescript
  // ===== Prywatne Metody =====

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new ConfigurationError(
        'API key jest wymagany. Ustaw OPENROUTER_API_KEY w zmiennych środowiskowych.'
      );
    }

    if (this.config.apiKey.length < 20) {
      throw new ConfigurationError('API key wydaje się być nieprawidłowy (za krótki)');
    }

    if (this.config.temperature < 0 || this.config.temperature > 2) {
      throw new ConfigurationError('Temperature musi być między 0 a 2');
    }

    if (this.config.defaultMaxTokens <= 0) {
      throw new ConfigurationError('defaultMaxTokens musi być większe od 0');
    }

    if (this.config.timeout <= 0) {
      throw new ConfigurationError('timeout musi być większy od 0');
    }

    // Walidacja URL
    if (this.config.siteUrl) {
      try {
        new URL(this.config.siteUrl);
      } catch {
        throw new ConfigurationError(`Nieprawidłowy siteUrl: ${this.config.siteUrl}`);
      }
    }
  }

  private validateChatOptions(options: ChatOptions): void {
    if (!options.messages || options.messages.length === 0) {
      throw new ValidationError('messages nie może być puste');
    }

    for (const message of options.messages) {
      if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
        throw new ValidationError(`Nieprawidłowa rola wiadomości: ${message.role}`);
      }

      if (!message.content) {
        throw new ValidationError('Wiadomość nie może mieć pustej zawartości');
      }
    }

    if (options.temperature !== undefined) {
      if (options.temperature < 0 || options.temperature > 2) {
        throw new ValidationError('temperature musi być między 0 a 2');
      }
    }

    if (options.maxTokens !== undefined && options.maxTokens <= 0) {
      throw new ValidationError('maxTokens musi być większe od 0');
    }
  }

  private buildRequestBody(options: ChatOptions): OpenRouterRequest {
    // Konstruuj tablicę wiadomości
    const messages: Message[] = [];

    // Dodaj system message jeśli istnieje
    if (options.systemMessage) {
      messages.push({
        role: 'system',
        content: options.systemMessage
      });
    }

    // Dodaj pozostałe wiadomości
    messages.push(...options.messages);

    // Merguj parametry
    const body: OpenRouterRequest = {
      model: options.model || this.config.defaultModel,
      messages,
      temperature: options.temperature ?? this.config.defaultTemperature,
      max_tokens: options.maxTokens || this.config.defaultMaxTokens
    };

    // Opcjonalne parametry
    if (options.topP !== undefined) body.top_p = options.topP;
    if (options.frequencyPenalty !== undefined) body.frequency_penalty = options.frequencyPenalty;
    if (options.presencePenalty !== undefined) body.presence_penalty = options.presencePenalty;
    if (options.responseFormat) body.response_format = options.responseFormat;
    if (options.stream) body.stream = options.stream;

    return body;
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': this.config.siteUrl,
      'X-Title': this.config.appName
    };
  }

  private async executeRequest(
    body: OpenRouterRequest,
    attempt: number = 1
  ): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Obsługa błędów HTTP
      if (!response.ok) {
        return await this.handleErrorResponse(response, body, attempt);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(
          `Request przekroczył timeout (${this.config.timeout}ms)`,
          this.config.timeout
        );
      }

      // Network error
      if (error instanceof TypeError) {
        throw new NetworkError(
          'Nie można połączyć się z OpenRouter API. Sprawdź połączenie internetowe.',
          error
        );
      }

      throw error;
    }
  }

  private async handleErrorResponse(
    response: Response,
    body?: OpenRouterRequest,
    attempt: number = 1
  ): Promise<never> {
    const status = response.status;

    // Spróbuj odczytać error details
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: await response.text() };
    }

    // 401 - Unauthorized
    if (status === 401) {
      throw new APIError(
        'Nieprawidłowy API key. Sprawdź OPENROUTER_API_KEY.',
        401,
        errorData
      );
    }

    // 429 - Rate Limit
    if (status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');

      if (body && attempt < this.config.maxRetries) {
        await this.sleep(retryAfter * 1000);
        return this.executeRequest(body, attempt + 1);
      }

      throw new RateLimitError(
        `Przekroczono limit requestów. Spróbuj ponownie za ${retryAfter}s.`,
        retryAfter
      );
    }

    // 5xx - Server errors (retry)
    if (status >= 500) {
      if (body && attempt < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.executeRequest(body, attempt + 1);
      }

      throw new APIError(
        'OpenRouter API jest tymczasowo niedostępne. Spróbuj ponownie później.',
        status,
        errorData
      );
    }

    // Inne błędy 4xx
    throw new APIError(
      `Błąd API (${status}): ${errorData.error?.message || 'Nieznany błąd'}`,
      status,
      errorData
    );
  }

  private parseResponse(
    raw: OpenRouterResponse,
    startTime: number
  ): ChatResponse {
    const choice = raw.choices[0];
    if (!choice) {
      throw new APIError('Brak choices w odpowiedzi', 500, raw);
    }

    const content = choice.message.content;
    let structuredData: unknown;

    // Spróbuj sparsować jako JSON jeśli używano response_format
    try {
      structuredData = JSON.parse(content);
    } catch {
      // Nie jest JSON, to normalna odpowiedź tekstowa
      structuredData = undefined;
    }

    return {
      id: raw.id,
      model: raw.model,
      content,
      structuredData,
      usage: {
        promptTokens: raw.usage.prompt_tokens,
        completionTokens: raw.usage.completion_tokens,
        totalTokens: raw.usage.total_tokens
      },
      finishReason: choice.finish_reason as any,
      metadata: {
        created: raw.created,
        latency: Date.now() - startTime
      }
    };
  }

  private zodToJsonSchema(schema: z.ZodSchema): Record<string, unknown> {
    const jsonSchema = zodToJsonSchema(schema, {
      target: 'openApi3',
      $refStrategy: 'none'
    });

    // Usuń metadane dodane przez zod-to-json-schema
    const { $schema, ...cleanSchema } = jsonSchema as any;

    return cleanSchema;
  }

  private addToHistory(messages: Message[], assistantResponse: string): void {
    this.history.push(...messages);
    this.history.push({
      role: 'assistant',
      content: assistantResponse
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logError(error: Error, context: Record<string, unknown>): void {
    console.error('[OpenRouter Error]', {
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      ...context
    });

    // W produkcji: wysłanie do systemu monitoringu
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: context });
    // }
  }
}
```

#### Krok 4.3: Utwórz `src/lib/services/openRouter/index.ts`

```typescript
export { OpenRouterService } from './OpenRouterService';
export * from './types';
export * from './errors';
```

### Faza 5: Utworzenie API Endpoint

#### Krok 5.1: Utwórz `src/pages/api/chat.ts`

```typescript
import type { APIRoute } from 'astro';
import { OpenRouterService } from '@/lib/services/openRouter';
import { ValidationError, APIError } from '@/lib/services/openRouter/errors';

const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  appName: import.meta.env.PUBLIC_APP_NAME,
  siteUrl: import.meta.env.PUBLIC_SITE_URL
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { messages, systemMessage, model, temperature, maxTokens } = body;

    // Walidacja podstawowa
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Pole "messages" jest wymagane i musi być niepustą tablicą' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Wywołanie OpenRouter
    const response = await openRouter.chat({
      messages,
      systemMessage,
      model,
      temperature,
      maxTokens
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.statusCode || 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd serwera' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### Faza 6: Utworzenie React Hook

#### Krok 6.1: Utwórz `src/lib/hooks/useChat.ts`

```typescript
import { useState, useCallback } from 'react';
import type { Message, ChatResponse } from '@/lib/services/openRouter';

interface UseChatOptions {
  systemMessage?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim()
    };

    // Dodaj wiadomość użytkownika
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemMessage: options.systemMessage,
          model: options.model,
          temperature: options.temperature,
          maxTokens: options.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd serwera');
      }

      const data: ChatResponse = await response.json();

      // Dodaj odpowiedź asystenta
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
}
```

### Faza 7: Przykład Użycia w Komponencie

#### Krok 7.1: Utwórz `src/components/ChatInterface.tsx`

```typescript
import React, { useState } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { Button } from './ui/button';

export function ChatInterface() {
  const [input, setInput] = useState('');
  
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    systemMessage: 'Jesteś pomocnym asystentem specjalizującym się w żywieniu psów i alergii pokarmowych.',
    model: 'openai/gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat o Żywieniu Psów</h1>
        <Button onClick={clearMessages} variant="outline" size="sm">
          Wyczyść
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'Ty' : 'Asystent'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">Asystent pisze...</div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wpisz swoją wiadomość..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Wyślij
        </Button>
      </form>
    </div>
  );
}
```

#### Krok 7.2: Utwórz stronę Astro `src/pages/chat.astro`

```astro
---
import Layout from '@/layouts/Layout.astro';
import { ChatInterface } from '@/components/ChatInterface';
---

<Layout title="Chat - ZwierzakBezAlergii">
  <ChatInterface client:load />
</Layout>
```

### Faza 8: Testowanie

#### Krok 8.1: Utwórz `test-openrouter.http`

```http
### Test Chat Endpoint
POST http://localhost:4321/api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Jakie składniki karmy są najczęściej alergenami u psów?"
    }
  ],
  "systemMessage": "Jesteś ekspertem od żywienia psów.",
  "model": "openai/gpt-3.5-turbo",
  "temperature": 0.7
}

### Test z historią konwersacji
POST http://localhost:4321/api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Wymień 3 najczęstsze alergeny u psów"
    },
    {
      "role": "assistant",
      "content": "Najczęstsze alergeny to: wołowina, kurczak, pszenica"
    },
    {
      "role": "user",
      "content": "Jakie alternatywy polecasz dla kurczaka?"
    }
  ]
}
```

#### Krok 8.2: Testy Manualne

```bash
# Uruchom dev server
npm run dev

# Otwórz http://localhost:4321/chat w przeglądarce
# Przetestuj różne scenariusze:
# 1. Wysłanie prostego pytania
# 2. Kontynuacja konwersacji
# 3. Wysłanie pustej wiadomości (powinna być zablokowana)
# 4. Długa konwersacja
# 5. Wyczyść historię i zacznij nową konwersację
```

### Faza 9: Dokumentacja i Deployment

#### Krok 9.1: Utwórz `docs/openrouter-usage.md`

```markdown
# Dokumentacja OpenRouter Service

## Szybki Start

### Podstawowe użycie w API endpoint:

\`\`\`typescript
import { OpenRouterService } from '@/lib/services/openRouter';

const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY
});

const response = await openRouter.chat({
  messages: [
    { role: 'user', content: 'Witaj!' }
  ]
});
\`\`\`

### Użycie ze schematem:

\`\`\`typescript
import { z } from 'zod';

const AnalysisSchema = z.object({
  allergens: z.array(z.string()),
  safe: z.boolean()
});

const response = await openRouter.chatWithSchema({
  messages: [{ role: 'user', content: 'Przeanalizuj: kurczak, ryż' }],
  schema: AnalysisSchema,
  schemaName: 'Analysis'
});

console.log(response.data.allergens); // ['kurczak']
\`\`\`

## Dostępne Modele

- `openai/gpt-3.5-turbo` - szybki, tani
- `openai/gpt-4` - najwyższa jakość
- `anthropic/claude-3-opus` - świetny dla długich kontekstów
- `google/gemini-pro` - dobry balans ceny i jakości

Pełna lista: https://openrouter.ai/docs#models
```

#### Krok 9.2: Deployment na DigitalOcean

```bash
# 1. Ustaw zmienne środowiskowe w DigitalOcean App Platform
OPENROUTER_API_KEY=sk-or-v1-xxxxx
PUBLIC_APP_NAME=ZwierzakBezAlergii
PUBLIC_SITE_URL=https://zwierzakbezalergii.pl

# 2. Build i deploy
npm run build

# 3. Testuj produkcyjny endpoint
curl -X POST https://zwierzakbezalergii.pl/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'
```

---

## Podsumowanie

Ten plan implementacji zapewnia:

✅ **Bezpieczną komunikację** z OpenRouter API  
✅ **Type-safe interfejsy** dzięki TypeScript  
✅ **Kompleksową obsługę błędów** z retry logic  
✅ **Wsparcie dla strukturalnych odpowiedzi** (JSON Schema)  
✅ **Streaming** dla real-time odpowiedzi  
✅ **React hook** dla łatwej integracji z UI  
✅ **API endpoint** ukrywający klucze przed frontendem  
✅ **Dokumentację** i przykłady użycia  

### Następne Kroki:

1. Implementuj usługę według kroków w Fazach 1-4
2. Stwórz API endpoint (Faza 5)
3. Zintegruj z frontendem przez hook (Faza 6-7)
4. Przetestuj dokładnie (Faza 8)
5. Wdróż na produkcję (Faza 9)

### Rozszerzenia:

- **Caching** - zmniejsz koszty przez cachowanie odpowiedzi
- **Analytics** - śledź użycie i koszty
- **A/B Testing** - testuj różne modele i parametry
- **Fine-tuning** - dostosuj model do specyfiki domeny

