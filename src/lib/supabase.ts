
import { createClient } from "@supabase/supabase-js";

// Get the Supabase URL and anon key from the window object where Lovable injects them
declare global {
  interface Window {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
  }
}

const supabaseUrl = window.SUPABASE_URL;
const supabaseAnonKey = window.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables - please make sure you've connected your project to Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
