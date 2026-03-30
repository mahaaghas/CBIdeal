import { Download, ReceiptText } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { getQuotationById, getQuotationTotal, portalSnapshot } from "@/lib/mock-data"

export default function PortalQuotationsPage() {
  const quotation = getQuotationById(portalSnapshot.quotationId)

  if (!quotation) return null

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Quotations"
        title="Your current quotation"
        description="This page sets out the structure of the current quotation, including service fees, programme-related costs, and any optional items that sit outside the core scope."
        actions={
          <Button className="rounded-full">
            <Download className="size-4" />
            Download quotation
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CrmSectionCard title="Quotation summary" description="Current quotation status and validity window.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{quotation.id}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{quotation.client}</p>
                <CrmStatusBadge status={quotation.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Issued {quotation.quotationDate} · valid until {quotation.validUntil}
              </p>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ReceiptText className="size-4" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{quotation.note}</p>
              </div>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Fee structure" description="Line items kept visible for easy review.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Service fees", quotation.serviceFees],
              ["Government fees", quotation.governmentFees],
              ["Optional items", quotation.optionalItems.length ? quotation.optionalItems : [{ label: "No optional items", amount: 0 }]],
            ].map(([title, items]) => (
              <div key={title} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
                <div className="mt-3 space-y-2">
                  {(items as { label: string; amount: number }[]).map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-3 text-sm">
                      <span className="leading-6 text-foreground">{item.label}</span>
                      <span className="shrink-0 font-medium text-foreground">
                        {item.amount ? `${quotation.currency} ${item.amount.toLocaleString()}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[20px] border border-border/70 bg-muted/20 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Total quotation value</p>
              <p className="text-base font-semibold text-foreground">
                {quotation.currency} {getQuotationTotal(quotation.id).toLocaleString()}
              </p>
            </div>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
