import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = typeof window === 'undefined'
    ? createServerClient(supabaseUrl, supabaseAnonKey) // for SSR
    : createBrowserClient(supabaseUrl, supabaseAnonKey); // for client-side
