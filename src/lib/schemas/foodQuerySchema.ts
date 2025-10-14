import { z } from 'zod';

/**
 * Schemat walidacji parametrów zapytania dla endpointu GET /api/foods
 * 
 * Obsługuje filtrowanie, wyszukiwanie, paginację i sortowanie
 */
export const FoodQuerySchema = z.object({
  // Filtrowanie po atrybutach karmy
  brandId: z
    .string()
    .regex(/^\d+$/, 'Brand ID musi być liczbą')
    .transform(Number)
    .optional(),

  sizeTypeId: z
    .string()
    .regex(/^\d+$/, 'Size Type ID musi być liczbą')
    .transform(Number)
    .optional(),

  ageCategoryId: z
    .string()
    .regex(/^\d+$/, 'Age Category ID musi być liczbą')
    .transform(Number)
    .optional(),

  // Wykluczanie alergenów (lista nazw oddzielona przecinkami)
  // Przykład: "drób,pszenica,ryby"
  excludeAllergens: z
    .string()
    .transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean))
    .optional(),

  // Wyszukiwanie pełnotekstowe w nazwie i składnikach
  search: z
    .string()
    .trim()
    .min(1, 'Zapytanie wyszukiwania nie może być puste')
    .optional(),

  // Paginacja
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit musi być liczbą')
    .transform(Number)
    .refine((val) => val > 0, 'Limit musi być większy od 0')
    .refine((val) => val <= 100, 'Maksymalny limit to 100')
    .default('20')
    .optional(),

  offset: z
    .string()
    .regex(/^\d+$/, 'Offset musi być liczbą')
    .transform(Number)
    .refine((val) => val >= 0, 'Offset nie może być ujemny')
    .default('0')
    .optional(),

  // Sortowanie
  orderBy: z
    .enum(['name', 'created_at', 'updated_at', 'brand_id'], {
      errorMap: () => ({ message: 'Nieprawidłowe pole sortowania' }),
    })
    .default('created_at')
    .optional(),

  orderDirection: z
    .enum(['asc', 'desc'], {
      errorMap: () => ({ message: 'Kierunek sortowania musi być "asc" lub "desc"' }),
    })
    .default('desc')
    .optional(),
});

/**
 * Typ TypeScript wynikowy ze schematu walidacji
 */
export type FoodQueryInput = z.infer<typeof FoodQuerySchema>;

/**
 * Interfejs dla filtrów przekazywanych do serwisu
 * (po przetworzeniu query params)
 */
export interface FoodFilters {
  brandId?: number;
  sizeTypeId?: number;
  ageCategoryId?: number;
  excludeAllergens?: string[];
  search?: string;
  limit: number;
  offset: number;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

