import Link from "next/link"
import { ArrowRight, Filter, ShieldCheck, Users } from "lucide-react"
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
import { clients } from "@/lib/mock-data"

export default function ClientsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Clients"
        title="Relationship context, account access, and current matters in one place."
        description="The client index is designed for ongoing advisory work rather than simple contact storage. It keeps relationship type, current status, route focus, and portal readiness visible from the same page."
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Client register"
          description="Use the register to move between internal relationship management and external client visibility without changing tools."
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
                <TableHead>Type</TableHead>
                <TableHead>Jurisdiction focus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Portal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-foreground">
                    <Link href={`/clients/${client.id}`} className="inline-flex items-center gap-2 hover:text-primary">
                      {client.name}
                      <ArrowRight className="size-4" />
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{client.summary}</p>
                  </TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>{client.jurisdictionFocus}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={client.status} />
                  </TableCell>
                  <TableCell>{client.portalStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Account structure"
          description="The same workspace supports both internal teams and controlled external access, which keeps the product scalable for firms and client-facing use."
        >
          <div className="space-y-4">
            <div className="rounded-[22px] border border-border/70 bg-background px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Internal team seats</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Advisers, coordinators, and support roles working inside the workspace.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-border/70 bg-background px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">External client accounts</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    A simplified client view for progress, secure uploads, and ongoing updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
