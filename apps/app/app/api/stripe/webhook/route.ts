import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export async function POST(request: Request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json(
      {
        received: false,
        error: "Stripe webhook handling is not configured in this environment.",
      },
      { status: 503 },
    )
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ received: false, error: "Missing Stripe signature." }, { status: 400 })
  }

  const payload = await request.text()

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)

    return NextResponse.json({
      received: true,
      eventType: event.type,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook payload."
    return NextResponse.json({ received: false, error: message }, { status: 400 })
  }
}
