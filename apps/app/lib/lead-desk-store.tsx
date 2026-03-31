"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  CrmLeadRecord,
  LeadLifecycleStatus,
  LeadPanelHistory,
  LeadPanelNote,
  LeadPanelOverlay,
} from "@cbideal/config/lead-intake"

type LeadDeskOverlayState = Record<string, LeadPanelOverlay>

type EnrichedLead = CrmLeadRecord &
  LeadPanelOverlay & {
    notes: string[]
    history: LeadPanelHistory[]
  }

type LeadDeskContextValue = {
  enrichLead: (lead: CrmLeadRecord) => EnrichedLead
  assignLead: (recordKey: string, managerId: string, managerName: string) => void
  setLeadStatus: (recordKey: string, status: LeadLifecycleStatus) => void
  addLeadNote: (recordKey: string, body: string, author?: string) => void
  convertLeadToInternalClient: (lead: CrmLeadRecord) => string
  createInternalCase: (lead: CrmLeadRecord) => string
}

const STORAGE_KEY = "cbideal-lead-desk-overlays"
const LeadDeskContext = createContext<LeadDeskContextValue | null>(null)

function readStoredOverlay() {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as LeadDeskOverlayState
  } catch {
    return {}
  }
}

function createHistory(label: string): LeadPanelHistory {
  return {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    createdAt: new Date().toISOString(),
  }
}

export function LeadDeskProvider({ children }: { children: ReactNode }) {
  const [overlays, setOverlays] = useState<LeadDeskOverlayState>({})

  useEffect(() => {
    setOverlays(readStoredOverlay())
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overlays))
  }, [overlays])

  const value = useMemo<LeadDeskContextValue>(() => {
    const updateOverlay = (recordKey: string, updater: (current: LeadPanelOverlay) => LeadPanelOverlay) => {
      setOverlays((current) => ({
        ...current,
        [recordKey]: updater(current[recordKey] ?? {}),
      }))
    }

    const appendHistory = (recordKey: string, label: string) => {
      updateOverlay(recordKey, (current) => ({
        ...current,
        history: [...(current.history ?? []), createHistory(label)],
      }))
    }

    return {
      enrichLead: (lead) => {
        const overlay = overlays[lead.recordKey] ?? {}
        const noteBodies = ((overlay.notes ?? []) as LeadPanelNote[]).map((note) => note.body)

        return {
          ...lead,
          ...overlay,
          status: overlay.status ?? lead.status,
          assignedManagerId: overlay.assignedManagerId ?? lead.assignedManagerId,
          assignedManagerName: overlay.assignedManagerName ?? lead.assignedManagerName,
          notes: [...lead.notes, ...noteBodies],
          history: overlay.history ?? [],
        }
      },
      assignLead: (recordKey, managerId, managerName) => {
        updateOverlay(recordKey, (current) => ({
          ...current,
          assignedManagerId: managerId,
          assignedManagerName: managerName,
          history: [...(current.history ?? []), createHistory(`Assigned to ${managerName}`)],
        }))
      },
      setLeadStatus: (recordKey, status) => {
        updateOverlay(recordKey, (current) => ({
          ...current,
          status,
          history: [...(current.history ?? []), createHistory(`Status updated to ${status}`)],
        }))
      },
      addLeadNote: (recordKey, body, author = "Internal note") => {
        updateOverlay(recordKey, (current) => ({
          ...current,
          notes: [
            ...(current.notes ?? []),
            {
              id: `${recordKey}-${Date.now()}`,
              body,
              author,
              createdAt: new Date().toISOString(),
            },
          ],
          history: [...(current.history ?? []), createHistory(`Internal note added by ${author}`)],
        }))
      },
      convertLeadToInternalClient: (lead) => {
        const existingId = overlays[lead.recordKey]?.linkedInternalClientId
        if (existingId) return existingId

        const internalClientId = `icl-${Date.now().toString().slice(-6)}`
        updateOverlay(lead.recordKey, (current) => ({
          ...current,
          linkedInternalClientId: internalClientId,
          status: "Converted",
          history: [...(current.history ?? []), createHistory(`Converted to internal client record ${internalClientId}`)],
        }))
        return internalClientId
      },
      createInternalCase: (lead) => {
        const existingId = overlays[lead.recordKey]?.linkedInternalCaseId
        if (existingId) return existingId

        const internalCaseId = `case-${Date.now().toString().slice(-6)}`
        updateOverlay(lead.recordKey, (current) => ({
          ...current,
          linkedInternalCaseId: internalCaseId,
          history: [...(current.history ?? []), createHistory(`Internal case ${internalCaseId} opened`)],
        }))
        return internalCaseId
      },
    }
  }, [overlays])

  return <LeadDeskContext.Provider value={value}>{children}</LeadDeskContext.Provider>
}

export function useLeadDesk() {
  const context = useContext(LeadDeskContext)

  if (!context) {
    throw new Error("useLeadDesk must be used inside LeadDeskProvider")
  }

  return context
}
