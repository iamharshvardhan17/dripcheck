import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edhyaeulpflazycfgpdq.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_3cTKC6sjiBz8VwjmO_i58g_4gPwOcCM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
