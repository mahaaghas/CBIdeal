import { ArrowUpToLine, Eye, Filter } from "lucide-react"
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
import { documents } from "@/lib/mock-data"

export default function DocumentsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Documents"
        title="A cleaner record of uploads, requests, and document status."
        description="The document layer keeps file visibility close to the relevant case while staying visually aligned with the wider CBI Deal system. It is designed for review, follow-up, and controlled client access."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CrmSectionCard
          title="Upload and review"
          description="Internal teams can keep uploads, requests, and reviews in one place, while the same structure is ready for external client portal use."
        >
          <div className="rounded-[24px] border border-dashed border-primary/28 bg-primary/[0.04] p-6">
            <p className="text-sm font-medium text-foreground">Upload a document pack</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Use this area for internal uploads today, with room to route the same action through the client portal later.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="rounded-full">
                <ArrowUpToLine className="size-4" />
                Upload files
              </Button>
              <Button variant="outline" className="rounded-full">
                <Eye className="size-4" />
                Review recent uploads
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Awaiting upload", value: "34" },
              { label: "In review", value: "18" },
              { label: "Received", value: "66" },
              { label: "Requested today", value: "7" },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmTableCard
          title="Document queue"
          description="The current queue shows where each document sits, who supplied it, and whether follow-up is still needed."
          action={
            <CrmToolbar
              searchPlaceholder="Search document names or case references"
              actions={
                <Button variant="outline" className="rounded-full">
                  <Filter className="size-4" />
                  Filter
                </Button>
              }
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((row) => (
                <TableRow key={`${row.caseId}-${row.name}`}>
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell>{row.caseId}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>{row.origin}</TableCell>
                  <TableCell>{row.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>
      </div>
    </div>
  )
}
