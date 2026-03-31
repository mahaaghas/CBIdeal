"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, FileCheck2, Users, Wallet } from "lucide-react"
import { CommunicationComposer } from "@/components/communication-composer"
import { DataImportWorkflow } from "@/components/data-import-workflow"
import { PaymentReviewControls } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

function toneClass(tone: string) {
  if (tone === "green") return "app-status-pill app-status-green"
  if (tone === "amber") return "app-status-pill app-status-amber"
  if (tone === "red") return "app-status-pill app-status-red"
  return "app-status-pill app-status-blue"
}

function actionClass(label: string) {
  if (label === "Verify") return "app-status-pill app-status-green"
  if (label === "Retry") return "app-status-pill app-status-blue"
  return "text-slate-300 underline-offset-4 hover:text-white hover:underline"
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openOnly, setOpenOnly] = useState(true)
  const { state, getCaseByClientId } = useWorkflow()

  const pendingReviews = state.payments.filter((payment) => payment.status === "Under review").length
  const approvedDocs = state.checklist.filter((item) => item.status === "Approved").length
  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const rows = state.payments.map((payment) => ({
    paymentId: payment.id,
    clientId: payment.clientId,
    caseId: payment.caseId,
    user: payment.client,
    program: getCaseByClientId(payment.clientId)?.route ?? payment.label,
    amount: `${payment.currency} ${payment.amount.toLocaleString()}`,
    status: payment.status,
    dueDate: payment.dueDate,
  }))

  const visibleRows = rows.filter((row) => {
    const matchesSearch = [row.user, row.program, row.amount, row.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const isOpen = row.status === "Under review" || row.status === "Awaiting proof" || row.status === "Rejected" || row.status === "Due soon"
    return matchesSearch && (!openOnly || isOpen)
  })

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
              Welcome back, Admin
            </h1>
            <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Admin workspace</span>
          </div>
          <DataImportWorkflow
            source="Workspace"
            defaultType="payments"
            triggerLabel="Import payments"
            title="Import payment stages"
            description="Upload payment schedules from your existing system, map the uploaded columns, and confirm the stages that should enter this workspace."
          />
        </div>
        <p className="max-w-3xl text-[1.05rem] text-slate-200/82">
          Track payment stages, verify uploaded proof, and keep finance visibility aligned with each live matter.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Payment stages", value: `${rows.length}`, change: "Active schedule items", iconBg: "app-kpi-icon", icon: Users },
          { label: "Proofs under review", value: `${pendingReviews}`, change: "Finance review needed", iconBg: "bg-[#d8891a]", icon: Bell },
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
            <Link href="/documents" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">Documents</Link>
            <span className="app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium">Payments</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative min-w-0 flex-1">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none"
                placeholder="Search payments..."
              />
            </div>
            <button
              type="button"
              onClick={() => setOpenOnly((current) => !current)}
              className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white"
            >
              {openOnly ? "Show all stages" : "Show open stages"}
            </button>
          </div>

          <div className="app-grid-table bg-[#263248]">
            <table className="w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Program</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={`${row.clientId}-${row.program}-${row.dueDate}`}>
                    <td className="font-semibold text-white">{row.user}</td>
                    <td className="font-semibold text-white">{row.program}</td>
                    <td className="font-semibold text-[#6289c1]">{row.amount}</td>
                    <td><span className={toneClass(row.status === "Paid" || row.status === "Approved" ? "green" : row.status === "Rejected" || row.status === "Overdue" ? "red" : row.status === "Awaiting proof" || row.status === "Due soon" ? "amber" : "blue")}>{row.status}</span></td>
                    <td className="text-slate-400">{row.dueDate}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {row.status === "Under review" ? (
                          <PaymentReviewControls paymentId={row.paymentId} paymentLabel={row.program} />
                        ) : row.status === "Awaiting proof" || row.status === "Due soon" || row.status === "Rejected" || row.status === "Overdue" ? (
                          <CommunicationComposer
                            clientId={row.clientId}
                            caseId={row.caseId}
                            paymentId={row.paymentId}
                            defaultCategory={row.status === "Rejected" || row.status === "Overdue" ? "Overdue payment" : "Payment reminder"}
                            triggerLabel={row.status === "Rejected" || row.status === "Overdue" ? "Send overdue note" : "Send reminder"}
                            className="rounded-full"
                          />
                        ) : (
                          <Link
                            href={`/clients/${row.clientId}`}
                            className={actionClass(row.status === "Rejected" ? "Retry" : "Details")}
                          >
                            {row.status === "Rejected" ? "Open record" : "Details"}
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
