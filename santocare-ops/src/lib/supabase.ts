import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for file storage.
 * Uses the service role key for admin access to the storage bucket.
 * Falls back to anon key for read-only access (not used yet).
 */
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable file uploads."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const DOCUMENTS_BUCKET = "documents";
