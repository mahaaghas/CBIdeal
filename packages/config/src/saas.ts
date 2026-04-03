import { buildSaasAppUrl, saasAppUrl } from "./app-url"

export type SaasPlanId = "starter" | "growth" | "enterprise"
export type SelfServePlanId = Exclude<SaasPlanId, "enterprise">
export type SubscriptionStatus = "Pending" | "Active" | "Past due" | "Cancelled" | "Enterprise review"
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Manual review"

export interface SaasPlanDefinition {
  id: SaasPlanId
  name: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  description: string
  ctaLabel: string
  secondaryLabel: string
  billingMode: "self-serve" | "sales-led"
  internalSeatLimit: number | null
  clientAccountLimit: number | null
  features: string[]
}

export const saasAppConfig = {
  websiteUrl: "https://www.cbideal.nl",
  appUrl: saasAppUrl,
  demoPath: "/demo",
  loginPath: "/login",
  signupPath: "/signup",
  billingSuccessPath: "/billing/success",
  billingCancelPath: "/billing/cancel",
  enterprisePath: "https://www.cbideal.nl/for-companies#company-form",
  requestDemoPath: "https://www.cbideal.nl/demo#demo-form",
} as const

export const saasPlans: SaasPlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 189,
    yearlyPrice: 169,
    description: "For smaller advisory teams that want a polished workspace with disciplined client handling from the outset.",
    ctaLabel: "Get Started",
    secondaryLabel: "View Demo",
    billingMode: "self-serve",
    internalSeatLimit: 3,
    clientAccountLimit: 40,
    features: [
      "Up to 3 internal users",
      "Up to 40 client accounts",
      "Branded client portal",
      "Quotations, payments, and document workflow",
      "Email templates and communication history",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 429,
    yearlyPrice: 389,
    description: "For established firms that need broader capacity, stronger coordination, and more room for branded client delivery.",
    ctaLabel: "Get Started",
    secondaryLabel: "View Demo",
    billingMode: "self-serve",
    internalSeatLimit: 10,
    clientAccountLimit: 180,
    features: [
      "Up to 10 internal users",
      "Up to 180 client accounts",
      "Advanced reminder and review workflows",
      "Branding personalisation",
      "Priority onboarding guidance",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "For wider structures that require implementation support, custom limits, and a more tailored operating setup.",
    ctaLabel: "Contact Sales",
    secondaryLabel: "Request Demo",
    billingMode: "sales-led",
    internalSeatLimit: null,
    clientAccountLimit: null,
    features: [
      "Custom seat and client-account structure",
      "Tailored implementation planning",
      "Enterprise billing and rollout support",
      "Priority service design",
      "Manual provisioning and setup",
    ],
  },
] as const

export const demoWorkspaceConfig = {
  workspaceId: "demo-shared-workspace",
  workspaceName: "CBI Deal Demo",
  companyName: "CBI Deal Demonstration",
  planId: "growth" as const,
} as const

export function getSaasDemoUrl() {
  return buildSaasAppUrl(saasAppConfig.demoPath)
}

export function getSaasLoginUrl(planId?: SaasPlanId) {
  const loginUrl = new URL(buildSaasAppUrl(saasAppConfig.loginPath))

  if (planId) {
    loginUrl.searchParams.set("plan", planId)
  }

  return loginUrl.toString()
}

export function getSelfServeSignupUrl(planId: SelfServePlanId) {
  const signupUrl = new URL(buildSaasAppUrl(saasAppConfig.signupPath))
  signupUrl.searchParams.set("plan", planId)
  return signupUrl.toString()
}

export function getSaasPlan(planId: SaasPlanId) {
  return saasPlans.find((plan) => plan.id === planId) ?? saasPlans[0]
}

export function isSelfServePlan(planId: SaasPlanId): planId is SelfServePlanId {
  return planId === "starter" || planId === "growth"
}

export function formatPlanAmount(plan: SaasPlanDefinition, billingCycle: "monthly" | "yearly" = "monthly") {
  const amount = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
  if (amount == null) return "Custom"
  return `EUR ${amount}`
}

export function getPlanLimits(planId: SaasPlanId) {
  const plan = getSaasPlan(planId)
  return {
    internalSeatLimit: plan.internalSeatLimit,
    clientAccountLimit: plan.clientAccountLimit,
  }
}
