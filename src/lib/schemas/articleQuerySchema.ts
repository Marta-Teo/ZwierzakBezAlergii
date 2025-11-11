import { z } from "zod";

/**
 * Schemat walidacji dla parametrów query endpoint GET /api/articles
 *
 * Waliduje wszystkie parametry wyszukiwania, filtrowania,
 * paginacji i sortowania artykułów.
 */
export const ArticleQuerySchema = z.object({
  // Filtrowanie
  authorId: z.coerce.number().int().positive().optional(),

  // Wyszukiwanie pełnotekstowe
  search: z.string().trim().max(200).optional(),

  // Paginacja
  limit: z.coerce.number().int().min(1).max(50).optional(),
  offset: z.coerce.number().int().min(0).optional(),

  // Sortowanie
  orderBy: z.enum(["created_at", "updated_at", "title"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
});

/**
 * Typ wnioskowany ze schematu walidacji
 * Reprezentuje parametry filtrowania artykułów
 */
export type ArticleFilters = z.infer<typeof ArticleQuerySchema>;
