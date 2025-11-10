import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "../lib/supabase/server";

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Utworzenie Supabase client z cookies
  const supabase = createSupabaseServerClient(context.cookies);
  context.locals.supabase = supabase;

  // 2. Sprawdzenie sesji użytkownika (z cookies)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  context.locals.session = session;
  context.locals.user = session?.user ?? null;

  // 3. Ochrona chronionych stron
  const protectedRoutes = ["/dogs", "/favorites"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    context.url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    // Redirect do login z return URL
    const returnUrl = encodeURIComponent(
      context.url.pathname + context.url.search
    );
    return context.redirect(`/login?redirect=${returnUrl}`);
  }

  return next();
});
