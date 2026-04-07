"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import {
  consumeSuccessfulConsultationSubmission,
  type SuccessfulConsultationSubmission,
} from "@/lib/consultation-tracking"
import { trackConsultationRequestSuccess } from "@/lib/analytics"

export function ConsultationThankYouState() {
  const [submission, setSubmission] = useState<SuccessfulConsultationSubmission | null>(null)

  useEffect(() => {
    const storedSubmission = consumeSuccessfulConsultationSubmission()

    if (!storedSubmission) return

    setSubmission(storedSubmission)
    const trackingResult = trackConsultationRequestSuccess({
      source_page: storedSubmission.sourcePage,
      language: storedSubmission.language,
      reference_id: storedSubmission.referenceId,
    })

    void fetch("/api/consultation-requests/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referenceId: storedSubmission.referenceId,
        thankYouConfirmed: true,
        conversionEventTriggered: trackingResult.customEventAttempted || trackingResult.adsConversionAttempted,
      }),
    }).catch(() => null)
  }, [])

  if (!submission) return null

  return (
    <div className="rounded-[1.5rem] border border-emerald-300/50 bg-emerald-50/90 px-5 py-5 text-sm leading-7 text-[#1d2430] shadow-[0_16px_40px_rgba(22,163,74,0.08)]">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 size-5 text-emerald-600" />
        <div>
          <p className="font-semibold text-[#10341e]">Consultation request confirmed</p>
          <p className="text-[#446054]">
            Reference: <span className="font-semibold text-[#10341e]">{submission.referenceId}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
