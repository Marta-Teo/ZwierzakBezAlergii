import type { APIRoute } from 'astro';
import { OpenRouterService } from '@/lib/services/openRouter';
import { ValidationError, APIError } from '@/lib/services/openRouter/errors';

// Wyłączamy prerendering dla tego endpointu zgodnie z zasadami Astro
export const prerender = false;

// Tworzymy singleton instancję OpenRouterService
const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  appName: import.meta.env.PUBLIC_APP_NAME,
  siteUrl: import.meta.env.PUBLIC_SITE_URL
});

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
    // Parsuj body requesta
    const body = await request.json();
    const { messages, systemMessage, model, temperature, maxTokens } = body;

    // Walidacja podstawowa - messages jest wymagane
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Pole "messages" jest wymagane i musi być niepustą tablicą' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Wywołanie OpenRouter Service
    const response = await openRouter.chat({
      messages,
      systemMessage,
      model,
      temperature,
      maxTokens
    });

    // Zwróć sukces
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Loguj błąd po stronie serwera
    console.error('[API /chat] Błąd:', error);

    // Obsługa ValidationError (400)
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          code: error.code 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Obsługa APIError (błędy z OpenRouter)
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          code: error.code,
          statusCode: error.statusCode 
        }),
        { 
          status: error.statusCode || 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd serwera',
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

