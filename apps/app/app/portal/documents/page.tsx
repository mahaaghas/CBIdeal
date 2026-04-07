"use client"

import { useMemo } from "react"
import { ChevronDown, Clock3, FileWarning, FolderCheck, UploadCloud } from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cbideal/ui/components/ui/collapsible"
import { DocumentUploadControl } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

type DocumentGroup = "needs-action" | "under-review" | "approved"

function getDocumentGroup(status: string): DocumentGroup {
  if (status === "Rejected" || status === "Not Uploaded") return "needs-action"
  if (status === "Approved") return "approved"
  return "under-review"
}

function getStatusLabel(status: string) {
  return status === "Not Uploaded" ? "Needs Action" : status
}

function getStatusBadgeClass(status: string) {
  if (status === "Rejected") return "border-[#8a4950]/40 bg-[#8a4950]/18 text-[#ffe2e5]"
  if (status === "Needs Action" || status === "Not Uploaded") {
    return "border-[#9f7a33]/36 bg-[#9f7a33]/16 text-[#f5e7c2]"
  }
  if (status === "Uploaded" || status === "Under Review") {
    return "border-[#9f7a33]/36 bg-[#9f7a33]/16 text-[#f5e7c2]"
  }
  return "border-[#4a8d5d]/32 bg-[#4a8d5d]/18 text-[#dff6e5]"
}

function getMessage(status: string, comment?: string | null) {
  if (status === "Rejected") {
    return comment ?? "This file was returned and needs a corrected version."
  }

  if (status === "Not Uploaded") {
    return comment ?? "This document is still required."
  }

  if (status === "Uploaded") {
    return "Your upload has been received and is waiting for review."
  }

  if (status === "Under Review") {
    return "This document is currently under review."
  }

  return "This document has been approved and added to your file."
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
  const activity = getDocumentActivityForClient(currentPortalClientId).slice(0, 8)

  const documents = useMemo(
    () =>
      checklist.map((item) => {
        const latestUpload = getLatestUploadForChecklistItem(item.id)

        return {
          ...item,
          latestUpload,
          group: getDocumentGroup(item.status),
          statusLabel: getStatusLabel(item.status),
          message: getMessage(item.status, item.comment),
        }
      }),
    [checklist, getLatestUploadForChecklistItem],
  )

  const actionRequired = documents.filter(
    (item) => item.status === "Rejected" || item.statusLabel === "Needs Action",
  )

  const groupedDocuments = [
    {
      title: "Needs action",
      items: documents.filter((item) => item.group === "needs-action"),
    },
    {
      title: "Under review",
      items: documents.filter((item) => item.group === "under-review"),
    },
    {
      title: "Approved",
      items: documents.filter((item) => item.group === "approved"),
    },
  ].filter((group) => group.items.length > 0)

  return (
    <div className="space-y-8">
      <section className="app-surface rounded-[28px] px-7 py-8 md:px-8">
        <div className="space-y-5">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Documents</p>
            <h1 className="font-serif text-[2.25rem] tracking-[-0.04em] text-white">Your document workspace</h1>
            <p className="text-sm leading-7 text-slate-300">
              Required files, review status, and the next action remain visible together so the portal stays practical
              and easy to trust.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="app-surface-soft rounded-[20px] px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Needs action</p>
              <p className="mt-3 text-[2rem] font-semibold text-white">{actionRequired.length}</p>
            </div>
            <div className="app-surface-soft rounded-[20px] px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Under review</p>
              <p className="mt-3 text-[2rem] font-semibold text-white">
                {documents.filter((item) => item.group === "under-review").length}
              </p>
            </div>
            <div className="app-surface-soft rounded-[20px] px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Approved</p>
              <p className="mt-3 text-[2rem] font-semibold text-white">
                {documents.filter((item) => item.group === "approved").length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {actionRequired.length > 0 ? (
        <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Action required</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                These items need your attention now and can be uploaded directly from this view.
              </p>
            </div>

            <div className="space-y-3">
              {actionRequired.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-5 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[1.02rem] font-semibold text-white">{item.item}</p>
                        <CrmStatusBadge status={item.statusLabel} className={getStatusBadgeClass(item.statusLabel)} />
                      </div>
                      <p className="text-sm leading-6 text-slate-300">{item.message}</p>
                      <p className="text-sm text-slate-400">
                        {item.latestUpload ? `Last upload: ${item.latestUpload.uploadedAt}` : "No file uploaded yet."}
                      </p>
                    </div>

                    <DocumentUploadControl
                      checklistItemId={item.id}
                      itemLabel={item.item}
                      uploadedBy={client?.name ?? "Portal client"}
                      triggerLabel={item.status === "Rejected" ? "Upload corrected file" : "Upload file"}
                      className="rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">All documents</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Everything is grouped by status so it stays obvious what still needs action and what is already complete.
            </p>
          </div>

          <div className="space-y-6">
            {groupedDocuments.map((group) => (
              <section key={group.title} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>

                <div className="space-y-3">
                  {group.items.map((item) => {
                    const actionable = item.group === "needs-action"

                    return (
                      <div key={item.id} className="app-surface-soft rounded-[18px] px-5 py-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-[1.02rem] font-semibold text-white">{item.item}</p>
                              <CrmStatusBadge status={item.statusLabel} className={getStatusBadgeClass(item.statusLabel)} />
                            </div>
                            <p className="text-sm leading-6 text-slate-300">{item.message}</p>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                              <span>
                                Last upload: {item.latestUpload ? item.latestUpload.uploadedAt : "Not uploaded yet"}
                              </span>
                              <span>{item.nextAction ?? (actionable ? "Upload the requested file." : "No further action required.")}</span>
                            </div>
                          </div>

                          {actionable ? (
                            <DocumentUploadControl
                              checklistItemId={item.id}
                              itemLabel={item.item}
                              uploadedBy={client?.name ?? "Portal client"}
                              triggerLabel={item.status === "Rejected" ? "Upload corrected file" : "Upload file"}
                              className="rounded-full"
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
        </div>
      </section>

      {activity.length > 0 ? (
        <Collapsible className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Activity log</h2>
                <p className="text-sm leading-7 text-slate-300">
                  A readable history of uploads and review decisions connected to your file.
                </p>
              </div>

              <CollapsibleTrigger className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]">
                Show activity
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-3 pt-2">
              {activity.map((event) => {
                const Icon = getActivityIcon(event.eventType)

                return (
                  <div key={event.id} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-semibold text-white">{event.itemLabel}</p>
                          <CrmStatusBadge
                            status={getStatusLabel(event.toStatus)}
                            className={getStatusBadgeClass(getStatusLabel(event.toStatus))}
                          />
                        </div>
                        <p className="text-sm leading-6 text-slate-400">
                          {event.actorName} | {event.createdAt}
                        </p>
                        <p className="text-sm leading-6 text-slate-300">{event.note ?? "Status updated."}</p>
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
