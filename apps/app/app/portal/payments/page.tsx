import { CreditCard, UploadCloud } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { getPaymentsForClient } from "@/lib/mock-data"

export default function PortalPaymentsPage() {
  const payments = getPaymentsForClient("a-rahman")

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Payments"
        title="Your payment schedule"
        description="Payment stages are shown here in the order they become relevant. Where a stage requires evidence, you can upload proof of payment directly against that stage."
        actions={
          <Button className="rounded-full">
            <UploadCloud className="size-4" />
            Upload proof of payment
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {payments.map((payment) => (
          <CrmSectionCard
            key={payment.id}
            title={payment.label}
            description={`${payment.currency} ${payment.amount.toLocaleString()} · due ${payment.dueDate}`}
          >
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CreditCard className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Current stage status</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      If a proof upload is needed, it will be reviewed before the stage is marked as cleared.
                    </p>
                  </div>
                </div>
                <CrmStatusBadge status={payment.status} />
              </div>
            </div>
          </CrmSectionCard>
        ))}
      </div>
    </div>
  )
}
