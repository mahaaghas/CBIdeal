import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const quizLeadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().optional(),
  sourcePage: z.string().trim().min(1),
  language: z.enum(["EN", "AR"]),
  answers: z.object({
    budget: z.enum(["under-150k", "150k-300k", "300k-600k", "600k-plus"]),
    goal: z.enum(["second-passport", "residency-europe", "tax-optimization", "backup-plan"]),
    timing: z.enum(["asap", "six-to-twelve", "no-rush"]),
    household: z.enum(["just-me", "couple", "family"]),
  }),
})

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = quizLeadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ ok: false, message: "Invalid quiz lead payload." }, { status: 400 })
    }

    const { name, email, whatsapp, sourcePage, language, answers } = validation.data
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("investor_leads").insert({
      full_name: name,
      email,
      phone_whatsapp: whatsapp?.trim() || null,
      nationality: "Quiz lead",
      residence_country: "Quiz lead",
      preferred_destination: null,
      budget_range: answers.budget,
      timeline: answers.timing,
      applicant_type: answers.household,
      program_type: answers.goal === "residency-europe" ? "residency" : "citizenship",
      notes: [
        "[Strategy quiz lead]",
        `goal=${answers.goal}`,
        `timing=${answers.timing}`,
        `household=${answers.household}`,
        `language=${language}`,
      ].join("\n"),
      source_page: `${sourcePage}-strategy-quiz`,
    })

    if (error) {
      console.error("Quiz lead insert failed:", error)
      return NextResponse.json({ ok: false, message: "We could not store the quiz lead." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Quiz lead request failed:", error)
    return NextResponse.json({ ok: false, message: "We could not process the quiz lead." }, { status: 500 })
  }
}
