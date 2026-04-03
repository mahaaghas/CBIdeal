"use client"

import { useMemo, useRef, useState } from "react"
import { Check, ClipboardPlus, FileUp, SearchCheck, UploadCloud, X } from "lucide-react"
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

function formatFileSize(bytes?: number) {
  if (!bytes || bytes <= 0) return null
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type SelectedFile = {
  fileName: string
  fileSizeLabel?: string | null
  mimeType?: string | null
}

export function DocumentReviewControls({
  checklistItemId,
  itemLabel,
  status,
}: {
  checklistItemId: string
  itemLabel: string
  status?: string
}) {
  const { approveDocument, rejectDocument, startDocumentReview } = useWorkflow()
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)
  const canStartReview = status === "Uploaded"

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canStartReview ? (
        <Button
          size="sm"
          variant="outline"
          className="app-button-secondary rounded-full"
          onClick={() => startDocumentReview(checklistItemId)}
        >
          <SearchCheck className="size-4" />
          Start review
        </Button>
      ) : null}

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
        <DialogContent className="app-dialog-panel text-white">
          <DialogHeader>
            <DialogTitle>Return document for correction</DialogTitle>
            <DialogDescription className="app-type-caption">
              Add a clear rejection reason for {itemLabel.toLowerCase()}. The portal checklist, client update, and review trail will update immediately.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what is missing, unclear, or needs to be corrected."
            className="app-textarea min-h-28"
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

export function DocumentMissingControl({
  checklistItemId,
  itemLabel,
  triggerLabel = "Mark missing",
  className,
}: {
  checklistItemId: string
  itemLabel: string
  triggerLabel?: string
  className?: string
}) {
  const { markDocumentMissing } = useWorkflow()
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className={className ?? "app-button-secondary rounded-full"}>
          <ClipboardPlus className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="app-dialog-panel text-white">
        <DialogHeader>
          <DialogTitle>Mark document as missing</DialogTitle>
          <DialogDescription className="app-type-caption">
            Use this when {itemLabel.toLowerCase()} is still required or needs a fresh upload. The checklist will move back to a client action state.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain what is still missing or why a new file is required."
          className="app-textarea min-h-28"
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
            onClick={() => {
              markDocumentMissing(checklistItemId, reason)
              setReason("")
              setOpen(false)
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DocumentRequestControl({
  clientId,
  caseId,
  category = "Additional documents",
  triggerLabel = "Request document",
  className,
}: {
  clientId: string
  caseId: string
  category?: string
  triggerLabel?: string
  className?: string
}) {
  const { requestAdditionalDocument } = useWorkflow()
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState("")
  const [requestCategory, setRequestCategory] = useState(category)
  const [note, setNote] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className={className ?? "app-button-secondary rounded-full"}>
          <ClipboardPlus className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="app-dialog-panel text-white">
        <DialogHeader>
          <DialogTitle>Request an additional document</DialogTitle>
          <DialogDescription className="app-type-caption">
            Add a new requirement to the client checklist so it appears immediately in both the portal and CRM.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={item}
            onChange={(event) => setItem(event.target.value)}
            placeholder="Document name"
            className="app-field"
          />
          <Input
            value={requestCategory}
            onChange={(event) => setRequestCategory(event.target.value)}
            placeholder="Category"
            className="app-field"
          />
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Explain why this document is required and what the client should upload."
            className="app-textarea min-h-28"
          />
        </div>

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
            disabled={!item.trim()}
            onClick={() => {
              requestAdditionalDocument({
                clientId,
                caseId,
                category: requestCategory,
                item,
                note,
              })
              setItem("")
              setRequestCategory(category)
              setNote("")
              setOpen(false)
            }}
          >
            Add request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
        <DialogContent className="app-dialog-panel text-white">
          <DialogHeader>
            <DialogTitle>Reject payment proof</DialogTitle>
            <DialogDescription className="app-type-caption">
              Add the reason for returning the proof on {paymentLabel.toLowerCase()}. The portal notice and email placeholder will update immediately.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what is missing from the proof of payment."
            className="app-textarea min-h-28"
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

function FileUploadDialog({
  open,
  onOpenChange,
  title,
  description,
  selectedFile,
  onFileChange,
  onSubmit,
  submitLabel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  selectedFile: SelectedFile | null
  onFileChange: (file: SelectedFile | null) => void
  onSubmit: () => void
  submitLabel: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="app-dialog-panel text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="app-type-caption">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-dashed border-white/14 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Choose a file to attach</p>
                <p className="text-sm leading-6 text-slate-300">
                  PDF, image, or office documents are supported. The latest upload becomes visible to the other workspace immediately.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="app-button-secondary rounded-full"
                onClick={() => inputRef.current?.click()}
              >
                <FileUp className="size-4" />
                Select file
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                onFileChange(
                  file
                    ? {
                        fileName: file.name,
                        fileSizeLabel: formatFileSize(file.size),
                        mimeType: file.type || null,
                      }
                    : null,
                )
              }}
            />
          </div>

          {selectedFile ? (
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-sm font-semibold text-white">{selectedFile.fileName}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                {[selectedFile.fileSizeLabel, selectedFile.mimeType].filter(Boolean).join(" · ") || "Ready to upload"}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-300">No file selected yet.</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="app-button-secondary rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="rounded-full" disabled={!selectedFile} onClick={onSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [open, setOpen] = useState(false)
  const label = useMemo(() => triggerLabel ?? "Upload", [triggerLabel])

  return (
    <>
      <Button size="sm" className={className ?? "rounded-full"} onClick={() => setOpen(true)}>
        <UploadCloud className="size-4" />
        {label}
      </Button>

      <FileUploadDialog
        open={open}
        onOpenChange={setOpen}
        title="Upload document"
        description={`Upload ${itemLabel.toLowerCase()} so it appears in the case workspace immediately and moves into review.`}
        selectedFile={selectedFile}
        onFileChange={setSelectedFile}
        submitLabel="Upload document"
        onSubmit={() => {
          if (!selectedFile) return
          uploadDocument(checklistItemId, selectedFile, uploadedBy)
          setSelectedFile(null)
          setOpen(false)
        }}
      />
    </>
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
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" className={className ?? "rounded-full"} onClick={() => setOpen(true)}>
        <UploadCloud className="size-4" />
        {triggerLabel}
      </Button>

      <FileUploadDialog
        open={open}
        onOpenChange={setOpen}
        title="Upload proof of payment"
        description={`Upload evidence for ${paymentLabel.toLowerCase()} so the finance review can begin immediately.`}
        selectedFile={selectedFile}
        onFileChange={setSelectedFile}
        submitLabel="Upload proof"
        onSubmit={() => {
          if (!selectedFile) return
          uploadPaymentProof(paymentId, selectedFile.fileName)
          setSelectedFile(null)
          setOpen(false)
        }}
      />
    </>
  )
}
