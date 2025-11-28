/// <reference types="astro/client" />

import type { SupabaseClient, Session, User } from "@supabase/supabase-js";
import type { Database } from "./db/database.types.ts";

// Typ dla Cloudflare runtime env
interface CloudflareEnv {
  OPENROUTER_API_KEY?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  PUBLIC_APP_NAME?: string;
  PUBLIC_SITE_URL?: string;
  ASSETS?: unknown;
}

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      session: Session | null;
      user: User | null;
      // Cloudflare runtime dostępny przez locals
      runtime?: {
        env: CloudflareEnv;
      };
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
