import { createClient } from '@supabase/supabase-js';

// 🟢 CLIENT-SIDE CONFIGURATION
// These are safe to expose to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🔴 SERVER-SIDE SECRETS
// These are only available on the server-side
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Environment validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase environment variables not found. Please set up your .env.local file.'
  );
  console.warn(
    '📋 Copy .env.example to .env.local and add your Supabase credentials.'
  );
  console.warn(
    '🔗 Get credentials from: https://supabase.com/dashboard → Settings → API'
  );
}

// Create a mock client for development if credentials are missing
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockClient =
  isDevelopment &&
  (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id'));

// 🟢 CLIENT-SIDE SUPABASE CLIENT
// This uses the anon key and is safe for browser use
export const supabase = useMockClient
  ? createClient('https://mock.supabase.co', 'mock-key')
  : createClient(supabaseUrl, supabaseAnonKey);

// 🔴 SERVER-SIDE SUPABASE CLIENT (Admin)
// This uses the service role key and should ONLY be used on the server
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// 🛡️ SECURITY HELPER
// Use this to ensure admin operations are only done server-side
export const getServerSideSupabase = () => {
  if (typeof window !== 'undefined') {
    throw new Error(
      '🚨 Admin Supabase client should only be used server-side!'
    );
  }

  if (!supabaseAdmin) {
    throw new Error(
      '🚨 Supabase service role key not configured. Check your .env.local file.'
    );
  }

  return supabaseAdmin;
};

// Database types
export interface Profile {
  id: string;
  role: 'child' | 'parent';
  name?: string;
  age?: number;
  interests?: string;
  created_at?: string;
  updated_at?: string;
}
