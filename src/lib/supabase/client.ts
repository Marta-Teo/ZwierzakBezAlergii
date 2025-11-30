import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/db/database.types";

/**
 * Gets Supabase URL from meta tag (server-injected) or import.meta.env
 */
function getSupabaseUrl(): string {
  // Try to get from meta tag first (for Cloudflare Workers)
  if (typeof document !== "undefined") {
    const metaUrl = document.querySelector('meta[name="supabase-url"]')?.getAttribute("content");
    if (metaUrl) return metaUrl;
  }
  // Fallback to import.meta.env (for local development)
  return import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || "";
}

/**
 * Gets Supabase Anon Key from meta tag (server-injected) or import.meta.env
 */
function getSupabaseAnonKey(): string {
  // Try to get from meta tag first (for Cloudflare Workers)
  if (typeof document !== "undefined") {
    const metaKey = document.querySelector('meta[name="supabase-anon-key"]')?.getAttribute("content");
    if (metaKey) return metaKey;
  }
  // Fallback to import.meta.env (for local development)
  return import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "";
}

/**
 * Creates a Supabase client for browser-side use (React components)
 * This client properly manages cookies for session persistence across SSR
 */
export function createSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "@supabase/ssr: Your project's URL and API key are required to create a Supabase client!\n\n" +
        "Check your Supabase project's API settings to find these values\n\n" +
        "https://supabase.com/dashboard/project/_/settings/api"
    );
  }

  return createBrowserClient<Database>(url, key);
}

// Lazy singleton - created on first access
let _supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
  get(target, prop) {
    if (!_supabaseInstance) {
      _supabaseInstance = createSupabaseBrowserClient();
    }
    return Reflect.get(_supabaseInstance, prop);
  },
});
