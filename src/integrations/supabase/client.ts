
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://puoggocvlysbthkhnuzz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b2dnb2N2bHlzYnRoa2hudXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDg2MjcsImV4cCI6MjA1NTgyNDYyN30.cBZ8EjmSwbXjwjZ_YM8xXY8gII7UE0GEpzMJMRwMz9s";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
