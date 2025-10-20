import type { APIRoute } from "astro";
import { UpdateBrandSchema } from "../../../lib/schemas/brandSchema";

export const prerender = false;

/**
 * PUT /api/brands/:id
 *
 * Aktualizuje markę karmy
 *
 * @param id - ID marki
 * @returns 200 - Marka zaktualizowana
 * @returns 400 - Nieprawidłowe ID lub dane
 * @returns 404 - Marka nie znaleziona
 * @returns 500 - Błąd serwera
 */
export const PUT: APIRoute = async ({ locals, params, request }) => {
  try {
    // KROK 1: Walidacja ID
    const id = parseInt(params.id || "", 10);

    if (isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowe ID marki",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 2: Parsowanie body
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[API PUT /brands/:id] Błąd parsowania JSON:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowy format JSON",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 3: Walidacja
    const validationResult = UpdateBrandSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[API PUT /brands/:id] Błąd walidacji:", JSON.stringify(validationResult.error.format(), null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Błąd walidacji danych",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 4: Aktualizacja w bazie
    const { data: updatedBrand, error } = await locals.supabase
      .from("brands")
      .update({
        name: validationResult.data.name,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedBrand) {
      // Sprawdź czy to błąd "nie znaleziono"
      if (error?.code === "PGRST116" || !updatedBrand) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Marka nie została znaleziona",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.error("[API PUT /brands/:id] Błąd Supabase:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie udało się zaktualizować marki",
          details: error?.message || "Nieznany błąd",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 5: Sukces
    return new Response(
      JSON.stringify({
        success: true,
        data: updatedBrand,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[API PUT /brands/:id] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
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

/**
 * DELETE /api/brands/:id
 *
 * Usuwa markę karmy
 * UWAGA: Usunięcie marki jest możliwe tylko jeśli nie ma karm tej marki
 *
 * @param id - ID marki
 * @returns 204 - Marka usunięta
 * @returns 400 - Nieprawidłowe ID
 * @returns 404 - Marka nie znaleziona
 * @returns 409 - Konflikt - marka ma przypisane karmy
 * @returns 500 - Błąd serwera
 */
export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    // KROK 1: Walidacja ID
    const id = parseInt(params.id || "", 10);

    if (isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowe ID marki",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 2: Sprawdź czy marka istnieje
    const { data: existingBrand } = await locals.supabase.from("brands").select("id").eq("id", id).single();

    if (!existingBrand) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Marka nie została znaleziona",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 3: Sprawdź czy są karmy tej marki
    const { count: foodsCount } = await locals.supabase
      .from("foods")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", id);

    if (foodsCount && foodsCount > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie można usunąć marki - ma przypisane karmy",
          details: `Znaleziono ${foodsCount} karm tej marki`,
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 4: Usuń markę
    const { error } = await locals.supabase.from("brands").delete().eq("id", id);

    if (error) {
      console.error("[API DELETE /brands/:id] Błąd Supabase:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nie udało się usunąć marki",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // KROK 5: Sukces
    return new Response(null, {
      status: 204,
    });
  } catch (err) {
    console.error("[API DELETE /brands/:id] Nieoczekiwany błąd:", JSON.stringify(err, null, 2));
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
