export const CONSULTATION_SUCCESS_STORAGE_KEY = "cbi-consultation-success"

export interface SuccessfulConsultationSubmission {
  referenceId: string
  sourcePage: string
  sourceUrl?: string
  language: "EN" | "AR" | "RU"
}

export function saveSuccessfulConsultationSubmission(payload: SuccessfulConsultationSubmission) {
  if (typeof window === "undefined") return

  window.sessionStorage.setItem(CONSULTATION_SUCCESS_STORAGE_KEY, JSON.stringify(payload))
}

export function consumeSuccessfulConsultationSubmission(): SuccessfulConsultationSubmission | null {
  if (typeof window === "undefined") return null

  const raw = window.sessionStorage.getItem(CONSULTATION_SUCCESS_STORAGE_KEY)

  if (!raw) return null

  window.sessionStorage.removeItem(CONSULTATION_SUCCESS_STORAGE_KEY)

  try {
    return JSON.parse(raw) as SuccessfulConsultationSubmission
  } catch {
    return null
  }
}
