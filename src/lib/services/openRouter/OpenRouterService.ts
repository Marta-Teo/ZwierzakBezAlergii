import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";
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
  ResponseFormat,
} from "./types";
import {
  ConfigurationError,
  APIError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  SchemaValidationError,
  ValidationError,
} from "./errors";

export class OpenRouterService {
  private readonly config: Readonly<Required<OpenRouterConfig>>;
  private history: Message[] = [];

  constructor(config: OpenRouterConfig) {
    // Walidacja i ustawienie domyślnych wartości
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || "https://openrouter.ai/api/v1",
      defaultModel: config.defaultModel || "openai/gpt-3.5-turbo",
      defaultTemperature: config.defaultTemperature ?? 0.7,
      defaultMaxTokens: config.defaultMaxTokens || 1000,
      timeout: config.timeout || 60000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      appName: config.appName || "ZwierzakBezAlergii",
      siteUrl: config.siteUrl || "",
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
        method: "chat",
        model: options.model || this.config.defaultModel,
        messageCount: options.messages.length,
      });
      throw error;
    }
  }

  async chatWithSchema<T>(options: ChatWithSchemaOptions<T>): Promise<ChatSchemaResponse<T>> {
    const { schema, schemaName, ...chatOptions } = options;

    // Konwertuj Zod schema na JSON Schema
    const jsonSchema = this.zodToJsonSchema(schema);

    // Ustaw response_format
    const responseFormat: ResponseFormat = {
      type: "json_schema",
      json_schema: {
        name: schemaName,
        strict: true,
        schema: jsonSchema,
      },
    };

    // Wykonaj chat z response_format
    const response = await this.chat({
      ...chatOptions,
      responseFormat,
    });

    // Waliduj odpowiedź względem schematu
    try {
      const parsedData = JSON.parse(response.content);
      const validatedData = schema.parse(parsedData);

      return {
        ...response,
        data: validatedData,
        structuredData: validatedData,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw new SchemaValidationError("Odpowiedź nie pasuje do oczekiwanego schematu", error);
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
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    // Parsuj SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new NetworkError("Nie można odczytać stream", new Error("No reader"));
    }

    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              yield {
                delta: "",
                accumulated,
                done: true,
              };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content || "";
              accumulated += delta;

              yield {
                delta,
                accumulated,
                done: false,
                usage: parsed.usage,
              };
            } catch {
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

  // ===== Prywatne Metody =====

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new ConfigurationError("API key jest wymagany. Ustaw OPENROUTER_API_KEY w zmiennych środowiskowych.");
    }

    if (this.config.apiKey.length < 20) {
      throw new ConfigurationError("API key wydaje się być nieprawidłowy (za krótki)");
    }

    if (this.config.defaultTemperature < 0 || this.config.defaultTemperature > 2) {
      throw new ConfigurationError("Temperature musi być między 0 a 2");
    }

    if (this.config.defaultMaxTokens <= 0) {
      throw new ConfigurationError("defaultMaxTokens musi być większe od 0");
    }

    if (this.config.timeout <= 0) {
      throw new ConfigurationError("timeout musi być większy od 0");
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
      throw new ValidationError("messages nie może być puste");
    }

    for (const message of options.messages) {
      if (!message.role || !["system", "user", "assistant"].includes(message.role)) {
        throw new ValidationError(`Nieprawidłowa rola wiadomości: ${message.role}`);
      }

      if (!message.content) {
        throw new ValidationError("Wiadomość nie może mieć pustej zawartości");
      }
    }

    if (options.temperature !== undefined) {
      if (options.temperature < 0 || options.temperature > 2) {
        throw new ValidationError("temperature musi być między 0 a 2");
      }
    }

    if (options.maxTokens !== undefined && options.maxTokens <= 0) {
      throw new ValidationError("maxTokens musi być większe od 0");
    }
  }

  private buildRequestBody(options: ChatOptions): OpenRouterRequest {
    // Konstruuj tablicę wiadomości
    const messages: Message[] = [];

    // Dodaj system message jeśli istnieje
    if (options.systemMessage) {
      messages.push({
        role: "system",
        content: options.systemMessage,
      });
    }

    // Dodaj pozostałe wiadomości
    messages.push(...options.messages);

    // Merguj parametry
    const body: OpenRouterRequest = {
      model: options.model || this.config.defaultModel,
      messages,
      temperature: options.temperature ?? this.config.defaultTemperature,
      max_tokens: options.maxTokens || this.config.defaultMaxTokens,
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
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": this.config.siteUrl,
      "X-Title": this.config.appName,
    };
  }

  private async executeRequest(body: OpenRouterRequest, attempt = 1): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
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
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request przekroczył timeout (${this.config.timeout}ms)`, this.config.timeout);
      }

      // Network error
      if (error instanceof TypeError) {
        throw new NetworkError("Nie można połączyć się z OpenRouter API. Sprawdź połączenie internetowe.", error);
      }

      throw error;
    }
  }

  private async handleErrorResponse(
    response: Response,
    body?: OpenRouterRequest,
    attempt = 1
  ): Promise<OpenRouterResponse> {
    const status = response.status;

    // Spróbuj odczytać error details
    let errorData: { error?: { message?: string }; message?: string };
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: await response.text() };
    }

    // 401 - Unauthorized
    if (status === 401) {
      throw new APIError("Nieprawidłowy API key. Sprawdź OPENROUTER_API_KEY.", 401, errorData);
    }

    // 429 - Rate Limit
    if (status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");

      if (body && attempt < this.config.maxRetries) {
        await this.sleep(retryAfter * 1000);
        return this.executeRequest(body, attempt + 1);
      }

      throw new RateLimitError(`Przekroczono limit requestów. Spróbuj ponownie za ${retryAfter}s.`, retryAfter);
    }

    // 5xx - Server errors (retry)
    if (status >= 500) {
      if (body && attempt < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.executeRequest(body, attempt + 1);
      }

      throw new APIError("OpenRouter API jest tymczasowo niedostępne. Spróbuj ponownie później.", status, errorData);
    }

    // Inne błędy 4xx
    throw new APIError(`Błąd API (${status}): ${errorData.error?.message || "Nieznany błąd"}`, status, errorData);
  }

  private parseResponse(raw: OpenRouterResponse, startTime: number): ChatResponse {
    const choice = raw.choices[0];
    if (!choice) {
      throw new APIError("Brak choices w odpowiedzi", 500, raw);
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
        totalTokens: raw.usage.total_tokens,
      },
      finishReason: choice.finish_reason as "stop" | "length" | "content_filter" | "tool_calls",
      metadata: {
        created: raw.created,
        latency: Date.now() - startTime,
      },
    };
  }

  private zodToJsonSchema(schema: z.ZodSchema): Record<string, unknown> {
    const jsonSchema = zodToJsonSchema(schema, {
      target: "openApi3",
      $refStrategy: "none",
    });

    // Usuń metadane dodane przez zod-to-json-schema
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $schema, ...cleanSchema } = jsonSchema as { $schema?: string; [key: string]: unknown };

    return cleanSchema;
  }

  private addToHistory(messages: Message[], assistantResponse: string): void {
    this.history.push(...messages);
    this.history.push({
      role: "assistant",
      content: assistantResponse,
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private logError(error: Error, context: Record<string, unknown>): void {
    console.error("[OpenRouter Error]", {
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      ...context,
    });

    // W produkcji: wysłanie do systemu monitoringu
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: context });
    // }
  }
}
