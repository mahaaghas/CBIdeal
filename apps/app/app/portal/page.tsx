import Link from "next/link"
import { CreditCard, FileStack, MessageSquareMore, ReceiptText, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { getPaymentsForClient, getQuotationById, portalSnapshot } from "@/lib/mock-data"

export default function ClientPortalPage() {
  const quotation = getQuotationById(portalSnapshot.quotationId)
  const payments = getPaymentsForClient("a-rahman")

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Client dashboard"
        title="A clear view of your quotation, current progress, and the documents still needed."
        description="This portal keeps the next practical steps close at hand. You can review the current quotation, follow payment stages, upload requested records, and read approved updates without needing to interpret internal casework."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/portal/documents">Upload requested documents</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmSectionCard title="Applicant" description="Current profile in view.">
          <p className="text-sm font-medium text-foreground">{portalSnapshot.applicant}</p>
          <p className="fine-print">{portalSnapshot.route}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Current stage" description="Where the matter currently stands.">
          <CrmStatusBadge status={portalSnapshot.currentStage} />
        </CrmSectionCard>
        <CrmSectionCard title="Next step" description="What requires attention next.">
          <p className="text-sm font-medium text-foreground">{portalSnapshot.nextStep}</p>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CrmSectionCard title="Progress" description="A simplified progress view for the current matter.">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Application progress</p>
              <p className="text-sm text-muted-foreground">{portalSnapshot.progress}%</p>
            </div>
            <Progress value={portalSnapshot.progress} className="h-2.5" />
          </div>
          <div className="rounded-[22px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                This portal is intentionally focused. It shows the current stage, requested records, payment status, and
                approved updates relevant to your case.
              </p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Current overview" description="The key parts of the matter you may need to review next.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ReceiptText className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Quotation</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {quotation ? `${quotation.currency} quotation accepted and kept available for download.` : "No quotation currently available."}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Payments</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {payments.length} payment stages linked to the active matter, including proof uploads where needed.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileStack className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Document checklist</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Required records are grouped and tracked individually so nothing is left ambiguous.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquareMore className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Approved updates</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Key updates appear here in a clear client-facing format as the matter moves forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Recent updates"
        description="Approved updates written for the client-facing side of the matter."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {portalSnapshot.updates.map((item) => (
            <div key={item} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </CrmSectionCard>
    </div>
  )
}
