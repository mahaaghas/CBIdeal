"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Bell, CheckCircle2, CreditCard, FileCheck2, Users, Wallet } from "lucide-react"
import { clients } from "@/lib/mock-data"
import { DocumentReviewControls, PaymentReviewControls } from "@/components/workflow-controls"
import { useWorkflow } from "@/lib/workflow-store"

const tabs = [
  { id: "clients", label: "Clients" },
  { id: "documents", label: "Documents" },
  { id: "payments", label: "Payments" },
] as const

function toneClass(tone: string) {
  if (tone === "green") return "app-status-pill app-status-green"
  if (tone === "amber") return "app-status-pill app-status-amber"
  if (tone === "red") return "app-status-pill app-status-red"
  return "app-status-pill app-status-blue"
}

function actionClass(label: string) {
  if (label === "Approve" || label === "Verify") return "app-status-pill app-status-green"
  if (label === "Reject") return "app-status-pill app-status-red"
  if (label === "Retry") return "app-status-pill app-status-blue"
  return "text-slate-300 underline-offset-4 hover:text-white hover:underline"
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"clients" | "documents" | "payments">("clients")
  const [searchTerm, setSearchTerm] = useState("")
  const [pendingOnly, setPendingOnly] = useState(false)
  const {
    state,
    getCaseByClientId,
    getClientDetail,
  } = useWorkflow()

  const clientRows = useMemo(() => clients.map((client) => {
    const caseRecord = getCaseByClientId(client.id)
    const needsAttention =
      caseRecord?.applicationStatus.includes("Awaiting") ||
      caseRecord?.applicationStatus.includes("Rejected")

    return {
      clientId: client.id,
      name: client.name,
      email: getClientDetail(client.id)?.contact ?? client.owner,
      country: client.region,
      progress: caseRecord?.applicationStatus ?? client.context,
      progressTone:
        caseRecord?.applicationStatus.includes("Awaiting") || caseRecord?.applicationStatus.includes("Rejected")
          ? "amber"
          : caseRecord?.applicationStatus.includes("Formal") || caseRecord?.applicationStatus.includes("Approved")
            ? "green"
            : "blue",
      status: needsAttention ? "Action needed" : caseRecord?.applicationStatus === "Formal review" ? "In review" : "On track",
      statusTone: needsAttention ? "amber" : caseRecord?.applicationStatus === "Formal review" ? "green" : "blue",
      joined: caseRecord?.nextMilestone ?? "Active file",
      needsAttention,
    }
  }), [getCaseByClientId, getClientDetail])

  const documentRows = state.checklist
    .filter((item) => item.status !== "Not Uploaded")
    .map((item) => ({
      clientId: item.clientId,
      user: getClientDetail(item.clientId)?.name ?? item.clientId,
      checklistItemId: item.id,
      document: item.item,
      type: item.category,
      typeTone: "blue",
      status: item.status,
      statusTone:
        item.status === "Approved"
          ? "green"
          : item.status === "Rejected"
            ? "red"
            : item.status === "Under Review"
              ? "amber"
              : "blue",
      uploaded: item.uploadedAt ?? "Awaiting upload",
    }))

  const paymentRows = state.payments.slice(0, 6).map((payment) => ({
    paymentId: payment.id,
    clientId: payment.clientId,
    user: payment.client,
    program: getCaseByClientId(payment.clientId)?.route ?? payment.label,
    amount: `${payment.currency} ${payment.amount.toLocaleString()}`,
    status: payment.status,
    statusTone:
      payment.status === "Paid" || payment.status === "Approved"
        ? "green"
        : payment.status === "Rejected" || payment.status === "Overdue"
          ? "red"
          : payment.status === "Awaiting proof" || payment.status === "Due soon"
            ? "amber"
            : "blue",
    date: payment.dueDate,
  }))

  const visibleClientRows = clientRows.filter((row) => {
    const matchesSearch = [row.name, row.email, row.country, row.progress]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return matchesSearch && (!pendingOnly || row.needsAttention)
  })

  const visibleDocumentRows = documentRows.filter((row) => {
    const matchesSearch = [row.user, row.document, row.type, row.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const isPending = row.status === "Uploaded" || row.status === "Under Review" || row.status === "Rejected"
    return matchesSearch && (!pendingOnly || isPending)
  })

  const visiblePaymentRows = paymentRows.filter((row) => {
    const matchesSearch = [row.user, row.program, row.amount, row.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const isPending = row.status === "Under review" || row.status === "Awaiting proof" || row.status === "Rejected"
    return matchesSearch && (!pendingOnly || isPending)
  })

  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const pendingReviews = state.checklist.filter(
    (item) => item.status === "Uploaded" || item.status === "Under Review",
  ).length + state.payments.filter((payment) => payment.status === "Under review").length

  const approvedDocs = state.checklist.filter((item) => item.status === "Approved").length

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
          Manage applications, reviews, payments, and client-facing progress from one structured workspace.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total clients",
            value: `${clients.length}`,
            change: "Live client relationships",
            icon: Users,
            iconClass: "app-kpi-icon",
          },
          {
            label: "Pending reviews",
            value: `${pendingReviews}`,
            change: "Documents and proofs awaiting review",
            icon: Bell,
            iconClass: "bg-[#d8891a]",
          },
          {
            label: "Approved docs",
            value: `${approvedDocs}`,
            change: "Approved checklist items",
            icon: FileCheck2,
            iconClass: "bg-[#46b264]",
          },
          {
            label: "Collected revenue",
            value: `EUR ${(totalRevenue / 1000).toFixed(0)}k`,
            change: "Paid and approved stages",
            icon: Wallet,
            iconClass: "app-kpi-icon",
          },
        ].map((item) => (
          <div key={item.label} className="app-kpi rounded-[22px] px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-[1.05rem] font-medium text-slate-300">{item.label}</p>
                <p className="font-serif text-[3rem] leading-none tracking-[-0.04em] text-white">{item.value}</p>
                <p className="text-base font-medium text-[#54de82]">{item.change}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-[18px] text-white ${item.iconClass}`}>
                <item.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
        <div className="space-y-6">
          <div className="app-tabbar inline-flex rounded-2xl p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSearchTerm("")
                    setPendingOnly(false)
                  }}
                  className={
                    isActive
                      ? "app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium"
                      : "app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium transition-colors hover:text-white"
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative min-w-0 flex-1">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none"
                placeholder={
                  activeTab === "documents"
                    ? "Search documents..."
                    : activeTab === "payments"
                      ? "Search payments..."
                      : "Search clients..."
                }
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPendingOnly((current) => !current)}
              className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white"
            >
              {pendingOnly ? "Show all items" : activeTab === "clients" ? "Show action needed" : "Show pending only"}
            </button>
          </div>

          <div className="app-grid-table bg-[#263248]">
            {activeTab === "clients" ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Country</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Next milestone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClientRows.map((row) => (
                    <tr key={row.clientId}>
                      <td>
                        <div className="space-y-1">
                          <p className="text-[1.05rem] font-semibold text-white">{row.name}</p>
                          <p className="text-sm text-slate-400">{row.email}</p>
                        </div>
                      </td>
                      <td>{row.country}</td>
                      <td><span className={toneClass(row.progressTone)}>{row.progress}</span></td>
                      <td><span className={toneClass(row.statusTone)}>{row.status}</span></td>
                      <td className="text-slate-400">{row.joined}</td>
                      <td>
                        <Link href={`/clients/${row.clientId}`} className="text-slate-300 underline-offset-4 hover:text-white hover:underline">
                          Open record
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {activeTab === "documents" ? (
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
                  {visibleDocumentRows.map((row) => (
                    <tr key={`${row.clientId}-${row.document}`}>
                      <td className="font-semibold text-white">{row.user}</td>
                      <td className="font-semibold text-white">{row.document}</td>
                      <td><span className={toneClass(row.typeTone)}>{row.type}</span></td>
                      <td><span className={toneClass(row.statusTone)}>{row.status}</span></td>
                      <td className="text-slate-400">{row.uploaded}</td>
                      <td>
                        {row.status === "Uploaded" || row.status === "Under Review" ? (
                          <DocumentReviewControls checklistItemId={row.checklistItemId} itemLabel={row.document} />
                        ) : (
                          <Link href={`/clients/${row.clientId}`} className="text-slate-300 underline-offset-4 hover:text-white hover:underline">
                            Open record
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {activeTab === "payments" ? (
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
                  {visiblePaymentRows.map((row) => (
                    <tr key={`${row.clientId}-${row.program}-${row.date}`}>
                      <td className="font-semibold text-white">{row.user}</td>
                      <td className="font-semibold text-white">{row.program}</td>
                      <td className="font-semibold text-[#6289c1]">{row.amount}</td>
                      <td><span className={toneClass(row.statusTone)}>{row.status}</span></td>
                      <td className="text-slate-400">{row.date}</td>
                      <td>
                        {row.status === "Under review" ? (
                          <PaymentReviewControls paymentId={row.paymentId} paymentLabel={row.program} />
                        ) : (
                          <Link
                            href={`/clients/${row.clientId}`}
                            className={actionClass(row.status === "Rejected" ? "Retry" : "Details")}
                          >
                            {row.status === "Rejected" ? "Open record" : "Details"}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 xl:hidden">
        <div className="app-surface rounded-[22px] px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="app-kpi-icon flex size-11 items-center justify-center rounded-[18px] text-white">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Payment review</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Payment stages and client proof uploads stay visible in one place.
              </p>
            </div>
          </div>
        </div>
        <div className="app-surface rounded-[22px] px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#46b264] text-white">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Document approvals</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Checklist decisions and the client-facing result stay aligned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
