import { z } from 'zod';

/**
 * Schemat walidacji dla tworzenia marki
 * 
 * @example
 * ```ts
 * const input = { name: "Royal Canin" };
 * ```
 */
export const CreateBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nazwa marki jest wymagana')
    .max(100, 'Nazwa marki nie może przekraczać 100 znaków'),
});

/**
 * Schemat walidacji dla aktualizacji marki
 * 
 * @example
 * ```ts
 * const input = { name: "Royal Canin Updated" };
 * ```
 */
export const UpdateBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nazwa marki musi mieć przynajmniej 1 znak')
    .max(100, 'Nazwa marki nie może przekraczać 100 znaków')
    .optional(),
});

/**
 * Typy TypeScript wynikowe ze schematów walidacji
 */
export type CreateBrandInput = z.infer<typeof CreateBrandSchema>;
export type UpdateBrandInput = z.infer<typeof UpdateBrandSchema>;

