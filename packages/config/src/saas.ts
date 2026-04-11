import { buildSaasAppUrl, saasAppUrl } from "./app-url"

export type SaasPlanId = "solo" | "team" | "business" | "enterprise"
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
  enterprisePath: "https://www.cbideal.nl/contact?intent=enterprise-platform",
  requestDemoPath: "https://www.cbideal.nl/demo#demo-form",
} as const

export const saasPlans: SaasPlanDefinition[] = [
  {
    id: "solo",
    name: "Solo",
    monthlyPrice: 49,
    yearlyPrice: 49,
    description: "For individual operators.",
    ctaLabel: "Start Solo",
    secondaryLabel: "View Demo",
    billingMode: "self-serve",
    internalSeatLimit: 1,
    clientAccountLimit: 5,
    features: [
      "Structured workspace for a focused advisory desk",
      "Core document, quotation, and payment workflow",
      "Professional client portal access",
      "Clear case handling without excess complexity",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthlyPrice: 119,
    yearlyPrice: 119,
    description: "For small teams.",
    ctaLabel: "Start Team",
    secondaryLabel: "View Demo",
    billingMode: "self-serve",
    internalSeatLimit: 3,
    clientAccountLimit: 20,
    features: [
      "Shared workspace for coordinated team delivery",
      "Multi-client workflow visibility and reminders",
      "Internal collaboration across cases and operators",
      "Branded client-facing experience",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 199,
    yearlyPrice: 199,
    description: "For growing firms.",
    ctaLabel: "Start Business",
    secondaryLabel: "View Demo",
    billingMode: "self-serve",
    internalSeatLimit: 8,
    clientAccountLimit: 60,
    features: [
      "Scalable client management across active matters",
      "Broader collaboration and operational oversight",
      "Higher workspace capacity for growing firms",
      "Priority onboarding guidance for rollout",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Flexible number of users.",
    ctaLabel: "Contact us",
    secondaryLabel: "Request Demo",
    billingMode: "sales-led",
    internalSeatLimit: null,
    clientAccountLimit: null,
    features: [
      "Tailored workflow design and operating structure",
      "Integration planning for larger teams",
      "Dedicated support and implementation guidance",
      "Custom access, governance, and rollout scope",
    ],
  },
] as const

export const demoWorkspaceConfig = {
  workspaceId: "demo-shared-workspace",
  workspaceName: "CBI Deal Demo",
  companyName: "CBI Deal Demonstration",
  planId: "business" as const,
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
  return planId === "solo" || planId === "team" || planId === "business"
}

export function formatPlanAmount(plan: SaasPlanDefinition, billingCycle: "monthly" | "yearly" = "monthly") {
  const amount = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
  if (amount == null) return "Custom"
  return `$${amount}`
}

export function getPlanLimits(planId: SaasPlanId) {
  const plan = getSaasPlan(planId)
  return {
    internalSeatLimit: plan.internalSeatLimit,
    clientAccountLimit: plan.clientAccountLimit,
  }
}
