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

