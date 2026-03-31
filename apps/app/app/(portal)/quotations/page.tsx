import Link from "next/link"
import { ArrowRight, Download, Filter, ReceiptText, Send } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { CrmToolbar } from "@cbideal/ui/components/crm-toolbar"
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
import { getQuotationTotal, quotations } from "@/lib/mock-data"

export default function QuotationsPage() {
  const totals = {
    draft: quotations.filter((item) => item.status === "Draft").length,
    sent: quotations.filter((item) => item.status === "Sent").length,
    accepted: quotations.filter((item) => item.status === "Accepted" || item.status === "Partially Paid").length,
  }

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Quotations"
        title="Quotations arranged around service scope, fee structure, and payment readiness."
        description="Each quotation keeps service fees, government costs, optional items, and notes close to the relevant case. The same record can be reviewed internally and then presented inside the client portal without changing format."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/quotations?export=register">
                <Download className="size-4" />
                Export register
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/clients?compose=quotation">
                <ReceiptText className="size-4" />
                Create quotation
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Draft quotations"
          value={`${totals.draft}`}
          note="Fee schedules still being refined before release."
          trend="Internal review"
        />
        <CrmStatCard
          label="Sent to clients"
          value={`${totals.sent}`}
          note="Quotations already shared through the structured client path."
          trend="Awaiting response"
        />
        <CrmStatCard
          label="Accepted or active"
          value={`${totals.accepted}`}
          note="Accepted quotations already linked to payment stages and live casework."
          trend="Financially active"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Quotation register"
          description="A single operational view across draft, issued, accepted, and paid quotations."
          action={
            <CrmToolbar
              searchPlaceholder="Search quotation IDs, clients, or case references"
              actions={
                <>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/quotations?filter=active">
                      <Filter className="size-4" />
                      Filter
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/quotations?action=resend">
                      <Send className="size-4" />
                      Resend quotation
                    </Link>
                  </Button>
                </>
              }
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid until</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium text-foreground">{quotation.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{quotation.client}</p>
                      <p className="text-xs text-muted-foreground">{quotation.owner}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CrmStatusBadge status={quotation.status} />
                  </TableCell>
                  <TableCell>{quotation.validUntil}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{quotation.currency} {getQuotationTotal(quotation.id).toLocaleString()}</span>
                      {quotation.status !== "Paid" ? (
                        <CommunicationComposer
                          clientId={quotation.clientId}
                          caseId={quotation.caseId}
                          quotationId={quotation.id}
                          defaultCategory="Quotation follow-up"
                          triggerLabel="Follow up"
                          className="rounded-full"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Current quotation focus"
          description="A quieter summary of what internal teams typically need to check before a quotation moves forward."
        >
          <div className="space-y-3">
            {quotations.slice(0, 3).map((quotation) => (
              <div key={quotation.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{quotation.client}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{quotation.note}</p>
                  </div>
                  <CrmStatusBadge status={quotation.status} />
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmTableCard
        title="Quotation detail snapshot"
        description="Line items are kept explicit so clients and internal teams can see the structure of the quote without ambiguity."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {quotations.map((quotation) => (
            <div key={quotation.id} className="surface-muted space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{quotation.id}</p>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">{quotation.client}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{quotation.note}</p>
                </div>
                <CrmStatusBadge status={quotation.status} />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "Service fees",
                    items: quotation.serviceFees,
                  },
                  {
                    title: "Government fees",
                    items: quotation.governmentFees,
                  },
                  {
                    title: "Optional items",
                    items: quotation.optionalItems.length ? quotation.optionalItems : [{ label: "No optional items", amount: 0 }],
                  },
                ].map((group) => (
                  <div key={group.title} className="rounded-[18px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{group.title}</p>
                    <div className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-3 text-sm">
                          <span className="leading-6 text-foreground">{item.label}</span>
                          <span className="shrink-0 font-medium text-foreground">
                            {item.amount ? `${quotation.currency} ${item.amount.toLocaleString()}` : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                <p className="text-sm font-medium text-foreground">Total quotation value</p>
                <p className="text-base font-semibold text-foreground">
                  {quotation.currency} {getQuotationTotal(quotation.id).toLocaleString()}
                </p>
              </div>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href={`/clients/${quotation.clientId}`}>
                  View client record
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <CommunicationComposer
                clientId={quotation.clientId}
                caseId={quotation.caseId}
                quotationId={quotation.id}
                defaultCategory="Quotation follow-up"
                triggerLabel="Send quotation follow-up"
                className="w-full rounded-full"
              />
            </div>
          ))}
        </div>
      </CrmTableCard>
    </div>
  )
}
