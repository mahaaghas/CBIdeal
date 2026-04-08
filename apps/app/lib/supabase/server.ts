import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerConfig } from "@/lib/supabase/config"

export function getSupabaseServerClient() {
  const { url, secretKey } = getSupabaseServerConfig()

  if (!url || !secretKey) {
    return null
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
