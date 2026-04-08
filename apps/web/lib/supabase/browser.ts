"use client"

import { createClient } from "@supabase/supabase-js"
import { getSupabaseBrowserConfig } from "@/lib/supabase/config"

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient
  }

  const { url, publishableKey } = getSupabaseBrowserConfig()
  if (!url || !publishableKey) {
    return null
  }

  browserClient = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return browserClient
}
