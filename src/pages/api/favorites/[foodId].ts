import type { APIRoute } from "astro";

/**
 * DELETE /api/favorites/:foodId
 * Usuwa karmę z ulubionych użytkownika
 */
export const DELETE: APIRoute = async ({ locals, params }) => {
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

  const foodId = parseInt(params.foodId || "0", 10);

  // Walidacja foodId
  if (!foodId || isNaN(foodId)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Nieprawidłowe ID karmy",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Najpierw sprawdź czy rekord istnieje
    const { data: existing } = await locals.supabase
      .from("favorite_foods")
      .select("id")
      .eq("user_id", user.id)
      .eq("food_id", foodId)
      .single();

    if (!existing) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Karma nie jest w ulubionych",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Usuń z ulubionych (RLS policy sprawdzi czy to karma tego użytkownika)
    const { error } = await locals.supabase
      .from("favorite_foods")
      .delete()
      .eq("user_id", user.id)
      .eq("food_id", foodId);

    if (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usunięto z ulubionych",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in DELETE /api/favorites/:foodId:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Nie udało się usunąć karmy z ulubionych",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

