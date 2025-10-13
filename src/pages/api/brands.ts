import type { APIRoute } from 'astro';

// 🔥 TAK UŻYWASZ SUPABASE w API routes!
// Endpoint zwraca listę wszystkich marek w formacie JSON

export const prerender = false; // Wyłącz pre-rendering dla API route

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Pobierz klienta Supabase z locals (dodany przez middleware)
    const { supabase } = locals;

    // Pobierz wszystkie marki z bazy danych
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    // Obsługa błędów z bazy danych
    if (error) {
      console.error('[API /brands] Błąd Supabase:', JSON.stringify(error, null, 2));
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

    // Zwróć dane w formacie JSON
    return new Response(
      JSON.stringify({
        success: true,
        data: brands,
        count: brands?.length || 0,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[API /brands] Nieoczekiwany błąd:', JSON.stringify(err, null, 2));
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

