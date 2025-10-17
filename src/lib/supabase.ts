
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const supabaseUrl = "https://ydhesvqbtgxqzbsellxy.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaGVzdnFidGd4cXpic2VsbHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2MjM2ODUsImV4cCI6MjAzNDE5OTY4NX0.n2N7Jq_B6S_y_i4sH_M4z1sT5-7f_x2nLq_M-2f1vYQ"

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is not defined.');
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
}
