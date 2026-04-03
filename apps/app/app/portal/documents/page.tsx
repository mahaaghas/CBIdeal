"use client"

import { Clock3, FileWarning, FolderCheck, UploadCloud } from "lucide-react"
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
    getDocumentActivityForClient,
    getPortalOverview,
    getPortalUserByClientId,
  } = useWorkflow()

  const client = getPortalUserByClientId(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)
  const checklist = caseRecord ? getChecklistForCase(caseRecord.id) : []
  const overview = getPortalOverview(currentPortalClientId)
  const recentActivity = getDocumentActivityForClient(currentPortalClientId).slice(0, 5)

  const grouped = checklist.reduce<Record<string, typeof checklist>>((groups, item) => {
    groups[item.category] ??= []
    groups[item.category].push(item)
    return groups
  }, {})

  const firstActionable = checklist.find((item) => item.status === "Rejected" || item.status === "Not Uploaded")

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Documents"
        title="Your document checklist"
        description="Each required file stays connected to its status, upload history, and next action so you always know what is complete, what is being reviewed, and what needs to be corrected."
        actions={
          firstActionable ? (
            <DocumentUploadControl
              checklistItemId={firstActionable.id}
              itemLabel={firstActionable.item}
              uploadedBy={client?.name ?? "Portal client"}
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
          <p className="mt-1 text-sm text-slate-300">ready in the case file</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Need attention</p>
          <p className="mt-3 text-[2rem] font-semibold text-white">{overview.pendingDocuments}</p>
          <p className="mt-1 text-sm text-slate-300">items waiting on you</p>
        </div>
        <div className="app-surface-soft rounded-[20px] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current focus</p>
          <p className="mt-3 text-lg font-semibold text-white">{overview.nextStep}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, items]) => (
            <CrmSectionCard
              key={category}
              title={category}
              description={`${items.length} requested item${items.length === 1 ? "" : "s"} connected to your active file.`}
            >
              <div className="space-y-3">
                {items.map((item) => {
                  const latestUpload = getLatestUploadForChecklistItem(item.id)
                  const actionable = item.status === "Rejected" || item.status === "Not Uploaded"

                  return (
                    <div key={item.id} className="rounded-[22px] border border-border/70 bg-background px-5 py-5 shadow-sm">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-[1rem] font-semibold text-foreground">{item.item}</p>
                            <CrmStatusBadge status={item.status} />
                          </div>

                          <p className="text-sm leading-7 text-muted-foreground">
                            {item.status === "Rejected"
                              ? "This file was reviewed and returned. Please upload a corrected version."
                              : item.status === "Not Uploaded"
                                ? "This document is still required before the file can move forward."
                                : item.status === "Approved"
                                  ? "This file has been accepted into the active case record."
                                  : "This file is already in the live review workflow."}
                          </p>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-[18px] border border-border/60 bg-muted/15 px-4 py-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest upload</p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                {latestUpload?.fileName ?? "Nothing uploaded yet"}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {latestUpload
                                  ? `Uploaded ${latestUpload.uploadedAt}${latestUpload.fileSizeLabel ? ` · ${latestUpload.fileSizeLabel}` : ""}`
                                  : "Use the upload action to attach the required file."}
                              </p>
                            </div>

                            <div className="rounded-[18px] border border-border/60 bg-muted/15 px-4 py-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Next action</p>
                              <p className="mt-2 text-sm font-medium text-foreground">{item.nextAction ?? "No action required."}</p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {item.comment ?? "The latest status will stay here until a new action is needed."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {actionable ? (
                          <DocumentUploadControl
                            checklistItemId={item.id}
                            itemLabel={item.item}
                            uploadedBy={client?.name ?? "Portal client"}
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

        <CrmSectionCard
          title="Live document activity"
          description="Recent upload and review changes connected to this checklist."
          className="app-surface"
        >
          <div className="space-y-3">
            {recentActivity.map((event) => (
              <div key={event.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {event.eventType === "document_uploaded" ? (
                      <UploadCloud className="size-4" />
                    ) : event.eventType === "document_rejected" ? (
                      <FileWarning className="size-4" />
                    ) : event.eventType === "document_approved" ? (
                      <FolderCheck className="size-4" />
                    ) : (
                      <Clock3 className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{event.itemLabel}</p>
                      <CrmStatusBadge status={event.toStatus} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {event.actorName} · {event.createdAt}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">{event.note ?? "Status updated."}</p>
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
