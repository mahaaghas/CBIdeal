"use client"

import { useMemo, useState } from "react"
import { Check, UploadCloud, X } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cbideal/ui/components/ui/dialog"
import { Input } from "@cbideal/ui/components/ui/input"
import { Textarea } from "@cbideal/ui/components/ui/textarea"
import { useWorkflow } from "@/lib/workflow-store"

export function DocumentReviewControls({
  checklistItemId,
  itemLabel,
}: {
  checklistItemId: string
  itemLabel: string
}) {
  const { approveDocument, rejectDocument } = useWorkflow()
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        className="rounded-full shadow-[0_16px_30px_rgba(17,28,43,0.18)]"
        onClick={() => approveDocument(checklistItemId)}
      >
        <Check className="size-4" />
        Approve
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="app-button-danger-outline rounded-full"
          >
            <X className="size-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-[24px] border-white/10 bg-[#233047] text-white">
          <DialogHeader>
            <DialogTitle>Return document for re-upload</DialogTitle>
            <DialogDescription className="text-slate-300">
              Add a clear reason for returning {itemLabel.toLowerCase()}. The client update and email placeholder will be created automatically.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what needs to be corrected or re-uploaded."
            className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
          />

          <DialogFooter>
            <Button
              variant="outline"
              className="app-button-secondary rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="app-button-danger-solid rounded-full"
              disabled={!reason.trim()}
              onClick={() => {
                rejectDocument(checklistItemId, reason)
                setReason("")
                setOpen(false)
              }}
            >
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function PaymentReviewControls({
  paymentId,
  paymentLabel,
}: {
  paymentId: string
  paymentLabel: string
}) {
  const { approvePaymentProof, rejectPaymentProof } = useWorkflow()
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        className="rounded-full shadow-[0_16px_30px_rgba(17,28,43,0.18)]"
        onClick={() => approvePaymentProof(paymentId)}
      >
        <Check className="size-4" />
        Approve
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="app-button-danger-outline rounded-full"
          >
            <X className="size-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-[24px] border-white/10 bg-[#233047] text-white">
          <DialogHeader>
            <DialogTitle>Reject payment proof</DialogTitle>
            <DialogDescription className="text-slate-300">
              Add the reason for returning the proof on {paymentLabel.toLowerCase()}. The portal notice and email placeholder will update immediately.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what is missing from the proof of payment."
            className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
          />

          <DialogFooter>
            <Button
              variant="outline"
              className="app-button-secondary rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="app-button-danger-solid rounded-full"
              disabled={!reason.trim()}
              onClick={() => {
                rejectPaymentProof(paymentId, reason)
                setReason("")
                setOpen(false)
              }}
            >
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DocumentUploadControl({
  checklistItemId,
  itemLabel,
  triggerLabel,
  uploadedBy = "Ahmed Rahman",
  className,
}: {
  checklistItemId: string
  itemLabel: string
  triggerLabel?: string
  uploadedBy?: string
  className?: string
}) {
  const { uploadDocument } = useWorkflow()
  const [fileName, setFileName] = useState("")
  const [open, setOpen] = useState(false)
  const label = useMemo(() => triggerLabel ?? "Upload", [triggerLabel])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className ?? "rounded-full"}>
          <UploadCloud className="size-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[24px] border-white/10 bg-[#233047] text-white">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription className="text-slate-300">
            Add the file name for {itemLabel.toLowerCase()}. This will move the item into review and notify the assigned account manager.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="example-file.pdf"
          className="rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
        />

        <DialogFooter>
          <Button
            variant="outline"
            className="app-button-secondary rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full"
            disabled={!fileName.trim()}
            onClick={() => {
              uploadDocument(checklistItemId, fileName, uploadedBy)
              setFileName("")
              setOpen(false)
            }}
          >
            Upload document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PaymentProofUploadControl({
  paymentId,
  paymentLabel,
  triggerLabel = "Upload proof",
  className,
}: {
  paymentId: string
  paymentLabel: string
  triggerLabel?: string
  className?: string
}) {
  const { uploadPaymentProof } = useWorkflow()
  const [fileName, setFileName] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className ?? "rounded-full"}>
          <UploadCloud className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[24px] border-white/10 bg-[#233047] text-white">
        <DialogHeader>
          <DialogTitle>Upload proof of payment</DialogTitle>
          <DialogDescription className="text-slate-300">
            Add the file name for {paymentLabel.toLowerCase()}. The payment stage will move into review and the account manager will be notified.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="wire-confirmation.pdf"
          className="rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
        />

        <DialogFooter>
          <Button
            variant="outline"
            className="app-button-secondary rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full"
            disabled={!fileName.trim()}
            onClick={() => {
              uploadPaymentProof(paymentId, fileName)
              setFileName("")
              setOpen(false)
            }}
          >
            Upload proof
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
