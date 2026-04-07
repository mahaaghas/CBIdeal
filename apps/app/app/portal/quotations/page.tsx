"use client"

import Link from "next/link"
import { MessageSquareMore, ReceiptText, ShieldCheck } from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { useWorkflow } from "@/lib/workflow-store"

function formatAmount(value: number, currency: string) {
  return `${currency} ${value.toLocaleString()}`
}

export default function PortalQuotationsPage() {
  const { currentPortalClientId, getQuotationByClientId } = useWorkflow()
  const quotation = getQuotationByClientId(currentPortalClientId)

  if (!quotation) {
    return (
      <div className="space-y-8">
        <section className="app-surface rounded-[28px] px-7 py-8 md:px-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Quotation</p>
            <h1 className="font-serif text-[2.2rem] tracking-[-0.04em] text-white">No quotation is active yet.</h1>
            <p className="text-sm leading-7 text-slate-300">
              Once the advisory scope is issued, the commercial structure and payment stages will appear here.
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="app-surface rounded-[28px] px-7 py-8 md:px-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Quotation</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-[2.35rem] tracking-[-0.04em] text-white">Your current quotation</h1>
                <CrmStatusBadge status={quotation.status} className="border-white/10 bg-white/[0.07] text-white" />
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate-300">
                This view shows the current scope and fee structure in a client-readable format. It is intentionally
                clear and limited to the commercial information that matters for your case.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Quotation ref</p>
                <p className="mt-3 text-lg font-semibold text-white">{quotation.id}</p>
              </div>
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Issued</p>
                <p className="mt-3 text-lg font-semibold text-white">{quotation.quotationDate}</p>
              </div>
              <div className="app-surface-soft rounded-[20px] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Valid until</p>
                <p className="mt-3 text-lg font-semibold text-white">{quotation.validUntil}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[28px] px-7 py-8 md:px-8">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <ReceiptText className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Scope note</p>
                <p className="text-sm leading-7 text-slate-300">{quotation.note}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Commercial clarity</p>
                <p className="text-sm leading-7 text-slate-300">
                  This portal does not pretend there is a downloadable legal pack when one is not attached. If you
                  need clarification on the scope or structure, use the messages area and the advisory team can answer
                  directly.
                </p>
              </div>
            </div>

            <Button asChild className="rounded-full">
              <Link href="/portal/messages">
                Ask for clarification
                <MessageSquareMore className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Fee structure</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Service items, programme-related costs, and optional extras are separated so the structure is easier to
                review.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                ["Service fees", quotation.serviceFees],
                ["Government fees", quotation.governmentFees],
                [
                  "Optional items",
                  quotation.optionalItems.length
                    ? quotation.optionalItems
                    : [{ label: "No optional items", amount: 0 }],
                ],
              ].map(([title, items]) => (
                <div key={title} className="app-surface-soft rounded-[20px] px-5 py-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
                  <div className="mt-4 space-y-3">
                    {(items as { label: string; amount: number; quantity?: number }[]).map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-3 text-sm">
                        <span className="leading-6 text-white">{item.label}</span>
                        <span className="shrink-0 font-medium text-slate-200">
                          {item.amount ? formatAmount(item.amount * (item.quantity ?? 1), quotation.currency) : "Included"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Commercial summary</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                A simple read of the totals and validity window connected to the current quotation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-300">Subtotal</span>
                  <span className="text-base font-semibold text-white">
                    {formatAmount(quotation.subtotal ?? 0, quotation.currency)}
                  </span>
                </div>
              </div>
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-300">VAT</span>
                  <span className="text-base font-semibold text-white">
                    {quotation.vatApplied ? `${quotation.vatPercentage}% applied` : "Not applied"}
                  </span>
                </div>
              </div>
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-300">Discount</span>
                  <span className="text-base font-semibold text-white">
                    {quotation.discountAmount ? formatAmount(quotation.discountAmount, quotation.currency) : "None"}
                  </span>
                </div>
              </div>
              <div className="rounded-[20px] border border-white/12 bg-white/[0.05] px-5 py-5 shadow-[0_18px_36px_rgba(6,10,18,0.18)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Total</span>
                  <span className="font-serif text-[2rem] tracking-[-0.03em] text-white">
                    {formatAmount(quotation.total ?? 0, quotation.currency)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Terms and payment sequencing remain visible inside the payments area once the quotation moves into the
              active operational flow.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
