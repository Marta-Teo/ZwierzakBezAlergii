import { useState, useCallback } from "react";
import type { Message, ChatResponse } from "@/lib/services/openRouter";

/**
 * Opcje konfiguracji dla hooka useChat
 */
interface UseChatOptions {
  /** Wiadomość systemowa definiująca zachowanie asystenta */
  systemMessage?: string;
  /** Model LLM do użycia (np. 'openai/gpt-4') */
  model?: string;
  /** Temperatura generowania (0-2, domyślnie 0.7) */
  temperature?: number;
  /** Maksymalna liczba tokenów w odpowiedzi */
  maxTokens?: number;
  /** Callback wywoływany przy błędzie */
  onError?: (error: Error) => void;
}

/**
 * Wartości zwracane przez hook useChat
 */
interface UseChatReturn {
  /** Tablica wszystkich wiadomości w konwersacji */
  messages: Message[];
  /** Czy request jest w trakcie przetwarzania */
  isLoading: boolean;
  /** Komunikat błędu (jeśli wystąpił) */
  error: string | null;
  /** Funkcja do wysyłania nowej wiadomości */
  sendMessage: (content: string) => Promise<void>;
  /** Funkcja do czyszczenia historii konwersacji */
  clearMessages: () => void;
}

/**
 * React hook do zarządzania konwersacją z LLM
 *
 * Automatycznie zarządza stanem konwersacji, obsługuje błędy i loading state.
 * Wysyła requesty do /api/chat endpoint.
 *
 * @param options - Opcje konfiguracji chatu
 * @returns Obiekt z metodami i stanem konwersacji
 *
 * @example
 * ```tsx
 * const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
 *   systemMessage: 'Jesteś ekspertem od żywienia psów.',
 *   model: 'openai/gpt-4',
 *   temperature: 0.7
 * });
 *
 * // Wyślij wiadomość
 * await sendMessage('Jakie są najczęstsze alergeny u psów?');
 *
 * // Wyczyść historię
 * clearMessages();
 * ```
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Wysyła nową wiadomość użytkownika i otrzymuje odpowiedź asystenta
   */
  const sendMessage = useCallback(
    async (content: string) => {
      // Guard clause - ignoruj puste wiadomości
      if (!content.trim()) return;

      // Utwórz wiadomość użytkownika
      const userMessage: Message = {
        role: "user",
        content: content.trim(),
      };

      // Dodaj wiadomość użytkownika do historii
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Wyślij request do API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            systemMessage: options.systemMessage,
            model: options.model,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
          }),
        });

        // Obsługa błędów HTTP
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Błąd serwera");
        }

        // Parsuj odpowiedź
        const data: ChatResponse = await response.json();

        // Dodaj odpowiedź asystenta do historii
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        // Obsługa błędów
        const errorMessage = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";

        setError(errorMessage);

        // Wywołaj callback onError jeśli został podany
        if (options.onError) {
          options.onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options]
  );

  /**
   * Czyści całą historię konwersacji i resetuje błędy
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
