import { createHash, randomUUID } from "node:crypto"
import type Stripe from "stripe"
import { getPlanLimits, isSelfServePlan, type PaymentStatus, type SelfServePlanId, type SubscriptionStatus } from "@cbideal/config"
import {
  buildDefaultBrandingSeed,
  hasWorkspaceAccess,
  slugify,
  type PlatformSignupRecord,
  type PlatformTenantRecord,
  type PlatformUserRecord,
} from "@/lib/platform-access"
import { hasSupabaseServerConfig } from "@/lib/supabase/config"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const workspaceSignupsTable = "workspace_signups"

type WorkspaceSignupRow = {
  id: string
  tenant_id: string
  user_id: string
  company_name: string
  company_slug: string
  plan_id: SelfServePlanId
  owner_full_name: string
  owner_email: string
  password_hash: string
  subscription_status: SubscriptionStatus
  payment_status: PaymentStatus
  stripe_checkout_session_id: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  stripe_live_mode: boolean | null
  stripe_checkout_completed_at: string | null
  access_role: "workspace_owner" | "internal_admin" | "super_admin"
  internal_access: boolean
  billing_bypass: boolean
  feature_scope: "standard" | "full_access"
  activated_at: string | null
  created_at: string
  updated_at: string
}

type WorkspaceStatusPayload = {
  tenant: PlatformTenantRecord
  user: PlatformUserRecord
  signup: PlatformSignupRecord
}

type CreateWorkspaceSignupInput = {
  fullName: string
  email: string
  password: string
  companyName: string
  planId: SelfServePlanId
}

type ActivateWorkspaceInput = {
  tenantId?: string | null
  checkoutSessionId?: string | null
  customerId?: string | null
  subscriptionId?: string | null
  priceId?: string | null
  subscriptionStatus?: Stripe.Subscription.Status | null
  liveMode?: boolean | null
  paidAt?: string | null
}

export type BillingRuntimeDiagnostics = {
  stripeSecretKeyPresent: boolean
  stripePublishableKeyPresent: boolean
  stripeWebhookSecretPresent: boolean
  stripeSoloPricePresent: boolean
  stripeTeamPricePresent: boolean
  stripeBusinessPricePresent: boolean
  supabaseConfigured: boolean
  appUrlPresent: boolean
  productionMode: boolean
  issues: string[]
  blockingIssues: string[]
  warningIssues: string[]
}

type InternalWorkspaceAccessInput = {
  email: string
  fullName: string
  password: string
  companyName: string
}

function createPrefixedId(prefix: string) {
  return `${prefix}-${randomUUID().replace(/-/g, "").slice(0, 12)}`
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function hashWorkspacePassword(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function isLiveStripeKey(key: string | undefined | null, livePrefix: string, testPrefix: string) {
  if (!key) return false
  if (key.startsWith(livePrefix)) return true
  if (key.startsWith(testPrefix)) return false
  return false
}

function requiresLiveStripeConfiguration() {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
}

export function getStripePriceIdForPlan(planId: SelfServePlanId) {
  if (planId === "solo") return process.env.STRIPE_PRICE_ID_SOLO?.trim() || null
  if (planId === "team") return process.env.STRIPE_PRICE_ID_TEAM?.trim() || null
  return process.env.STRIPE_PRICE_ID_BUSINESS?.trim() || null
}

export function getSelfServeSeatCount(planId: SelfServePlanId) {
  const limits = getPlanLimits(planId)
  return limits.internalSeatLimit ?? 0
}

export function getPlanIdFromStripePriceId(priceId?: string | null): SelfServePlanId | null {
  const normalizedPriceId = priceId?.trim()
  if (!normalizedPriceId) return null

  if (normalizedPriceId === process.env.STRIPE_PRICE_ID_SOLO?.trim()) return "solo"
  if (normalizedPriceId === process.env.STRIPE_PRICE_ID_TEAM?.trim()) return "team"
  if (normalizedPriceId === process.env.STRIPE_PRICE_ID_BUSINESS?.trim()) return "business"

  return null
}

function getWorkspaceStatusesForSubscription(
  subscriptionStatus?: Stripe.Subscription.Status | null,
): Pick<WorkspaceSignupRow, "subscription_status" | "payment_status"> | null {
  switch (subscriptionStatus) {
    case "active":
    case "trialing":
      return {
        subscription_status: "Active",
        payment_status: "Paid",
      }
    case "past_due":
    case "unpaid":
      return {
        subscription_status: "Past due",
        payment_status: "Failed",
      }
    case "canceled":
    case "incomplete_expired":
      return {
        subscription_status: "Cancelled",
        payment_status: "Failed",
      }
    case "incomplete":
      return {
        subscription_status: "Pending",
        payment_status: "Pending",
      }
    case "paused":
      return {
        subscription_status: "Past due",
        payment_status: "Pending",
      }
    default:
      return null
  }
}

export function getStripeBillingConfigIssues() {
  const issues: string[] = []
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

  if (!secretKey) issues.push("Missing STRIPE_SECRET_KEY.")
  if (!publishableKey) issues.push("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.")
  if (!webhookSecret) issues.push("Missing STRIPE_WEBHOOK_SECRET.")
  if (!appUrl) issues.push("Missing NEXT_PUBLIC_APP_URL.")
  if (!process.env.STRIPE_PRICE_ID_SOLO?.trim()) issues.push("Missing STRIPE_PRICE_ID_SOLO.")
  if (!process.env.STRIPE_PRICE_ID_TEAM?.trim()) issues.push("Missing STRIPE_PRICE_ID_TEAM.")
  if (!process.env.STRIPE_PRICE_ID_BUSINESS?.trim()) issues.push("Missing STRIPE_PRICE_ID_BUSINESS.")

  const requiresLiveKeys = requiresLiveStripeConfiguration()
  if (requiresLiveKeys && secretKey && !isLiveStripeKey(secretKey, "sk_live_", "sk_test_")) {
    issues.push("STRIPE_SECRET_KEY must be a live key in production.")
  }
  if (requiresLiveKeys && publishableKey && !isLiveStripeKey(publishableKey, "pk_live_", "pk_test_")) {
    issues.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a live key in production.")
  }

  return issues
}

export function getStripeBillingBlockingIssues() {
  const blockingIssues: string[] = []

  if (!process.env.STRIPE_SECRET_KEY?.trim()) blockingIssues.push("Missing STRIPE_SECRET_KEY.")
  if (!process.env.NEXT_PUBLIC_APP_URL?.trim()) blockingIssues.push("Missing NEXT_PUBLIC_APP_URL.")
  if (!process.env.STRIPE_PRICE_ID_SOLO?.trim()) blockingIssues.push("Missing STRIPE_PRICE_ID_SOLO.")
  if (!process.env.STRIPE_PRICE_ID_TEAM?.trim()) blockingIssues.push("Missing STRIPE_PRICE_ID_TEAM.")
  if (!process.env.STRIPE_PRICE_ID_BUSINESS?.trim()) blockingIssues.push("Missing STRIPE_PRICE_ID_BUSINESS.")

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  if (requiresLiveStripeConfiguration() && secretKey && !isLiveStripeKey(secretKey, "sk_live_", "sk_test_")) {
    blockingIssues.push("STRIPE_SECRET_KEY must be a live key in production.")
  }

  return blockingIssues
}

export function isStripeBillingConfigured() {
  return getStripeBillingBlockingIssues().length === 0
}

export function getBillingRuntimeDiagnostics(): BillingRuntimeDiagnostics {
  const issues = getStripeBillingConfigIssues()
  const blockingIssues = getStripeBillingBlockingIssues()
  const warningIssues = issues.filter((issue) => !blockingIssues.includes(issue))
  return {
    stripeSecretKeyPresent: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    stripePublishableKeyPresent: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()),
    stripeWebhookSecretPresent: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    stripeSoloPricePresent: Boolean(process.env.STRIPE_PRICE_ID_SOLO?.trim()),
    stripeTeamPricePresent: Boolean(process.env.STRIPE_PRICE_ID_TEAM?.trim()),
    stripeBusinessPricePresent: Boolean(process.env.STRIPE_PRICE_ID_BUSINESS?.trim()),
    supabaseConfigured: hasSupabaseServerConfig(),
    appUrlPresent: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    productionMode: requiresLiveStripeConfiguration(),
    issues,
    blockingIssues,
    warningIssues,
  }
}

export function logBillingRuntimeState(context: string) {
  const diagnostics = getBillingRuntimeDiagnostics()
  console.info(`[billing.runtime] ${context}`, diagnostics)
  return diagnostics
}

function requireSupabaseServerClient() {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error(
      "Supabase server credentials are missing. Workspace billing is blocked until NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured. Legacy SUPABASE_URL and SUPABASE_SECRET_KEY aliases are still supported during migration.",
    )
  }

  return supabase
}

function toWorkspaceStatusPayload(row: WorkspaceSignupRow): WorkspaceStatusPayload {
  const limits = getPlanLimits(row.plan_id)
  return {
    tenant: {
      id: row.tenant_id,
      slug: row.company_slug,
      companyName: row.company_name,
      planId: row.plan_id,
      subscriptionStatus: row.subscription_status,
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
      activatedAt: row.activated_at,
      ownerUserId: row.user_id,
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      stripeCheckoutSessionId: row.stripe_checkout_session_id,
      internalSeatLimit: limits.internalSeatLimit,
      clientAccountLimit: limits.clientAccountLimit,
      internalSeatCount: 1,
      clientAccountCount: 0,
      internalAccess: row.internal_access,
      billingBypass: row.billing_bypass,
      featureScope: row.feature_scope,
      branding: buildDefaultBrandingSeed(row.company_name),
    },
    user: {
      id: row.user_id,
      tenantId: row.tenant_id,
      fullName: row.owner_full_name,
      email: row.owner_email,
      passwordHash: "",
      role:
        row.access_role === "super_admin"
          ? "Super admin"
          : row.access_role === "internal_admin"
            ? "Internal admin"
            : "Workspace owner",
      createdAt: row.created_at,
    },
    signup: {
      id: row.id,
      tenantId: row.tenant_id,
      companyName: row.company_name,
      planId: row.plan_id,
      userEmail: row.owner_email,
      userName: row.owner_full_name,
      signupDate: row.created_at,
      paymentStatus: row.payment_status,
      source: "Self-serve",
      subscriptionStatus: row.subscription_status,
    },
  }
}

async function getWorkspaceSignupRowByTenantId(tenantId: string) {
  const supabase = requireSupabaseServerClient()
  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load workspace billing record: ${error.message}`)
  }

  return (data as WorkspaceSignupRow | null) ?? null
}

async function getWorkspaceSignupRowByEmail(email: string) {
  const supabase = requireSupabaseServerClient()
  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .select("*")
    .ilike("owner_email", normalizeEmail(email))
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load workspace credentials: ${error.message}`)
  }

  return (data as WorkspaceSignupRow | null) ?? null
}

async function getWorkspaceSignupRowByStripeReference(input: ActivateWorkspaceInput) {
  const supabase = requireSupabaseServerClient()

  if (input.tenantId) {
    return getWorkspaceSignupRowByTenantId(input.tenantId)
  }

  if (input.subscriptionId) {
    const { data, error } = await supabase
      .from(workspaceSignupsTable)
      .select("*")
      .eq("stripe_subscription_id", input.subscriptionId)
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to load subscription billing record: ${error.message}`)
    }

    if (data) return data as WorkspaceSignupRow
  }

  if (input.customerId) {
    const { data, error } = await supabase
      .from(workspaceSignupsTable)
      .select("*")
      .eq("stripe_customer_id", input.customerId)
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to load customer billing record: ${error.message}`)
    }

    if (data) return data as WorkspaceSignupRow
  }

  if (input.checkoutSessionId) {
    const { data, error } = await supabase
      .from(workspaceSignupsTable)
      .select("*")
      .eq("stripe_checkout_session_id", input.checkoutSessionId)
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to load checkout billing record: ${error.message}`)
    }

    return (data as WorkspaceSignupRow | null) ?? null
  }

  return null
}

export async function createWorkspaceSignup(input: CreateWorkspaceSignupInput) {
  const supabase = requireSupabaseServerClient()
  const email = normalizeEmail(input.email)
  const companyName = input.companyName.trim()
  const fullName = input.fullName.trim()

  if (!fullName || !companyName) {
    throw new Error("Please complete the account and company details first.")
  }
  if (!isSelfServePlan(input.planId)) {
    throw new Error("Only self-serve plans can be created through this flow.")
  }

  const passwordHash = hashWorkspacePassword(input.password)
  const tenantId = createPrefixedId("tenant")
  const userId = createPrefixedId("usr")

  const insertPayload = {
    tenant_id: tenantId,
    user_id: userId,
    company_name: companyName,
    company_slug: slugify(companyName) || createPrefixedId("firm"),
    plan_id: input.planId,
    owner_full_name: fullName,
    owner_email: email,
    password_hash: passwordHash,
    subscription_status: "Pending" as const,
    payment_status: "Pending" as const,
    access_role: "workspace_owner" as const,
    internal_access: false,
    billing_bypass: false,
    feature_scope: "standard" as const,
  }

  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .insert(insertPayload)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("An account with that email already exists.")
    }
    throw new Error(`Unable to create the workspace billing record: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export async function verifyWorkspaceCredentials(email: string, password: string) {
  const row = await getWorkspaceSignupRowByEmail(email)
  if (!row) {
    throw new Error("No account was found for that email address.")
  }

  const passwordHash = hashWorkspacePassword(password)
  if (row.password_hash !== passwordHash) {
    throw new Error("The password did not match this account.")
  }

  return toWorkspaceStatusPayload(row)
}

export async function getWorkspaceStatus(tenantId: string) {
  const row = await getWorkspaceSignupRowByTenantId(tenantId)
  return row ? toWorkspaceStatusPayload(row) : null
}

export async function provisionInternalTestWorkspace(input: InternalWorkspaceAccessInput) {
  const supabase = requireSupabaseServerClient()
  const email = normalizeEmail(input.email)
  const now = new Date().toISOString()
  const passwordHash = hashWorkspacePassword(input.password)
  const existing = await getWorkspaceSignupRowByEmail(email)
  const tenantId = existing?.tenant_id ?? createPrefixedId("tenant")
  const userId = existing?.user_id ?? createPrefixedId("usr")

  const payload = {
    tenant_id: tenantId,
    user_id: userId,
    company_name: input.companyName.trim(),
    company_slug: slugify(input.companyName) || createPrefixedId("firm"),
    plan_id: "business" as const,
    owner_full_name: input.fullName.trim(),
    owner_email: email,
    password_hash: passwordHash,
    subscription_status: "Active" as const,
    payment_status: "Paid" as const,
    access_role: "internal_admin" as const,
    internal_access: true,
    billing_bypass: true,
    feature_scope: "full_access" as const,
    stripe_checkout_completed_at: now,
    activated_at: now,
  }

  const query = existing
    ? supabase.from(workspaceSignupsTable).update(payload).eq("tenant_id", existing.tenant_id)
    : supabase.from(workspaceSignupsTable).insert(payload)

  const { data, error } = await query.select("*").single()

  if (error) {
    throw new Error(`Unable to provision internal test workspace: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export function workspaceRequiresStripe(tenant: PlatformTenantRecord, user: PlatformUserRecord | null | undefined) {
  return !hasWorkspaceAccess(tenant, user)
}

export async function markWorkspaceCheckoutPending(input: {
  tenantId: string
  checkoutSessionId: string
  priceId?: string | null
  liveMode?: boolean | null
}) {
  const supabase = requireSupabaseServerClient()
  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .update({
      payment_status: "Pending",
      subscription_status: "Pending",
      stripe_checkout_session_id: input.checkoutSessionId,
      stripe_price_id: input.priceId ?? null,
      stripe_live_mode: input.liveMode ?? null,
    })
    .eq("tenant_id", input.tenantId)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Unable to store checkout session state: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export async function markWorkspacePaymentFailed(input: ActivateWorkspaceInput) {
  const supabase = requireSupabaseServerClient()
  const row = await getWorkspaceSignupRowByStripeReference(input)
  if (!row) return null

  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .update({
      payment_status: "Failed",
      subscription_status: row.subscription_status === "Cancelled" ? "Cancelled" : "Pending",
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", row.tenant_id)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Unable to record payment failure: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export async function activateWorkspaceSubscription(input: ActivateWorkspaceInput) {
  const supabase = requireSupabaseServerClient()
  const row = await getWorkspaceSignupRowByStripeReference(input)
  if (!row) {
    throw new Error("No workspace billing record matched the Stripe confirmation.")
  }

  const expectedPriceId = getStripePriceIdForPlan(row.plan_id)
  const normalizedPriceId = input.priceId?.trim() || row.stripe_price_id

  if (expectedPriceId && normalizedPriceId && expectedPriceId !== normalizedPriceId) {
    throw new Error(
      `Stripe price ${normalizedPriceId} does not match workspace plan ${row.plan_id}. Expected ${expectedPriceId}.`,
    )
  }

  const derivedPlanId = getPlanIdFromStripePriceId(normalizedPriceId)
  if (normalizedPriceId && !derivedPlanId) {
    throw new Error(`Stripe price ${normalizedPriceId} is not mapped to a configured self-serve plan.`)
  }

  if (derivedPlanId && derivedPlanId !== row.plan_id) {
    throw new Error(`Stripe price ${normalizedPriceId} resolved to ${derivedPlanId}, not ${row.plan_id}.`)
  }

  if (requiresLiveStripeConfiguration() && input.liveMode === false) {
    throw new Error("Stripe live mode is required in production.")
  }

  const activatedAt = input.paidAt ?? new Date().toISOString()
  const statusPatch = getWorkspaceStatusesForSubscription(input.subscriptionStatus)
  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .update({
      payment_status: statusPatch?.payment_status ?? "Paid",
      subscription_status: statusPatch?.subscription_status ?? "Active",
      stripe_checkout_session_id: input.checkoutSessionId ?? row.stripe_checkout_session_id,
      stripe_customer_id: input.customerId ?? row.stripe_customer_id,
      stripe_subscription_id: input.subscriptionId ?? row.stripe_subscription_id,
      stripe_price_id: normalizedPriceId,
      stripe_live_mode: input.liveMode ?? row.stripe_live_mode,
      stripe_checkout_completed_at: activatedAt,
      activated_at:
        (statusPatch?.subscription_status ?? "Active") === "Active" ? activatedAt : row.activated_at ?? activatedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", row.tenant_id)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Unable to activate the workspace subscription: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export async function syncWorkspaceSubscriptionStatus(input: ActivateWorkspaceInput) {
  const supabase = requireSupabaseServerClient()
  const row = await getWorkspaceSignupRowByStripeReference(input)
  if (!row) {
    throw new Error("No workspace billing record matched the Stripe subscription update.")
  }

  if (!input.subscriptionStatus) {
    throw new Error("A Stripe subscription status is required to sync billing state.")
  }

  const normalizedPriceId = input.priceId?.trim() || row.stripe_price_id
  const expectedPriceId = getStripePriceIdForPlan(row.plan_id)
  const derivedPlanId = getPlanIdFromStripePriceId(normalizedPriceId)

  if (expectedPriceId && normalizedPriceId && expectedPriceId !== normalizedPriceId) {
    throw new Error(
      `Stripe price ${normalizedPriceId} does not match workspace plan ${row.plan_id}. Expected ${expectedPriceId}.`,
    )
  }

  if (normalizedPriceId && !derivedPlanId) {
    throw new Error(`Stripe price ${normalizedPriceId} is not mapped to a configured self-serve plan.`)
  }

  if (derivedPlanId && derivedPlanId !== row.plan_id) {
    throw new Error(`Stripe price ${normalizedPriceId} resolved to ${derivedPlanId}, not ${row.plan_id}.`)
  }

  if (requiresLiveStripeConfiguration() && input.liveMode === false) {
    throw new Error("Stripe live mode is required in production.")
  }

  const statusPatch = getWorkspaceStatusesForSubscription(input.subscriptionStatus)
  if (!statusPatch) {
    throw new Error(`Unsupported Stripe subscription status: ${input.subscriptionStatus}.`)
  }

  const { data, error } = await supabase
    .from(workspaceSignupsTable)
    .update({
      subscription_status: statusPatch.subscription_status,
      payment_status: statusPatch.payment_status,
      stripe_customer_id: input.customerId ?? row.stripe_customer_id,
      stripe_subscription_id: input.subscriptionId ?? row.stripe_subscription_id,
      stripe_price_id: normalizedPriceId,
      stripe_live_mode: input.liveMode ?? row.stripe_live_mode,
      activated_at:
        statusPatch.subscription_status === "Active"
          ? input.paidAt ?? row.activated_at ?? new Date().toISOString()
          : row.activated_at,
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", row.tenant_id)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Unable to sync the workspace subscription state: ${error.message}`)
  }

  return toWorkspaceStatusPayload(data as WorkspaceSignupRow)
}

export function getStripeMetadataValue(
  metadata: Stripe.Metadata | null | undefined,
  key: string,
) {
  const value = metadata?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : null
}
