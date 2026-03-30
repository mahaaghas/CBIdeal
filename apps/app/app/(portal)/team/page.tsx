import { Users2 } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { team, workspace } from "@/lib/mock-data"

export default function TeamPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Team"
        title="Internal seats, responsibilities, and workspace capacity."
        description="The team area keeps role visibility, seat structure, and current load close together. It is designed for multi-tenant growth, but the first layer stays simple: internal users, client-facing support, and room for future permissions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmSectionCard title="Internal seats" description="Current advisory, operations, and admin seats inside the workspace.">
          <p className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{workspace.internalSeats}</p>
        </CrmSectionCard>
        <CrmSectionCard title="External accounts" description="Client-facing access that can be granted without opening the full internal workspace.">
          <p className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{workspace.externalAccounts}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Tenant readiness" description="Prepared for firm-level controls, custom branding, and client-specific structure later.">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users2 className="size-4" />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">Structured for one workspace today, with room for wider tenant separation later.</p>
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Team and access roles"
          description="A single register for the people working inside the platform and the roles attached to each seat."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Load</TableHead>
                <TableHead>Seat type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.function}</TableCell>
                  <TableCell>{row.load}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={row.seatType} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Access structure"
          description="The workspace supports a layered model: internal seats for the operating team, and a separate external-facing layer for clients or approved counterparts."
        >
          <div className="space-y-3">
            {[
              "Internal seats remain the primary operating layer for casework, documents, and coordinated review.",
              "External client accounts can be kept intentionally narrow around progress, updates, and uploads.",
              "Later tenant-specific permissions can build on this same structure without replacing the design system.",
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
