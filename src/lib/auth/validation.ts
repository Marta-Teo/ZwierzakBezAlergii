/**
 * Authentication Validation Functions
 * Client-side validation for auth forms
 * Based on auth-spec.md section 2.3.1
 */

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength levels
 */
export type PasswordStrength = "weak" | "medium" | "strong";

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Error message or null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email jest wymagany";
  if (!EMAIL_REGEX.test(email)) return "Nieprawidłowy format email";
  return null;
};

/**
 * Validate password for login
 * @param password - Password to validate
 * @returns Error message or null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return "Hasło jest wymagane";
  if (password.length < 8) return "Hasło musi mieć min. 8 znaków";
  return null;
};

/**
 * Validate password for registration (stricter requirements)
 * @param password - Password to validate
 * @returns Error message or null if valid
 */
export const validatePasswordStrict = (password: string): string | null => {
  if (!password) return "Hasło jest wymagane";
  if (password.length < 8) return "Hasło musi mieć min. 8 znaków";
  if (!/[A-Za-z]/.test(password)) return "Hasło musi zawierać literę";
  if (!/[0-9]/.test(password)) return "Hasło musi zawierać cyfrę";
  return null;
};

/**
 * Validate password confirmation
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns Error message or null if valid
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Potwierdzenie hasła jest wymagane";
  if (password !== confirmPassword) return "Hasła nie są identyczne";
  return null;
};

/**
 * Validate login form
 * @param email - Email address
 * @param password - Password
 * @returns Error message or null if valid
 */
export const validateLoginForm = (email: string, password: string): string | null => {
  const emailError = validateEmail(email);
  if (emailError) return emailError;

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return null;
};

/**
 * Validate registration form
 * @param email - Email address
 * @param password - Password
 * @param confirmPassword - Password confirmation
 * @returns Error message or null if valid
 */
export const validateRegisterForm = (email: string, password: string, confirmPassword: string): string | null => {
  const emailError = validateEmail(email);
  if (emailError) return emailError;

  const passwordError = validatePasswordStrict(password);
  if (passwordError) return passwordError;

  const confirmError = validatePasswordConfirmation(password, confirmPassword);
  if (confirmError) return confirmError;

  return null;
};

/**
 * Get password strength indicator
 * @param password - Password to evaluate
 * @returns Password strength level
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 8) return "weak";
  if (password.length < 12) return "medium";

  // Strong password: 12+ chars, upper, lower, digit, and special char
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUpper && hasLower && hasDigit && hasSpecial) {
    return "strong";
  }

  return "medium";
};

/**
 * Get initials from email address (for avatar)
 * @param email - Email address
 * @returns Two-letter initials
 */
export const getInitials = (email: string): string => {
  if (!email) return "U";

  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return email.substring(0, 2).toUpperCase();
};
