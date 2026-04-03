"use client"

import { buildSaasAppUrl } from "@cbideal/config"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  communicationHistory as initialCommunicationHistory,
  emailIntegrationSettings,
  emailTemplates,
  type CommunicationLogRecord,
  type CommunicationStatus,
  type EmailIntegrationRecord,
  type EmailTemplateRecord,
  type TemplateCategory,
} from "@/lib/communication-data"
import { useBranding } from "@/lib/branding-store"
import { externalUsers } from "@/lib/mock-data"
import { buildScopedStorageKey } from "@/lib/platform-access"
import { usePlatformAccess } from "@/lib/platform-access-store"
import { useWorkflow } from "@/lib/workflow-store"

type CommunicationContextInput = {
  clientId: string
  caseId?: string | null
  quotationId?: string | null
  paymentId?: string | null
  checklistItemId?: string | null
  customReason?: string | null
}

export type TemplateVariables = Record<string, string>

type CommunicationState = {
  history: CommunicationLogRecord[]
  integration: EmailIntegrationRecord
}

type CommunicationContextValue = {
  state: CommunicationState & { templates: EmailTemplateRecord[] }
  getTemplateById: (templateId: string) => EmailTemplateRecord | undefined
  getTemplatesByCategory: (category?: TemplateCategory | "All") => EmailTemplateRecord[]
  getCommunicationHistory: (clientId?: string) => CommunicationLogRecord[]
  getDefaultVariables: (templateId: string, context: CommunicationContextInput) => TemplateVariables
  getRecipientForClient: (clientId: string) => string
  saveCommunication: (
    input: CommunicationContextInput & {
      templateId: string
      status: CommunicationStatus
      channel: CommunicationLogRecord["channel"]
      scheduledFor?: string | null
      rendered: {
        subject: string
        previewText: string
        htmlBody: string
        textBody: string
      }
      recipient: string
    },
  ) => void
  updateEmailIntegration: (patch: Partial<EmailIntegrationRecord>) => void
  testEmailIntegration: () => void
}

const STORAGE_KEY = "cbideal-communication-state"
const CommunicationContext = createContext<CommunicationContextValue | null>(null)

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function CommunicationProvider({ children }: { children: ReactNode }) {
  const { branding } = useBranding()
  const { storageScope } = usePlatformAccess()
  const workflow = useWorkflow()
  const [state, setState] = useState<CommunicationState>({
    history: clone(initialCommunicationHistory),
    integration: clone(emailIntegrationSettings),
  })
  const scopedStorageKey = buildScopedStorageKey(STORAGE_KEY, storageScope)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(scopedStorageKey)
    if (!saved) return

    try {
      setState(JSON.parse(saved) as CommunicationState)
    } catch {
      window.localStorage.removeItem(scopedStorageKey)
    }
  }, [scopedStorageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(scopedStorageKey, JSON.stringify(state))
  }, [scopedStorageKey, state])

  const value = useMemo<CommunicationContextValue>(() => {
    const getTemplateById = (templateId: string) =>
      emailTemplates.find((template) => template.id === templateId)

    const getTemplatesByCategory = (category?: TemplateCategory | "All") =>
      category && category !== "All"
        ? emailTemplates.filter((template) => template.category === category)
        : emailTemplates

    const getCommunicationHistory = (clientId?: string) =>
      clientId ? state.history.filter((entry) => entry.clientId === clientId) : state.history

    const getRecipientForClient = (clientId: string) => {
      const externalUser = externalUsers.find((user) => user.clientId === clientId)
      return externalUser?.email ?? `${clientId}@samplemail.com`
    }

    const getDefaultVariables = (templateId: string, context: CommunicationContextInput) => {
      const client = workflow.getClientById(context.clientId)
      const clientDetail = workflow.getClientDetail(context.clientId)
      const caseRecord =
        (context.caseId ? workflow.state.cases.find((entry) => entry.id === context.caseId) : undefined) ??
        workflow.getCaseByClientId(context.clientId)
      const quotation =
        (context.quotationId
          ? workflow.state.quotations.find((entry) => entry.id === context.quotationId)
          : undefined) ?? workflow.getQuotationByClientId(context.clientId)
      const payment = context.paymentId
        ? workflow.state.payments.find((entry) => entry.id === context.paymentId)
        : undefined
      const checklistItem = context.checklistItemId
        ? workflow.state.checklist.find((entry) => entry.id === context.checklistItemId)
        : undefined
      const proof = context.paymentId
        ? workflow.state.paymentProofs.find((entry) => entry.paymentId === context.paymentId)
        : undefined

      const portalBase = buildSaasAppUrl("/portal")

      const defaults: TemplateVariables = {
        client_name: clientDetail?.name ?? client?.name ?? "Client",
        company_name: branding.companyName,
        account_manager_name:
          caseRecord?.owner ?? quotation?.owner ?? clientDetail?.owner ?? client?.owner ?? branding.senderDisplayName,
        document_name: checklistItem?.item ?? "Requested document",
        rejection_reason:
          context.customReason ??
          checklistItem?.comment ??
          proof?.rejectionReason ??
          "Please upload a revised version that addresses the review note.",
        payment_amount: payment ? `${payment.currency} ${payment.amount.toLocaleString()}` : "",
        payment_due_date: payment?.dueDate ?? "",
        quotation_name: quotation?.title ?? quotation?.id ?? "Current quotation",
        portal_link: context.paymentId ? `${portalBase}/payments` : `${portalBase}/messages`,
        upload_link: `${portalBase}/documents`,
        case_name: caseRecord?.route ?? quotation?.title ?? clientDetail?.summary ?? "Active matter",
      }

      const template = getTemplateById(templateId)
      if (!template) return defaults

      return template.variables.reduce<TemplateVariables>((accumulator, variable) => {
        accumulator[variable.key] = defaults[variable.key] ?? ""
        return accumulator
      }, {})
    }

    const saveCommunication = (
      input: CommunicationContextInput & {
        templateId: string
        status: CommunicationStatus
        channel: CommunicationLogRecord["channel"]
        scheduledFor?: string | null
        rendered: {
          subject: string
          previewText: string
          htmlBody: string
          textBody: string
        }
        recipient: string
      },
    ) => {
      const template = getTemplateById(input.templateId)
      if (!template) return

      setState((current) => ({
        ...current,
        history: [
          {
            id: `comm-${Date.now()}`,
            clientId: input.clientId,
            caseId: input.caseId ?? null,
            quotationId: input.quotationId ?? null,
            paymentId: input.paymentId ?? null,
            checklistItemId: input.checklistItemId ?? null,
            templateId: template.id,
            templateName: template.name,
            category: template.category,
            subject: input.rendered.subject,
            previewText: input.rendered.previewText,
            renderedHtml: input.rendered.htmlBody,
            renderedText: input.rendered.textBody,
            sender: `${branding.senderDisplayName} <${current.integration.senderMailbox}>`,
            recipient: input.recipient,
            createdAt: formatDateTime(),
            scheduledFor: input.scheduledFor ?? null,
            status: input.status,
            channel: input.channel,
            contextSummary:
              input.checklistItemId
                ? "Document-related communication"
                : input.paymentId
                  ? "Payment-related communication"
                  : input.quotationId
                    ? "Quotation-related communication"
                    : "Client communication",
          },
          ...current.history,
        ],
      }))
    }

    const updateEmailIntegration = (patch: Partial<EmailIntegrationRecord>) => {
      setState((current) => ({
        ...current,
        integration: {
          ...current.integration,
          ...patch,
        },
      }))
    }

    const testEmailIntegration = () => {
      setState((current) => ({
        ...current,
        integration: {
          ...current.integration,
          connected: true,
          lastTested: formatDateTime(),
          status: "Draft-only mode",
        },
      }))
    }

    return {
      state: {
        ...state,
        templates: emailTemplates,
      },
      getTemplateById,
      getTemplatesByCategory,
      getCommunicationHistory,
      getDefaultVariables,
      getRecipientForClient,
      saveCommunication,
      updateEmailIntegration,
      testEmailIntegration,
    }
  }, [branding, state, workflow])

  return <CommunicationContext.Provider value={value}>{children}</CommunicationContext.Provider>
}

export function useCommunication() {
  const context = useContext(CommunicationContext)
  if (!context) {
    throw new Error("useCommunication must be used within CommunicationProvider")
  }

  return context
}
