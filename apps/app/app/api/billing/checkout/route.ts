import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSaasPlan, isSelfServePlan, type SaasPlanId } from "@cbideal/config"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

function getPriceIdForPlan(planId: SaasPlanId) {
  if (planId === "starter") return process.env.STRIPE_STARTER_PRICE_ID
  if (planId === "growth") return process.env.STRIPE_GROWTH_PRICE_ID
  return null
}

export async function POST(request: Request) {
  const body = (await request.json()) as { tenantId?: string; planId?: SaasPlanId }
  const tenantId = body.tenantId?.trim()
  const planId = body.planId

  if (!tenantId || !planId || !isSelfServePlan(planId)) {
    return NextResponse.json({ error: "A valid self-serve tenant and plan are required." }, { status: 400 })
  }

  const plan = getSaasPlan(planId)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin || "https://app.cbideal.nl"
  const successUrl = `${baseUrl}/billing/success?tenant=${tenantId}&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/billing/cancel?tenant=${tenantId}`

  if (!stripe || !getPriceIdForPlan(planId)) {
    return NextResponse.json({
      url: `${baseUrl}/billing/success?tenant=${tenantId}&sandbox=1`,
      checkoutSessionId: null,
      mode: "sandbox",
      note: "Stripe is not configured. Falling back to the local billing sandbox.",
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: getPriceIdForPlan(planId),
          quantity: 1,
        },
      ],
      metadata: {
        tenantId,
        planId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    })

    return NextResponse.json({
      url: session.url,
      checkoutSessionId: session.id,
      mode: "stripe",
      plan: plan.name,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the Stripe checkout session."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
