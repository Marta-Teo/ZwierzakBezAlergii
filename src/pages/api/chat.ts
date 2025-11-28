import type { APIRoute } from "astro";
import { OpenRouterService } from "@/lib/services/openRouter";
import { ValidationError, APIError, ConfigurationError } from "@/lib/services/openRouter/errors";

// Wyłączamy prerendering dla tego endpointu zgodnie z zasadami Astro
export const prerender = false;

// Lazy initialization - tworzymy serwis dopiero przy pierwszym requeście
let openRouter: OpenRouterService | null = null;

function getOpenRouterService(): OpenRouterService {
  if (!openRouter) {
    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new ConfigurationError(
        "Brak klucza OPENROUTER_API_KEY. Dodaj go w Cloudflare Dashboard -> Settings -> Variables and Secrets."
      );
    }
    
    openRouter = new OpenRouterService({
      apiKey,
      appName: import.meta.env.PUBLIC_APP_NAME || "ZwierzakBezAlergii",
      siteUrl: import.meta.env.PUBLIC_SITE_URL || "https://www.zwierzakbezalergii.pl",
    });
  }
  return openRouter;
}

/**
 * POST /api/chat
 *
 * Endpoint do komunikacji z OpenRouter API
 * Przyjmuje wiadomości użytkownika i zwraca odpowiedź z modelu LLM
 *
 * Body parameters:
 * - messages: Message[] (wymagane) - tablica wiadomości w konwersacji
 * - systemMessage?: string - opcjonalna wiadomość systemowa
 * - model?: string - model do użycia (domyślnie gpt-3.5-turbo)
 * - temperature?: number - temperatura generowania (0-2)
 * - maxTokens?: number - maksymalna liczba tokenów w odpowiedzi
 *
 * @returns ChatResponse z treścią odpowiedzi i metadanymi
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Lazy init serwisu - jeśli brak klucza API, zwrócimy czytelny błąd
    const service = getOpenRouterService();
    // Parsuj body requesta
    const body = await request.json();
    const { messages, systemMessage, model, temperature, maxTokens } = body;

    // Walidacja podstawowa - messages jest wymagane
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Pole "messages" jest wymagane i musi być niepustą tablicą',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Wywołanie OpenRouter Service
    const response = await service.chat({
      messages,
      systemMessage,
      model,
      temperature,
      maxTokens,
    });

    // Zwróć sukces
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Loguj błąd po stronie serwera
    console.error("[API /chat] Błąd:", error);

    // Obsługa ConfigurationError (brak klucza API)
    if (error instanceof ConfigurationError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          code: "CONFIGURATION_ERROR",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Obsługa ValidationError (400)
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Obsługa APIError (błędy z OpenRouter)
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code,
          statusCode: error.statusCode,
        }),
        {
          status: error.statusCode || 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera",
        code: "INTERNAL_SERVER_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
