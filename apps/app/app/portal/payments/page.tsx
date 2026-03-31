"use client"

import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { PaymentProofUploadControl } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalPaymentsPage() {
  const {
    currentPortalClientId,
    getPaymentsForClient,
    getPaymentProofByPaymentId,
    getPortalOverview,
  } = useWorkflow()

  const payments = getPaymentsForClient(currentPortalClientId)
  const overview = getPortalOverview(currentPortalClientId)
  const firstActionable = payments.find(
    (payment) => payment.status === "Awaiting proof" || payment.status === "Rejected",
  )

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Payments"
        title="Your payment schedule"
        description="Each stage shows what it covers, where it currently stands, and whether anything further is required from you."
        actions={
          firstActionable ? (
            <PaymentProofUploadControl
              paymentId={firstActionable.id}
              paymentLabel={firstActionable.label}
              triggerLabel={firstActionable.status === "Rejected" ? "Re-upload proof" : "Upload proof"}
              className="rounded-full"
            />
          ) : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Open stages</p>
          <p className="mt-3 text-[2rem] font-semibold text-white">{overview.pendingPayments}</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
          <p className="mt-3 text-lg font-semibold text-white">{overview.paymentHeadline}</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Next step</p>
          <p className="mt-3 text-lg font-semibold text-white">{overview.nextStep}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {payments.map((payment) => {
          const proof = getPaymentProofByPaymentId(payment.id)
          const actionable = payment.status === "Awaiting proof" || payment.status === "Rejected"

          return (
            <CrmSectionCard
              key={payment.id}
              title={payment.label}
              description={`${payment.currency} ${payment.amount.toLocaleString()} � due ${payment.dueDate}`}
            >
              <div className="space-y-4 rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Current stage status</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {proof
                        ? `Latest proof: ${proof.fileName} � uploaded ${proof.uploadedAt}`
                        : "No proof of payment has been uploaded yet."}
                    </p>
                  </div>
                  <CrmStatusBadge status={payment.status} />
                </div>

                {proof?.rejectionReason ? (
                  <div className="rounded-[16px] bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                    {proof.rejectionReason}
                  </div>
                ) : null}

                {actionable ? (
                  <PaymentProofUploadControl
                    paymentId={payment.id}
                    paymentLabel={payment.label}
                    triggerLabel={payment.status === "Rejected" ? "Re-upload proof" : "Upload proof"}
                    className="rounded-full"
                  />
                ) : null}
              </div>
            </CrmSectionCard>
          )
        })}
      </div>
    </div>
  )
}

