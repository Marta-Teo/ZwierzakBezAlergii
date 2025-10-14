import { createClient, type SupabaseClient as SupabaseClientBase } from '@supabase/supabase-js';

import type { Database } from '../db/database.types.ts';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Typ SupabaseClient dla projektu - używaj tego zamiast importu z '@supabase/supabase-js'
export type SupabaseClient = SupabaseClientBase<Database>;

