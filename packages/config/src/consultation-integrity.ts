export const consultationSubmissionsTable = "consultation_submissions"

export type ConsultationSubmissionStatus = "received" | "delivered" | "delivery_failed"
export type ConsultationEmailStatus = "pending" | "sent" | "failed"
export type ConsultationCrmSyncStatus = "pending" | "synced" | "failed"
export type ConsultationThankYouStatus = "not_confirmed" | "confirmed"
export type ConsultationConversionStatus = "not_triggered" | "triggered"

export interface ConsultationSubmissionRecord {
  referenceId: string
  fullName: string
  email: string
  phoneWhatsApp: string
  countryOfResidence: string
  nationality: string
  interestedIn: string
  budgetRange: string
  preferredContactMethod: string
  familyApplication?: string | null
  timeline?: string | null
  currentResidencyStatus?: string | null
  message: string
  language: "EN" | "AR" | "RU"
  sourcePage: string
  sourceCategory?: string | null
  sourceUrl: string
  campaign?: string | null
  userAgent?: string | null
  submittedAt: string
  submissionStatus: ConsultationSubmissionStatus
  emailStatus: ConsultationEmailStatus
  emailMessageId?: string | null
  emailRecipients: string[]
  emailError?: string | null
  crmSyncStatus: ConsultationCrmSyncStatus
  crmRecordId?: string | null
  crmError?: string | null
  thankYouStatus: ConsultationThankYouStatus
  thankYouConfirmedAt?: string | null
  conversionStatus: ConsultationConversionStatus
  conversionEventAt?: string | null
}

export function formatConsultationDateTime(value?: string | null) {
  const date = value ? new Date(value) : new Date()

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
