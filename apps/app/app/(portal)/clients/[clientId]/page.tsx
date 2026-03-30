import Link from "next/link"
import { notFound } from "next/navigation"
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
import {
  clientDetails,
  cases,
  getChecklistForCase,
  getNotificationsForClient,
  getPaymentsForClient,
  getQuotationById,
  getQuotationTotal,
  getReviewsForCase,
  getUploadsForCase,
} from "@/lib/mock-data"

type Params = Promise<{ clientId: string }>

export default async function ClientDetailPage({ params }: { params: Params }) {
  const { clientId } = await params
  const client = clientDetails[clientId as keyof typeof clientDetails]

  if (!client) {
    notFound()
  }

  const currentCase = cases.find((item) => item.id === client.caseId)
  const quotation = client.quotationId ? getQuotationById(client.quotationId) : null
  const payments = getPaymentsForClient(client.id)
  const checklist = getChecklistForCase(client.caseId)
  const uploads = getUploadsForCase(client.caseId)
  const reviews = getReviewsForCase(client.caseId)
  const notifications = getNotificationsForClient(client.id)

  const progress = currentCase?.progress ?? 0
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
        description={`${client.summary} This view keeps the quotation, payment schedule, checklist, reviews, and client-facing activity in one structured workspace so the account manager does not need to reconstruct the case from separate tools.`}
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
          <CrmStatusBadge status={currentCase?.stage ?? client.applicationStatus} />
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
          description="A single progress view covering stage, timing, and what the client should be asked for next."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{currentCase?.route ?? client.applicationStatus}</p>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Next milestone</p>
            <p className="mt-2 text-sm font-medium text-foreground">{currentCase?.nextMilestone ?? "To be confirmed"}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Current stage: {currentCase?.applicationStatus ?? client.applicationStatus}
            </p>
          </div>
          <div className="space-y-3">
            {client.notes.map((note) => (
              <div key={note} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
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
          description="Commercial scope, fee visibility, and payment stages tied directly to the active matter."
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
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Service fees</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {quotation.currency} {quotation.serviceFees.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Government fees</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {quotation.currency} {quotation.governmentFees.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-border/70 bg-muted/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {quotation.currency} {getQuotationTotal(quotation.id).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{payment.label}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {payment.currency} {payment.amount.toLocaleString()} · due {payment.dueDate}
                        </p>
                      </div>
                      <CrmStatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="fine-print">No active quotation is attached to this matter yet.</p>
          )}
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Document checklist"
        description="Required records grouped by category so internal teams and clients can work from the same structure."
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
                {items.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.item}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {item.uploadedAt ? `Uploaded ${item.uploadedAt}` : "Awaiting upload"}
                        </p>
                        {item.comment ? <p className="text-sm leading-6 text-muted-foreground">{item.comment}</p> : null}
                      </div>
                      <CrmStatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CrmSectionCard>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CrmSectionCard
          title="Uploads and review decisions"
          description="Every upload can be reviewed, approved, or returned with a required reason."
        >
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{upload.fileName}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Uploaded by {upload.uploadedBy} · {upload.uploadedAt}
                    </p>
                  </div>
                  <CrmStatusBadge status={upload.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-border/70 pt-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[20px] border border-border/70 bg-muted/20 px-4 py-4">
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
          title="Client-facing notifications"
          description="Workflow-triggered messages keep the client informed without exposing internal-only context."
        >
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.type}</p>
                      <CrmStatusBadge status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.channel} · {item.sentAt}
                    </p>
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
                body: "Clients can read and download their quotation without seeing internal notes or drafting history.",
              },
              {
                icon: CreditCard,
                title: "Payment proof loop",
                body: "Rejected proofs remain attached to the stage with the reason kept visible for re-upload.",
              },
              {
                icon: ShieldCheck,
                title: "Controlled document access",
                body: "Only required checklist items and approved updates appear in the client-facing layer.",
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
        </CrmSectionCard>
      </div>
    </div>
  )
}
