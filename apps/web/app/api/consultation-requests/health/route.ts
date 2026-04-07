import { NextResponse } from "next/server"

const defaultRecipients = ["sales@cbideal.nl", "va.agency.hirings@gmail.com"]

function getConfiguredRecipientCount() {
  const configuredRecipients = process.env.CONSULTATION_NOTIFICATION_EMAILS
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)

  return configuredRecipients && configuredRecipients.length > 0
    ? configuredRecipients.length
    : defaultRecipients.length
}

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    config: {
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      fromEmailConfigured: Boolean(process.env.LEAD_NOTIFICATIONS_FROM_EMAIL),
      notificationRecipientsConfigured: getConfiguredRecipientCount() > 0,
      conversionLabelConfigured: Boolean(
        process.env.NEXT_PUBLIC_GOOGLE_ADS_CONSULTATION_CONVERSION_LABEL?.trim(),
      ),
      consultationRoute: "/book-a-cbi-consultation",
      thankYouRoute: "/thank-you",
    },
  })
}
