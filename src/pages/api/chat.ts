import type { APIRoute } from "astro";
import { OpenRouterService } from "@/lib/services/openRouter";
import { ValidationError, APIError, ConfigurationError } from "@/lib/services/openRouter/errors";

// Wyłączamy prerendering dla tego endpointu zgodnie z zasadami Astro
export const prerender = false;

/**
 * Tworzy instancję OpenRouterService z kluczem API z runtime env
 * W Cloudflare Workers, zmienne z Dashboard są dostępne przez runtime.env
 */
function createOpenRouterService(runtimeEnv: Record<string, unknown> | undefined): OpenRouterService {
  // Próbuj pobrać klucz z runtime env (Cloudflare Dashboard) lub import.meta.env (wrangler.toml)
  const apiKey = (runtimeEnv?.OPENROUTER_API_KEY as string) || import.meta.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new ConfigurationError(
      "Brak klucza OPENROUTER_API_KEY. Dodaj go w Cloudflare Dashboard -> Settings -> Variables and Secrets."
    );
  }
  
  const appName = (runtimeEnv?.PUBLIC_APP_NAME as string) || import.meta.env.PUBLIC_APP_NAME || "ZwierzakBezAlergii";
  const siteUrl = (runtimeEnv?.PUBLIC_SITE_URL as string) || import.meta.env.PUBLIC_SITE_URL || "https://www.zwierzakbezalergii.pl";
  
  return new OpenRouterService({
    apiKey,
    appName,
    siteUrl,
  });
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
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Pobierz runtime env z Cloudflare (zmienne z Dashboard)
    const runtimeEnv = locals.runtime?.env as Record<string, unknown> | undefined;
    
    // Utwórz serwis z kluczem API
    const service = createOpenRouterService(runtimeEnv);
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
