import { NextResponse } from "next/server"
import { z } from "zod"
import { confirmConsultationSuccess } from "@/lib/consultation-submissions"

const confirmationSchema = z.object({
  referenceId: z.string().trim().min(1),
  thankYouConfirmed: z.boolean().default(true),
  conversionEventTriggered: z.boolean().default(false),
})

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = confirmationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ ok: false, message: "Invalid confirmation payload." }, { status: 400 })
    }

    const { referenceId, thankYouConfirmed, conversionEventTriggered } = validationResult.data

    await confirmConsultationSuccess(referenceId, {
      thankYouConfirmed,
      conversionEventTriggered,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[consultation] success confirmation failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      { ok: false, message: "We could not confirm the thank-you state." },
      { status: 500 },
    )
  }
}
