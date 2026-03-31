"use client"

import Link from "next/link"
import { ArrowRight, CreditCard, FileText, ShieldCheck } from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { DocumentUploadControl, PaymentProofUploadControl } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

export default function ClientPortalPage() {
  const {
    currentPortalClientId,
    getCaseByClientId,
    getChecklistForCase,
    getPaymentsForClient,
    getPortalOverview,
  } = useWorkflow()

  const overview = getPortalOverview(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)
  const checklist = caseRecord ? getChecklistForCase(caseRecord.id) : []
  const payments = getPaymentsForClient(currentPortalClientId)

  const primaryDocumentAction = checklist.find(
    (item) => item.status === "Rejected" || item.status === "Not Uploaded",
  )
  const primaryPaymentAction = payments.find(
    (item) => item.status === "Awaiting proof" || item.status === "Rejected",
  )

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
            Welcome back, Ahmed
          </h1>
          <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Private client</span>
        </div>
        <p className="max-w-3xl text-[1.02rem] leading-7 text-slate-200/82">
          A clear view of your current route, the items that need your attention, and the next step in the process.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="app-surface rounded-[28px] px-7 py-7 md:px-8 md:py-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Current matter</p>
              <h2 className="font-serif text-[2.35rem] tracking-[-0.04em] text-white">{overview.route}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <CrmStatusBadge status={overview.stage} className="border-white/10 bg-white/[0.07] text-white" />
                <span className="text-sm text-slate-300">{overview.progress}% complete</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Next step</p>
                <p className="mt-3 text-lg font-semibold text-white">{overview.nextStep}</p>
              </div>
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Documents</p>
                <p className="mt-3 text-[2rem] font-semibold text-white">{overview.pendingDocuments}</p>
                <p className="mt-1 text-sm text-slate-300">items still need attention</p>
              </div>
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Payments</p>
                <p className="mt-3 text-[2rem] font-semibold text-white">{overview.pendingPayments}</p>
                <p className="mt-1 text-sm text-slate-300">stage{overview.pendingPayments === 1 ? "" : "s"} currently open</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/portal/messages">
                  View updates
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                <Link href="/portal/profile">View profile</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[28px] px-7 py-7 md:px-8 md:py-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">What needs attention</p>
              <h2 className="font-serif text-[2rem] tracking-[-0.035em] text-white">A simpler next move</h2>
              <p className="text-sm leading-7 text-slate-300">
                Where something is waiting on you, it appears here first so you do not need to search through the portal.
              </p>
            </div>

            <div className="space-y-4">
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold text-white">Documents</p>
                    <p className="text-sm leading-6 text-slate-300">
                      {primaryDocumentAction
                        ? `${primaryDocumentAction.item} is currently the main document item waiting on you.`
                        : "No document action is currently needed from you."}
                    </p>
                    {primaryDocumentAction ? (
                      <DocumentUploadControl
                        checklistItemId={primaryDocumentAction.id}
                        itemLabel={primaryDocumentAction.item}
                        triggerLabel={primaryDocumentAction.status === "Rejected" ? "Upload corrected file" : "Upload document"}
                        className="rounded-full"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <CreditCard className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold text-white">Payments</p>
                    <p className="text-sm leading-6 text-slate-300">
                      {primaryPaymentAction
                        ? `${primaryPaymentAction.label} is the current payment step waiting on evidence or review.`
                        : "No payment action is currently needed from you."}
                    </p>
                    {primaryPaymentAction ? (
                      <PaymentProofUploadControl
                        paymentId={primaryPaymentAction.id}
                        paymentLabel={primaryPaymentAction.label}
                        triggerLabel={primaryPaymentAction.status === "Rejected" ? "Re-upload proof" : "Upload proof"}
                        className="rounded-full"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Current position</p>
                    <p className="text-sm leading-6 text-slate-300">{overview.paymentHeadline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Payment stages</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                The payment view keeps only the stages relevant to your matter, together with their current status.
              </p>
            </div>

            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="app-surface-soft rounded-[18px] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[1.02rem] font-semibold text-white">{payment.label}</p>
                      <p className="text-sm text-slate-300">
                        {payment.currency} {payment.amount.toLocaleString()} � due {payment.dueDate}
                      </p>
                    </div>
                    <CrmStatusBadge status={payment.status} className="border-white/10 bg-white/[0.07] text-white" />
                  </div>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="w-full rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
              <Link href="/portal/payments">Open payment detail</Link>
            </Button>
          </div>
        </section>

        <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Document checklist</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Each requested item remains visible until it is approved, so it is always clear what is still needed.
              </p>
            </div>

            <div className="space-y-3">
              {checklist.slice(0, 4).map((item) => (
                <div key={item.id} className="app-surface-soft rounded-[18px] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[1.02rem] font-semibold text-white">{item.item}</p>
                      <p className="text-sm text-slate-300">{item.category}</p>
                    </div>
                    <CrmStatusBadge status={item.status} className="border-white/10 bg-white/[0.07] text-white" />
                  </div>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="w-full rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
              <Link href="/portal/documents">Open document checklist</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

