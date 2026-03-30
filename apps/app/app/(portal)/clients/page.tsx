import Link from "next/link"
import { ArrowRight, CreditCard, FileStack, Filter, ReceiptText, ShieldCheck, Users } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
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
import {
  clientDetails,
  clients,
  getChecklistForCase,
  getPaymentsForClient,
  getQuotationById,
} from "@/lib/mock-data"

export default function ClientsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Clients"
        title="Relationship context, operational visibility, and client-facing access in one register."
        description="The client layer is designed to bring together case progress, commercial records, document readiness, and portal visibility. It works as the main relationship index for internal teams while remaining aligned with the external client experience."
      />

      <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <CrmTableCard
          title="Client register"
          description="Move from relationship context into the underlying case, quotation, payment, and document record without switching views."
          action={
            <CrmToolbar
              searchPlaceholder="Search clients, firms, or route focus"
              actions={
                <>
                  <Button variant="outline" className="rounded-full">
                    <Filter className="size-4" />
                    Filter
                  </Button>
                  <Button asChild className="rounded-full">
                    <Link href="/portal">
                      View client portal
                      <ArrowRight className="size-4" />
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
                <TableHead>Client</TableHead>
                <TableHead>Context</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Current quotation</TableHead>
                <TableHead>Payments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const detail = clientDetails[client.id as keyof typeof clientDetails]
                const quotation = detail?.quotationId ? getQuotationById(detail.quotationId) : null
                const payments = getPaymentsForClient(client.id)

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/clients/${client.id}`} className="inline-flex items-center gap-2 hover:text-primary">
                        {client.name}
                        <ArrowRight className="size-4" />
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{client.summary}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p>{client.context}</p>
                        <p className="text-xs text-muted-foreground">{client.jurisdictionFocus}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CrmStatusBadge status={client.portalStatus} />
                    </TableCell>
                    <TableCell>{quotation ? <CrmStatusBadge status={quotation.status} /> : "—"}</TableCell>
                    <TableCell>{payments.length} stages</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Relationship structure"
          description="The same workspace supports internal decision-making and a quieter client-facing experience."
        >
          <div className="space-y-4">
            {[
              {
                icon: Users,
                title: "Internal team seats",
                body: "Account managers, coordinators, finance, and admin roles work inside the full operating layer.",
              },
              {
                icon: ShieldCheck,
                title: "External client accounts",
                body: "Clients and approved advisers only see the portions of the record that are relevant to their case.",
              },
              {
                icon: ReceiptText,
                title: "Quotation-linked workflows",
                body: "Commercial records stay tied to the client and case, rather than sitting in a separate finance silo.",
              },
              {
                icon: CreditCard,
                title: "Payment visibility",
                body: "Proof uploads, approvals, rejections, and reminders can be managed without leaving the client context.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] border border-border/70 bg-background px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmTableCard
        title="Client readiness snapshot"
        description="A quick cross-check of quotation status, payments, and document readiness for the active client base."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {clients.map((client) => {
            const detail = clientDetails[client.id as keyof typeof clientDetails]
            const quotation = detail?.quotationId ? getQuotationById(detail.quotationId) : null
            const payments = getPaymentsForClient(client.id)
            const checklist = detail?.caseId ? getChecklistForCase(detail.caseId) : []
            const approvedDocs = checklist.filter((item) => item.status === "Approved").length

            return (
              <div key={client.id} className="surface-muted flex h-full flex-col justify-between p-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">{client.name}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{client.region}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quotation</span>
                    {quotation ? <CrmStatusBadge status={quotation.status} /> : <span className="text-sm">—</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment stages</span>
                    <span className="text-sm font-medium text-foreground">{payments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approved documents</span>
                    <span className="text-sm font-medium text-foreground">
                      {approvedDocs}/{checklist.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CrmTableCard>
    </div>
  )
}
