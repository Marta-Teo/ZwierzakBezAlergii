import type { APIRoute } from 'astro';

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
 * @returns 200 - Lista alergenów z informacją o hierarchii
 * @returns 500 - Błąd serwera
 */
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { data: allergens, error } = await locals.supabase
      .from('allergens')
      .select('*')
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('[API /allergens] Błąd Supabase:', JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Opcjonalnie: grupowanie w strukturę drzewa
    // Główne kategorie (parent_id = null)
    const mainCategories = allergens?.filter((a) => a.parent_id === null) || [];
    
    // Podkategorie
    const subCategories = allergens?.filter((a) => a.parent_id !== null) || [];

    return new Response(
      JSON.stringify({
        success: true,
        data: allergens,
        count: allergens?.length || 0,
        hierarchy: {
          mainCategories,
          subCategories,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[API /allergens] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd serwera',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

