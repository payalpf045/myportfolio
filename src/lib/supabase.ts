
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const supabaseUrl = "https://ydhesvqbtgxqzbsellxy.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaGVzdnFidGd4cXpic2VsbHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMzU2NzEsImV4cCI6MjA3NDYxMTY3MX0.fQDaryfyoNYozAOBMkuZFX6AVutVb_ZfGd5Q4D6ehBk"

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is not defined in environment variables.');
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
}
