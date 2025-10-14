import { z } from 'zod';

/**
 * Schemat walidacji dla tworzenia nowej karmy
 * 
 * Waliduje dane wejściowe zgodnie z wymaganiami bazy danych:
 * - name: wymagane, niepuste (TEXT NOT NULL)
 * - brand_id: wymagane, dodatnia liczba całkowita (INT NOT NULL REFERENCES brands)
 * - size_type_id: opcjonalne, liczba lub null (INT REFERENCES size_types)
 * - age_category_id: opcjonalne, liczba lub null (INT REFERENCES age_categories)
 * - ingredients_raw: opcjonalne, tekst lub null (TEXT)
 */
export const CreateFoodSchema = z.object({
  name: z
    .string({
      required_error: 'Nazwa karmy jest wymagana',
      invalid_type_error: 'Nazwa karmy musi być tekstem',
    })
    .min(1, 'Nazwa karmy nie może być pusta')
    .trim(),

  brand_id: z
    .number({
      required_error: 'ID marki jest wymagane',
      invalid_type_error: 'ID marki musi być liczbą',
    })
    .int('ID marki musi być liczbą całkowitą')
    .positive('ID marki musi być liczbą dodatnią'),

  size_type_id: z
    .number({
      invalid_type_error: 'ID typu rozmiaru musi być liczbą',
    })
    .int('ID typu rozmiaru musi być liczbą całkowitą')
    .positive('ID typu rozmiaru musi być liczbą dodatnią')
    .nullable()
    .optional(),

  age_category_id: z
    .number({
      invalid_type_error: 'ID kategorii wiekowej musi być liczbą',
    })
    .int('ID kategorii wiekowej musi być liczbą całkowitą')
    .positive('ID kategorii wiekowej musi być liczbą dodatnią')
    .nullable()
    .optional(),

  ingredients_raw: z
    .string({
      invalid_type_error: 'Składniki muszą być tekstem',
    })
    .trim()
    .nullable()
    .optional(),
});

/**
 * Typ TypeScript wynikowy ze schematu walidacji
 */
export type CreateFoodInput = z.infer<typeof CreateFoodSchema>;

/**
 * Schemat walidacji dla aktualizacji karmy
 * 
 * Wszystkie pola opcjonalne - umożliwia częściową aktualizację (PATCH-like behavior)
 * 
 * @example
 * ```ts
 * // Aktualizacja tylko nazwy
 * const input = { name: "Nowa nazwa" };
 * 
 * // Aktualizacja marki i rozmiaru
 * const input = { brand_id: 2, size_type_id: 1 };
 * ```
 */
export const UpdateFoodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nazwa karmy musi mieć przynajmniej 1 znak')
    .max(200, 'Nazwa karmy nie może przekraczać 200 znaków')
    .optional(),

  brand_id: z
    .number({
      required_error: 'ID marki jest wymagane',
      invalid_type_error: 'ID marki musi być liczbą',
    })
    .int('ID marki musi być liczbą całkowitą')
    .positive('ID marki musi być liczbą dodatnią')
    .optional(),

  size_type_id: z
    .number({
      invalid_type_error: 'ID rozmiaru musi być liczbą',
    })
    .int('ID rozmiaru musi być liczbą całkowitą')
    .positive('ID rozmiaru musi być liczbą dodatnią')
    .nullable()
    .optional(),

  age_category_id: z
    .number({
      invalid_type_error: 'ID kategorii wieku musi być liczbą',
    })
    .int('ID kategorii wieku musi być liczbą całkowitą')
    .positive('ID kategorii wieku musi być liczbą dodatnią')
    .nullable()
    .optional(),

  ingredients_raw: z
    .string()
    .trim()
    .min(1, 'Surowy skład musi mieć przynajmniej 1 znak')
    .max(2000, 'Surowy skład nie może przekraczać 2000 znaków')
    .optional(),
});

/**
 * Typ TypeScript dla aktualizacji karmy
 */
export type UpdateFoodInput = z.infer<typeof UpdateFoodSchema>;

