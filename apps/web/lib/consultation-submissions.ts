import {
  consultationSubmissionsTable,
} from "@cbideal/config/consultation-integrity"
import {
  consultationBudgetOptions,
  consultationContactMethodOptions,
  consultationFamilyApplicationOptions,
  consultationInterestOptions,
  consultationTimelineOptions,
  type ConsultationRequestValues,
} from "@/lib/consultation-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const INVESTOR_LEADS_TABLE = "investor_leads"

function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value?: string | null,
) {
  if (!value) return null
  return options.find((option) => option.value === value)?.label ?? value
}

function normalizeOptional(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function buildConsultationNotes(values: ConsultationRequestValues) {
  const lines = [
    `Preferred contact method: ${optionLabel(consultationContactMethodOptions, values.preferredContactMethod) ?? "Not provided"}`,
  ]

  const familyApplication = optionLabel(consultationFamilyApplicationOptions, values.familyApplication)
  if (familyApplication) {
    lines.push(`Family application: ${familyApplication}`)
  }

  const timeline = optionLabel(consultationTimelineOptions, values.timeline)
  if (timeline) {
    lines.push(`Timeline: ${timeline}`)
  }

  const residencyStatus = normalizeOptional(values.currentResidencyStatus)
  if (residencyStatus) {
    lines.push(`Current residency status: ${residencyStatus}`)
  }

  const campaign = normalizeOptional(values.campaign)
  if (campaign) {
    lines.push(`Campaign: ${campaign}`)
  }

  lines.push(`Language: ${values.language}`)

  const sourceCategory = normalizeOptional(values.sourceCategory)
  if (sourceCategory) {
    lines.push(`Source category: ${sourceCategory}`)
  }

  const additionalNotes = normalizeOptional(values.message)
  if (additionalNotes) {
    lines.push(`Additional notes: ${additionalNotes}`)
  }

  return lines.join("\n")
}

function buildConsultationLeadInsert(values: ConsultationRequestValues) {
  return {
    full_name: values.fullName,
    email: values.email,
    phone_whatsapp: values.phoneWhatsApp,
    nationality: values.nationality,
    residence_country: values.countryOfResidence,
    preferred_destination: null,
    budget_range: optionLabel(consultationBudgetOptions, values.budgetRange),
    timeline: optionLabel(consultationTimelineOptions, values.timeline),
    applicant_type:
      optionLabel(consultationFamilyApplicationOptions, values.familyApplication) ?? "Not specified",
    program_type: optionLabel(consultationInterestOptions, values.interestedIn),
    notes: buildConsultationNotes(values),
    source_page: values.sourcePage,
  }
}

export function buildConsultationSubmissionInsert(input: {
  referenceId: string
  values: ConsultationRequestValues
  recipients: string[]
  submittedAt: string
  sourceUrl: string
  userAgent: string
}) {
  return {
    full_name: input.values.fullName,
    email: input.values.email,
    phone_whatsapp: input.values.phoneWhatsApp,
    country_of_residence: input.values.countryOfResidence,
    nationality: input.values.nationality,
    interested_in: optionLabel(consultationInterestOptions, input.values.interestedIn),
    approximate_investment_range: optionLabel(consultationBudgetOptions, input.values.budgetRange),
    family_application: optionLabel(consultationFamilyApplicationOptions, input.values.familyApplication),
    timeline: optionLabel(consultationTimelineOptions, input.values.timeline),
    current_residency_status: normalizeOptional(input.values.currentResidencyStatus),
    preferred_contact_method: optionLabel(consultationContactMethodOptions, input.values.preferredContactMethod),
    message_additional_notes: input.values.message,
  }
}

export async function insertConsultationSubmissionRecord(input: {
  referenceId: string
  values: ConsultationRequestValues
  recipients: string[]
  submittedAt: string
  sourceUrl: string
  userAgent: string
}) {
  const supabase = getSupabaseServerClient()
  const payload = buildConsultationSubmissionInsert(input)
  const response = await supabase
    .from(consultationSubmissionsTable)
    .insert(payload)
    .select()
    .single()

  return {
    table: consultationSubmissionsTable,
    payload,
    data: response.data,
    error: response.error,
  }
}

export async function createConsultationSubmissionRecord(input: {
  referenceId: string
  values: ConsultationRequestValues
  recipients: string[]
  submittedAt: string
  sourceUrl: string
  userAgent: string
}) {
  const { error } = await insertConsultationSubmissionRecord(input)

  if (error) {
    throw new Error(`Consultation submission insert failed: ${error.message}`)
  }
}

async function updateSubmission(referenceId: string, updates: Record<string, unknown>) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from(consultationSubmissionsTable)
    .update(updates)
    .eq("reference_id", referenceId)

  if (error) {
    throw new Error(`Consultation submission update failed: ${error.message}`)
  }
}

export async function markConsultationEmailSuccess(referenceId: string, emailMessageId?: string | null) {
  await updateSubmission(referenceId, {
    submission_status: "delivered" satisfies ConsultationSubmissionStatus,
    email_status: "sent" satisfies ConsultationEmailStatus,
    email_message_id: normalizeOptional(emailMessageId),
    email_error: null,
  })
}

export async function markConsultationEmailFailure(referenceId: string, message: string) {
  await updateSubmission(referenceId, {
    submission_status: "delivery_failed" satisfies ConsultationSubmissionStatus,
    email_status: "failed" satisfies ConsultationEmailStatus,
    email_error: message,
  })
}

export async function syncConsultationToLeadInbox(values: ConsultationRequestValues) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from(INVESTOR_LEADS_TABLE)
    .insert(buildConsultationLeadInsert(values))
    .select("id")
    .single()

  if (error) {
    throw new Error(`Consultation lead sync failed: ${error.message}`)
  }

  const crmRecordId = typeof data?.id === "string" ? data.id : null
  return crmRecordId
}

export async function markConsultationCrmSyncSuccess(referenceId: string, crmRecordId?: string | null) {
  await updateSubmission(referenceId, {
    crm_sync_status: "synced" satisfies ConsultationCrmSyncStatus,
    crm_record_id: normalizeOptional(crmRecordId),
    crm_error: null,
  })
}

export async function markConsultationCrmSyncFailure(referenceId: string, message: string) {
  await updateSubmission(referenceId, {
    crm_sync_status: "failed" satisfies ConsultationCrmSyncStatus,
    crm_error: message,
  })
}

export async function confirmConsultationSuccess(referenceId: string, input: {
  thankYouConfirmed: boolean
  conversionEventTriggered: boolean
}) {
  const timestamp = new Date().toISOString()
  await updateSubmission(referenceId, {
    thank_you_status: input.thankYouConfirmed
      ? ("confirmed" satisfies ConsultationThankYouStatus)
      : ("not_confirmed" satisfies ConsultationThankYouStatus),
    thank_you_confirmed_at: input.thankYouConfirmed ? timestamp : null,
    conversion_status: input.conversionEventTriggered
      ? ("triggered" satisfies ConsultationConversionStatus)
      : ("not_triggered" satisfies ConsultationConversionStatus),
    conversion_event_at: input.conversionEventTriggered ? timestamp : null,
  })
}
