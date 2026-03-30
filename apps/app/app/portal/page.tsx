import { FileStack, ShieldCheck, UploadCloud } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { portalSnapshot } from "@/lib/mock-data"

export default function ClientPortalPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Client portal"
        title="A simplified view of progress, updates, and requested documents."
        description="The client portal keeps only the essentials in view: where the matter stands, what needs attention next, and which documents are still outstanding."
        actions={<Button className="rounded-full">Upload requested documents</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmSectionCard title="Applicant" description="Current profile in view.">
          <p className="text-sm font-medium text-foreground">{portalSnapshot.applicant}</p>
          <p className="fine-print">{portalSnapshot.route}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Current stage" description="Where the matter currently stands.">
          <CrmStatusBadge status={portalSnapshot.currentStage} />
        </CrmSectionCard>
        <CrmSectionCard title="Next step" description="What is needed next.">
          <p className="text-sm font-medium text-foreground">{portalSnapshot.nextStep}</p>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <CrmSectionCard title="Progress" description="A narrow progress view for external visibility.">
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
                This view is intentionally simplified so only the current stage, next action, and approved updates are visible.
              </p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Recent updates"
          description="Approved updates written for the client-facing side of the matter."
        >
          <div className="space-y-3">
            {portalSnapshot.updates.map((item) => (
              <div key={item} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Documents"
        description="Requested and received files visible inside the simplified client portal."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {portalSnapshot.documents.map((document) => (
            <div key={document.name} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {document.status === "Requested" ? <UploadCloud className="size-4" /> : <FileStack className="size-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{document.name}</p>
                  <div className="mt-2">
                    <CrmStatusBadge status={document.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CrmSectionCard>
    </div>
  )
}
