import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://bbzogjxmdcjlavtzbfie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiem9nanhtZGNqbGF2dHpiZmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzA5MjUsImV4cCI6MjA0NzQwNjkyNX0.Nf0cHeKHHxIUAQhQgTc1qxh2h0iSq5fD-93Fb6i9Ipg';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
