import type { APIRoute } from "astro";
import type { FavoritesResponse, FavoriteIdsResponse } from "../../types";

/**
 * GET /api/favorites
 * Pobiera listę ulubionych karm użytkownika
 * 
 * Query params:
 * - idsOnly (boolean) - jeśli true, zwraca tylko tablicę ID karm
 */
export const GET: APIRoute = async ({ locals, url }) => {
  const user = locals.user;

  // Sprawdzenie czy użytkownik jest zalogowany
  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Musisz być zalogowany",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const idsOnly = url.searchParams.get("idsOnly") === "true";

  try {
    if (idsOnly) {
      // Tylko ID karm (dla widoku /foods)
      const { data, error } = await locals.supabase
        .from("favorite_foods")
        .select("food_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching favorite IDs:", error);
        throw error;
      }

      const ids = data.map((f) => f.food_id);
      
      const response: FavoriteIdsResponse = {
        success: true,
        data: ids,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Pełne dane karm z JOIN
      const { data, error } = await locals.supabase
        .from("favorite_foods")
        .select(
          `
          food_id,
          foods (
            id,
            name,
            brand_id,
            image_url,
            size_type_id,
            age_category_id,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching favorites:", error);
        throw error;
      }

      // Pobierz nazwy marek dla wszystkich karm
      const foodIds = data.map((f: any) => f.foods.id);
      const brandIds = data.map((f: any) => f.foods.brand_id).filter(Boolean);

      let brandsMap: Record<number, string> = {};
      if (brandIds.length > 0) {
        const { data: brands } = await locals.supabase
          .from("brands")
          .select("id, name")
          .in("id", brandIds);

        if (brands) {
          brandsMap = brands.reduce(
            (acc, brand) => {
              acc[brand.id] = brand.name;
              return acc;
            },
            {} as Record<number, string>
          );
        }
      }

      // Mapowanie do FoodListItem
      const foods = data.map((f: any) => ({
        ...f.foods,
        brandName: brandsMap[f.foods.brand_id] || "Nieznana marka",
        isFavorite: true,
      }));

      const response: FavoritesResponse = {
        success: true,
        data: foods,
        count: foods.length,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in GET /api/favorites:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Nie udało się pobrać ulubionych karm",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * POST /api/favorites
 * Dodaje karmę do ulubionych
 * 
 * Body:
 * {
 *   "foodId": number
 * }
 */
export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user;

  // Sprawdzenie czy użytkownik jest zalogowany
  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Musisz być zalogowany",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { foodId } = body;

    // Walidacja foodId
    if (!foodId || typeof foodId !== "number") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowe ID karmy",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sprawdź czy karma istnieje
    const { data: food } = await locals.supabase
      .from("foods")
      .select("id")
      .eq("id", foodId)
      .single();

    if (!food) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Karma nie istnieje",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Dodaj do ulubionych (RLS policy + UNIQUE constraint sprawdzą duplikaty)
    const { error } = await locals.supabase
      .from("favorite_foods")
      .insert({ user_id: user.id, food_id: foodId });

    if (error) {
      // Duplicate key error (23505)
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Karma jest już w ulubionych",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Dodano do ulubionych",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Nie udało się dodać karmy do ulubionych",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

