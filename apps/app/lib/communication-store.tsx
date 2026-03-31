"use client"

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
  emailTemplates as initialTemplates,
  type CommunicationLogRecord,
  type CommunicationStatus,
  type EmailIntegrationRecord,
  type EmailTemplateRecord,
  type TemplateCategory,
} from "@/lib/communication-data"
import { getBrandingUiTokens, useBranding } from "@/lib/branding-store"
import { externalUsers, workspace } from "@/lib/mock-data"
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

type RenderedTemplate = {
  subject: string
  previewText: string
  htmlBody: string
  textBody: string
  variables: Record<string, string>
  recipient: string
}

type CommunicationState = {
  templates: EmailTemplateRecord[]
  history: CommunicationLogRecord[]
  integration: EmailIntegrationRecord
}

type CommunicationContextValue = {
  state: CommunicationState
  getTemplateById: (templateId: string) => EmailTemplateRecord | undefined
  getTemplatesByCategory: (category?: TemplateCategory | "All") => EmailTemplateRecord[]
  getCommunicationHistory: (clientId?: string) => CommunicationLogRecord[]
  renderTemplate: (templateId: string, context: CommunicationContextInput) => RenderedTemplate | null
  buildOutlookDraftUrl: (templateId: string, context: CommunicationContextInput) => string | null
  createTemplate: (input: Omit<EmailTemplateRecord, "id" | "lastEdited" | "lastUsed">) => string
  updateTemplate: (templateId: string, patch: Partial<Omit<EmailTemplateRecord, "id">>) => void
  duplicateTemplate: (templateId: string) => string | null
  deleteTemplate: (templateId: string) => void
  saveCommunication: (input: CommunicationContextInput & {
    templateId: string
    status: CommunicationStatus
    channel: CommunicationLogRecord["channel"]
    scheduledFor?: string | null
  }) => string | null
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
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function replaceTokens(input: string, variables: Record<string, string>) {
  return input.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] ?? "")
}

export function CommunicationProvider({ children }: { children: ReactNode }) {
  const { branding } = useBranding()
  const { storageScope } = usePlatformAccess()
  const workflow = useWorkflow()
  const [state, setState] = useState<CommunicationState>({
    templates: clone(initialTemplates),
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
      state.templates.find((template) => template.id === templateId)

    const getTemplatesByCategory = (category?: TemplateCategory | "All") =>
      category && category !== "All"
        ? state.templates.filter((template) => template.category === category)
        : state.templates

    const getCommunicationHistory = (clientId?: string) =>
      clientId ? state.history.filter((entry) => entry.clientId === clientId) : state.history

    const buildVariables = (context: CommunicationContextInput) => {
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
      const externalUser = externalUsers.find((user) => user.clientId === context.clientId)

      const clientName = clientDetail?.name ?? client?.name ?? "Client"
      const paymentAmount = payment
        ? `${payment.currency} ${payment.amount.toLocaleString()}`
        : "Payment amount"
      const recipient = externalUser?.email ?? `${context.clientId}@samplemail.com`
      const tokens = getBrandingUiTokens(branding)
      const brandLogo = branding.darkLogoUrl || branding.companyLogoUrl
      const brandHeaderMarkup = brandLogo
        ? `<img src="${brandLogo}" alt="${branding.companyName}" style="display:block;max-width:220px;height:42px;width:auto;object-fit:contain;object-position:left;" />`
        : `<div style="font-family:Cormorant Garamond,Georgia,serif;font-size:32px;line-height:1.05;color:#ffffff;">${branding.companyName}</div>`

      return {
        client_name: clientName,
        company_name: branding.companyName,
        account_manager_name:
          caseRecord?.owner ?? quotation?.owner ?? clientDetail?.owner ?? client?.owner ?? "Account manager",
        document_name: checklistItem?.item ?? "document",
        rejection_reason:
          context.customReason ??
          checklistItem?.comment ??
          proof?.rejectionReason ??
          "Please re-upload the item with the requested corrections.",
        payment_amount: paymentAmount,
        payment_due_date: payment?.dueDate ?? "the current due date",
        quotation_name: quotation?.id ?? "quotation",
        portal_link: `https://${workspace.appHost}/portal`,
        upload_link: `https://${workspace.appHost}/portal/documents`,
        case_name: caseRecord?.route ?? quotation?.client ?? clientName,
        sender_name: branding.senderDisplayName,
        reply_to: state.integration.replyTo,
        recipient_email: recipient,
        brand_primary: branding.primaryColor,
        brand_primary_strong: tokens.primaryStrong,
        brand_on_primary: tokens.onPrimary,
        brand_header_markup: brandHeaderMarkup,
      }
    }

    const renderTemplate = (templateId: string, context: CommunicationContextInput) => {
      const template = getTemplateById(templateId)
      if (!template) return null

      const variables = buildVariables(context)

      return {
        subject: replaceTokens(template.subject, variables),
        previewText: replaceTokens(template.previewText, variables),
        htmlBody: replaceTokens(template.htmlBody, variables),
        textBody: replaceTokens(template.textBody, variables),
        variables,
        recipient: variables.recipient_email,
      }
    }

    const buildOutlookDraftUrl = (templateId: string, context: CommunicationContextInput) => {
      const rendered = renderTemplate(templateId, context)
      if (!rendered) return null

      const query = new URLSearchParams({
        subject: rendered.subject,
        body: rendered.textBody,
      })

      return `mailto:${rendered.recipient}?${query.toString()}`
    }

    const createTemplate = (
      input: Omit<EmailTemplateRecord, "id" | "lastEdited" | "lastUsed">,
    ) => {
      const id = `tpl-${Date.now()}`
      setState((current) => ({
        ...current,
        templates: [
          {
            ...input,
            id,
            lastEdited: formatDateTime(),
            lastUsed: null,
          },
          ...current.templates,
        ],
      }))
      return id
    }

    const updateTemplate = (templateId: string, patch: Partial<Omit<EmailTemplateRecord, "id">>) => {
      setState((current) => ({
        ...current,
        templates: current.templates.map((template) =>
          template.id === templateId
            ? { ...template, ...patch, lastEdited: formatDateTime() }
            : template,
        ),
      }))
    }

    const duplicateTemplate = (templateId: string) => {
      const template = getTemplateById(templateId)
      if (!template) return null
      const nextId = `tpl-${Date.now()}`
      setState((current) => ({
        ...current,
        templates: [
          {
            ...template,
            id: nextId,
            name: `${template.name} copy`,
            lastEdited: formatDateTime(),
            lastUsed: null,
          },
          ...current.templates,
        ],
      }))
      return nextId
    }

    const deleteTemplate = (templateId: string) => {
      setState((current) => ({
        ...current,
        templates: current.templates.filter((template) => template.id !== templateId),
      }))
    }

    const saveCommunication = (
      input: CommunicationContextInput & {
        templateId: string
        status: CommunicationStatus
        channel: CommunicationLogRecord["channel"]
        scheduledFor?: string | null
      },
    ) => {
      const template = getTemplateById(input.templateId)
      const rendered = renderTemplate(input.templateId, input)
      if (!template || !rendered) return null

      setState((current) => ({
        ...current,
        templates: current.templates.map((entry) =>
          entry.id === input.templateId ? { ...entry, lastUsed: formatDateTime() } : entry,
        ),
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
            subject: rendered.subject,
            previewText: rendered.previewText,
            renderedHtml: rendered.htmlBody,
            renderedText: rendered.textBody,
            sender: `${branding.senderDisplayName} <${current.integration.senderMailbox}>`,
            recipient: rendered.recipient,
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

      return buildOutlookDraftUrl(input.templateId, input)
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
      state,
      getTemplateById,
      getTemplatesByCategory,
      getCommunicationHistory,
      renderTemplate,
      buildOutlookDraftUrl,
      createTemplate,
      updateTemplate,
      duplicateTemplate,
      deleteTemplate,
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
