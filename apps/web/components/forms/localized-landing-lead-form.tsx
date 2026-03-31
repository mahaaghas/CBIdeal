import { InvestorIntakeForm } from "@/components/forms/investor-intake-form"
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
  return (
    <InvestorIntakeForm
      title={props.title}
      description={props.description}
      submitLabel={props.submitLabel}
      sourcePage={props.sourcePage ?? props.sourceCategory}
      className={props.className}
    />
  )
}
