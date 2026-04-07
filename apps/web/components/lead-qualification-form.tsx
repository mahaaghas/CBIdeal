"use client"

import { BusinessIntakeForm } from "@/components/forms/business-intake-form"
import { InvestorIntakeForm } from "@/components/forms/investor-intake-form"
import type { Locale } from "@/lib/i18n/routing"

interface LeadQualificationFormProps {
  locale?: Locale
  formType: "investor" | "company" | "partner"
  title: string
  description: string
  submitLabel?: string
  source: string
}

export function LeadQualificationForm({
  locale,
  formType,
  title,
  description,
  submitLabel,
  source,
}: LeadQualificationFormProps) {
  if (formType === "investor") {
    return (
      <InvestorIntakeForm
        locale={locale}
        title={title}
        description={description}
        submitLabel={submitLabel}
        sourcePage={source}
        sourceCategory="contact"
      />
    )
  }

  return (
    <BusinessIntakeForm
      title={title}
      description={description}
      submitLabel={submitLabel}
      sourcePage={source}
      initialInterest={formType === "partner" ? "Partnership" : "SaaS platform"}
    />
  )
}
