import Link from "next/link"
import { UploadCloud } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { getChecklistForCase, portalSnapshot } from "@/lib/mock-data"

export default function PortalDocumentsPage() {
  const checklist = getChecklistForCase("case-2034")
  const grouped = checklist.reduce<Record<string, typeof checklist>>((groups, item) => {
    groups[item.category] ??= []
    groups[item.category].push(item)
    return groups
  }, {})

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Documents checklist"
        title="Requested and reviewed documents"
        description="Each document request appears as a checklist item so it is clear what has been approved, what is still under review, and what needs to be uploaded again."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/portal/documents?action=upload">
            <UploadCloud className="size-4" />
            Upload document
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <CrmSectionCard key={category} title={category} description={`${items.length} items in this group.`}>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.uploadedAt ? `Uploaded ${item.uploadedAt}` : "Not uploaded yet"}
                      </p>
                      {item.comment ? <p className="text-sm leading-6 text-muted-foreground">{item.comment}</p> : null}
                    </div>
                    <CrmStatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </CrmSectionCard>
        ))}
      </div>

      <CrmSectionCard
        title="Current attention point"
        description="Where the matter currently needs action from you."
      >
        <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
          <p className="text-sm leading-7 text-muted-foreground">{portalSnapshot.nextStep}</p>
        </div>
      </CrmSectionCard>
    </div>
  )
}
