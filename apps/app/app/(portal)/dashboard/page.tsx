"use client"

import Link from "next/link"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileCheck2,
  FileSearch,
  FolderKanban,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { clients } from "@/lib/mock-data"
import { useWorkflow } from "@/lib/workflow-store"

function parseDateLabel(value?: string | null) {
  if (!value) return 0

  const normalised = value.replace(",", "")
  const parsed = new Date(normalised).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DashboardPage() {
  const {
    state,
    getCaseByClientId,
    getClientDetail,
    getQuotationByClientId,
    getPaymentsForClient,
  } = useWorkflow()

  const totalClients = clients.length
  const pendingReviews =
    state.checklist.filter((item) => item.status === "Uploaded" || item.status === "Under Review").length +
    state.payments.filter((payment) => payment.status === "Under review").length
  const approvedDocs = state.checklist.filter((item) => item.status === "Approved").length
  const revenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const awaitingDocumentReview = state.checklist.filter(
    (item) => item.status === "Uploaded" || item.status === "Under Review",
  )
  const dueOrOverduePayments = state.payments.filter(
    (payment) =>
      payment.status === "Due soon" ||
      payment.status === "Overdue" ||
      payment.status === "Awaiting proof" ||
      payment.status === "Rejected",
  )
  const missingDocuments = state.checklist.filter((item) => item.status === "Not Uploaded")
  const pendingQuotations = state.quotations.filter(
    (quotation) => quotation.status === "Draft" || quotation.status === "Sent" || quotation.status === "Accepted",
  )

  const actionItems = [
    {
      label: "Documents awaiting review",
      value: awaitingDocumentReview.length,
      note:
        awaitingDocumentReview.length > 0
          ? `${awaitingDocumentReview[0].item} from ${getClientDetail(awaitingDocumentReview[0].clientId)?.name ?? awaitingDocumentReview[0].clientId} is ready for review.`
          : "No document reviews are currently waiting.",
      href: "/documents",
    },
    {
      label: "Payments due or overdue",
      value: dueOrOverduePayments.length,
      note:
        dueOrOverduePayments.length > 0
          ? `${dueOrOverduePayments[0].label} for ${dueOrOverduePayments[0].client} is the next finance priority.`
          : "No payment stages need immediate attention.",
      href: "/payments",
    },
    {
      label: "Missing client documents",
      value: missingDocuments.length,
      note:
        missingDocuments.length > 0
          ? `${missingDocuments[0].item} is still missing for ${getClientDetail(missingDocuments[0].clientId)?.name ?? missingDocuments[0].clientId}.`
          : "No missing checklist items remain across active matters.",
      href: "/documents",
    },
    {
      label: "Pending quotations",
      value: pendingQuotations.length,
      note:
        pendingQuotations.length > 0
          ? `${pendingQuotations[0].id} is the next commercial item requiring movement.`
          : "All active quotations have moved beyond the initial issue stage.",
      href: "/quotations",
    },
  ]

  const stageDistribution = Object.entries(
    state.cases.reduce<Record<string, number>>((accumulator, caseRecord) => {
      accumulator[caseRecord.stage] = (accumulator[caseRecord.stage] ?? 0) + 1
      return accumulator
    }, {}),
  )
    .map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / Math.max(state.cases.length, 1)) * 100),
    }))
    .sort((left, right) => right.value - left.value)

  const documentSegments = [
    {
      label: "Approved",
      value: state.checklist.filter((item) => item.status === "Approved").length,
      className: "bg-[#49b56a]",
    },
    {
      label: "Pending",
      value: state.checklist.filter(
        (item) =>
          item.status === "Uploaded" ||
          item.status === "Under Review" ||
          item.status === "Not Uploaded",
      ).length,
      className: "bg-[#d38a21]",
    },
    {
      label: "Rejected",
      value: state.checklist.filter((item) => item.status === "Rejected").length,
      className: "bg-[#c35a63]",
    },
  ]

  const totalChecklistItems = Math.max(
    documentSegments.reduce((sum, segment) => sum + segment.value, 0),
    1,
  )

  const collectedRevenue = revenue
  const inReviewRevenue = state.payments
    .filter((payment) => payment.status === "Under review" || payment.status === "Awaiting proof")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const scheduledRevenue = state.payments
    .filter((payment) => payment.status === "Upcoming" || payment.status === "Due soon")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const revenueTotal = Math.max(collectedRevenue + inReviewRevenue + scheduledRevenue, 1)

  const quickActions = [
    {
      label: "Create client record",
      body: "Open the client workspace and prepare a new matter.",
      href: "/clients",
    },
    {
      label: "Create quotation",
      body: "Move directly into commercial scope and fee preparation.",
      href: "/quotations",
    },
    {
      label: "Review documents",
      body: "Go straight to the items waiting on a decision.",
      href: "/documents",
    },
    {
      label: "Open portal view",
      body: "See the external client experience and active updates.",
      href: "/portal",
    },
  ]

  const activityItems = [
    ...state.uploads.map((upload) => ({
      id: `upload-${upload.id}`,
      title: "Document uploaded",
      detail: `${upload.client} added ${upload.fileName}.`,
      when: upload.uploadedAt,
      href: `/clients/${clients.find((client) => client.name === upload.client)?.id ?? "a-rahman"}`,
    })),
    ...state.reviews.map((review) => ({
      id: `review-${review.id}`,
      title: review.decision === "Approved" ? "Document approved" : "Document returned",
      detail: `${review.item} was reviewed by ${review.reviewer}.`,
      when: review.decidedAt,
      href: `/clients/${state.cases.find((caseRecord) => caseRecord.id === review.caseId)?.clientId ?? "a-rahman"}`,
    })),
    ...state.paymentProofs.map((proof) => ({
      id: `proof-${proof.id}`,
      title:
        proof.status === "Approved"
          ? "Payment proof approved"
          : proof.status === "Rejected"
            ? "Payment proof returned"
            : "Payment proof submitted",
      detail: `${proof.client} updated ${state.payments.find((payment) => payment.id === proof.paymentId)?.label ?? "payment stage"}.`,
      when: proof.reviewedAt ?? proof.uploadedAt,
      href: `/clients/${proof.clientId}`,
    })),
  ]
    .sort((left, right) => parseDateLabel(right.when) - parseDateLabel(left.when))
    .slice(0, 7)

  const caseSnapshots = state.cases
    .map((caseRecord) => {
      const checklist = state.checklist.filter((item) => item.caseId === caseRecord.id)
      const payments = getPaymentsForClient(caseRecord.clientId)
      const openItems =
        checklist.filter((item) => item.status !== "Approved").length +
        payments.filter((payment) => payment.status !== "Paid" && payment.status !== "Approved").length

      return {
        ...caseRecord,
        clientName: getClientDetail(caseRecord.clientId)?.name ?? caseRecord.client,
        openItems,
      }
    })
    .sort((left, right) => right.openItems - left.openItems || right.progress - left.progress)
    .slice(0, 4)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
            Overview
          </h1>
          <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Operational dashboard</span>
        </div>
        <p className="max-w-3xl text-[1.05rem] text-slate-200/82">
          A high-level view of active matters, immediate priorities, and recent movement across the workspace.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total clients",
            value: `${totalClients}`,
            change: "Live relationships in the workspace",
            icon: Users,
            iconClass: "app-kpi-icon",
          },
          {
            label: "Pending reviews",
            value: `${pendingReviews}`,
            change: "Documents and proof waiting on a decision",
            icon: Bell,
            iconClass: "bg-[#d8891a]",
          },
          {
            label: "Approved documents",
            value: `${approvedDocs}`,
            change: "Checklist items cleared across active files",
            icon: FileCheck2,
            iconClass: "bg-[#46b264]",
          },
          {
            label: "Revenue",
            value: formatCurrency(revenue),
            change: "Collected from paid and approved stages",
            icon: Wallet,
            iconClass: "app-kpi-icon",
          },
        ].map((item) => (
          <div key={item.label} className="app-kpi rounded-[22px] px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-[1.05rem] font-medium text-slate-300">{item.label}</p>
                <p className="font-serif text-[3rem] leading-none tracking-[-0.04em] text-white">{item.value}</p>
                <p className="text-base font-medium text-[#54de82]">{item.change}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-[18px] text-white ${item.iconClass}`}>
                <item.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Action required</p>
                <h2 className="font-serif text-[2.05rem] tracking-[-0.035em] text-white">What needs attention first</h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                  The overview keeps the current pressure points together so reviews, missing documents, payments, and commercial items are visible without opening multiple modules.
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link href="/documents">
                  Review queue
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {actionItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="app-surface-soft rounded-[22px] px-5 py-5 transition-colors hover:bg-white/[0.08]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-sm font-semibold text-white">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{item.note}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                      Open
                      <ChevronRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Quick actions</p>
              <h2 className="font-serif text-[2.05rem] tracking-[-0.035em] text-white">Direct shortcuts</h2>
              <p className="text-sm leading-7 text-slate-300">
                Fast entry points for the actions used most often during daily casework.
              </p>
            </div>

            <div className="space-y-3">
              {quickActions.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-slate-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="app-surface rounded-[24px] px-6 py-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Case stage distribution</p>
              <h2 className="mt-2 font-serif text-[1.9rem] tracking-[-0.03em] text-white">Where active matters sit</h2>
            </div>

            <div className="space-y-4">
              {stageDistribution.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-white">{item.label}</span>
                    <span className="text-slate-300">{item.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#5b78a2]"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Document status</p>
              <h2 className="mt-2 font-serif text-[1.9rem] tracking-[-0.03em] text-white">Checklist position</h2>
            </div>

            <div className="overflow-hidden rounded-full bg-white/[0.05]">
              <div className="flex h-3 w-full">
                {documentSegments.map((segment) => (
                  <div
                    key={segment.label}
                    className={segment.className}
                    style={{ width: `${(segment.value / totalChecklistItems) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {documentSegments.map((segment) => (
                <div key={segment.label} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`size-2.5 rounded-full ${segment.className}`} />
                    <span className="text-white">{segment.label}</span>
                  </div>
                  <span className="text-slate-300">{segment.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Revenue overview</p>
              <h2 className="mt-2 font-serif text-[1.9rem] tracking-[-0.03em] text-white">Commercial position</h2>
            </div>

            {[
              {
                label: "Collected",
                value: collectedRevenue,
                className: "bg-[#49b56a]",
              },
              {
                label: "Awaiting proof or review",
                value: inReviewRevenue,
                className: "bg-[#d38a21]",
              },
              {
                label: "Scheduled",
                value: scheduledRevenue,
                className: "bg-[#5b78a2]",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-white">{item.label}</span>
                  <span className="text-slate-300">{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${item.className}`}
                    style={{ width: `${Math.max((item.value / revenueTotal) * 100, item.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Recent activity</p>
                <h2 className="mt-2 font-serif text-[1.9rem] tracking-[-0.03em] text-white">Latest movement</h2>
              </div>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                <Link href="/documents">Open reviews</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {activityItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-sm text-slate-400">{item.when}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Case snapshot</p>
                <h2 className="mt-2 font-serif text-[1.9rem] tracking-[-0.03em] text-white">Active matters in view</h2>
              </div>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                <Link href="/cases">Open applications</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {caseSnapshots.map((caseRecord) => (
                <Link
                  key={caseRecord.id}
                  href={`/clients/${caseRecord.clientId}`}
                  className="block rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{caseRecord.clientName}</p>
                        <p className="text-sm leading-6 text-slate-300">{caseRecord.route}</p>
                      </div>
                      <CrmStatusBadge status={caseRecord.applicationStatus} className="border-white/10 bg-white/[0.07] text-white" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-300">Progress</span>
                        <span className="text-white">{caseRecord.progress}%</span>
                      </div>
                      <Progress value={caseRecord.progress} className="h-2.5" />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                      <span>{caseRecord.openItems} open item{caseRecord.openItems === 1 ? "" : "s"}</span>
                      <span>{caseRecord.nextMilestone}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 xl:hidden">
        <div className="app-surface rounded-[22px] px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="app-kpi-icon flex size-11 items-center justify-center rounded-[18px] text-white">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Commercial visibility</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Revenue, quotation movement, and payment stages stay visible without opening list pages.
              </p>
            </div>
          </div>
        </div>
        <div className="app-surface rounded-[22px] px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#46b264] text-white">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Operational read</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The overview is now a decision view, with priority items and active case context instead of a registry table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
