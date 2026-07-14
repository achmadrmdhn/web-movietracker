import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any).env ?? {};
const supabaseUrl = (env.VITE_SUPABASE_URL || env.SUPABASE_URL) as string | undefined;
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY) as string | undefined;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabase ? createClient(supabaseUrl as string, supabaseAnonKey as string) : null;

export default supabase;
