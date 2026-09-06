import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { logger } from "../logger";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      supabaseClient = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      return supabaseClient;
    } catch (err) {
      logger.error("Failed to initialize Supabase client", { error: err instanceof Error ? err.message : String(err) });
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://") &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function safeQuery<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: unknown }>,
  fallbackValue: T
): Promise<{ data: T; source: "supabase" | "fallback"; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: fallbackValue, source: "fallback" };
  }

  try {
    const res = await queryFn(client);
    if (res.error || !res.data) {
      return {
        data: fallbackValue,
        source: "fallback",
        error: res.error ? String(res.error) : "No data returned",
      };
    }
    return { data: res.data, source: "supabase" };
  } catch (err) {
    return {
      data: fallbackValue,
      source: "fallback",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
