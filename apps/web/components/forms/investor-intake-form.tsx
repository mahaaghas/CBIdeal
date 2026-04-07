"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ConsultationRequestForm } from "@/components/forms/consultation-request-form"
import type { Locale } from "@/lib/i18n/routing"

interface InvestorIntakeFormProps {
  locale?: Locale
  title?: string
  description?: string
  sourcePage: string
  sourceCategory?: string
  submitLabel?: string
  display?: "embedded" | "modal"
  triggerLabel?: string
  className?: string
  id?: string
}

export function InvestorIntakeForm({
  locale = "en",
  display = "embedded",
  triggerLabel = "Request a consultation",
  ...props
}: InvestorIntakeFormProps) {
  if (display === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full">{triggerLabel}</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-4xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{props.title ?? "Request a private consultation"}</DialogTitle>
          </DialogHeader>
          <ConsultationRequestForm locale={locale} {...props} />
        </DialogContent>
      </Dialog>
    )
  }

  return <ConsultationRequestForm locale={locale} {...props} />
}
