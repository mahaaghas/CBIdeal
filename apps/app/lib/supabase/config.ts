export function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    null

  return {
    url,
    publishableKey,
  }
}

export function getSupabaseServerConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || null
  const secretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || null

  return {
    url,
    secretKey,
  }
}

export function hasSupabaseBrowserConfig() {
  const config = getSupabaseBrowserConfig()
  return Boolean(config.url && config.publishableKey)
}

export function hasSupabaseServerConfig() {
  const config = getSupabaseServerConfig()
  return Boolean(config.url && config.secretKey)
}
