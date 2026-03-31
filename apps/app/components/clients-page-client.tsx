"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Bell, FileCheck2, Users, Wallet } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cbideal/ui/components/ui/dialog"
import { Input } from "@cbideal/ui/components/ui/input"
import { useWorkflow } from "@/lib/workflow-store"

function toneClass(tone: string) {
  if (tone === "green") return "app-status-pill app-status-green"
  if (tone === "amber") return "app-status-pill app-status-amber"
  if (tone === "red") return "app-status-pill app-status-red"
  return "app-status-pill app-status-blue"
}

export function ClientsPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [actionNeededOnly, setActionNeededOnly] = useState(false)
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    type: "Private client",
    context: "",
    region: "",
    investmentRange: "",
    jurisdictionFocus: "",
    ownerId: "usr-maha",
  })
  const { state, getAllClients, getCaseByClientId, getClientDetail, createClient } = useWorkflow()

  const createOpen = searchParams.get("create") === "new"
  const returnTo = searchParams.get("returnTo")
  const allClients = getAllClients()

  const rows = useMemo(
    () =>
      allClients.map((client) => {
        const caseRecord = getCaseByClientId(client.id)
        const actionNeeded =
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
          status:
            actionNeeded
              ? "Action needed"
              : caseRecord?.applicationStatus === "Formal review"
                ? "In review"
                : "On track",
          statusTone:
            actionNeeded ? "amber" : caseRecord?.applicationStatus === "Formal review" ? "green" : "blue",
          joined: caseRecord?.nextMilestone ?? "Active file",
          actionNeeded,
        }
      }),
    [allClients, getCaseByClientId, getClientDetail],
  )

  const visibleRows = rows.filter((row) => {
    const matchesSearch = [row.name, row.email, row.country, row.progress, row.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return matchesSearch && (!actionNeededOnly || row.actionNeeded)
  })

  const pendingReviews = state.checklist.filter((item) => item.status === "Uploaded" || item.status === "Under Review").length
  const approvedDocs = state.checklist.filter((item) => item.status === "Approved").length
  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const closeCreateDialog = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("create")
    params.delete("returnTo")
    const query = params.toString()
    router.push(query ? `/clients?${query}` : "/clients")
  }

  const handleCreateClient = () => {
    if (!newClientForm.name.trim() || !newClientForm.context.trim()) return

    const clientId = createClient(newClientForm)

    setNewClientForm({
      name: "",
      type: "Private client",
      context: "",
      region: "",
      investmentRange: "",
      jurisdictionFocus: "",
      ownerId: "usr-maha",
    })

    if (returnTo) {
      router.push(`${returnTo}?client=${clientId}`)
      return
    }

    router.push(`/clients/${clientId}`)
  }

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
              Welcome back, Admin
            </h1>
            <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Admin workspace</span>
          </div>
          <p className="max-w-3xl text-[1.05rem] text-slate-200/82">
            Review live client status, case position, and where attention is currently needed.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total clients", value: `${allClients.length}`, change: "Live client relationships", iconBg: "app-kpi-icon", icon: Users },
            { label: "Pending reviews", value: `${pendingReviews}`, change: "Checklist items awaiting review", iconBg: "bg-[#d8891a]", icon: Bell },
            { label: "Approved docs", value: `${approvedDocs}`, change: "Approved checklist items", iconBg: "bg-[#46b264]", icon: FileCheck2 },
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
              <span className="app-tab app-tab-active rounded-[14px] px-10 py-2.5 text-lg font-medium">Clients</span>
              <Link href="/documents" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">Documents</Link>
              <Link href="/payments" className="app-tab rounded-[14px] px-10 py-2.5 text-lg font-medium">Payments</Link>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative min-w-0 flex-1">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="app-search h-14 w-full rounded-2xl px-12 text-base outline-none"
                  placeholder="Search clients..."
                />
              </div>
              <button
                type="button"
                onClick={() => setActionNeededOnly((current) => !current)}
                className="app-search inline-flex h-14 items-center gap-2 rounded-2xl px-5 text-base font-semibold text-white"
              >
                {actionNeededOnly ? "Show all clients" : "Show action needed"}
              </button>
            </div>

            <div className="app-grid-table bg-[#263248]">
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
                  {visibleRows.map((row) => (
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
            </div>
          </div>
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
        <DialogContent className="app-surface max-w-2xl border-white/10 p-0 text-white">
          <DialogHeader className="border-b border-white/8 px-6 py-6 text-left">
            <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">New client</DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-7 text-slate-300">
              Open a new client record so the quotation workflow can continue with the correct context, ownership, and client-facing structure.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Client or company name</label>
              <Input
                value={newClientForm.name}
                onChange={(event) => setNewClientForm((current) => ({ ...current, name: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Profile type</label>
              <Input
                value={newClientForm.type}
                onChange={(event) => setNewClientForm((current) => ({ ...current, type: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Region</label>
              <Input
                value={newClientForm.region}
                onChange={(event) => setNewClientForm((current) => ({ ...current, region: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Case context</label>
              <Input
                value={newClientForm.context}
                onChange={(event) => setNewClientForm((current) => ({ ...current, context: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Investment range</label>
              <Input
                value={newClientForm.investmentRange}
                onChange={(event) => setNewClientForm((current) => ({ ...current, investmentRange: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Jurisdiction focus</label>
              <Input
                value={newClientForm.jurisdictionFocus}
                onChange={(event) => setNewClientForm((current) => ({ ...current, jurisdictionFocus: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/8 px-6 py-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
              onClick={closeCreateDialog}
            >
              Cancel
            </Button>
            <Button type="button" className="rounded-full" onClick={handleCreateClient}>
              Create client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
