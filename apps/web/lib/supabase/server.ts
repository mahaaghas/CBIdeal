import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerConfig } from "@/lib/supabase/config"

export function getSupabaseServerClient() {
  const { url, secretKey } = getSupabaseServerConfig()

  if (!url || !secretKey) {
    throw new Error(
      "Missing Supabase server environment variables. Configure NEXT_PUBLIC_SUPABASE_URL plus SUPABASE_SECRET_KEY, or use the legacy SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY aliases.",
    )
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
