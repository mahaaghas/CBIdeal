"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getSaasPlan, isSelfServePlan, saasAppConfig, type SaasPlanId, type SelfServePlanId } from "@cbideal/config"
import {
  buildDefaultBrandingSeed,
  buildScopedStorageKey,
  createEmptyPlatformState,
  createId,
  createSignupRecord,
  createTenantRecord,
  DEMO_SCOPE_KEY,
  INTERNAL_SCOPE_KEY,
  PLATFORM_STORAGE_KEY,
  type PlatformSessionMode,
  type PlatformSignupRecord,
  type PlatformState,
  type PlatformTenantRecord,
  type PlatformUserRecord,
} from "@/lib/platform-access"

type RegistrationInput = {
  fullName: string
  email: string
  password: string
  companyName: string
  planId: SelfServePlanId
}

type PlatformAccessContextValue = {
  ready: boolean
  state: PlatformState
  mode: PlatformSessionMode
  storageScope: string
  currentTenant: PlatformTenantRecord | null
  currentUser: PlatformUserRecord | null
  getInternalSignupRecords: () => PlatformSignupRecord[]
  startDemoSession: () => void
  signOut: () => void
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  registerWorkspace: (input: RegistrationInput) => Promise<{ ok: boolean; tenantId?: string; error?: string }>
  activateSubscription: (tenantId: string, data?: { checkoutSessionId?: string | null; customerId?: string | null; subscriptionId?: string | null }) => void
  markCheckoutPending: (tenantId: string, checkoutSessionId?: string | null) => void
  markPaymentFailed: (tenantId: string) => void
  updateTenantBrandingSeed: (tenantId: string, patch: Partial<PlatformTenantRecord["branding"]>) => void
}

const PlatformAccessContext = createContext<PlatformAccessContextValue | null>(null)

async function hashPassword(value: string) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  return Array.from(new Uint8Array(digest))
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("")
}

function usePlatformState() {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<PlatformState>(createEmptyPlatformState)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(PLATFORM_STORAGE_KEY)
    if (!raw) {
      setReady(true)
      return
    }

    try {
      setState(JSON.parse(raw) as PlatformState)
    } catch {
      window.localStorage.removeItem(PLATFORM_STORAGE_KEY)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready || typeof window === "undefined") return
    window.localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(state))
  }, [ready, state])

  return { ready, state, setState }
}

export function PlatformAccessProvider({ children }: { children: ReactNode }) {
  const { ready, state, setState } = usePlatformState()

  const value = useMemo<PlatformAccessContextValue>(() => {
    const currentTenant =
      state.session.tenantId ? state.tenants.find((tenant) => tenant.id === state.session.tenantId) ?? null : null
    const currentUser =
      state.session.userId ? state.users.find((user) => user.id === state.session.userId) ?? null : null
    const storageScope =
      state.session.mode === "demo"
        ? DEMO_SCOPE_KEY
        : state.session.mode === "workspace" && currentTenant
          ? currentTenant.id
          : INTERNAL_SCOPE_KEY

    const getInternalSignupRecords = () =>
      [...state.signups].sort((left, right) => right.signupDate.localeCompare(left.signupDate))

    const startDemoSession = () => {
      setState((current) => ({
        ...current,
        session: {
          mode: "demo",
          tenantId: null,
          userId: null,
          startedAt: new Date().toISOString(),
        },
      }))
    }

    const signOut = () => {
      setState((current) => ({
        ...current,
        session: {
          mode: "guest",
          tenantId: null,
          userId: null,
          startedAt: null,
        },
      }))
    }

    const login = async (email: string, password: string) => {
      const emailAddress = email.trim().toLowerCase()
      const matchingUser = state.users.find((user) => user.email.toLowerCase() === emailAddress)
      if (!matchingUser) {
        return { ok: false, error: "No account was found for that email address." }
      }

      const passwordHash = await hashPassword(password)
      if (matchingUser.passwordHash !== passwordHash) {
        return { ok: false, error: "The password did not match this account." }
      }

      setState((current) => ({
        ...current,
        session: {
          mode: "workspace",
          tenantId: matchingUser.tenantId,
          userId: matchingUser.id,
          startedAt: new Date().toISOString(),
        },
      }))

      return { ok: true }
    }

    const registerWorkspace = async (input: RegistrationInput) => {
      const email = input.email.trim().toLowerCase()
      if (state.users.some((user) => user.email.toLowerCase() === email)) {
        return { ok: false, error: "An account with that email already exists." }
      }

      const fullName = input.fullName.trim()
      const companyName = input.companyName.trim()
      if (!fullName || !companyName) {
        return { ok: false, error: "Please complete the account and company details first." }
      }

      const passwordHash = await hashPassword(input.password)
      const user: PlatformUserRecord = {
        id: createId("usr"),
        tenantId: "",
        fullName,
        email,
        passwordHash,
        role: "Workspace owner",
        createdAt: new Date().toISOString(),
      }

      const tenant = createTenantRecord({
        companyName,
        planId: input.planId,
        ownerUserId: user.id,
      })
      user.tenantId = tenant.id

      const signup = createSignupRecord({
        tenantId: tenant.id,
        companyName,
        planId: input.planId,
        userEmail: email,
        userName: fullName,
      })

      setState((current) => ({
        ...current,
        users: [...current.users, user],
        tenants: [...current.tenants, tenant],
        signups: [...current.signups, signup],
        session: {
          mode: "workspace",
          tenantId: tenant.id,
          userId: user.id,
          startedAt: new Date().toISOString(),
        },
      }))

      return { ok: true, tenantId: tenant.id }
    }

    const activateSubscription = (
      tenantId: string,
      data?: { checkoutSessionId?: string | null; customerId?: string | null; subscriptionId?: string | null },
    ) => {
      setState((current) => ({
        ...current,
        tenants: current.tenants.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                subscriptionStatus: "Active",
                paymentStatus: "Paid",
                activatedAt: new Date().toISOString(),
                stripeCheckoutSessionId: data?.checkoutSessionId ?? tenant.stripeCheckoutSessionId,
                stripeCustomerId: data?.customerId ?? tenant.stripeCustomerId,
                stripeSubscriptionId: data?.subscriptionId ?? tenant.stripeSubscriptionId,
              }
            : tenant,
        ),
        signups: current.signups.map((signup) =>
          signup.tenantId === tenantId
            ? {
                ...signup,
                paymentStatus: "Paid",
                subscriptionStatus: "Active",
              }
            : signup,
        ),
      }))
    }

    const markCheckoutPending = (tenantId: string, checkoutSessionId?: string | null) => {
      setState((current) => ({
        ...current,
        tenants: current.tenants.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                subscriptionStatus: "Pending",
                paymentStatus: "Pending",
                stripeCheckoutSessionId: checkoutSessionId ?? tenant.stripeCheckoutSessionId,
              }
            : tenant,
        ),
      }))
    }

    const markPaymentFailed = (tenantId: string) => {
      setState((current) => ({
        ...current,
        tenants: current.tenants.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                paymentStatus: "Failed",
                subscriptionStatus: "Pending",
              }
            : tenant,
        ),
        signups: current.signups.map((signup) =>
          signup.tenantId === tenantId
            ? {
                ...signup,
                paymentStatus: "Failed",
                subscriptionStatus: "Pending",
              }
            : signup,
        ),
      }))
    }

    const updateTenantBrandingSeed = (tenantId: string, patch: Partial<PlatformTenantRecord["branding"]>) => {
      setState((current) => ({
        ...current,
        tenants: current.tenants.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                branding: {
                  ...tenant.branding,
                  ...patch,
                  companyName: patch.companyName ?? tenant.branding.companyName,
                  senderDisplayName:
                    patch.senderDisplayName ?? patch.companyName ?? tenant.branding.senderDisplayName,
                },
              }
            : tenant,
        ),
      }))
    }

    return {
      ready,
      state,
      mode: state.session.mode,
      storageScope,
      currentTenant,
      currentUser,
      getInternalSignupRecords,
      startDemoSession,
      signOut,
      login,
      registerWorkspace,
      activateSubscription,
      markCheckoutPending,
      markPaymentFailed,
      updateTenantBrandingSeed,
    }
  }, [ready, setState, state])

  return <PlatformAccessContext.Provider value={value}>{children}</PlatformAccessContext.Provider>
}

export function usePlatformAccess() {
  const context = useContext(PlatformAccessContext)
  if (!context) {
    throw new Error("usePlatformAccess must be used within PlatformAccessProvider")
  }

  return context
}

export function getSelfServeCheckoutUrl(planId: SelfServePlanId, tenantId: string) {
  const plan = getSaasPlan(planId)
  const params = new URLSearchParams({
    tenant: tenantId,
    plan: plan.id,
  })
  return `/signup/checkout?${params.toString()}`
}

export function getEnterpriseContactUrl() {
  return saasAppConfig.enterprisePath
}
