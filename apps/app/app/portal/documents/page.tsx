"use client"

import { useMemo } from "react"
import { ChevronDown, Clock3, FileWarning, FolderCheck, UploadCloud } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cbideal/ui/components/ui/collapsible"
import { DocumentUploadControl } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

type DocumentBucket = "needs-action" | "under-review" | "approved"

function getDocumentBucket(status: string): DocumentBucket {
  if (status === "Rejected" || status === "Not Uploaded") return "needs-action"
  if (status === "Approved") return "approved"
  return "under-review"
}

function getDisplayStatus(status: string) {
  return status === "Not Uploaded" ? "Needs Action" : status
}

function getStatusMessage(status: string, comment?: string | null) {
  if (status === "Rejected") {
    return comment ?? "This file was returned and needs a corrected upload."
  }

  if (status === "Not Uploaded") {
    return comment ?? "This document is still required before the file can move forward."
  }

  if (status === "Uploaded") {
    return "Your upload has been received and is waiting for internal review."
  }

  if (status === "Under Review") {
    return "This document is currently being reviewed by the case team."
  }

  return "This document has been approved and added to your active file."
}

function getActivityIcon(eventType: string) {
  if (eventType === "document_uploaded") return UploadCloud
  if (eventType === "document_rejected") return FileWarning
  if (eventType === "document_approved") return FolderCheck
  return Clock3
}

export default function PortalDocumentsPage() {
  const {
    currentPortalClientId,
    getCaseByClientId,
    getChecklistForCase,
    getLatestUploadForChecklistItem,
    getDocumentActivityForClient,
    getPortalUserByClientId,
  } = useWorkflow()

  const client = getPortalUserByClientId(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)
  const checklist = caseRecord ? getChecklistForCase(caseRecord.id) : []
  const recentActivity = getDocumentActivityForClient(currentPortalClientId).slice(0, 8)

  const documents = useMemo(
    () =>
      checklist.map((item) => {
        const latestUpload = getLatestUploadForChecklistItem(item.id)
        return {
          ...item,
          latestUpload,
          bucket: getDocumentBucket(item.status),
          displayStatus: getDisplayStatus(item.status),
          statusMessage: getStatusMessage(item.status, item.comment),
        }
      }),
    [checklist, getLatestUploadForChecklistItem],
  )

  const actionRequired = documents.filter((item) => item.bucket === "needs-action")
  const groupedDocuments = [
    {
      title: "Needs Action",
      description: "Documents waiting on you right now.",
      items: actionRequired,
    },
    {
      title: "Under Review",
      description: "Uploads that have already been received and are moving through review.",
      items: documents.filter((item) => item.bucket === "under-review"),
    },
    {
      title: "Approved",
      description: "Files already cleared into the case record.",
      items: documents.filter((item) => item.bucket === "approved"),
    },
  ].filter((group) => group.items.length > 0)

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Documents"
        title="Your document workspace"
        description="Everything you need to upload, re-upload, or track sits here in one action-driven view."
      />

      {actionRequired.length > 0 ? (
        <CrmSectionCard
          title="Action Required"
          description="These items need your attention before the case can keep moving."
          className="app-surface"
        >
          <div className="space-y-4">
            {actionRequired.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-rose-200/12 bg-background px-6 py-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-[1.04rem] font-semibold text-foreground">{item.item}</h3>
                        <CrmStatusBadge status={item.displayStatus} />
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{item.statusMessage}</p>
                    </div>

                    <div className="rounded-[18px] border border-border/60 bg-muted/15 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest upload</p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {item.latestUpload?.fileName ?? "Nothing uploaded yet"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.latestUpload
                          ? `Uploaded ${item.latestUpload.uploadedAt}${item.latestUpload.fileSizeLabel ? ` · ${item.latestUpload.fileSizeLabel}` : ""}`
                          : "Upload the requested file to move this item into review."}
                      </p>
                    </div>
                  </div>

                  <DocumentUploadControl
                    checklistItemId={item.id}
                    itemLabel={item.item}
                    uploadedBy={client?.name ?? "Portal client"}
                    triggerLabel={item.status === "Rejected" ? "Upload corrected file" : "Upload document"}
                    className="cursor-pointer rounded-full transition-colors duration-200 ease-in-out hover:bg-primary/90"
                  />
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      ) : null}

      <CrmSectionCard
        title="Your Documents"
        description="Documents are grouped by status so it stays clear what still needs action and what is already progressing."
        className="app-surface"
      >
        <div className="space-y-6">
          {groupedDocuments.map((group) => (
            <section key={group.title} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-[1.08rem] font-semibold text-foreground">{group.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => {
                  const actionable = item.bucket === "needs-action"

                  return (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-border/70 bg-background px-5 py-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-[1rem] font-semibold text-foreground">{item.item}</h3>
                              <CrmStatusBadge status={item.displayStatus} />
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">{item.statusMessage}</p>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-[18px] border border-border/60 bg-muted/15 px-4 py-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest upload</p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                {item.latestUpload?.fileName ?? "Nothing uploaded yet"}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {item.latestUpload
                                  ? `Uploaded ${item.latestUpload.uploadedAt}${item.latestUpload.fileSizeLabel ? ` · ${item.latestUpload.fileSizeLabel}` : ""}`
                                  : "No file has been attached yet."}
                              </p>
                            </div>

                            <div className="rounded-[18px] border border-border/60 bg-muted/15 px-4 py-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Next step</p>
                              <p className="mt-2 text-sm font-medium text-foreground">
                                {item.nextAction ?? (actionable ? "Upload the requested file." : "No action required.")}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {actionable
                                  ? "Once uploaded, this document will move directly into the live review flow."
                                  : item.bucket === "under-review"
                                    ? "The case team will update the status here as soon as the review is complete."
                                    : "This item is complete and no further action is needed."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {actionable ? (
                          <DocumentUploadControl
                            checklistItemId={item.id}
                            itemLabel={item.item}
                            uploadedBy={client?.name ?? "Portal client"}
                            triggerLabel={item.status === "Rejected" ? "Upload corrected file" : "Upload document"}
                            className="cursor-pointer rounded-full transition-colors duration-200 ease-in-out hover:bg-primary/90"
                          />
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </CrmSectionCard>

      {recentActivity.length > 0 ? (
        <Collapsible className="app-surface rounded-[28px] border border-border/70 px-6 py-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-[1.08rem] font-semibold text-foreground">Activity Log</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Reference history for uploads and review decisions.
                </p>
              </div>

              <CollapsibleTrigger className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 ease-in-out hover:bg-muted/40">
                Show activity
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-3 pt-2">
              {recentActivity.map((event) => {
                const Icon = getActivityIcon(event.eventType)

                return (
                  <div
                    key={event.id}
                    className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium text-foreground">{event.itemLabel}</p>
                          <CrmStatusBadge status={getDisplayStatus(event.toStatus)} />
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {event.actorName} · {event.createdAt}
                        </p>
                        <p className="text-sm leading-6 text-muted-foreground">{event.note ?? "Status updated."}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CollapsibleContent>
          </div>
        </Collapsible>
      ) : null}
    </div>
  )
}
