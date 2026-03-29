import { LandingLeadFormBase } from "@/components/forms/landing-lead-form-base"
import type { LandingLeadSourceCategory } from "@/lib/landing-form"

interface EnglishLandingLeadFormProps {
  sourceCategory: LandingLeadSourceCategory
  sourcePage?: string
  title?: string
  description?: string
  submitLabel?: string
  className?: string
}

export function EnglishLandingLeadForm({
  sourceCategory,
  sourcePage,
  title = "Request a private consultation",
  description = "Share a concise outline of your situation so the first conversation can begin with the right level of context and discretion.",
  submitLabel = "Request consultation",
  className,
}: EnglishLandingLeadFormProps) {
  return (
    <LandingLeadFormBase
      sourceCategory={sourceCategory}
      sourcePage={sourcePage}
      language="EN"
      className={className}
      copy={{
        eyebrow: "Private consultation",
        title,
        description,
        confidentialityNote:
          "All enquiries are reviewed discreetly. We work with a limited number of cases and prioritise serious, well-considered requests.",
        areaOfInterestLabel: "Area of interest",
        areaOfInterestPlaceholder: "Select an area",
        applicationScopeLabel: "Application type",
        applicationScopePlaceholder: "Who is included",
        regionOfInterestLabel: "Region of interest",
        regionOfInterestPlaceholder: "Select a region",
        fullNameLabel: "Full name",
        fullNamePlaceholder: "Your full name",
        budgetRangeLabel: "Investment range",
        budgetRangePlaceholder: "Select range",
        timelineLabel: "Preferred timeline",
        timelinePlaceholder: "Select preferred timing",
        whatsappLabel: "WhatsApp number",
        whatsappPlaceholder: "+971 ...",
        emailLabel: "Email",
        emailPlaceholder: "name@email.com",
        notesLabel: "Additional context",
        notesPlaceholder:
          "Share anything useful for context, such as family considerations, timing, or jurisdictions already under review.",
        optionalLabel: "optional",
        successMessage:
          "Thank you. Your request has been received and will be reviewed privately before we return with the most appropriate next step.",
        submitLabel,
      }}
    />
  )
}
