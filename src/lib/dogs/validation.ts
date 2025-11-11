/**
 * Dog Profile Validation
 * Client-side validation for dog profile forms
 */

export interface DogFormData {
  name: string;
  size_type_id: number | null;
  age_category_id: number | null;
  allergen_ids: number[];
  notes: string | null;
}

/**
 * Validates dog form data
 * @param data - Dog form data to validate
 * @returns Error message or null if valid
 */
export function validateDogForm(data: DogFormData): string | null {
  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    return "Imię psa jest wymagane";
  }

  if (data.name.length > 50) {
    return "Imię psa może mieć maksymalnie 50 znaków";
  }

  // Only letters, spaces, hyphens allowed (including Polish characters)
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-]+$/;
  if (!nameRegex.test(data.name)) {
    return "Imię psa może zawierać tylko litery, spacje i myślniki";
  }

  // Notes validation
  if (data.notes && data.notes.length > 500) {
    return "Notatki mogą mieć maksymalnie 500 znaków";
  }

  return null;
}

/**
 * Sanitizes dog name (trim, remove multiple spaces)
 * @param name - Dog name to sanitize
 * @returns Sanitized dog name
 */
export function sanitizeDogName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}
