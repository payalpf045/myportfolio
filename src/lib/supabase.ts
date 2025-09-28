import { createClient } from '@supabase/supabase-js'

// Re-usable singleton client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function createSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is not defined in environment variables.');
  }
  
  supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabaseClient;
}
