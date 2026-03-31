"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, FileCheck2, Users, Wallet } from "lucide-react"
import { CommunicationComposer } from "@/components/communication-composer"
import { DocumentReviewControls } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

function toneClass(tone: string) {
  if (tone === "green") return "app-status-pill app-status-green"
  if (tone === "amber") return "app-status-pill app-status-amber"
  if (tone === "red") return "app-status-pill app-status-red"
  return "app-status-pill app-status-blue"
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pendingOnly, setPendingOnly] = useState(true)
  const { state, getClientDetail } = useWorkflow()

  const pendingReviews = state.checklist.filter((item) => item.status === "Uploaded" || item.status === "Under Review").length
  const approvedDocs = state.checklist.filter((item) => item.status === "Approved").length
  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const rows = state.checklist
    .map((item) => ({
      clientId: item.clientId,
      caseId: item.caseId,
      checklistItemId: item.id,
      user: getClientDetail(item.clientId)?.name ?? item.clientId,
      document: item.item,
      type: item.category,
      status: item.status,
      uploaded: item.uploadedAt ?? "Awaiting upload",
    }))

  const visibleRows = rows.filter((row) => {
    const matchesSearch = [row.user, row.document, row.type, row.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const isPending = row.status === "Uploaded" || row.status === "Under Review" || row.status === "Rejected"
    return matchesSearch && (!pendingOnly || isPending)
  })

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
            Welcome back, Admin
          </h1>
          <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Admin workspace</span>
        </div>
        <p className="max-w-3xl text-[1.05rem] text-slate-200/82">
          Review uploaded records, approve complete documents, and return anything that needs to be corrected.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total clients", value: `${new Set(rows.map((row) => row.clientId)).size}`, change: "Clients with visible records", iconBg: "app-kpi-icon", icon: Users },
          { label: "Pending reviews", value: `${pendingReviews}`, change: "Items awaiting decision", iconBg: "bg-[#d8891a]", icon: Bell },
          { label: "Approved docs", value: `${approvedDocs}`, change: "Checklist items approved", iconBg: "bg-[#46b264]", icon: FileCheck2 },
          { label: "Collected revenue", value: `EUR ${(totalRevenue / 1000).toFixed(0)}k`, change: "Paid and approved stages", iconBg: "app-kpi-icon", icon: Wallet },
        ].map((item) => (
          <div key={item.label} className="app-kpi rounded-[22px] px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-[1.05rem] font-medium text-slate-300">{item.label}</p>
                <p className="font-serif text-[3rem] leading-none tracking-[-0.04em] text-white">{item.value}</p>
                <p className="text-base font-medium text-[#54de82]">{item.change}</p>
              </div>
              <div className={`${item.iconBg} flex size-12 items-center justify-center rounded-[18px] text-white`}>
                <item.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
        <div className="space-y-6">
          <div className="app-tabbar inline-flex rounded-2xl p-1">
            <Link href="/clients" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">Clients</Link>
            <span className="app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium">Documents</span>
            <Link href="/payments" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">Payments</Link>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative min-w-0 flex-1">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none"
                placeholder="Search documents..."
              />
            </div>
            <button
              type="button"
              onClick={() => setPendingOnly((current) => !current)}
              className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white"
            >
              {pendingOnly ? "Show all items" : "Show pending only"}
            </button>
          </div>

          <div className="app-grid-table bg-[#263248]">
            <table className="w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={`${row.clientId}-${row.document}`}>
                    <td className="font-semibold text-white">{row.user}</td>
                    <td className="font-semibold text-white">{row.document}</td>
                    <td><span className={toneClass("blue")}>{row.type}</span></td>
                    <td><span className={toneClass(row.status === "Approved" ? "green" : row.status === "Rejected" ? "red" : row.status === "Under Review" ? "amber" : "blue")}>{row.status}</span></td>
                    <td className="text-slate-400">{row.uploaded}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {row.status === "Uploaded" || row.status === "Under Review" ? (
                          <DocumentReviewControls checklistItemId={row.checklistItemId} itemLabel={row.document} />
                        ) : row.status === "Rejected" || row.status === "Not Uploaded" ? (
                          <CommunicationComposer
                            clientId={row.clientId}
                            caseId={row.caseId}
                            checklistItemId={row.checklistItemId}
                            defaultCategory={row.status === "Rejected" ? "Document re-upload request" : "Missing document"}
                            triggerLabel={row.status === "Rejected" ? "Request re-upload" : "Request document"}
                            className="rounded-full"
                          />
                        ) : (
                          <Link href={`/clients/${row.clientId}`} className="text-slate-300 underline-offset-4 hover:text-white hover:underline">
                            Open record
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
