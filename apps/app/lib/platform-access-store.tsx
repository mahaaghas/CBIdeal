"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getSaasPlan, isSelfServePlan, saasAppConfig, type SelfServePlanId } from "@cbideal/config"
import {
  createEmptyPlatformState,
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
  login: (email: string, password: string) => Promise<{ ok: boolean; nextPath?: string; error?: string }>
  registerWorkspace: (input: RegistrationInput) => Promise<{ ok: boolean; tenantId?: string; error?: string }>
  syncTenantStatus: (tenantId: string) => Promise<{ ok: boolean; tenant?: PlatformTenantRecord; error?: string }>
  markCheckoutPending: (tenantId: string, checkoutSessionId?: string | null) => void
  markPaymentFailed: (tenantId: string) => void
  updateTenantBrandingSeed: (tenantId: string, patch: Partial<PlatformTenantRecord["branding"]>) => void
}

const PlatformAccessContext = createContext<PlatformAccessContextValue | null>(null)

function upsertRecord<T extends { id: string }>(records: T[], record: T) {
  const existingIndex = records.findIndex((item) => item.id === record.id)
  if (existingIndex === -1) {
    return [...records, record]
  }

  return records.map((item) => (item.id === record.id ? record : item))
}

function upsertSignupRecord(records: PlatformSignupRecord[], record: PlatformSignupRecord) {
  const existingIndex = records.findIndex((item) => item.tenantId === record.tenantId)
  if (existingIndex === -1) {
    return [...records, record]
  }

  return records.map((item) => (item.tenantId === record.tenantId ? record : item))
}

function mergeWorkspacePayload(
  current: PlatformState,
  payload: { tenant: PlatformTenantRecord; user: PlatformUserRecord; signup?: PlatformSignupRecord | null },
) {
  return {
    ...current,
    users: upsertRecord(current.users, payload.user),
    tenants: upsertRecord(current.tenants, payload.tenant),
    signups: payload.signup ? upsertSignupRecord(current.signups, payload.signup) : current.signups,
  }
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

  const syncTenantStatus = useCallback(
    async (tenantId: string) => {
      const response = await fetch(`/api/workspace/status?tenant=${encodeURIComponent(tenantId)}`, {
        method: "GET",
        cache: "no-store",
      })

      const payload = (await response.json()) as {
        tenant?: PlatformTenantRecord
        user?: PlatformUserRecord
        signup?: PlatformSignupRecord
        error?: string
      }

      const tenant = payload.tenant
      const user = payload.user
      if (!response.ok || !tenant || !user) {
        return { ok: false, error: payload.error ?? "Unable to load the current billing status." }
      }

      setState((current) => mergeWorkspacePayload(current, { tenant, user, signup: payload.signup }))
      return { ok: true, tenant }
    },
    [setState],
  )

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
      const response = await fetch("/api/workspace/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const payload = (await response.json()) as {
        tenant?: PlatformTenantRecord
        user?: PlatformUserRecord
        signup?: PlatformSignupRecord
        error?: string
      }

      const tenant = payload.tenant
      const user = payload.user
      if (!response.ok || !tenant || !user) {
        return { ok: false, error: payload.error ?? "Unable to sign in." }
      }

      setState((current) => ({
        ...mergeWorkspacePayload(current, { tenant, user, signup: payload.signup }),
        session: {
          mode: "workspace",
          tenantId: tenant.id,
          userId: user.id,
          startedAt: new Date().toISOString(),
        },
      }))

      return {
        ok: true,
        nextPath:
          tenant.subscriptionStatus === "Active" && tenant.paymentStatus === "Paid"
            ? "/dashboard"
            : isSelfServePlan(tenant.planId)
              ? getSelfServeCheckoutUrl(tenant.planId, tenant.id)
              : saasAppConfig.enterprisePath,
      }
    }

    const registerWorkspace = async (input: RegistrationInput) => {
      const response = await fetch("/api/workspace/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      const payload = (await response.json()) as {
        tenant?: PlatformTenantRecord
        user?: PlatformUserRecord
        signup?: PlatformSignupRecord
        error?: string
      }

      const tenant = payload.tenant
      const user = payload.user
      if (!response.ok || !tenant || !user) {
        return { ok: false, error: payload.error ?? "We could not create the workspace." }
      }

      setState((current) => ({
        ...mergeWorkspacePayload(current, { tenant, user, signup: payload.signup }),
        session: {
          mode: "workspace",
          tenantId: tenant.id,
          userId: user.id,
          startedAt: new Date().toISOString(),
        },
      }))

      return { ok: true, tenantId: tenant.id }
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
      syncTenantStatus,
      markCheckoutPending,
      markPaymentFailed,
      updateTenantBrandingSeed,
    }
  }, [ready, setState, state, syncTenantStatus])

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
