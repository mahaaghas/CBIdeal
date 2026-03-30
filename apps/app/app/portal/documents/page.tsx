"use client"

import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { DocumentUploadControl } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalDocumentsPage() {
  const {
    currentPortalClientId,
    getCaseByClientId,
    getChecklistForCase,
    getLatestUploadForChecklistItem,
    getPortalOverview,
  } = useWorkflow()

  const caseRecord = getCaseByClientId(currentPortalClientId)
  const checklist = caseRecord ? getChecklistForCase(caseRecord.id) : []
  const overview = getPortalOverview(currentPortalClientId)

  const grouped = checklist.reduce<Record<string, typeof checklist>>((groups, item) => {
    groups[item.category] ??= []
    groups[item.category].push(item)
    return groups
  }, {})

  const firstActionable = checklist.find(
    (item) => item.status === "Rejected" || item.status === "Not Uploaded",
  )

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Documents"
        title="Your document checklist"
        description="Each requested document sits inside one checklist, with its current status and any note that affects what should happen next."
        actions={
          firstActionable ? (
            <DocumentUploadControl
              checklistItemId={firstActionable.id}
              itemLabel={firstActionable.item}
              triggerLabel={firstActionable.status === "Rejected" ? "Upload corrected file" : "Upload document"}
              className="rounded-full"
            />
          ) : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Approved</p>
          <p className="mt-3 text-[2rem] font-semibold text-white">{overview.approvedDocuments}</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Need attention</p>
          <p className="mt-3 text-[2rem] font-semibold text-white">{overview.pendingDocuments}</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current focus</p>
          <p className="mt-3 text-lg font-semibold text-white">{overview.nextStep}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <CrmSectionCard key={category} title={category} description={`${items.length} requested item${items.length === 1 ? "" : "s"}.`}>
            <div className="space-y-3">
              {items.map((item) => {
                const latestUpload = getLatestUploadForChecklistItem(item.id)
                const actionable = item.status === "Rejected" || item.status === "Not Uploaded"

                return (
                  <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium text-foreground">{item.item}</p>
                          <CrmStatusBadge status={item.status} />
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {latestUpload
                            ? `Latest file: ${latestUpload.fileName} · uploaded ${latestUpload.uploadedAt}`
                            : "No file has been uploaded yet."}
                        </p>
                        {item.comment ? <p className="text-sm leading-6 text-muted-foreground">{item.comment}</p> : null}
                      </div>

                      {actionable ? (
                        <DocumentUploadControl
                          checklistItemId={item.id}
                          itemLabel={item.item}
                          triggerLabel={item.status === "Rejected" ? "Re-upload" : "Upload"}
                          className="rounded-full"
                        />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </CrmSectionCard>
        ))}
      </div>
    </div>
  )
}
