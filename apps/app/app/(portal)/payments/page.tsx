import { BellRing, CheckCircle2, Filter, UploadCloud, XCircle } from "lucide-react"
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
import { notificationLog, paymentProofs, paymentSchedules } from "@/lib/mock-data"

export default function PaymentsPage() {
  const dueSoon = paymentSchedules.filter((item) => item.status === "Due soon" || item.status === "Upcoming").length
  const proofsPending = paymentSchedules.filter(
    (item) => item.status === "Awaiting proof" || item.status === "Under review" || item.status === "Rejected",
  ).length
  const approved = paymentSchedules.filter((item) => item.status === "Approved" || item.status === "Paid").length

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Payments"
        title="Payment stages, due dates, and proof review kept inside the same case workflow."
        description="The payment layer is structured around quotation-linked stages rather than loose invoices. Internal teams can track what is due, what is overdue, and what evidence has been uploaded, while client-facing users only see the stages relevant to their matter."
        actions={
          <>
            <Button variant="outline" className="rounded-full">
              <BellRing className="size-4" />
              Review reminders
            </Button>
            <Button className="rounded-full">
              <UploadCloud className="size-4" />
              Log payment proof
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Upcoming stages"
          value={`${dueSoon}`}
          note="Payments approaching or already in their reminder window."
          trend="Due soon"
        />
        <CrmStatCard
          label="Awaiting evidence"
          value={`${proofsPending}`}
          note="Stages waiting on client proof, finance review, or corrected re-upload."
          trend="Needs review"
        />
        <CrmStatCard
          label="Approved stages"
          value={`${approved}`}
          note="Payments already cleared and ready for the next operational step."
          trend="Financially confirmed"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Payment schedule"
          description="A single register for every stage, due date, and current approval position."
          action={
            <CrmToolbar
              searchPlaceholder="Search clients, payment stages, or case IDs"
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
                <TableHead>Client</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentSchedules.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.client}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>
                    {row.currency} {row.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <CrmStatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Proof review queue"
          description="Uploaded proofs can be approved or returned with a required reason before the case moves on."
        >
          <div className="space-y-3">
            {paymentProofs.map((proof) => (
              <div key={proof.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{proof.client}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {proof.fileName} · uploaded {proof.uploadedAt}
                    </p>
                    {proof.rejectionReason ? (
                      <p className="text-sm leading-6 text-muted-foreground">{proof.rejectionReason}</p>
                    ) : null}
                  </div>
                  <CrmStatusBadge status={proof.status} />
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <CrmSectionCard
          title="Approve proof"
          description="Approvals confirm the payment stage and allow the case to move on."
        >
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Once approved, the payment stage can be marked as cleared and the assigned account manager receives a
                confirmation update automatically.
              </p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Reject proof"
          description="Rejected proofs always require a reason so the client knows what must be corrected."
        >
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <XCircle className="size-4" />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Rejections trigger a client message asking for a fresh upload and keep the rejection note visible on the
                payment record.
              </p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Reminder flow"
          description="Upcoming and overdue reminders stay connected to the specific payment stage."
        >
          <div className="space-y-3">
            {notificationLog
              .filter((item) => item.type.includes("Payment") || item.type.includes("payment"))
              .map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <p className="text-sm font-medium text-foreground">{item.type}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.recipient} · {item.sentAt}
                  </p>
                </div>
              ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
