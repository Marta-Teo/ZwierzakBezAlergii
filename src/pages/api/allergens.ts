import type { APIRoute } from "astro";
import { sortAllergensByPriority } from "../../lib/utils/allergenSorting";

/**
 * GET /api/allergens
 *
 * Pobiera listę alergenów w strukturze hierarchicznej
 * Zasób read-only - dostępny dla wszystkich użytkowników
 *
 * Alergeny mają hierarchię:
 * - Główne kategorie (parent_id = null): mięso, drób, ryby, zboża, strączkowe, nabiał, jaja, czosnek
 * - Podkategorie (parent_id != null): np. kurczak (parent: drób), pszenica (parent: zboża)
 *
 * Sortowanie według priorytetów:
 * - Kategorie główne: drób → mięso → ryby → zboża → reszta alfabetycznie
 * - Podkategorie drobiu: kurczak → indyk → kaczka → reszta alfabetycznie
 * - Podkategorie mięsa: wołowina → reszta alfabetycznie
 * - Podkategorie zbóż: pszenica → kukurydza → jęczmień → reszta alfabetycznie
 * - Pozostałe podkategorie: alfabetycznie
 *
 * @returns 200 - Lista alergenów z informacją o hierarchii
 * @returns 500 - Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { data: allergens, error } = await locals.supabase.from("allergens").select("*");

    if (error) {
      console.error("[API /allergens] Błąd Supabase:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Sortuj alergeny według priorytetów
    const sortedAllergens = sortAllergensByPriority(allergens || []);

    // Opcjonalnie: grupowanie w strukturę drzewa
    // Główne kategorie (parent_id = null)
    const mainCategories = sortedAllergens.filter((a) => a.parent_id === null);

    // Podkategorie
    const subCategories = sortedAllergens.filter((a) => a.parent_id !== null);

    return new Response(
      JSON.stringify({
        success: true,
        data: sortedAllergens,
        count: sortedAllergens.length,
        hierarchy: {
          mainCategories,
          subCategories,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API /allergens] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd serwera",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
