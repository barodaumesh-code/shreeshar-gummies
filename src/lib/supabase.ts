import { createClient } from '@supabase/supabase-js';

// --- PUBLIC (browser) CLIENT ---
// Uses the anon key. Subject to RLS. Safe to ship to the browser.
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// --- ADMIN (server-only) CLIENT ---
// Uses the service-role key. BYPASSES RLS. NEVER expose to the browser.
// Only import this from files under `src/app/api/**` or server components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
