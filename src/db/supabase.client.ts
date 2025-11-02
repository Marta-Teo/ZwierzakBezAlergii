import { createClient, type SupabaseClient as SupabaseClientBase } from "@supabase/supabase-js";

import type { Database } from "../db/database.types.ts";

// Użyj PUBLIC_ prefix dla zmiennych dostępnych w przeglądarce
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Typ SupabaseClient dla projektu - używaj tego zamiast importu z '@supabase/supabase-js'
export type SupabaseClient = SupabaseClientBase<Database>;
