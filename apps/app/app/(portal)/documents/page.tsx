"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Bell, FileCheck2, Search, Users, Wallet } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { CommunicationComposer } from "@/components/communication-composer"
import { DocumentMissingControl, DocumentReviewControls } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"Pending" | "All" | "Rejected">("Pending")
  const { state, getClientDetail, getLatestUploadForChecklistItem } = useWorkflow()

  const rows = useMemo(
    () =>
      state.checklist.map((item) => ({
        clientId: item.clientId,
        caseId: item.caseId,
        checklistItemId: item.id,
        user: getClientDetail(item.clientId)?.name ?? item.clientId,
        document: item.item,
        type: item.category,
        status: item.status,
        uploaded: item.uploadedAt ?? "Awaiting upload",
        comment: item.comment,
        latestUpload: getLatestUploadForChecklistItem(item.id),
      })),
    [getClientDetail, getLatestUploadForChecklistItem, state.checklist],
  )

  const pendingReviews = rows.filter((row) => row.status === "Uploaded" || row.status === "Under Review").length
  const approvedDocs = rows.filter((row) => row.status === "Approved").length
  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const rejectedItems = rows.filter((row) => row.status === "Rejected").length

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = [row.user, row.document, row.type, row.status]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Rejected"
            ? row.status === "Rejected"
            : row.status === "Uploaded" || row.status === "Under Review" || row.status === "Rejected"

      return matchesSearch && matchesFilter
    })
  }, [filter, rows, searchTerm])

  return (
    <div className="app-page-stack">
      <CrmPageHeader
        eyebrow="Documents"
        title="Document review kept visible, structured, and easy to act on."
        description="Review queues, returned items, and client document pressure stay in one controlled workspace so teams can approve quickly, return files clearly, and move cases forward without ambiguity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Clients with records",
            value: `${new Set(rows.map((row) => row.clientId)).size}`,
            note: "Active clients currently represented in the review register.",
            icon: Users,
            iconClass: "app-kpi-icon",
          },
          {
            label: "Pending reviews",
            value: `${pendingReviews}`,
            note: "Uploaded items currently waiting on an internal decision.",
            icon: Bell,
            iconClass: "app-kpi-icon-warning",
          },
          {
            label: "Approved documents",
            value: `${approvedDocs}`,
            note: "Checklist items already cleared across active matters.",
            icon: FileCheck2,
            iconClass: "app-kpi-icon-success",
          },
          {
            label: "Returned items",
            value: `${rejectedItems}`,
            note: `Collected revenue linked to active matters: ${formatMoney(totalRevenue)}.`,
            icon: Wallet,
            iconClass: "app-kpi-icon",
          },
        ].map((item) => (
          <div key={item.label} className="app-kpi rounded-[22px] px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="app-kpi-label text-[1.02rem] font-medium">{item.label}</p>
                <p className="app-type-metric">{item.value}</p>
                <p className="app-type-caption text-sm">{item.note}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-[18px] text-white ${item.iconClass}`}>
                <item.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CrmTableCard
        title="Document review register"
        description="A calmer operational register for uploaded records, missing items, and returned files. Approval is kept primary, rejection remains clearly visible, and client follow-up stays close to the review context."
        className="app-surface"
        action={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="relative w-full min-w-0 lg:w-[24rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="app-search h-12 w-full rounded-full px-11 text-sm outline-none"
                placeholder="Search client, document, type, or status"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Pending", "Rejected", "All"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === option ? "app-filter-chip-active" : "app-filter-chip"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <Table className="app-grid-table">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.checklistItemId}>
                <TableCell className="min-w-[16rem]">
                  <div className="space-y-1.5">
                    <p className="text-[0.98rem] font-semibold text-white">{row.user}</p>
                    <p className="text-sm leading-6 text-slate-400">{row.clientId}</p>
                  </div>
                </TableCell>
                <TableCell className="min-w-[18rem]">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-white">{row.document}</p>
                    <p className="text-sm leading-6 text-slate-300">
                      {row.status === "Rejected"
                        ? "Returned for correction and re-upload."
                        : row.status === "Not Uploaded"
                          ? "Still missing from the checklist."
                          : "Present in the current review flow."}
                    </p>
                    {row.comment ? <p className="text-sm leading-6 text-slate-400">{row.comment}</p> : null}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="app-status-pill app-status-blue">{row.type}</span>
                </TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-slate-100">{row.latestUpload?.fileName ?? row.uploaded}</p>
                    <p className="text-slate-400">
                      {row.latestUpload
                        ? `Uploaded ${row.latestUpload.uploadedAt}${row.latestUpload.fileSizeLabel ? ` · ${row.latestUpload.fileSizeLabel}` : ""}`
                        : row.status === "Approved"
                          ? "Accepted into file"
                          : "Awaiting client upload"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {row.status === "Uploaded" || row.status === "Under Review" ? (
                      <DocumentReviewControls checklistItemId={row.checklistItemId} itemLabel={row.document} status={row.status} />
                    ) : row.status === "Rejected" || row.status === "Not Uploaded" ? (
                      <>
                        <CommunicationComposer
                          clientId={row.clientId}
                          caseId={row.caseId}
                          checklistItemId={row.checklistItemId}
                          defaultCategory={row.status === "Rejected" ? "Document re-upload request" : "Missing document"}
                          triggerLabel={row.status === "Rejected" ? "Request re-upload" : "Request document"}
                          className="rounded-full"
                        />
                        {row.status !== "Not Uploaded" ? (
                          <DocumentMissingControl
                            checklistItemId={row.checklistItemId}
                            itemLabel={row.document}
                            className="rounded-full"
                          />
                        ) : null}
                      </>
                    ) : (
                      <>
                        <DocumentMissingControl
                          checklistItemId={row.checklistItemId}
                          itemLabel={row.document}
                          className="rounded-full"
                        />
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="app-button-secondary rounded-full"
                        >
                          <Link href={`/clients/${row.clientId}`}>Open record</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>
    </div>
  )
}
