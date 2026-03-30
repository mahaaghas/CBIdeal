import Link from "next/link"
import { Bell, FileCheck2, Users, Wallet } from "lucide-react"

const paymentRows = [
  {
    clientId: "a-rahman",
    user: "Ahmed Rahman",
    program: "Dominica citizenship",
    amount: "$221,000",
    status: "Completed",
    statusTone: "green",
    date: "Jan 15, 2026",
    actions: [{ label: "View receipt", href: "/clients/a-rahman?section=payments" }],
  },
  {
    clientId: "al-noor",
    user: "Al Noor Holdings",
    program: "Portugal residence route",
    amount: "EUR 12,000",
    status: "Pending",
    statusTone: "amber",
    date: "Jan 18, 2026",
    actions: [
      { label: "Verify", href: "/clients/al-noor?section=payments&action=verify" },
      { label: "Details", href: "/clients/al-noor?section=payments" },
    ],
  },
  {
    clientId: "westbridge",
    user: "Westbridge Capital",
    program: "European residence structure",
    amount: "EUR 14,000",
    status: "Pending",
    statusTone: "amber",
    date: "Jan 20, 2026",
    actions: [
      { label: "Verify", href: "/clients/westbridge?section=payments&action=verify" },
      { label: "Details", href: "/clients/westbridge?section=payments" },
    ],
  },
  {
    clientId: "m-elsayed",
    user: "M. El Sayed",
    program: "Strategic relocation",
    amount: "EUR 4,200",
    status: "Failed",
    statusTone: "red",
    date: "Jan 22, 2026",
    actions: [{ label: "Retry", href: "/clients/m-elsayed?section=payments&action=retry" }],
  },
] as const

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
          Track payment stages, verify uploaded proof, and keep client-facing finance records aligned with the case.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total clients", value: "248", change: "+12% from last month", iconBg: "app-kpi-icon", icon: Users },
          { label: "Pending reviews", value: "34", change: "+8% from last month", iconBg: "bg-[#d8891a]", icon: Bell },
          { label: "Approved docs", value: "892", change: "+23% from last month", iconBg: "bg-[#46b264]", icon: FileCheck2 },
          { label: "Total revenue", value: "$2.4M", change: "+18% from last month", iconBg: "app-kpi-icon", icon: Wallet },
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
            <Link href="/dashboard?tab=clients" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">
              Clients
            </Link>
            <Link href="/dashboard?tab=documents" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">
              Documents
            </Link>
            <span className="app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium">Payments</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative min-w-0 flex-1">
              <input className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none" placeholder="Search payments..." />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <Link href="/payments?filter=pending" className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white">
              Filter
            </Link>
          </div>

          <div className="app-grid-table bg-[#263248]">
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
                          <Link key={action.label} href={action.href} className={actionClass(action.label)}>
                            {action.label}
                          </Link>
                        ))}
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
