export const customerSafeMessages = {
  setupUnavailable: "We're unable to continue setup right now. Please try again in a moment.",
  billingUnavailable: "Billing is temporarily unavailable. Please try again shortly.",
  billingPreparationFailed: "Something went wrong while preparing billing. Please try again.",
  billingConfirmationFailed: "We couldn't complete this step right now. Please return to billing and try again.",
  workspaceAccessFailed: "We're unable to confirm workspace access right now. Please return to billing and try again.",
  loginFailed: "We're unable to complete this right now. Please try again in a moment.",
  invalidLogin: "Please check your email and password and try again.",
  duplicateAccount: "An account already exists for this email address. Sign in instead or use a different email.",
  workspaceMissing: "We couldn't find this workspace setup. Please restart the signup flow.",
  planMismatch: "We couldn't continue billing for the selected plan. Please return to setup and try again.",
  workspaceActive: "This workspace is already active. You can continue into the platform.",
  missingBillingReference: "We couldn't verify this payment step. Please return to billing and try again.",
  authUnavailable: "We're unable to continue this step right now. Please try again in a moment.",
  authLinkInvalid: "The link may have expired or already been used. Please request a new one to continue.",
  passwordResetFailed: "We couldn't complete this password reset right now. Please request a new link and try again.",
} as const

type CustomerErrorContext =
  | "register"
  | "login"
  | "status"
  | "checkout"
  | "runtime"
  | "success"
  | "workspace-access"

export function getCustomerSafeMessage(context: CustomerErrorContext, rawMessage?: string | null) {
  const message = rawMessage?.trim() ?? ""

  if (context === "register") {
    if (/already exists/i.test(message)) return customerSafeMessages.duplicateAccount
    return customerSafeMessages.setupUnavailable
  }

  if (context === "login") {
    if (/no account|did not match/i.test(message)) return customerSafeMessages.invalidLogin
    return customerSafeMessages.loginFailed
  }

  if (context === "status") {
    if (/not found/i.test(message)) return customerSafeMessages.workspaceMissing
    return customerSafeMessages.workspaceAccessFailed
  }

  if (context === "checkout") {
    if (/already active/i.test(message)) return customerSafeMessages.workspaceActive
    if (/not found/i.test(message)) return customerSafeMessages.workspaceMissing
    if (/does not match/i.test(message)) return customerSafeMessages.planMismatch
    return customerSafeMessages.billingPreparationFailed
  }

  if (context === "runtime") {
    return customerSafeMessages.billingUnavailable
  }

  if (context === "success") {
    if (/missing a workspace reference|missing.*reference|sandbox/i.test(message)) {
      return customerSafeMessages.missingBillingReference
    }
    return customerSafeMessages.billingConfirmationFailed
  }

  return customerSafeMessages.workspaceAccessFailed
}

export function isTechnicalErrorMessage(rawMessage?: string | null) {
  const message = rawMessage?.trim() ?? ""
  return /supabase|stripe|service role|environment|credential|next_public_|webhook|configured|storage|api|database|secret|key|stack|provider/i.test(
    message,
  )
}
