import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import type { Database } from "@/db/database.types";

/**
 * Gets Supabase URL from environment variables
 * Throws descriptive error if not configured
 */
function getSupabaseUrl(): string {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
  if (!url) {
    throw new Error(
      "[Supabase] Brak zmiennej środowiskowej PUBLIC_SUPABASE_URL lub SUPABASE_URL. " +
        "Dodaj ją w Cloudflare Dashboard -> Settings -> Environment variables"
    );
  }
  return url;
}

/**
 * Gets Supabase Anon Key from environment variables
 * Throws descriptive error if not configured
 */
function getSupabaseAnonKey(): string {
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "[Supabase] Brak zmiennej środowiskowej PUBLIC_SUPABASE_ANON_KEY lub SUPABASE_ANON_KEY. " +
        "Dodaj ją w Cloudflare Dashboard -> Settings -> Environment variables"
    );
  }
  return key;
}

/**
 * Creates a Supabase client for server-side use (Astro SSR, middleware, API routes)
 * This client properly manages cookies for session persistence
 */
export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(key: string) {
        return cookies.get(key)?.value;
      },
      set(key: string, value: string, options: CookieOptions) {
        cookies.set(key, value, options);
      },
      remove(key: string, options: CookieOptions) {
        cookies.delete(key, options);
      },
    },
  });
}
