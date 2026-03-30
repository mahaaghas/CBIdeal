import { CheckCircle2, Filter, UploadCloud, XCircle } from "lucide-react"
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
import { documentChecklistItems, documentUploads, reviewDecisions } from "@/lib/mock-data"

export default function DocumentsPage() {
  const categories = Array.from(new Set(documentChecklistItems.map((item) => item.category)))

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Document review queue"
        title="Checklist items, uploads, and review decisions organised in one controlled workflow."
        description="The document layer is built around required checklist items rather than loose files. That keeps each upload tied to a category, a case, a review decision, and a clear next action for the client."
        actions={
          <>
            <Button variant="outline" className="rounded-full">
              <UploadCloud className="size-4" />
              Review latest uploads
            </Button>
            <Button className="rounded-full">Request missing documents</Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <CrmTableCard
          title="Checklist register"
          description="A full register of required items, grouped internally by case but readable at platform level."
          action={
            <CrmToolbar
              searchPlaceholder="Search checklist items, cases, or categories"
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
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentChecklistItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.item}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.caseId}</TableCell>
                  <TableCell>{item.uploadedAt ?? "—"}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Review actions"
          description="Approve and reject paths are kept explicit so client follow-up stays precise."
        >
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Approval records reviewer and date</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Approved items can move straight into the next case step or provider pack without further handling.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                  <XCircle className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Rejection requires a reason</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    The rejection comment stays attached to the checklist item and triggers a re-upload request for the client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>
      </div>

      <CrmTableCard
        title="Current uploads"
        description="A platform-wide view of the files that have been uploaded against checklist items."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Uploaded by</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentUploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell className="font-medium text-foreground">{upload.fileName}</TableCell>
                <TableCell>{upload.client}</TableCell>
                <TableCell>{upload.caseId}</TableCell>
                <TableCell>{upload.uploadedBy}</TableCell>
                <TableCell>
                  <CrmStatusBadge status={upload.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>

      <div className="grid gap-4 xl:grid-cols-5">
        {categories.map((category) => {
          const items = documentChecklistItems.filter((item) => item.category === category)

          return (
            <CrmSectionCard
              key={category}
              title={category}
              description={`${items.length} required items in this document group.`}
              className="xl:col-span-1"
            >
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                    <p className="text-sm font-medium text-foreground">{item.item}</p>
                    <div className="mt-2">
                      <CrmStatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CrmSectionCard>
          )
        })}
      </div>

      <CrmSectionCard
        title="Recent review decisions"
        description="Approved and rejected outcomes stay visible alongside the reason for the decision."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {reviewDecisions.map((review) => (
            <div key={review.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{review.item}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {review.reviewer} · {review.decidedAt}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">{review.note}</p>
                </div>
                <CrmStatusBadge status={review.decision} />
              </div>
            </div>
          ))}
        </div>
      </CrmSectionCard>
    </div>
  )
}
