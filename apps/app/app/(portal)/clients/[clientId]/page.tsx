import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, FileStack, MessageSquareMore, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { clientDetails } from "@/lib/mock-data"

type Params = Promise<{ clientId: string }>

export default async function ClientDetailPage({ params }: { params: Params }) {
  const { clientId } = await params
  const client = clientDetails[clientId as keyof typeof clientDetails]

  if (!client) {
    notFound()
  }

  const completeSteps = client.timeline.filter((step) => step.status === "Complete").length
  const progress = Math.round((completeSteps / client.timeline.length) * 100)

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Client detail"
        title={client.name}
        description={`${client.summary} This page keeps profile context, application status, documents, and notes together so the relationship can be understood at a glance.`}
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/clients">
              <ArrowLeft className="size-4" />
              Back to clients
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <CrmSectionCard title="Profile" description="Relationship and applicant type.">
          <p className="text-sm font-medium text-foreground">{client.profileType}</p>
          <p className="fine-print">{client.contact}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Region" description="Primary geography in view.">
          <p className="text-sm font-medium text-foreground">{client.region}</p>
          <p className="fine-print">Relationship owner: {client.owner}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Client status" description="Current relationship status.">
          <CrmStatusBadge status={client.status} />
        </CrmSectionCard>
        <CrmSectionCard title="Application status" description="Current matter position.">
          <CrmStatusBadge status={client.applicationStatus} />
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CrmSectionCard
          title="Case progress"
          description="A simplified view of the current path, useful for both internal review and future client-facing display."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Progress through current path</p>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
          <div className="space-y-3">
            {client.timeline.map((step) => (
              <div
                key={step.step}
                className="flex items-center justify-between gap-3 rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm"
              >
                <p className="text-sm font-medium text-foreground">{step.step}</p>
                <CrmStatusBadge status={step.status} />
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Documents"
          description="Current document position for the matter, including requested and reviewed items."
        >
          <div className="space-y-3">
            {client.documents.map((document) => (
              <div
                key={document.name}
                className="flex items-center justify-between gap-3 rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileStack className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{document.name}</p>
                </div>
                <CrmStatusBadge status={document.status} />
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <CrmSectionCard
          title="Advisory notes"
          description="Short internal notes that keep the relationship context close to the matter."
        >
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
          title="Client-facing readiness"
          description="How this matter could be shown inside the simplified client portal."
        >
          <div className="space-y-3">
            {[
              "Progress can be exposed as a simple stage view without revealing internal-only notes.",
              "Document uploads can remain limited to the records currently marked as requested or pending.",
              "Client updates can be written in a narrower, controlled format for external visibility.",
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
