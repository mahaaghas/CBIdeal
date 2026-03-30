import { Bell, CheckCircle2, CreditCard, FileCheck2, Users, Wallet } from "lucide-react"

const tabs = [
  { id: "clients", label: "Clients" },
  { id: "documents", label: "Documents" },
  { id: "payments", label: "Payments" },
] as const

const clientRows = [
  {
    name: "Ahmed Rahman",
    email: "a.rahman@samplemail.com",
    country: "Kuwait",
    progress: "Payment",
    progressTone: "blue",
    status: "Active",
    statusTone: "blue",
    joined: "Jan 15, 2026",
  },
  {
    name: "Al Noor Holdings",
    email: "office@alnoor-demo.com",
    country: "United Arab Emirates",
    progress: "Review",
    progressTone: "amber",
    status: "Pending",
    statusTone: "amber",
    joined: "Jan 18, 2026",
  },
  {
    name: "Westbridge Capital",
    email: "counsel@westbridge-demo.com",
    country: "Qatar",
    progress: "Upload",
    progressTone: "blue",
    status: "Active",
    statusTone: "blue",
    joined: "Jan 20, 2026",
  },
  {
    name: "M. El Sayed",
    email: "m.elsayed@samplemail.com",
    country: "Saudi Arabia",
    progress: "Approved",
    progressTone: "green",
    status: "Approved",
    statusTone: "green",
    joined: "Dec 28, 2025",
  },
] as const

const documentRows = [
  {
    user: "Ahmed Rahman",
    document: "Passport copy",
    type: "Identity",
    typeTone: "blue",
    status: "Approved",
    statusTone: "green",
    uploaded: "Jan 12, 2026",
    actions: ["Download"],
  },
  {
    user: "Al Noor Holdings",
    document: "Source of funds memo",
    type: "Financial",
    typeTone: "blue",
    status: "Pending",
    statusTone: "amber",
    uploaded: "Jan 18, 2026",
    actions: ["Approve", "Reject"],
  },
  {
    user: "Westbridge Capital",
    document: "Board authority resolution",
    type: "Legal",
    typeTone: "blue",
    status: "Pending",
    statusTone: "amber",
    uploaded: "Jan 20, 2026",
    actions: ["Approve", "Reject"],
  },
  {
    user: "M. El Sayed",
    document: "Police clearance",
    type: "Legal",
    typeTone: "blue",
    status: "Rejected",
    statusTone: "red",
    uploaded: "Jan 21, 2026",
    actions: ["Download"],
  },
] as const

const paymentRows = [
  {
    user: "Ahmed Rahman",
    program: "Dominica citizenship",
    amount: "$221,000",
    status: "Completed",
    statusTone: "green",
    date: "Jan 15, 2026",
    actions: ["View receipt"],
  },
  {
    user: "Al Noor Holdings",
    program: "Portugal residence route",
    amount: "EUR 12,000",
    status: "Pending",
    statusTone: "amber",
    date: "Jan 18, 2026",
    actions: ["Verify", "Details"],
  },
  {
    user: "Westbridge Capital",
    program: "European residence structure",
    amount: "EUR 14,000",
    status: "Pending",
    statusTone: "amber",
    date: "Jan 20, 2026",
    actions: ["Verify", "Details"],
  },
  {
    user: "M. El Sayed",
    program: "Strategic relocation",
    amount: "EUR 4,200",
    status: "Failed",
    statusTone: "red",
    date: "Jan 22, 2026",
    actions: ["Retry"],
  },
] as const

function toneClass(tone: string) {
  if (tone === "green") return "app-status-pill app-status-green"
  if (tone === "amber") return "app-status-pill app-status-amber"
  if (tone === "red") return "app-status-pill app-status-red"
  return "app-status-pill app-status-blue"
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>
}) {
  const resolved = searchParams ? await searchParams : undefined
  const activeTab = resolved?.tab === "documents" || resolved?.tab === "payments" ? resolved.tab : "clients"

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
          Manage applications, documents, payments, and client activity from one structured workspace.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total clients",
            value: "248",
            change: "+12% from last month",
            icon: Users,
            iconClass: "app-kpi-icon",
          },
          {
            label: "Pending reviews",
            value: "34",
            change: "+8% from last month",
            icon: Bell,
            iconClass: "bg-[#d8891a]",
          },
          {
            label: "Approved docs",
            value: "892",
            change: "+23% from last month",
            icon: FileCheck2,
            iconClass: "bg-[#46b264]",
          },
          {
            label: "Total revenue",
            value: "$2.4M",
            change: "+18% from last month",
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
                <a
                  key={tab.id}
                  href={`/dashboard?tab=${tab.id}`}
                  className={isActive ? "app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium" : "app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium transition-colors hover:text-white"}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative min-w-0 flex-1">
              <input
                className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none"
                placeholder={
                  activeTab === "documents"
                    ? "Search documents..."
                    : activeTab === "payments"
                      ? "Search payments..."
                      : "Search clients..."
                }
                readOnly
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button
              type="button"
              className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Filter
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
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientRows.map((row) => (
                    <tr key={row.email}>
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
                      <td className="text-slate-400">•••</td>
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
                  {documentRows.map((row) => (
                    <tr key={`${row.user}-${row.document}`}>
                      <td className="font-semibold text-white">{row.user}</td>
                      <td className="font-semibold text-white">{row.document}</td>
                      <td><span className={toneClass(row.typeTone)}>{row.type}</span></td>
                      <td><span className={toneClass(row.statusTone)}>{row.status}</span></td>
                      <td className="text-slate-400">{row.uploaded}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {row.actions.map((action) => (
                            <span
                              key={action}
                              className={
                                action === "Approve"
                                  ? "app-status-pill app-status-green"
                                  : action === "Reject"
                                    ? "app-status-pill app-status-red"
                                    : "text-slate-300"
                              }
                            >
                              {action}
                            </span>
                          ))}
                        </div>
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
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row) => (
                    <tr key={`${row.user}-${row.program}`}>
                      <td className="font-semibold text-white">{row.user}</td>
                      <td className="font-semibold text-white">{row.program}</td>
                      <td className="font-semibold text-[#6289c1]">{row.amount}</td>
                      <td><span className={toneClass(row.statusTone)}>{row.status}</span></td>
                      <td className="text-slate-400">{row.date}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {row.actions.map((action) => (
                            <span
                              key={action}
                              className={
                                action === "Verify"
                                  ? "app-status-pill app-status-green"
                                  : action === "Retry"
                                    ? "app-status-pill app-status-blue"
                                    : "text-slate-300"
                              }
                            >
                              {action}
                            </span>
                          ))}
                        </div>
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
                Quotation-linked payment stages, proof uploads, and reminders stay visible in one place.
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
                Review decisions stay attached to the exact document item so client follow-up remains precise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
