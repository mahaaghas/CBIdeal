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
  cases as initialCases,
  clientDetails,
  clients,
  documentChecklistItems,
  documentUploads,
  externalUsers,
  internalUsers,
  leads as initialLeads,
  notificationLog,
  paymentProofs,
  paymentSchedules,
  portalSnapshot,
  quotations,
  reviewDecisions,
  tasks,
  workspace,
} from "@/lib/mock-data"
import type { ImportSource, ImportType } from "@/lib/data-import"
import { buildScopedStorageKey } from "@/lib/platform-access"
import { usePlatformAccess } from "@/lib/platform-access-store"

type ClientRecord = (typeof clients)[number]
type ClientDetailRecord = (typeof clientDetails)[keyof typeof clientDetails]
type CaseRecord = (typeof initialCases)[number]
type QuotationLineItem = {
  label: string
  amount: number
  quantity?: number
}
export type QuotationRecord = (typeof quotations)[number] & {
  title?: string
  advisorName?: string
  serviceFees: QuotationLineItem[]
  governmentFees: QuotationLineItem[]
  optionalItems: QuotationLineItem[]
  discountAmount?: number
  discountReason?: string | null
  vatApplied?: boolean
  vatPercentage?: number
  subtotal?: number
  vatAmount?: number
  total?: number
  notes?: string
  terms?: string
  sentDate?: string | null
  decisionStatus?: "Accepted" | "Pending" | "Declined"
}
type PaymentRecord = (typeof paymentSchedules)[number]
type PaymentProofRecord = (typeof paymentProofs)[number]
type ChecklistRecord = (typeof documentChecklistItems)[number]
type UploadRecord = (typeof documentUploads)[number]
type ReviewRecord = (typeof reviewDecisions)[number]
type NotificationRecord = (typeof notificationLog)[number] & { clientId?: string; isRead?: boolean }
export type WorkspaceLeadRecord = {
  id: string
  name: string
  companyName?: string
  email: string
  phone?: string
  country?: string
  interest: string
  status: "New" | "Contacted" | "Qualified" | "Converted"
  assignedManager: string
  sourcePage?: string
  submittedAt: string
  notes?: string
}
export type WorkspaceImportSummary = {
  id: string
  importType: ImportType
  source: ImportSource
  fileName: string
  importedCount: number
  skippedCount: number
  issueCount: number
  issues: string[]
  completedAt: string
}

export type WorkflowNotificationFeedItem = {
  id: string
  title: string
  description: string
  context: string
  timestamp: string
  href: string
  unread: boolean
  status: "New" | "Read"
}

type WorkflowState = {
  leads: WorkspaceLeadRecord[]
  clients: ClientRecord[]
  clientProfiles: Record<string, ClientDetailRecord>
  cases: CaseRecord[]
  quotations: QuotationRecord[]
  payments: PaymentRecord[]
  paymentProofs: PaymentProofRecord[]
  checklist: ChecklistRecord[]
  uploads: UploadRecord[]
  reviews: ReviewRecord[]
  notifications: NotificationRecord[]
  clientUpdates: Record<string, string[]>
  importSummaries: WorkspaceImportSummary[]
}

type WorkflowContextValue = {
  state: WorkflowState
  currentPortalClientId: string
  getAllLeads: () => WorkspaceLeadRecord[]
  getAllClients: () => ClientRecord[]
  getClientById: (clientId: string) => ClientRecord | undefined
  getClientDetail: (clientId: string) => ClientDetailRecord | undefined
  getCaseByClientId: (clientId: string) => CaseRecord | undefined
  getQuotationByClientId: (clientId: string) => QuotationRecord | undefined
  getPaymentsForClient: (clientId: string) => PaymentRecord[]
  getPaymentProofByPaymentId: (paymentId: string) => PaymentProofRecord | undefined
  getChecklistForCase: (caseId: string) => ChecklistRecord[]
  getUploadsForCase: (caseId: string) => UploadRecord[]
  getLatestUploadForChecklistItem: (checklistItemId: string) => UploadRecord | undefined
  getReviewsForCase: (caseId: string) => ReviewRecord[]
  getNotificationsForClient: (clientId: string) => NotificationRecord[]
  getClientUpdates: (clientId: string) => string[]
  getImportSummaries: () => WorkspaceImportSummary[]
  getWorkspaceNotificationFeed: () => WorkflowNotificationFeedItem[]
  getPortalNotificationFeed: (clientId: string) => WorkflowNotificationFeedItem[]
  getOpenNotificationCount: () => number
  getPortalNotificationCount: (clientId: string) => number
  markNotificationRead: (notificationId: string) => void
  markNotificationsRead: (notificationIds: string[]) => void
  createClient: (input: {
    name: string
    type: string
    context: string
    region: string
    investmentRange: string
    jurisdictionFocus: string
    ownerId: string
  }) => string
  createQuotation: (input: {
    clientId: string
    title: string
    quotationDate: string
    advisorName: string
    currency: string
    serviceFees: QuotationLineItem[]
    governmentFees: QuotationLineItem[]
    optionalItems: QuotationLineItem[]
    discountAmount: number
    discountReason?: string | null
    vatApplied: boolean
    vatPercentage: number
    notes?: string
    terms?: string
  }) => string
  importRecords: (input: {
    type: ImportType
    rows: Record<string, string>[]
    fileName: string
    source: ImportSource
    skipInvalidRows?: boolean
  }) => WorkspaceImportSummary
  startFromScratch: () => void
  getPortalOverview: (clientId: string) => {
    route: string
    stage: string
    progress: number
    nextStep: string
    pendingDocuments: number
    pendingPayments: number
    approvedDocuments: number
    paymentHeadline: string
  }
  approveDocument: (checklistItemId: string) => void
  rejectDocument: (checklistItemId: string, reason: string) => void
  uploadDocument: (checklistItemId: string, fileName: string, uploadedBy?: string) => void
  uploadPaymentProof: (paymentId: string, fileName: string) => void
  approvePaymentProof: (paymentId: string) => void
  rejectPaymentProof: (paymentId: string, reason: string) => void
}

const STORAGE_KEY = "cbideal-workflow-state"
const CURRENT_PORTAL_CLIENT_ID = "a-rahman"

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
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

function formatDateLabelFromIso(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate))
}

function parseDateLabel(value?: string | null) {
  if (!value) return 0

  const parsed = new Date(value.replace(",", "")).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function normaliseClientId(raw?: string | null) {
  return raw?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? ""
}

function calculateLineItemsTotal(items: QuotationLineItem[]) {
  return items.reduce((total, item) => total + item.amount * (item.quantity ?? 1), 0)
}

function buildQuotationComputedFields(record: QuotationRecord): QuotationRecord {
  const subtotal =
    calculateLineItemsTotal(record.serviceFees) +
    calculateLineItemsTotal(record.governmentFees) +
    calculateLineItemsTotal(record.optionalItems)

  const discountAmount = record.discountAmount ?? 0
  const netAmount = Math.max(subtotal - discountAmount, 0)
  const vatApplied = record.vatApplied ?? false
  const vatPercentage = record.vatPercentage ?? 0
  const vatAmount = vatApplied ? Math.round(netAmount * (vatPercentage / 100)) : 0
  const total = netAmount + vatAmount

  return {
    ...record,
    title: record.title ?? `${record.client} quotation`,
    advisorName: record.advisorName ?? record.owner,
    discountAmount,
    discountReason: record.discountReason ?? null,
    vatApplied,
    vatPercentage,
    subtotal,
    vatAmount,
    total,
    notes: record.notes ?? record.note,
    terms:
      record.terms ??
      "This quotation remains subject to final document readiness, programme-side requirements, and the agreed scope of work.",
    sentDate:
      record.sentDate ??
      (record.status === "Draft" ? null : record.quotationDate),
    decisionStatus:
      record.decisionStatus ??
      (record.status === "Accepted" || record.status === "Partially Paid" || record.status === "Paid"
        ? "Accepted"
        : "Pending"),
  }
}

function buildInitialState(): WorkflowState {
  const initialNotifications: NotificationRecord[] = clone(notificationLog).map((item) => {
    const matchedClient = clients.find((client) => client.name === item.recipient)

    return {
      ...item,
      clientId: matchedClient?.id,
      isRead: item.id === "notif-001" || item.id === "notif-003",
    }
  })

  initialNotifications.unshift(
    {
      id: "notif-seed-task-updated",
      type: "Task updated",
      channel: "Workspace",
      recipient: "Maha A.",
      recipientType: "Internal",
      relatedTo: "task-002",
      sentAt: "31 Mar 2026, 08:35",
      status: "Sent",
      clientId: "al-noor-holdings",
      isRead: false,
    },
    {
      id: "notif-seed-quotation-accepted",
      type: "Quotation accepted",
      channel: "Workspace",
      recipient: "Maha A.",
      recipientType: "Internal",
      relatedTo: "quo-1004",
      sentAt: "30 Mar 2026, 17:18",
      status: "Sent",
      clientId: "m-el-sayed",
      isRead: false,
    },
    {
      id: "notif-seed-payment-approved",
      type: "Payment approved",
      channel: "Email",
      recipient: "Ahmed Rahman",
      recipientType: "Client",
      relatedTo: "pay-rahman-1",
      sentAt: "30 Mar 2026, 10:42",
      status: "Sent",
      clientId: "a-rahman",
      isRead: false,
    },
    {
      id: "notif-seed-proof-uploaded",
      type: "Proof of payment uploaded",
      channel: "Workspace",
      recipient: "Sami K.",
      recipientType: "Internal",
      relatedTo: "pay-rahman-1",
      sentAt: "30 Mar 2026, 09:55",
      status: "Sent",
      clientId: "a-rahman",
      isRead: true,
    },
    {
      id: "notif-seed-document-approved",
      type: "Document approved",
      channel: "Email",
      recipient: "Al Noor Holdings",
      recipientType: "Client",
      relatedTo: "doc-noor-proof-address",
      sentAt: "29 Mar 2026, 14:12",
      status: "Sent",
      clientId: "al-noor-holdings",
      isRead: true,
    },
    {
      id: "notif-seed-document-uploaded",
      type: "Document uploaded",
      channel: "Workspace",
      recipient: "Nour H.",
      recipientType: "Internal",
      relatedTo: "doc-westbridge-board-resolution",
      sentAt: "30 Mar 2026, 11:18",
      status: "Sent",
      clientId: "westbridge-capital",
      isRead: false,
    },
  )

  return {
    leads: clone(initialLeads).map((lead, index) => ({
      id: lead.id ?? `workspace-lead-${index + 1}`,
      name: lead.name,
      companyName: lead.name.includes("Office") || lead.name.includes("Capital") ? lead.name : "",
      email: `${normaliseClientId(lead.name) || `lead-${index + 1}`}@example.com`,
      phone: "",
      country: lead.region,
      interest: lead.focus,
      status:
        lead.status === "Private consultation"
          ? "Qualified"
          : lead.status === "Awaiting documents"
            ? "Contacted"
            : lead.status === "Initial review" || lead.status === "Research stage"
              ? "New"
              : "Qualified",
      assignedManager: lead.owner,
      sourcePage: "/website-import",
      submittedAt: "29 Mar 2026",
      notes: `${lead.timeline} / ${lead.budget}`,
    })),
    clients: clone(clients),
    clientProfiles: clone(clientDetails),
    cases: clone(initialCases),
    quotations: clone(quotations).map((quotation) => buildQuotationComputedFields(quotation)),
    payments: clone(paymentSchedules),
    paymentProofs: clone(paymentProofs),
    checklist: clone(documentChecklistItems),
    uploads: clone(documentUploads),
    reviews: clone(reviewDecisions),
    notifications: initialNotifications,
    clientUpdates: {
      "a-rahman": clone(portalSnapshot.updates),
      "al-noor-holdings": clone(clientDetails["al-noor-holdings"].notes),
      "westbridge-capital": clone(clientDetails["westbridge-capital"].notes),
      "m-el-sayed": clone(clientDetails["m-el-sayed"].notes),
    },
    importSummaries: [],
  }
}

function buildWorkspaceSeed(companyName: string, ownerName: string): WorkflowState {
  const welcomeClientId = normaliseClientId(companyName) || "workspace-owner"
  const welcomeCaseId = `case-${welcomeClientId}`

  return {
    leads: [],
    clients: [
      {
        id: welcomeClientId,
        name: companyName,
        type: "Firm workspace",
        context: "Workspace setup",
        status: "Onboarding",
        owner: ownerName,
        ownerId: internalUsers[0]?.id ?? "usr-maha",
        jurisdictionFocus: "Initial configuration",
        portalStatus: "Portal not yet opened",
        summary: "This record anchors the firm workspace while the first real clients, quotations, and portal access are being configured.",
        region: "Internal setup",
        investmentRange: "Not applicable",
      },
    ],
    clientProfiles: {
      [welcomeClientId]: {
        id: welcomeClientId,
        name: companyName,
        contact: ownerName,
        owner: ownerName,
        profileType: "Firm workspace",
        region: "Internal setup",
        status: "Onboarding",
        applicationStatus: "Ready for setup",
        summary:
          "This workspace has been activated. The first real client, quotation, and case will replace the onboarding record naturally as your team begins working.",
        caseId: welcomeCaseId,
        quotationId: "",
        paymentIds: [],
        notes: [
          "Welcome to the workspace.",
          "Create your first client, quotation, or case to replace this onboarding record.",
        ],
      },
    },
    cases: [
      {
        id: welcomeCaseId,
        clientId: welcomeClientId,
        client: companyName,
        route: "Workspace activation",
        stage: "Ready for setup",
        owner: ownerName,
        ownerId: internalUsers[0]?.id ?? "usr-maha",
        nextMilestone: formatDate(new Date()),
        progress: 8,
        applicationStatus: "Complete onboarding and add your first live matter",
        region: "Internal",
      },
    ],
    quotations: [],
    payments: [],
    paymentProofs: [],
    checklist: [],
    uploads: [],
    reviews: [],
    notifications: [
      {
        id: "notif-workspace-welcome",
        type: "Task assigned",
        channel: "Workspace",
        recipient: ownerName,
        recipientType: "Internal",
        relatedTo: welcomeCaseId,
        sentAt: formatDateTime(),
        status: "Sent",
        clientId: welcomeClientId,
        isRead: false,
      },
    ],
    clientUpdates: {
      [welcomeClientId]: [
        "Your workspace is active. Add your first real client or quotation to begin replacing the onboarding record.",
      ],
    },
    importSummaries: [],
  }
}

function getClientName(clientId: string) {
  return clients.find((client) => client.id === clientId)?.name ?? clientId
}

function getAssignedManagerName(ownerId?: string) {
  return internalUsers.find((user) => user.id === ownerId)?.name ?? "Account manager"
}

function getInternalUserByName(raw?: string | null) {
  const normalised = raw?.trim().toLowerCase()
  if (!normalised) return internalUsers[0]
  return (
    internalUsers.find((user) => user.name.toLowerCase() === normalised) ??
    internalUsers.find((user) => user.name.toLowerCase().includes(normalised)) ??
    internalUsers[0]
  )
}

function normaliseQuotationStatusValue(value?: string | null): QuotationRecord["status"] {
  const normalised = value?.trim().toLowerCase()
  if (normalised === "sent") return "Sent"
  if (normalised === "accepted") return "Accepted"
  if (normalised === "partially paid") return "Partially Paid"
  if (normalised === "paid") return "Paid"
  return "Draft"
}

function normalisePaymentStatusValue(value?: string | null): PaymentRecord["status"] {
  const normalised = value?.trim().toLowerCase()
  if (normalised === "due soon") return "Due soon"
  if (normalised === "awaiting proof") return "Awaiting proof"
  if (normalised === "under review") return "Under review"
  if (normalised === "approved") return "Approved"
  if (normalised === "overdue") return "Overdue"
  if (normalised === "rejected") return "Rejected"
  if (normalised === "paid") return "Paid"
  return "Upcoming"
}

function isWorkspaceSeedState(state: WorkflowState) {
  return (
    state.clients.length === 1 &&
    state.clients[0]?.type === "Firm workspace" &&
    state.cases.length === 1 &&
    state.quotations.length === 0 &&
    state.payments.length === 0 &&
    state.leads.length === 0 &&
    state.importSummaries.length === 0
  )
}

function clearWorkspaceSeed(state: WorkflowState) {
  if (!isWorkspaceSeedState(state)) return

  state.clients = []
  state.clientProfiles = {}
  state.cases = []
  state.notifications = []
  state.clientUpdates = {}
}

function ensureImportedClient(
  state: WorkflowState,
  input: {
    clientName: string
    companyName?: string
    type?: string
    context?: string
    region?: string
    investmentRange?: string
    jurisdictionFocus?: string
    assignedManager?: string
    email?: string
    notes?: string
    status?: string
  },
) {
  const name = input.clientName.trim() || input.companyName?.trim() || "Imported client"
  const clientId = normaliseClientId(name) || `client-${Date.now()}`
  const manager = getInternalUserByName(input.assignedManager)
  const existing = state.clients.find((client) => client.id === clientId)

  if (!existing) {
    state.clients.unshift({
      id: clientId,
      name,
      type: input.type?.trim() || "Imported client",
      context: input.context?.trim() || "Imported from existing records",
      status: input.status?.trim() || "Active",
      owner: manager.name,
      ownerId: manager.id,
      jurisdictionFocus: input.jurisdictionFocus?.trim() || "Imported route context",
      portalStatus: "Portal pending",
      summary: input.notes?.trim() || "Imported from a structured data migration.",
      region: input.region?.trim() || input.companyName?.trim() || "Imported region",
      investmentRange: input.investmentRange?.trim() || "Not yet classified",
    } as ClientRecord)
  }

  const existingProfile = state.clientProfiles[clientId]
  if (!existingProfile) {
    state.clientProfiles[clientId] = {
      id: clientId,
      name,
      contact: input.email?.trim() || manager.name,
      owner: manager.name,
      profileType: input.type?.trim() || "Imported client",
      region: input.region?.trim() || "Imported region",
      status: input.status?.trim() || "Active",
      applicationStatus: "Imported record",
      summary: input.notes?.trim() || "Imported into the workspace from existing operational data.",
      caseId: "",
      quotationId: "",
      paymentIds: [],
      notes: [
        "Imported into the workspace.",
        input.notes?.trim() || "Review the imported record and continue normal operations.",
      ],
    } as ClientDetailRecord
  }

  if (!state.clientUpdates[clientId]) {
    state.clientUpdates[clientId] = ["Imported into the workspace and ready for review."]
  }

  return clientId
}

function ensureImportedCase(
  state: WorkflowState,
  input: {
    clientId: string
    clientName: string
    route: string
    stage?: string
    applicationStatus?: string
    assignedManager?: string
    nextMilestone?: string
    progress?: number
    region?: string
  },
) {
  const manager = getInternalUserByName(input.assignedManager)
  const existing =
    state.cases.find(
      (caseRecord) =>
        caseRecord.clientId === input.clientId &&
        caseRecord.route.toLowerCase() === input.route.trim().toLowerCase(),
    ) ?? state.cases.find((caseRecord) => caseRecord.clientId === input.clientId)

  if (existing) {
    return existing.id
  }

  const caseId = `case-${Date.now()}-${state.cases.length + 1}`
  state.cases.unshift({
    id: caseId,
    clientId: input.clientId,
    client: input.clientName,
    route: input.route.trim(),
    stage: input.stage?.trim() || "Imported",
    owner: manager.name,
    ownerId: manager.id,
    nextMilestone: input.nextMilestone?.trim() || formatDate(),
    progress: Math.max(8, Math.min(Math.round(input.progress ?? 24), 96)),
    applicationStatus: input.applicationStatus?.trim() || "Imported and ready for review",
    region: input.region?.trim() || "Imported region",
  } as CaseRecord)

  if (state.clientProfiles[input.clientId] && !state.clientProfiles[input.clientId].caseId) {
    state.clientProfiles[input.clientId] = {
      ...state.clientProfiles[input.clientId],
      caseId,
    }
  }

  return caseId
}

function pushNotification(
  state: WorkflowState,
  draft: Omit<NotificationRecord, "id" | "sentAt" | "clientId"> & { clientId?: string },
) {
  const clientId =
    draft.clientId ??
    clients.find((client) => client.name === draft.recipient)?.id ??
    undefined

  state.notifications.unshift({
    ...draft,
    id: `notif-${Date.now()}`,
    sentAt: formatDateTime(),
    clientId,
    isRead: false,
  })
}

function pushClientUpdate(state: WorkflowState, clientId: string, message: string) {
  state.clientUpdates[clientId] = [message, ...(state.clientUpdates[clientId] ?? [])].slice(0, 8)
}

function syncQuotationStatus(state: WorkflowState, quotationId?: string | null) {
  if (!quotationId) return

  const quotation = state.quotations.find((item) => item.id === quotationId)
  if (!quotation) return

  const relatedPayments = state.payments.filter((item) => item.quotationId === quotationId)

  if (!relatedPayments.length) return

  const paidCount = relatedPayments.filter((item) => item.status === "Paid" || item.status === "Approved").length

  if (paidCount === 0) {
    quotation.status = quotation.status === "Draft" ? "Draft" : "Sent"
    return
  }

  quotation.status = paidCount === relatedPayments.length ? "Paid" : "Partially Paid"
}

function syncCaseState(state: WorkflowState, caseId?: string | null) {
  if (!caseId) return

  const caseRecord = state.cases.find((item) => item.id === caseId)
  if (!caseRecord) return

  const relatedChecklist = state.checklist.filter((item) => item.caseId === caseId)
  const relatedPayments = state.payments.filter((item) => item.caseId === caseId)

  const totalDocuments = relatedChecklist.length || 1
  const approvedDocuments = relatedChecklist.filter((item) => item.status === "Approved").length
  const rejectedDocuments = relatedChecklist.filter((item) => item.status === "Rejected").length
  const missingDocuments = relatedChecklist.filter((item) => item.status === "Not Uploaded").length
  const reviewDocuments = relatedChecklist.filter(
    (item) => item.status === "Uploaded" || item.status === "Under Review",
  ).length

  const totalPayments = relatedPayments.length || 1
  const clearedPayments = relatedPayments.filter((item) => item.status === "Paid" || item.status === "Approved").length
  const rejectedPayments = relatedPayments.filter((item) => item.status === "Rejected").length
  const paymentReview = relatedPayments.filter((item) => item.status === "Under review").length
  const awaitingProof = relatedPayments.filter((item) => item.status === "Awaiting proof").length

  const progress = Math.round(
    18 +
      (approvedDocuments / totalDocuments) * 42 +
      (clearedPayments / totalPayments) * 28 +
      (reviewDocuments ? 8 : 0) -
      (rejectedDocuments ? 4 : 0) -
      (rejectedPayments ? 4 : 0),
  )

  caseRecord.progress = Math.max(12, Math.min(progress, 96))

  if (rejectedDocuments > 0) {
    caseRecord.stage = "Document collection"
    caseRecord.applicationStatus = "Awaiting corrected document"
    caseRecord.nextMilestone = "Client re-upload required"
    return
  }

  if (rejectedPayments > 0) {
    caseRecord.stage = "Due diligence preparation"
    caseRecord.applicationStatus = "Awaiting revised proof of payment"
    caseRecord.nextMilestone = "Payment evidence to be re-uploaded"
    return
  }

  if (paymentReview > 0) {
    caseRecord.stage = "Due diligence preparation"
    caseRecord.applicationStatus = "Payment evidence under review"
    caseRecord.nextMilestone = "Internal finance review"
    return
  }

  if (missingDocuments > 0 || reviewDocuments > 0) {
    caseRecord.stage = "Document collection"
    caseRecord.applicationStatus =
      reviewDocuments > 0 ? "Document review in progress" : "Awaiting required documents"
    caseRecord.nextMilestone =
      reviewDocuments > 0 ? "Internal document review" : "Upload remaining required records"
    return
  }

  if (awaitingProof > 0) {
    caseRecord.stage = "Due diligence preparation"
    caseRecord.applicationStatus = "Awaiting proof of payment"
    caseRecord.nextMilestone = "Upload payment evidence"
    return
  }

  if (approvedDocuments === totalDocuments && clearedPayments === relatedPayments.length && relatedPayments.length > 0) {
    caseRecord.stage = "Government review"
    caseRecord.applicationStatus = "Formal review"
    caseRecord.nextMilestone = "Programme-side review underway"
    return
  }

  caseRecord.applicationStatus = "Structured review"
}

function resolveNotificationFeedItem(
  item: NotificationRecord,
  state: WorkflowState,
  audience: "workspace" | "portal",
): WorkflowNotificationFeedItem {
  const client = item.clientId ? state.clients.find((entry) => entry.id === item.clientId) : undefined
  const caseRecord = item.clientId ? state.cases.find((entry) => entry.clientId === item.clientId) : undefined
  const checklistItem = state.checklist.find((entry) => entry.id === item.relatedTo)
  const payment = state.payments.find((entry) => entry.id === item.relatedTo)
  const paymentFromProof = state.paymentProofs.find((entry) => entry.id === item.relatedTo)
  const proofPayment =
    payment ?? (paymentFromProof ? state.payments.find((entry) => entry.id === paymentFromProof.paymentId) : undefined)
  const quotation = state.quotations.find((entry) => entry.id === item.relatedTo)
  const task = tasks.find((entry) => entry.id === item.relatedTo)

  const defaultHref = audience === "workspace" ? "/dashboard" : "/portal"
  let description = item.type
  let context = client?.name ?? caseRecord?.route ?? item.recipient
  let href = defaultHref

  switch (item.type) {
    case "Document uploaded":
      description = checklistItem
        ? `${client?.name ?? "A client"} uploaded ${checklistItem.item.toLowerCase()}.`
        : `${item.recipient} uploaded a required document.`
      context = caseRecord?.route ?? client?.name ?? "Document review"
      href = audience === "workspace" ? "/documents" : "/portal/documents"
      break
    case "Document approved":
      description = checklistItem
        ? `${checklistItem.item} was approved and cleared for the active file.`
        : "A required document was approved."
      context = client?.name ?? caseRecord?.route ?? "Document review"
      href = audience === "workspace" ? "/documents" : "/portal/documents"
      break
    case "Document rejected and re-upload requested":
      description = checklistItem
        ? `${checklistItem.item} was returned and a new upload is required.`
        : "A document needs to be uploaded again."
      context = client?.name ?? caseRecord?.route ?? "Document review"
      href = audience === "workspace" ? "/documents" : "/portal/documents"
      break
    case "Proof of payment uploaded":
      description = proofPayment
        ? `${client?.name ?? "A client"} uploaded proof for ${proofPayment.label.toLowerCase()}.`
        : "A payment proof was uploaded."
      context = client?.name ?? proofPayment?.label ?? "Payments"
      href = audience === "workspace" ? "/payments" : "/portal/payments"
      break
    case "Payment approved":
      description = proofPayment
        ? `${proofPayment.label} was approved and cleared.`
        : "A payment stage was approved."
      context = client?.name ?? proofPayment?.label ?? "Payments"
      href = audience === "workspace" ? "/payments" : "/portal/payments"
      break
    case "Proof of payment rejected":
      description = proofPayment
        ? `${proofPayment.label} was returned and new proof is required.`
        : "A payment proof was returned for re-upload."
      context = client?.name ?? proofPayment?.label ?? "Payments"
      href = audience === "workspace" ? "/payments" : "/portal/payments"
      break
    case "Payment reminder":
    case "Missing documents reminder":
      description = proofPayment
        ? `A reminder was prepared for ${proofPayment.label.toLowerCase()}.`
        : caseRecord
          ? `A reminder was issued for outstanding items in ${caseRecord.route.toLowerCase()}.`
          : "A client reminder was issued."
      context = client?.name ?? caseRecord?.route ?? "Client reminder"
      href = audience === "workspace" ? "/clients" : "/portal/messages"
      break
    case "Quotation accepted":
      description = quotation
        ? `${quotation.id.toUpperCase()} has moved into an accepted commercial stage.`
        : "A quotation was accepted."
      context = client?.name ?? quotation?.client ?? "Quotations"
      href = audience === "workspace" ? "/quotations" : "/portal/quotations"
      break
    case "Quotation sent":
      description = quotation
        ? `${quotation.id.toUpperCase()} was issued to the client and is awaiting response.`
        : "A quotation was issued."
      context = client?.name ?? quotation?.client ?? "Quotations"
      href = audience === "workspace" ? "/quotations" : "/portal/quotations"
      break
    case "Task assigned":
    case "Task updated":
      description = task ? task.name : "A task was updated in the workspace."
      context = task ? `${task.owner} / ${task.priority} priority` : "Task management"
      href = audience === "workspace" ? "/tasks" : "/portal/messages"
      break
    default:
      href = audience === "workspace" ? "/clients" : "/portal/messages"
  }

  return {
    id: item.id,
    title: item.type,
    description,
    context,
    timestamp: item.sentAt,
    href,
    unread: !item.isRead,
    status: item.isRead ? "Read" : "New",
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const { currentTenant, currentUser, mode, storageScope } = usePlatformAccess()
  const scopedStorageKey = buildScopedStorageKey(STORAGE_KEY, storageScope)
  const [state, setState] = useState<WorkflowState>(() =>
    mode === "workspace" && currentTenant
      ? buildWorkspaceSeed(currentTenant.companyName, currentUser?.fullName ?? "Workspace owner")
      : buildInitialState(),
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = window.localStorage.getItem(scopedStorageKey)
    if (!saved) {
      setState(
        mode === "workspace" && currentTenant
          ? buildWorkspaceSeed(currentTenant.companyName, currentUser?.fullName ?? "Workspace owner")
          : buildInitialState(),
      )
      return
    }

    try {
      setState(JSON.parse(saved) as WorkflowState)
    } catch {
      window.localStorage.removeItem(scopedStorageKey)
    }
  }, [currentTenant, currentUser?.fullName, mode, scopedStorageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(scopedStorageKey, JSON.stringify(state))
  }, [scopedStorageKey, state])

  const value = useMemo<WorkflowContextValue>(() => {
    const getAllLeads = () => state.leads

    const getAllClients = () => state.clients

    const getClientById = (clientId: string) => state.clients.find((client) => client.id === clientId)

    const getClientDetail = (clientId: string) =>
      state.clientProfiles[clientId]

    const getCaseByClientId = (clientId: string) =>
      state.cases.find((item) => item.clientId === clientId)

    const getQuotationByClientId = (clientId: string) =>
      state.quotations.find((item) => item.clientId === clientId)

    const getPaymentsForClient = (clientId: string) =>
      state.payments.filter((item) => item.clientId === clientId)

    const getPaymentProofByPaymentId = (paymentId: string) =>
      state.paymentProofs.find((item) => item.paymentId === paymentId)

    const getChecklistForCase = (caseId: string) =>
      state.checklist.filter((item) => item.caseId === caseId)

    const getUploadsForCase = (caseId: string) =>
      state.uploads.filter((item) => item.caseId === caseId)

    const getLatestUploadForChecklistItem = (checklistItemId: string) =>
      [...state.uploads]
        .filter((item) => item.checklistItemId === checklistItemId)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]

    const getReviewsForCase = (caseId: string) =>
      state.reviews.filter((item) => item.caseId === caseId)

    const getNotificationsForClient = (clientId: string) =>
      state.notifications.filter((item) => item.clientId === clientId)

    const getClientUpdates = (clientId: string) => state.clientUpdates[clientId] ?? []

    const getImportSummaries = () =>
      [...state.importSummaries].sort((left, right) => parseDateLabel(right.completedAt) - parseDateLabel(left.completedAt))

    const getWorkspaceNotificationFeed = () =>
      [...state.notifications]
        .sort((left, right) => parseDateLabel(right.sentAt) - parseDateLabel(left.sentAt))
        .map((item) => resolveNotificationFeedItem(item, state, "workspace"))

    const getPortalNotificationFeed = (clientId: string) =>
      state.notifications
        .filter((item) => item.clientId === clientId)
        .sort((left, right) => parseDateLabel(right.sentAt) - parseDateLabel(left.sentAt))
        .map((item) => resolveNotificationFeedItem(item, state, "portal"))

    const getOpenNotificationCount = () =>
      getWorkspaceNotificationFeed().filter((item) => item.unread).length

    const getPortalNotificationCount = (clientId: string) =>
      getPortalNotificationFeed(clientId).filter((item) => item.unread).length

    const markNotificationRead = (notificationId: string) => {
      setState((current) => {
        const next = clone(current)
        const notification = next.notifications.find((item) => item.id === notificationId)
        if (!notification || notification.isRead) return current
        notification.isRead = true
        return next
      })
    }

    const markNotificationsRead = (notificationIds: string[]) => {
      if (!notificationIds.length) return

      setState((current) => {
        const next = clone(current)
        let changed = false

        next.notifications.forEach((notification) => {
          if (notificationIds.includes(notification.id) && !notification.isRead) {
            notification.isRead = true
            changed = true
          }
        })

        return changed ? next : current
      })
    }

    const createClient = (input: {
      name: string
      type: string
      context: string
      region: string
      investmentRange: string
      jurisdictionFocus: string
      ownerId: string
    }) => {
      const clientId = normaliseClientId(input.name)
      const owner = internalUsers.find((user) => user.id === input.ownerId) ?? internalUsers[0]
      const today = formatDate()

      setState((current) => {
        const next = clone(current)
        if (next.clients.some((client) => client.id === clientId)) return current

        next.clients.unshift({
          id: clientId,
          name: input.name,
          type: input.type,
          context: input.context,
          status: "Onboarding",
          owner: owner.name,
          ownerId: owner.id,
          jurisdictionFocus: input.jurisdictionFocus,
          portalStatus: "Invitation sent",
          summary: `${input.context} currently being prepared for a more detailed review and quotation stage.`,
          region: input.region,
          investmentRange: input.investmentRange,
        } as ClientRecord)

        next.clientProfiles[clientId] = {
          id: clientId,
          name: input.name,
          contact: "Primary contact",
          owner: owner.name,
          profileType: input.type,
          region: input.region,
          status: "Onboarding",
          applicationStatus: "Initial review",
          summary: `${input.context} prepared for the initial advisory and quotation workflow.`,
          caseId: `case-${Date.now()}`,
          quotationId: "",
          paymentIds: [],
          notes: [
            "Client record created from the quotation flow.",
            `Initial context: ${input.context}.`,
            "Awaiting next operational step.",
          ],
        } as ClientDetailRecord

        next.cases.unshift({
          id: next.clientProfiles[clientId].caseId,
          clientId,
          client: input.name,
          route: input.context,
          stage: "Initial review",
          owner: owner.name,
          ownerId: owner.id,
          nextMilestone: today,
          progress: 18,
          applicationStatus: "Initial review",
          region: input.region,
        } as CaseRecord)

        next.clientUpdates[clientId] = [
          "Your client record has been opened and is ready for the next commercial step.",
        ]

        return next
      })

      return clientId
    }

    const createQuotation = (input: {
      clientId: string
      title: string
      quotationDate: string
      advisorName: string
      currency: string
      serviceFees: QuotationLineItem[]
      governmentFees: QuotationLineItem[]
      optionalItems: QuotationLineItem[]
      discountAmount: number
      discountReason?: string | null
      vatApplied: boolean
      vatPercentage: number
      notes?: string
      terms?: string
    }) => {
      const nextId = `quo-${Date.now().toString().slice(-4)}`

      setState((current) => {
        const next = clone(current)
        const clientRecord = next.clients.find((entry) => entry.id === input.clientId)
        if (!clientRecord) return current

        const linkedCase = next.cases.find((entry) => entry.clientId === input.clientId)
        const newQuotation = buildQuotationComputedFields({
          id: nextId,
          caseId: linkedCase?.id ?? `case-${Date.now()}`,
          clientId: input.clientId,
          client: clientRecord.name,
          status: "Draft",
          currency: input.currency,
          quotationDate: formatDateLabelFromIso(input.quotationDate),
          validUntil: formatDateLabelFromIso(
            new Date(new Date(input.quotationDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          ),
          owner: input.advisorName,
          ownerId:
            internalUsers.find((user) => user.name === input.advisorName)?.id ??
            clientRecord.ownerId,
          note: input.notes?.trim() || `${input.title} prepared for structured review.`,
          title: input.title,
          advisorName: input.advisorName,
          serviceFees: input.serviceFees,
          governmentFees: input.governmentFees,
          optionalItems: input.optionalItems,
          discountAmount: input.discountAmount,
          discountReason: input.discountReason ?? null,
          vatApplied: input.vatApplied,
          vatPercentage: input.vatPercentage,
          notes: input.notes?.trim() || "",
          terms: input.terms?.trim() || "",
          decisionStatus: "Pending",
          sentDate: null,
        } as QuotationRecord)

        next.quotations.unshift(newQuotation)

        if (next.clientProfiles[input.clientId]) {
          next.clientProfiles[input.clientId] = {
            ...next.clientProfiles[input.clientId],
            quotationId: nextId,
          }
        }

        if (linkedCase) {
          linkedCase.nextMilestone = "Quotation under review"
        }

        pushClientUpdate(
          next,
          input.clientId,
          `${input.title} has been prepared and saved as a draft quotation.`,
        )

        return next
      })

      return nextId
    }

    const startFromScratch = () => {
      setState((current) => {
        const next = clone(current)
        clearWorkspaceSeed(next)
        return next
      })
    }

    const importRecords = (input: {
      type: ImportType
      rows: Record<string, string>[]
      fileName: string
      source: ImportSource
      skipInvalidRows?: boolean
    }) => {
      const summary: WorkspaceImportSummary = {
        id: `import-${Date.now()}`,
        importType: input.type,
        source: input.source,
        fileName: input.fileName,
        importedCount: 0,
        skippedCount: 0,
        issueCount: 0,
        issues: [],
        completedAt: formatDateTime(),
      }

      setState((current) => {
        const next = clone(current)
        clearWorkspaceSeed(next)

        input.rows.forEach((row, index) => {
          const rowLabel = `Row ${index + 2}`
          const issuePrefix = `${rowLabel}:`

          switch (input.type) {
            case "leads": {
              if (!row.full_name || !row.email) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} full name and email are required.`)
                return
              }

              const existingLead = next.leads.find(
                (lead) =>
                  lead.email.toLowerCase() === row.email.toLowerCase() &&
                  lead.name.toLowerCase() === row.full_name.toLowerCase(),
              )

              if (existingLead) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} duplicate lead already exists.`)
                return
              }

              next.leads.unshift({
                id: `lead-${Date.now()}-${index}`,
                name: row.full_name,
                companyName: row.company_name || "",
                email: row.email,
                phone: row.phone || "",
                country: row.country || "",
                interest: row.interest || "Imported enquiry",
                status:
                  row.status === "Contacted" || row.status === "Qualified" || row.status === "Converted"
                    ? row.status
                    : "New",
                assignedManager: getInternalUserByName(row.assigned_manager).name,
                sourcePage: row.source_page || "Imported",
                submittedAt: row.submitted_at ? formatDateLabelFromIso(new Date(row.submitted_at).toISOString()) : formatDate(),
                notes: row.notes || "",
              })
              summary.importedCount += 1
              return
            }
            case "clients": {
              if (!row.client_name && !row.company_name) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} client name is required.`)
                return
              }

              ensureImportedClient(next, {
                clientName: row.client_name || row.company_name,
                companyName: row.company_name,
                type: row.client_type,
                context: row.case_context,
                region: row.region || row.country,
                investmentRange: row.investment_range,
                jurisdictionFocus: row.jurisdiction_focus,
                assignedManager: row.assigned_manager,
                email: row.email,
                notes: row.notes,
                status: row.status,
              })
              summary.importedCount += 1
              return
            }
            case "cases": {
              if (!row.client_name || !row.route) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} client name and route are required.`)
                return
              }

              const clientId = ensureImportedClient(next, {
                clientName: row.client_name,
                context: row.route,
                region: row.region,
                assignedManager: row.assigned_manager,
              })

              ensureImportedCase(next, {
                clientId,
                clientName: row.client_name,
                route: row.route,
                stage: row.stage,
                applicationStatus: row.application_status,
                assignedManager: row.assigned_manager,
                nextMilestone: row.next_milestone ? formatDateLabelFromIso(new Date(row.next_milestone).toISOString()) : formatDate(),
                progress: Number(row.progress || 24),
                region: row.region,
              })
              summary.importedCount += 1
              return
            }
            case "quotations": {
              if (!row.client_name || !row.quotation_date || Number.isNaN(Number(row.service_fees_total || 0))) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} client name, quotation date, and service fees total are required.`)
                return
              }

              const clientId = ensureImportedClient(next, {
                clientName: row.client_name,
                context: row.quotation_title || "Imported quotation",
                assignedManager: row.advisor_name,
              })
              const caseId = ensureImportedCase(next, {
                clientId,
                clientName: row.client_name,
                route: row.quotation_title || "Imported commercial scope",
                assignedManager: row.advisor_name,
                applicationStatus: "Commercial preparation",
              })
              const clientRecord = next.clients.find((entry) => entry.id === clientId)
              if (!clientRecord) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} client could not be created.`)
                return
              }

              const quotationId = row.quotation_id?.trim() || `quo-${Date.now()}-${index}`
              next.quotations.unshift(
                buildQuotationComputedFields({
                  id: quotationId.toLowerCase(),
                  caseId,
                  clientId,
                  client: clientRecord.name,
                  status: normaliseQuotationStatusValue(row.status),
                  currency: row.currency?.trim() || "EUR",
                  quotationDate: formatDateLabelFromIso(new Date(row.quotation_date).toISOString()),
                  validUntil: formatDateLabelFromIso(
                    new Date(new Date(row.quotation_date).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                  ),
                  owner: getInternalUserByName(row.advisor_name).name,
                  ownerId: getInternalUserByName(row.advisor_name).id,
                  note: row.notes?.trim() || "Imported quotation",
                  title: row.quotation_title?.trim() || "Imported quotation",
                  advisorName: getInternalUserByName(row.advisor_name).name,
                  serviceFees: [{ label: "Imported service fees", amount: Number(row.service_fees_total || 0) }],
                  governmentFees: [{ label: "Imported government fees", amount: Number(row.government_fees_total || 0) }],
                  optionalItems: [{ label: "Imported optional items", amount: Number(row.optional_items_total || 0) }],
                  discountAmount: Number(row.discount_amount || 0),
                  discountReason: row.discount_reason || null,
                  vatApplied: (row.vat_applied || "").trim().toLowerCase() === "yes" || (row.vat_applied || "").trim().toLowerCase() === "true",
                  vatPercentage: Number(row.vat_percentage || 0),
                  notes: row.notes || "",
                  terms: "Imported into the platform and ready for review.",
                  decisionStatus: normaliseQuotationStatusValue(row.status) === "Accepted" ? "Accepted" : "Pending",
                  sentDate: normaliseQuotationStatusValue(row.status) === "Draft" ? null : formatDateLabelFromIso(new Date(row.quotation_date).toISOString()),
                } as QuotationRecord),
              )

              if (next.clientProfiles[clientId]) {
                next.clientProfiles[clientId] = {
                  ...next.clientProfiles[clientId],
                  quotationId: quotationId.toLowerCase(),
                }
              }
              summary.importedCount += 1
              return
            }
            case "payments": {
              if (!row.client_name || !row.payment_label || Number.isNaN(Number(row.amount || 0)) || !row.due_date) {
                summary.skippedCount += 1
                summary.issues.push(`${issuePrefix} client name, payment label, amount, and due date are required.`)
                return
              }

              const clientId = ensureImportedClient(next, {
                clientName: row.client_name,
                context: row.payment_label,
                assignedManager: row.assigned_manager,
              })
              const caseId = ensureImportedCase(next, {
                clientId,
                clientName: row.client_name,
                route: row.notes?.trim() || "Imported payment workflow",
                assignedManager: row.assigned_manager,
              })
              const paymentId = `pay-${Date.now()}-${index}`

              next.payments.unshift({
                id: paymentId,
                quotationId: row.quotation_id?.trim() || "",
                caseId,
                clientId,
                client: row.client_name,
                label: row.payment_label,
                amount: Number(row.amount || 0),
                currency: row.currency?.trim() || "EUR",
                dueDate: formatDateLabelFromIso(new Date(row.due_date).toISOString()),
                status: normalisePaymentStatusValue(row.status),
                assignedManager: getInternalUserByName(row.assigned_manager).name,
                assignedManagerId: getInternalUserByName(row.assigned_manager).id,
              } as PaymentRecord)

              if (next.clientProfiles[clientId]) {
                next.clientProfiles[clientId] = {
                  ...next.clientProfiles[clientId],
                  paymentIds: [...next.clientProfiles[clientId].paymentIds, paymentId],
                }
              }
              summary.importedCount += 1
              return
            }
            default:
              return
          }
        })

        summary.issueCount = summary.issues.length
        next.importSummaries.unshift(summary)
        return next
      })

      return summary
    }

    const getPortalOverview = (clientId: string) => {
      const caseRecord = getCaseByClientId(clientId)
      const checklist = caseRecord ? getChecklistForCase(caseRecord.id) : []
      const payments = getPaymentsForClient(clientId)

      const pendingDocuments = checklist.filter(
        (item) => item.status === "Rejected" || item.status === "Not Uploaded",
      ).length
      const approvedDocuments = checklist.filter((item) => item.status === "Approved").length
      const pendingPayments = payments.filter(
        (item) =>
          item.status === "Awaiting proof" ||
          item.status === "Under review" ||
          item.status === "Rejected" ||
          item.status === "Due soon",
      ).length

      let nextStep = "Awaiting internal review."
      const rejectedDocument = checklist.find((item) => item.status === "Rejected")
      const missingDocument = checklist.find((item) => item.status === "Not Uploaded")
      const paymentReupload = payments.find((item) => item.status === "Rejected")
      const paymentAwaitingProof = payments.find((item) => item.status === "Awaiting proof")
      const paymentReview = payments.find((item) => item.status === "Under review")

      if (rejectedDocument) {
        nextStep = `Re-upload ${rejectedDocument.item.toLowerCase()}.`
      } else if (paymentReupload) {
        nextStep = `Re-upload proof for ${paymentReupload.label.toLowerCase()}.`
      } else if (paymentAwaitingProof) {
        nextStep = `Upload proof for ${paymentAwaitingProof.label.toLowerCase()}.`
      } else if (missingDocument) {
        nextStep = `Upload ${missingDocument.item.toLowerCase()}.`
      } else if (paymentReview) {
        nextStep = "Your payment evidence is under review."
      } else if (caseRecord?.applicationStatus) {
        nextStep = caseRecord.applicationStatus
      }

      const paymentHeadline =
        pendingPayments > 0 ? `${pendingPayments} payment item${pendingPayments > 1 ? "s" : ""} need attention` : "Payment stages are clear"

      return {
        route: caseRecord?.route ?? portalSnapshot.route,
        stage: caseRecord?.applicationStatus ?? portalSnapshot.currentStage,
        progress: caseRecord?.progress ?? portalSnapshot.progress,
        nextStep,
        pendingDocuments,
        pendingPayments,
        approvedDocuments,
        paymentHeadline,
      }
    }

    const approveDocument = (checklistItemId: string) => {
      setState((current) => {
        const next = clone(current)
        const item = next.checklist.find((entry) => entry.id === checklistItemId)
        if (!item) return current

        item.status = "Approved"
        item.reviewer = "Nour H."
        item.reviewedAt = formatDate()
        item.comment = "Approved for use in the current file."

        const upload = [...next.uploads]
          .filter((entry) => entry.checklistItemId === checklistItemId)
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]

        if (upload) {
          upload.status = "Approved"
        }

        next.reviews.unshift({
          id: `review-${Date.now()}`,
          checklistItemId,
          caseId: item.caseId,
          item: item.item,
          decision: "Approved",
          reviewer: "Nour H.",
          reviewerId: "usr-nour",
          decidedAt: formatDate(),
          note: "Approved for the active case file.",
        })

        pushNotification(next, {
          type: "Document approved",
          channel: "Email",
          recipient: getClientName(item.clientId),
          recipientType: "Client",
          relatedTo: checklistItemId,
          status: "Queued",
          clientId: item.clientId,
        })
        pushClientUpdate(next, item.clientId, `${item.item} has been approved.`)

        syncCaseState(next, item.caseId)
        return next
      })
    }

    const rejectDocument = (checklistItemId: string, reason: string) => {
      setState((current) => {
        const trimmedReason = reason.trim()
        if (!trimmedReason) return current

        const next = clone(current)
        const item = next.checklist.find((entry) => entry.id === checklistItemId)
        if (!item) return current

        item.status = "Rejected"
        item.reviewer = "Nour H."
        item.reviewedAt = formatDate()
        item.comment = trimmedReason

        const upload = [...next.uploads]
          .filter((entry) => entry.checklistItemId === checklistItemId)
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]

        if (upload) {
          upload.status = "Rejected"
        }

        next.reviews.unshift({
          id: `review-${Date.now()}`,
          checklistItemId,
          caseId: item.caseId,
          item: item.item,
          decision: "Rejected",
          reviewer: "Nour H.",
          reviewerId: "usr-nour",
          decidedAt: formatDate(),
          note: trimmedReason,
        })

        pushNotification(next, {
          type: "Document rejected and re-upload requested",
          channel: "Email",
          recipient: getClientName(item.clientId),
          recipientType: "Client",
          relatedTo: checklistItemId,
          status: "Queued",
          clientId: item.clientId,
        })
        pushClientUpdate(next, item.clientId, `${item.item} needs to be uploaded again. ${trimmedReason}`)

        syncCaseState(next, item.caseId)
        return next
      })
    }

    const uploadDocument = (checklistItemId: string, fileName: string, uploadedBy = "Portal user") => {
      setState((current) => {
        const trimmedName = fileName.trim()
        if (!trimmedName) return current

        const next = clone(current)
        const item = next.checklist.find((entry) => entry.id === checklistItemId)
        if (!item) return current

        item.status = "Uploaded"
        item.uploadedAt = formatDate()
        item.reviewer = null
        item.reviewedAt = null
        item.comment = null

        next.uploads.unshift({
          id: `upload-${Date.now()}`,
          checklistItemId,
          caseId: item.caseId,
          client: getClientName(item.clientId),
          fileName: trimmedName,
          uploadedBy,
          uploadedAt: formatDate(),
          status: "Uploaded",
        })

        const caseRecord = next.cases.find((entry) => entry.id === item.caseId)
        pushNotification(next, {
          type: "Document uploaded",
          channel: "Workspace",
          recipient: getAssignedManagerName(caseRecord?.ownerId),
          recipientType: "Internal",
          relatedTo: checklistItemId,
          status: "Sent",
          clientId: item.clientId,
        })
        pushClientUpdate(next, item.clientId, `${item.item} was uploaded and is now awaiting review.`)

        syncCaseState(next, item.caseId)
        return next
      })
    }

    const uploadPaymentProof = (paymentId: string, fileName: string) => {
      setState((current) => {
        const trimmedName = fileName.trim()
        if (!trimmedName) return current

        const next = clone(current)
        const payment = next.payments.find((entry) => entry.id === paymentId)
        if (!payment) return current

        payment.status = "Under review"

        const existingProof = next.paymentProofs.find((entry) => entry.paymentId === paymentId)

        if (existingProof) {
          existingProof.fileName = trimmedName
          existingProof.uploadedAt = formatDate()
          existingProof.status = "Under Review"
          existingProof.reviewer = null
          existingProof.reviewedAt = null
          existingProof.rejectionReason = null
        } else {
          next.paymentProofs.unshift({
            id: `proof-${Date.now()}`,
            paymentId,
            clientId: payment.clientId,
            client: payment.client,
            uploadedAt: formatDate(),
            fileName: trimmedName,
            status: "Under Review",
            reviewer: null,
            reviewerId: null,
            reviewedAt: null,
            rejectionReason: null,
          })
        }

        pushNotification(next, {
          type: "Proof of payment uploaded",
          channel: "Workspace",
          recipient: payment.assignedManager,
          recipientType: "Internal",
          relatedTo: paymentId,
          status: "Sent",
          clientId: payment.clientId,
        })
        pushClientUpdate(next, payment.clientId, `${payment.label} proof has been uploaded and is now under review.`)

        syncQuotationStatus(next, payment.quotationId)
        syncCaseState(next, payment.caseId)
        return next
      })
    }

    const approvePaymentProof = (paymentId: string) => {
      setState((current) => {
        const next = clone(current)
        const payment = next.payments.find((entry) => entry.id === paymentId)
        if (!payment) return current

        payment.status = "Paid"

        const proof = next.paymentProofs.find((entry) => entry.paymentId === paymentId)
        if (proof) {
          proof.status = "Approved"
          proof.reviewer = "Lina F."
          proof.reviewerId = "usr-lina"
          proof.reviewedAt = formatDate()
          proof.rejectionReason = null
        }

        pushNotification(next, {
          type: "Payment approved",
          channel: "Email",
          recipient: payment.client,
          recipientType: "Client",
          relatedTo: paymentId,
          status: "Queued",
          clientId: payment.clientId,
        })
        pushClientUpdate(next, payment.clientId, `${payment.label} has been cleared.`)

        syncQuotationStatus(next, payment.quotationId)
        syncCaseState(next, payment.caseId)
        return next
      })
    }

    const rejectPaymentProof = (paymentId: string, reason: string) => {
      setState((current) => {
        const trimmedReason = reason.trim()
        if (!trimmedReason) return current

        const next = clone(current)
        const payment = next.payments.find((entry) => entry.id === paymentId)
        if (!payment) return current

        payment.status = "Rejected"

        const proof = next.paymentProofs.find((entry) => entry.paymentId === paymentId)
        if (proof) {
          proof.status = "Rejected"
          proof.reviewer = "Lina F."
          proof.reviewerId = "usr-lina"
          proof.reviewedAt = formatDate()
          proof.rejectionReason = trimmedReason
        }

        pushNotification(next, {
          type: "Proof of payment rejected",
          channel: "Email",
          recipient: payment.client,
          recipientType: "Client",
          relatedTo: paymentId,
          status: "Queued",
          clientId: payment.clientId,
        })
        pushClientUpdate(next, payment.clientId, `${payment.label} needs to be uploaded again. ${trimmedReason}`)

        syncQuotationStatus(next, payment.quotationId)
        syncCaseState(next, payment.caseId)
        return next
      })
    }

    return {
      state,
      currentPortalClientId: state.clients[0]?.id ?? CURRENT_PORTAL_CLIENT_ID,
      getAllLeads,
      getAllClients,
      getClientById,
      getClientDetail,
      getCaseByClientId,
      getQuotationByClientId,
      getPaymentsForClient,
      getPaymentProofByPaymentId,
      getChecklistForCase,
      getUploadsForCase,
      getLatestUploadForChecklistItem,
      getReviewsForCase,
      getNotificationsForClient,
      getClientUpdates,
      getImportSummaries,
      getWorkspaceNotificationFeed,
      getPortalNotificationFeed,
      getOpenNotificationCount,
      getPortalNotificationCount,
      markNotificationRead,
      markNotificationsRead,
      createClient,
      createQuotation,
      importRecords,
      startFromScratch,
      getPortalOverview,
      approveDocument,
      rejectDocument,
      uploadDocument,
      uploadPaymentProof,
      approvePaymentProof,
      rejectPaymentProof,
    }
  }, [state])

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)

  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider")
  }

  return context
}
