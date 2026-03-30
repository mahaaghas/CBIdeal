import { ArabicLandingLeadForm } from "@/components/forms/arabic-landing-lead-form"
import { EnglishLandingLeadForm } from "@/components/forms/english-landing-lead-form"
import type { LandingLeadSourceCategory } from "@/lib/landing-form"
import type { Locale } from "@/lib/i18n/routing"

interface LocalizedLandingLeadFormProps {
  locale?: Locale
  sourceCategory: LandingLeadSourceCategory
  sourcePage?: string
  title?: string
  description?: string
  submitLabel?: string
  className?: string
}

export function LocalizedLandingLeadForm({ locale = "en", ...props }: LocalizedLandingLeadFormProps) {
  if (locale === "ar") {
    return <ArabicLandingLeadForm {...props} />
  }

  return <EnglishLandingLeadForm {...props} />
}
