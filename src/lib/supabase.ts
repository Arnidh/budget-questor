
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://puoggocvlysbthkhnuzz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b2dnb2N2bHlzYnRoa2hudXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDg2MjcsImV4cCI6MjA1NTgyNDYyN30.cBZ8EjmSwbXjwjZ_YM8xXY8gII7UE0GEpzMJMRwMz9s";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
