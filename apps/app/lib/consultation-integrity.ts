import {
  consultationSubmissionsTable,
  formatConsultationDateTime,
  type ConsultationSubmissionRecord,
} from "@cbideal/config/consultation-integrity"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const DEFAULT_MARKETING_SITE_URL = "https://www.cbideal.com"

type GenericRecord = Record<string, unknown>

export interface ConsultationHealthConfig {
  resendConfigured: boolean
  fromEmailConfigured: boolean
  notificationRecipientsConfigured: boolean
  conversionLabelConfigured: boolean
  consultationRoute: string
  thankYouRoute: string
}

export interface ConsultationRouteCheck {
  label: string
  path: string
  ok: boolean
  statusCode?: number
  message: string
}

export interface ConsultationIntegrityRecord extends ConsultationSubmissionRecord {
  submittedAtLabel: string
  thankYouConfirmedAtLabel?: string | null
  conversionEventAtLabel?: string | null
}

export interface ConsultationIntegrityDashboardData {
  siteUrl: string
  records: ConsultationIntegrityRecord[]
  warnings: string[]
  routeChecks: ConsultationRouteCheck[]
  config: ConsultationHealthConfig | null
  configurationError?: string | null
  storageError?: string | null
  metrics: {
    total: number
    emailSent: number
    thankYouConfirmed: number
    conversionTriggered: number
    crmSynced: number
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : []
}

function asBoolean(value: unknown) {
  return value === true
}

function normalizeSiteUrl() {
  return (process.env.MARKETING_SITE_URL?.trim() || DEFAULT_MARKETING_SITE_URL).replace(/\/+$/, "")
}

function normaliseConsultationRecord(row: GenericRecord): ConsultationIntegrityRecord {
  const submittedAt = asString(row.submitted_at) || new Date().toISOString()
  const thankYouConfirmedAt = asOptionalString(row.thank_you_confirmed_at)
  const conversionEventAt = asOptionalString(row.conversion_event_at)

  return {
    referenceId: asString(row.reference_id),
    fullName: asString(row.full_name),
    email: asString(row.email),
    phoneWhatsApp: asString(row.phone_whatsapp),
    countryOfResidence: asString(row.country_of_residence),
    nationality: asString(row.nationality),
    interestedIn: asString(row.interested_in),
    budgetRange: asString(row.budget_range),
    preferredContactMethod: asString(row.preferred_contact_method),
    familyApplication: asOptionalString(row.family_application),
    timeline: asOptionalString(row.timeline),
    currentResidencyStatus: asOptionalString(row.current_residency_status),
    message: asString(row.message),
    language: (asString(row.language) || "EN") as ConsultationSubmissionRecord["language"],
    sourcePage: asString(row.source_page),
    sourceCategory: asOptionalString(row.source_category),
    sourceUrl: asString(row.source_url),
    campaign: asOptionalString(row.campaign),
    userAgent: asOptionalString(row.user_agent),
    submittedAt,
    submissionStatus: (asString(row.submission_status) || "received") as ConsultationSubmissionRecord["submissionStatus"],
    emailStatus: (asString(row.email_status) || "pending") as ConsultationSubmissionRecord["emailStatus"],
    emailMessageId: asOptionalString(row.email_message_id),
    emailRecipients: asStringArray(row.email_recipients),
    emailError: asOptionalString(row.email_error),
    crmSyncStatus: (asString(row.crm_sync_status) || "pending") as ConsultationSubmissionRecord["crmSyncStatus"],
    crmRecordId: asOptionalString(row.crm_record_id),
    crmError: asOptionalString(row.crm_error),
    thankYouStatus: (asString(row.thank_you_status) || "not_confirmed") as ConsultationSubmissionRecord["thankYouStatus"],
    thankYouConfirmedAt,
    conversionStatus: (asString(row.conversion_status) || "not_triggered") as ConsultationSubmissionRecord["conversionStatus"],
    conversionEventAt,
    submittedAtLabel: formatConsultationDateTime(submittedAt),
    thankYouConfirmedAtLabel: thankYouConfirmedAt ? formatConsultationDateTime(thankYouConfirmedAt) : null,
    conversionEventAtLabel: conversionEventAt ? formatConsultationDateTime(conversionEventAt) : null,
  }
}

async function fetchDashboardConfig(siteUrl: string) {
  try {
    const response = await fetch(`${siteUrl}/api/consultation-requests/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })

    if (!response.ok) {
      return {
        config: null,
        error: `Health endpoint returned ${response.status}.`,
      }
    }

    const payload = (await response.json()) as { config?: ConsultationHealthConfig }
    return {
      config: payload.config ?? null,
      error: payload.config ? null : "Health endpoint did not return configuration details.",
    }
  } catch (error) {
    return {
      config: null,
      error: error instanceof Error ? error.message : "Health endpoint could not be reached.",
    }
  }
}

async function runRouteCheck(siteUrl: string, path: string, label: string, expectedText: string): Promise<ConsultationRouteCheck> {
  try {
    const response = await fetch(`${siteUrl}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })
    const body = await response.text()
    const ok = response.ok && body.includes(expectedText)

    return {
      label,
      path,
      ok,
      statusCode: response.status,
      message: ok
        ? `${label} is reachable and includes the expected live content.`
        : `${label} did not return the expected live content.`,
    }
  } catch (error) {
    return {
      label,
      path,
      ok: false,
      message: error instanceof Error ? error.message : `${label} could not be checked.`,
    }
  }
}

async function fetchRouteChecks(siteUrl: string) {
  return Promise.all([
    runRouteCheck(siteUrl, "/", "Homepage consultation CTA target", "/book-a-cbi-consultation"),
    runRouteCheck(siteUrl, "/book-a-cbi-consultation", "Consultation page", "consultation-request-form"),
    runRouteCheck(siteUrl, "/thank-you", "Thank-you page", "Consultation received"),
  ])
}

export async function getConsultationIntegrityDashboardData(): Promise<ConsultationIntegrityDashboardData> {
  const siteUrl = normalizeSiteUrl()
  const supabase = getSupabaseServerClient()
  const warnings: string[] = []
  let storageError: string | null = null
  let records: ConsultationIntegrityRecord[] = []

  if (!supabase) {
    storageError = "Supabase is not configured in the app environment, so recorded consultation submissions cannot be shown here."
    warnings.push(storageError)
  } else {
    const { data, error } = await supabase
      .from(consultationSubmissionsTable)
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(50)

    if (error) {
      storageError = `Consultation submission records could not be loaded: ${error.message}`
      warnings.push(storageError)
    } else {
      records = (data ?? []).map((row) => normaliseConsultationRecord(row as GenericRecord))
    }
  }

  const configResult = await fetchDashboardConfig(siteUrl)
  const routeChecks = await fetchRouteChecks(siteUrl)

  if (configResult.error) {
    warnings.push(`Marketing site configuration could not be verified: ${configResult.error}`)
  }

  const failingRouteChecks = routeChecks.filter((check) => !check.ok)
  if (failingRouteChecks.length > 0) {
    warnings.push(`${failingRouteChecks.length} core consultation route check${failingRouteChecks.length === 1 ? "" : "s"} failed.`)
  }

  if (configResult.config) {
    if (!configResult.config.resendConfigured) {
      warnings.push("Resend is not configured on the marketing site deployment.")
    }
    if (!configResult.config.fromEmailConfigured) {
      warnings.push("The sender email is not configured on the marketing site deployment.")
    }
    if (!configResult.config.notificationRecipientsConfigured) {
      warnings.push("Consultation notification recipients are not configured on the marketing site deployment.")
    }
    if (!configResult.config.conversionLabelConfigured) {
      warnings.push("The Google Ads consultation conversion label is not configured on the marketing site deployment.")
    }
  }

  const unresolvedSuccesses = records.filter(
    (record) =>
      record.submissionStatus === "delivered" &&
      record.thankYouStatus !== "confirmed",
  )
  if (unresolvedSuccesses.length > 0) {
    warnings.push(`${unresolvedSuccesses.length} delivered submission${unresolvedSuccesses.length === 1 ? "" : "s"} have not yet confirmed the thank-you state.`)
  }

  const emailFailures = records.filter((record) => record.emailStatus === "failed")
  if (emailFailures.length > 0) {
    warnings.push(`${emailFailures.length} recorded submission${emailFailures.length === 1 ? "" : "s"} failed during email delivery.`)
  }

  const crmFailures = records.filter((record) => record.crmSyncStatus === "failed")
  if (crmFailures.length > 0) {
    warnings.push(`${crmFailures.length} recorded submission${crmFailures.length === 1 ? "" : "s"} did not sync into the internal lead inbox.`)
  }

  return {
    siteUrl,
    records,
    warnings,
    routeChecks,
    config: configResult.config,
    configurationError: configResult.error,
    storageError,
    metrics: {
      total: records.length,
      emailSent: records.filter((record) => record.emailStatus === "sent").length,
      thankYouConfirmed: records.filter((record) => record.thankYouStatus === "confirmed").length,
      conversionTriggered: records.filter((record) => record.conversionStatus === "triggered").length,
      crmSynced: records.filter((record) => record.crmSyncStatus === "synced").length,
    },
  }
}
