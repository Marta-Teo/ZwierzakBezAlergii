/**
 * Authentication Error Messages
 * Maps Supabase Auth error codes to user-friendly Polish messages
 * Based on auth-spec.md section 2.3.2
 */

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Login errors
  invalid_credentials: "Nieprawidłowy email lub hasło",
  email_not_confirmed: "Email nie został zweryfikowany. Sprawdź swoją skrzynkę pocztową.",
  user_not_found: "Nie znaleziono użytkownika z tym emailem",
  invalid_grant: "Nieprawidłowy email lub hasło",

  // Register errors
  user_already_exists: "Użytkownik z tym emailem już istnieje",
  email_exists: "Użytkownik z tym emailem już istnieje",
  weak_password: "Hasło jest zbyt słabe. Użyj minimum 8 znaków, litery i cyfry.",

  // Rate limiting
  too_many_requests: "Zbyt wiele prób. Spróbuj ponownie za chwilę.",
  over_email_send_rate_limit: "Zbyt wiele wysłanych emaili. Spróbuj ponownie za chwilę.",

  // Reset password errors
  invalid_recovery_token: "Link resetujący hasło wygasł lub jest nieprawidłowy",
  same_password: "Nowe hasło nie może być takie samo jak poprzednie",

  // Generic
  network_error: "Błąd połączenia. Sprawdź połączenie z internetem.",
  server_error: "Błąd serwera. Spróbuj ponownie później.",
};

/**
 * Get user-friendly error message from Supabase Auth error
 * @param error - Error object from Supabase Auth
 * @returns User-friendly error message in Polish
 */
export const getAuthErrorMessage = (error: any): string => {
  // Handle network errors
  if (error?.message?.includes("network") || !navigator.onLine) {
    return AUTH_ERROR_MESSAGES.network_error;
  }

  // Get error code
  const code = error?.code || error?.message || "unknown";

  // Return mapped message or generic error
  return AUTH_ERROR_MESSAGES[code] || "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.";
};
