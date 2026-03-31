"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BellRing,
  CreditCard,
  FileStack,
  MessageSquareMore,
  ReceiptText,
  ShieldCheck,
} from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { CommunicationComposer } from "@/components/communication-composer"
import { DocumentReviewControls, PaymentReviewControls } from "@/components/workflow-controls"
import { useCommunication } from "@/lib/communication-store"
import { useWorkflow } from "@/lib/workflow-store"

export default function ClientDetailPage() {
  const params = useParams<{ clientId: string }>()
  const clientId = typeof params.clientId === "string" ? params.clientId : ""
  const {
    getClientDetail,
    getCaseByClientId,
    getQuotationByClientId,
    getPaymentsForClient,
    getPaymentProofByPaymentId,
    getChecklistForCase,
    getLatestUploadForChecklistItem,
    getReviewsForCase,
    getNotificationsForClient,
    getClientUpdates,
  } = useWorkflow()
  const { getCommunicationHistory } = useCommunication()

  const client = getClientDetail(clientId)
  const caseRecord = getCaseByClientId(clientId)

  if (!client || !caseRecord) {
    return (
      <div className="section-stack">
        <CrmSectionCard title="Client not found" description="The requested client record is not available in this workspace state.">
          <Button asChild className="rounded-full">
            <Link href="/clients">Return to clients</Link>
          </Button>
        </CrmSectionCard>
      </div>
    )
  }

  const quotation = getQuotationByClientId(clientId)
  const payments = getPaymentsForClient(clientId)
  const checklist = getChecklistForCase(caseRecord.id)
  const reviews = getReviewsForCase(caseRecord.id)
  const notifications = getNotificationsForClient(clientId)
  const updates = getClientUpdates(clientId)
  const communicationHistory = getCommunicationHistory(clientId)

  const checklistByCategory = checklist.reduce<Record<string, typeof checklist>>((groups, item) => {
    groups[item.category] ??= []
    groups[item.category].push(item)
    return groups
  }, {})

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Client case detail"
        title={client.name}
        description={`${client.summary} This view keeps the payment structure, document decisions, and client-facing update trail connected to the same matter.`}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/clients">
                <ArrowLeft className="size-4" />
                Back to clients
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/portal">Open client portal</Link>
            </Button>
            <CommunicationComposer
              clientId={clientId}
              caseId={caseRecord.id}
              quotationId={quotation?.id}
              defaultCategory="Application progress update"
              triggerLabel="Send progress update"
              className="rounded-full"
            />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <CrmSectionCard title="Client profile" description="Relationship type and primary contact.">
          <p className="text-sm font-medium text-foreground">{client.profileType}</p>
          <p className="fine-print">{client.contact}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Region" description="Primary geography currently in view.">
          <p className="text-sm font-medium text-foreground">{client.region}</p>
          <p className="fine-print">Relationship owner: {client.owner}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Case stage" description="Current matter position.">
          <CrmStatusBadge status={caseRecord.applicationStatus} />
        </CrmSectionCard>
        <CrmSectionCard title="Quotation" description="Commercial status for the active matter.">
          {quotation ? <CrmStatusBadge status={quotation.status} /> : <p className="fine-print">No quotation yet</p>}
        </CrmSectionCard>
        <CrmSectionCard title="Portal visibility" description="External access and case visibility.">
          <CrmStatusBadge status="Portal live" />
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <CrmSectionCard
          title="Case progress"
          description="A clear read on progress, current position, and what the client will see next."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{caseRecord.route}</p>
              <p className="text-sm text-muted-foreground">{caseRecord.progress}%</p>
            </div>
            <Progress value={caseRecord.progress} className="h-2.5" />
          </div>
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Next milestone</p>
            <p className="mt-2 text-sm font-medium text-foreground">{caseRecord.nextMilestone}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Current status: {caseRecord.applicationStatus}</p>
          </div>
          <div className="space-y-3">
            {updates.slice(0, 3).map((note, index) => (
              <div key={`${note}-${index}`} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquareMore className="size-4" />
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Quotation and payment structure"
          description="Commercial scope, payment stages, and finance review decisions attached to the active matter."
        >
          {quotation ? (
            <>
              <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{quotation.id}</p>
                    <p className="text-sm font-medium text-foreground">{quotation.note}</p>
                  </div>
                  <CrmStatusBadge status={quotation.status} />
                </div>
              </div>

              <div className="space-y-3">
                {payments.map((payment) => {
                  const proof = getPaymentProofByPaymentId(payment.id)

                  return (
                    <div key={payment.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{payment.label}</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {payment.currency} {payment.amount.toLocaleString()} · due {payment.dueDate}
                          </p>
                          {proof ? (
                            <p className="text-sm leading-6 text-muted-foreground">
                              Proof: {proof.fileName} · uploaded {proof.uploadedAt}
                            </p>
                          ) : (
                            <p className="text-sm leading-6 text-muted-foreground">Awaiting client upload.</p>
                          )}
                          {proof?.rejectionReason ? (
                            <p className="text-sm leading-6 text-rose-700">{proof.rejectionReason}</p>
                          ) : null}
                        </div>
                        <CrmStatusBadge status={payment.status} />
                      </div>

                      {payment.status === "Under review" ? (
                        <div className="mt-4">
                          <PaymentReviewControls paymentId={payment.id} paymentLabel={payment.label} />
                        </div>
                      ) : null}

                      {payment.status === "Awaiting proof" ||
                      payment.status === "Due soon" ||
                      payment.status === "Rejected" ||
                      payment.status === "Overdue" ? (
                        <div className="mt-3">
                          <CommunicationComposer
                            clientId={clientId}
                            caseId={caseRecord.id}
                            paymentId={payment.id}
                            defaultCategory={payment.status === "Rejected" || payment.status === "Overdue" ? "Overdue payment" : "Payment reminder"}
                            triggerLabel={payment.status === "Rejected" ? "Request new proof" : "Send payment reminder"}
                            className="rounded-full"
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="fine-print">No active quotation is attached to this matter yet.</p>
          )}
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Document checklist"
        description="Required records grouped by category, with review actions attached to the specific item."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {Object.entries(checklistByCategory).map(([category, items]) => (
            <div key={category} className="surface-muted space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{category}</p>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">{items.length} checklist items</h3>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-background text-primary shadow-sm">
                  <FileStack className="size-4" />
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const latestUpload = getLatestUploadForChecklistItem(item.id)
                  const canReview = item.status === "Uploaded" || item.status === "Under Review"
                  const canMessage = item.status === "Rejected" || item.status === "Not Uploaded"

                  return (
                    <div key={item.id} className="rounded-[18px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{item.item}</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {latestUpload
                              ? `${latestUpload.fileName} · uploaded ${latestUpload.uploadedAt}`
                              : "Awaiting upload"}
                          </p>
                          {item.comment ? <p className="text-sm leading-6 text-muted-foreground">{item.comment}</p> : null}
                        </div>
                        <CrmStatusBadge status={item.status} />
                      </div>

                      {canReview ? (
                        <div className="mt-4">
                          <DocumentReviewControls checklistItemId={item.id} itemLabel={item.item} />
                        </div>
                      ) : null}

                      {canMessage ? (
                        <div className="mt-3">
                          <CommunicationComposer
                            clientId={clientId}
                            caseId={caseRecord.id}
                            checklistItemId={item.id}
                            defaultCategory={item.status === "Rejected" ? "Document re-upload request" : "Missing document"}
                            triggerLabel={item.status === "Rejected" ? "Request re-upload" : "Request document"}
                            customReason={item.comment}
                            className="rounded-full"
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CrmSectionCard>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CrmSectionCard
          title="Review trail"
          description="Uploads, decisions, and comments remain visible together so nothing is lost in handover."
        >
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{review.item}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {review.reviewer} · {review.decidedAt}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">{review.note}</p>
                  </div>
                  <CrmStatusBadge status={review.decision} />
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Communication history"
          description="Prepared drafts, sent reminders, and scheduled updates linked to this client."
        >
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Communication overview</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {communicationHistory.length} logged message{communicationHistory.length === 1 ? "" : "s"} across drafts, scheduled reminders, and sent updates.
                  </p>
                </div>
                <CommunicationComposer
                  clientId={clientId}
                  caseId={caseRecord.id}
                  quotationId={quotation?.id}
                  defaultCategory="Application progress update"
                  triggerLabel="Send custom update"
                  className="rounded-full"
                />
              </div>
            </div>

            {communicationHistory.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquareMore className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.templateName}</p>
                      <CrmStatusBadge status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.subject}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.contextSummary}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.sender}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.createdAt}</p>
                    {item.scheduledFor ? (
                      <p className="text-sm leading-6 text-muted-foreground">Scheduled for {item.scheduledFor}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-3 border-t border-border/70 pt-4">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.type}</p>
                      <CrmStatusBadge status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.channel} · {item.sentAt}</p>
                  </div>
                </div>
              </div>
            ))}
            </div>

            <div className="space-y-3 border-t border-border/70 pt-4">
              {[
                {
                  icon: ReceiptText,
                  title: "Quotation visibility",
                  body: "Clients can read and download their quotation without seeing internal drafting notes.",
                },
                {
                  icon: CreditCard,
                  title: "Payment proof loop",
                  body: "Rejected proofs remain attached to the exact stage together with the rejection reason.",
                },
                {
                  icon: ShieldCheck,
                  title: "Controlled document access",
                  body: "Only checklist items and updates relevant to the client appear in the portal.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
