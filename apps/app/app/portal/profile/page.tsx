"use client"

import { Mail, MapPin, ShieldCheck, UserRound } from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalProfilePage() {
  const {
    currentPortalClientId,
    getPortalUserByClientId,
    getClientDetail,
    getCaseByClientId,
  } = useWorkflow()

  const user = getPortalUserByClientId(currentPortalClientId)
  const client = getClientDetail(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)

  return (
    <div className="space-y-8">
      <section className="app-surface rounded-[28px] px-7 py-8 md:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Profile</p>
          <h1 className="font-serif text-[2.25rem] tracking-[-0.04em] text-white">Account and access details</h1>
          <p className="text-sm leading-7 text-slate-300">
            Profile details stay intentionally simple here so the portal remains focused on the case itself while still
            making contact information and access scope easy to confirm.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <UserRound className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Portal user</p>
                <p className="text-sm leading-6 text-slate-300">The current signed-in contact for this portal view.</p>
              </div>
            </div>

            <div className="app-surface-soft rounded-[18px] px-5 py-4">
              <p className="text-base font-semibold text-white">{user?.name ?? client?.name ?? "Portal user"}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{user?.role ?? client?.profileType ?? "Client contact"}</p>
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Case profile</p>
                <p className="text-sm leading-6 text-slate-300">The active matter currently attached to this account.</p>
              </div>
            </div>

            <div className="app-surface-soft rounded-[18px] px-5 py-4">
              <p className="text-base font-semibold text-white">{caseRecord?.route ?? "No active matter"}</p>
              <div className="mt-3">
                <CrmStatusBadge
                  status={client?.applicationStatus ?? "Portal access active"}
                  className="border-white/10 bg-white/[0.07] text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <Mail className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Contact details</p>
                <p className="text-sm leading-6 text-slate-300">The address used for portal notices and updates.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                <p className="mt-2 text-sm font-semibold text-white">{user?.email ?? "No portal email configured"}</p>
              </div>
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <MapPin className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Portal access status</p>
                    <p className="text-sm leading-6 text-slate-300">{user?.portalStatus ?? "Portal access is active."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
