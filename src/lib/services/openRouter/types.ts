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

