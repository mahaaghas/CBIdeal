import { createHash, randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

function readRequiredEnv(name, fallback) {
  const value = process.env[name] || (fallback ? process.env[fallback] : "")
  if (!value || !value.trim()) {
    throw new Error(`Missing ${name}${fallback ? ` or ${fallback}` : ""}.`)
  }
  return value.trim()
}

function hashPassword(value) {
  return createHash("sha256").update(value).digest("hex")
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function createPrefixedId(prefix) {
  return `${prefix}-${randomUUID().replace(/-/g, "").slice(0, 12)}`
}

async function main() {
  const email = (process.argv[2] || "mha.aghaa@gmail.com").trim().toLowerCase()
  const password = process.argv[3] || process.env.INTERNAL_TEST_ACCOUNT_PASSWORD
  const fullName = process.argv[4] || "Mha Aghaa"
  const companyName = process.argv[5] || "CBI Deal Internal QA"

  if (!password) {
    throw new Error("Provide a password as the second argument or set INTERNAL_TEST_ACCOUNT_PASSWORD.")
  }

  const url = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL")
  const secretKey = readRequiredEnv("SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY")
  const supabase = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: existing, error: lookupError } = await supabase
    .from("workspace_signups")
    .select("*")
    .ilike("owner_email", email)
    .limit(1)
    .maybeSingle()

  if (lookupError) {
    throw new Error(`Lookup failed: ${lookupError.message}`)
  }

  const now = new Date().toISOString()
  const payload = {
    tenant_id: existing?.tenant_id ?? createPrefixedId("tenant"),
    user_id: existing?.user_id ?? createPrefixedId("usr"),
    company_name: companyName,
    company_slug: slugify(companyName) || createPrefixedId("firm"),
    plan_id: "business",
    owner_full_name: fullName,
    owner_email: email,
    password_hash: hashPassword(password),
    subscription_status: "Active",
    payment_status: "Paid",
    access_role: "internal_admin",
    internal_access: true,
    billing_bypass: true,
    feature_scope: "full_access",
    stripe_checkout_completed_at: now,
    activated_at: now,
  }

  const query = existing
    ? supabase.from("workspace_signups").update(payload).eq("tenant_id", existing.tenant_id)
    : supabase.from("workspace_signups").insert(payload)

  const { data, error } = await query.select("tenant_id,user_id,owner_email,company_name,plan_id,access_role,internal_access,billing_bypass,feature_scope").single()

  if (error) {
    throw new Error(`Provisioning failed: ${error.message}`)
  }

  console.log(JSON.stringify({ ok: true, account: data, password }, null, 2))
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }, null, 2))
  process.exit(1)
})
