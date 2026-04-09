import { demoWorkspaceConfig, getPlanLimits, type PaymentStatus, type SaasPlanId, type SubscriptionStatus } from "@cbideal/config"

export type PlatformSessionMode = "guest" | "demo" | "workspace"
export type PlatformAccessRole = "Workspace owner" | "Internal admin" | "Super admin"
export type PlatformFeatureScope = "standard" | "full_access"

export interface TenantBrandingSeed {
  companyName: string
  companyLogoUrl: string
  darkLogoUrl: string
  appIconUrl: string
  primaryColor: string
  secondaryColor: string
  surfaceTint: string
  senderDisplayName: string
}

export interface PlatformTenantRecord {
  id: string
  slug: string
  companyName: string
  planId: SaasPlanId
  subscriptionStatus: SubscriptionStatus
  paymentStatus: PaymentStatus
  createdAt: string
  activatedAt: string | null
  ownerUserId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripeCheckoutSessionId: string | null
  internalSeatLimit: number | null
  clientAccountLimit: number | null
  internalSeatCount: number
  clientAccountCount: number
  internalAccess: boolean
  billingBypass: boolean
  featureScope: PlatformFeatureScope
  branding: TenantBrandingSeed
}

export interface PlatformUserRecord {
  id: string
  tenantId: string
  fullName: string
  email: string
  passwordHash: string
  role: PlatformAccessRole
  createdAt: string
}

export interface PlatformSignupRecord {
  id: string
  tenantId: string
  companyName: string
  planId: SaasPlanId
  userEmail: string
  userName: string
  signupDate: string
  paymentStatus: PaymentStatus
  source: "Self-serve" | "Enterprise"
  subscriptionStatus: SubscriptionStatus
}

export interface PlatformSessionRecord {
  mode: PlatformSessionMode
  tenantId: string | null
  userId: string | null
  startedAt: string | null
}

export interface PlatformState {
  session: PlatformSessionRecord
  users: PlatformUserRecord[]
  tenants: PlatformTenantRecord[]
  signups: PlatformSignupRecord[]
}

export const PLATFORM_STORAGE_KEY = "cbideal-platform-state"
export const INTERNAL_SCOPE_KEY = "internal-admin"
export const DEMO_SCOPE_KEY = demoWorkspaceConfig.workspaceId

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function buildScopedStorageKey(baseKey: string, scope: string) {
  return `${baseKey}:${scope}`
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function buildDefaultBrandingSeed(companyName: string): TenantBrandingSeed {
  return {
    companyName,
    companyLogoUrl: "",
    darkLogoUrl: "",
    appIconUrl: "",
    primaryColor: "#5b78a2",
    secondaryColor: "#94a7bf",
    surfaceTint: "#42536d",
    senderDisplayName: companyName,
  }
}

export function createEmptyPlatformState(): PlatformState {
  return {
    session: {
      mode: "guest",
      tenantId: null,
      userId: null,
      startedAt: null,
    },
    users: [],
    tenants: [],
    signups: [],
  }
}

export function createTenantRecord(input: {
  companyName: string
  planId: SaasPlanId
  ownerUserId: string
}): PlatformTenantRecord {
  const limits = getPlanLimits(input.planId)
  const subscriptionStatus: SubscriptionStatus =
    input.planId === "enterprise" ? "Enterprise review" : "Pending"

  return {
    id: createId("tenant"),
    slug: slugify(input.companyName) || createId("firm"),
    companyName: input.companyName,
    planId: input.planId,
    subscriptionStatus,
    paymentStatus: input.planId === "enterprise" ? "Manual review" : "Pending",
    createdAt: new Date().toISOString(),
    activatedAt: null,
    ownerUserId: input.ownerUserId,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCheckoutSessionId: null,
    internalSeatLimit: limits.internalSeatLimit,
    clientAccountLimit: limits.clientAccountLimit,
    internalSeatCount: 1,
    clientAccountCount: 0,
    internalAccess: false,
    billingBypass: false,
    featureScope: "standard",
    branding: buildDefaultBrandingSeed(input.companyName),
  }
}

export function createSignupRecord(input: {
  tenantId: string
  companyName: string
  planId: SaasPlanId
  userEmail: string
  userName: string
}): PlatformSignupRecord {
  return {
    id: createId("signup"),
    tenantId: input.tenantId,
    companyName: input.companyName,
    planId: input.planId,
    userEmail: input.userEmail,
    userName: input.userName,
    signupDate: new Date().toISOString(),
    paymentStatus: input.planId === "enterprise" ? "Manual review" : "Pending",
    source: input.planId === "enterprise" ? "Enterprise" : "Self-serve",
    subscriptionStatus: input.planId === "enterprise" ? "Enterprise review" : "Pending",
  }
}

export function hasInternalAdminRole(user: PlatformUserRecord | null | undefined) {
  return user?.role === "Internal admin" || user?.role === "Super admin"
}

export function hasPaidWorkspaceAccess(tenant: PlatformTenantRecord | null | undefined) {
  return tenant?.subscriptionStatus === "Active" && tenant?.paymentStatus === "Paid"
}

export function hasWorkspaceAccess(
  tenant: PlatformTenantRecord | null | undefined,
  user: PlatformUserRecord | null | undefined,
) {
  if (!tenant) return false
  if (hasPaidWorkspaceAccess(tenant)) return true

  return Boolean(tenant.internalAccess && tenant.billingBypass && hasInternalAdminRole(user))
}

export function hasInternalAreaAccess(
  tenant: PlatformTenantRecord | null | undefined,
  user: PlatformUserRecord | null | undefined,
) {
  return Boolean(tenant?.internalAccess && hasInternalAdminRole(user))
}
