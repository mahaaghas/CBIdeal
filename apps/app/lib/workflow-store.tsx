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
  notificationLog,
  paymentProofs,
  paymentSchedules,
  portalSnapshot,
  quotations,
  reviewDecisions,
  workspace,
} from "@/lib/mock-data"

type CaseRecord = (typeof initialCases)[number]
type QuotationRecord = (typeof quotations)[number]
type PaymentRecord = (typeof paymentSchedules)[number]
type PaymentProofRecord = (typeof paymentProofs)[number]
type ChecklistRecord = (typeof documentChecklistItems)[number]
type UploadRecord = (typeof documentUploads)[number]
type ReviewRecord = (typeof reviewDecisions)[number]
type NotificationRecord = (typeof notificationLog)[number] & { clientId?: string }

type WorkflowState = {
  cases: CaseRecord[]
  quotations: QuotationRecord[]
  payments: PaymentRecord[]
  paymentProofs: PaymentProofRecord[]
  checklist: ChecklistRecord[]
  uploads: UploadRecord[]
  reviews: ReviewRecord[]
  notifications: NotificationRecord[]
  clientUpdates: Record<string, string[]>
}

type WorkflowContextValue = {
  state: WorkflowState
  currentPortalClientId: string
  getClientById: (clientId: string) => (typeof clients)[number] | undefined
  getClientDetail: (clientId: string) => (typeof clientDetails)[keyof typeof clientDetails] | undefined
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
  getOpenNotificationCount: () => number
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

function normaliseClientId(raw?: string | null) {
  return raw?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? ""
}

function buildInitialState(): WorkflowState {
  const initialNotifications: NotificationRecord[] = clone(notificationLog).map((item) => {
    const matchedClient = clients.find((client) => client.name === item.recipient)

    return {
      ...item,
      clientId: matchedClient?.id,
    }
  })

  return {
    cases: clone(initialCases),
    quotations: clone(quotations),
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
  }
}

function getClientName(clientId: string) {
  return clients.find((client) => client.id === clientId)?.name ?? clientId
}

function getAssignedManagerName(ownerId?: string) {
  return internalUsers.find((user) => user.id === ownerId)?.name ?? "Account manager"
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

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(buildInitialState)

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      setState(JSON.parse(saved) as WorkflowState)
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<WorkflowContextValue>(() => {
    const getClientById = (clientId: string) => clients.find((client) => client.id === clientId)

    const getClientDetail = (clientId: string) =>
      clientDetails[clientId as keyof typeof clientDetails]

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

    const getOpenNotificationCount = () =>
      state.notifications.filter(
        (item) => item.recipientType === "Internal" && (item.status === "Sent" || item.status === "Queued"),
      ).length

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
      currentPortalClientId: CURRENT_PORTAL_CLIENT_ID,
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
      getOpenNotificationCount,
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
