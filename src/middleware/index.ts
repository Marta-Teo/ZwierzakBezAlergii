// Polyfill for MessageChannel (required for React 19 on Cloudflare Workers)
import "../polyfills/message-channel";

import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "../lib/supabase/server";

export const onRequest = defineMiddleware(async (context, next) => {
  // 0. Pomiń middleware dla static assets - nie potrzebują Supabase
  const pathname = context.url.pathname;
  const isStaticAsset =
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/_image") ||
    pathname === "/favicon.png" ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".eot");

  if (isStaticAsset) {
    return next();
  }

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
  const isProtectedRoute = protectedRoutes.some((route) => context.url.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirect do login z return URL
    const returnUrl = encodeURIComponent(context.url.pathname + context.url.search);
    return context.redirect(`/login?redirect=${returnUrl}`);
  }

  return next();
});
