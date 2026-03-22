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
  description = "Share the essentials below and we will review your profile discreetly before suggesting the most suitable next step.",
  submitLabel = "Request a private consultation",
  className,
}: EnglishLandingLeadFormProps) {
  return (
    <LandingLeadFormBase
      sourceCategory={sourceCategory}
      sourcePage={sourcePage}
      language="EN"
      className={className}
      copy={{
        eyebrow: "Private consultation form",
        title,
        description,
        confidentialityNote: "Confidential review. Designed for fast completion and realistic first-step qualification.",
        fullNameLabel: "Full name",
        fullNamePlaceholder: "Your full name",
        nationalityLabel: "Nationality",
        nationalityPlaceholder: "Current passport nationality",
        currentResidenceLabel: "Current country of residence",
        currentResidencePlaceholder: "Where you live now",
        budgetRangeLabel: "Investment budget range",
        budgetRangePlaceholder: "Select budget range",
        timelineLabel: "Timeline",
        timelinePlaceholder: "Select timeline",
        whatsappLabel: "WhatsApp number",
        whatsappPlaceholder: "+971 ...",
        emailLabel: "Email",
        emailPlaceholder: "name@email.com",
        notesLabel: "Notes",
        notesPlaceholder: "Add anything useful for context: family members, travel goals, timing, or jurisdictions already under consideration.",
        optionalLabel: "optional",
        successMessage:
          "Thank you. Your request has been received and will be reviewed privately before the next step is recommended.",
        submitLabel,
      }}
    />
  )
}
