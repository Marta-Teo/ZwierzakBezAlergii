import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/db/database.types";

/**
 * Creates a Supabase client for browser-side use (React components)
 * This client properly manages cookies for session persistence across SSR
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
}

// Export a singleton instance for convenience
export const supabase = createSupabaseBrowserClient();

