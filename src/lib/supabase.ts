import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only client using the service role key — bypasses RLS.
 * Never import this from a "use client" component.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase não está configurado: define SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local"
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return cached;
}
