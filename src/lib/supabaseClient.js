import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // If env vars are missing, we still create a client but it won't work perfectly.
  // This prevents crashes in the component tree until configured.
  console.warn('Supabase URL or Key missing in environment variables.');
}

export const supabase = createClient(SUPABASE_URL || 'https://example.supabase.co', SUPABASE_ANON_KEY || 'example');
