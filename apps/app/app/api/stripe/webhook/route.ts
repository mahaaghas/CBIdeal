import { NextResponse } from "next/server"
import Stripe from "stripe"
import {
  activateWorkspaceSubscription,
  getPlanIdFromStripePriceId,
  getSelfServeSeatCount,
  getStripeMetadataValue,
  logBillingRuntimeState,
  markWorkspacePaymentFailed,
  syncWorkspaceSubscriptionStatus,
} from "@/lib/workspace-billing"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

type InvoiceWithSubscriptionReference = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null
}

type RetrievedCheckoutSession = Stripe.Checkout.Session & {
  line_items?: {
    data: Array<
      Stripe.LineItem & {
        price?: Stripe.Price | string | null
      }
    >
  } | null
}

function getSessionPriceId(session: RetrievedCheckoutSession) {
  const firstLine = session.line_items?.data?.[0]
  const price = firstLine?.price
  if (!price) return null
  return typeof price === "string" ? price : price.id
}

function getInvoicePriceId(invoice: Stripe.Invoice) {
  const firstLine = invoice.lines.data[0]
  const price = firstLine?.pricing?.price_details?.price
  if (typeof price === "string" && price.trim()) {
    return price.trim()
  }
  return null
}

function getSubscriptionPriceId(subscription: Stripe.Subscription) {
  const firstItem = subscription.items.data[0]
  const price = firstItem?.price
  return price?.id?.trim() || null
}

function getSubscriptionSeatCount(subscription: Stripe.Subscription) {
  const quantity = subscription.items.data[0]?.quantity
  return typeof quantity === "number" && Number.isFinite(quantity) ? quantity : null
}

export async function POST(request: Request) {
  if (!stripe || !stripeWebhookSecret) {
    logBillingRuntimeState("webhook-misconfigured")
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
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook payload."
    console.error("[stripe.webhook] signature verification failed", { error: message })
    return NextResponse.json({ received: false, error: message }, { status: 400 })
  }

  console.info("[stripe.webhook] received event", {
    eventType: event.type,
    eventId: event.id,
    liveMode: event.livemode,
  })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        const session = (await stripe.checkout.sessions.retrieve(checkoutSession.id, {
          expand: ["customer", "subscription", "subscription.items.data.price", "line_items.data.price"],
        })) as RetrievedCheckoutSession
        const tenantId = getStripeMetadataValue(session.metadata, "tenantId") ?? session.client_reference_id ?? null
        const paid = session.payment_status === "paid" || session.status === "complete"
        const subscriptionObject =
          session.subscription && typeof session.subscription !== "string" ? session.subscription : null
        const sessionPriceId = getSessionPriceId(session)
        const resolvedPlanId =
          getStripeMetadataValue(session.metadata, "planId") ?? getPlanIdFromStripePriceId(sessionPriceId)
        const expectedSeatCount =
          resolvedPlanId === "solo" || resolvedPlanId === "team" || resolvedPlanId === "business"
            ? getSelfServeSeatCount(resolvedPlanId)
            : null
        const actualSeatCount = subscriptionObject ? getSubscriptionSeatCount(subscriptionObject) : null

        console.info("[stripe.webhook] processing checkout completion", {
          tenantId,
          sessionId: session.id,
          paymentStatus: session.payment_status,
          sessionStatus: session.status,
        })

        if (!paid) {
          console.warn("[stripe.webhook] checkout completed without a paid state", {
            tenantId,
            sessionId: session.id,
            paymentStatus: session.payment_status,
            status: session.status,
          })
          break
        }

        if (
          subscriptionObject &&
          expectedSeatCount !== null &&
          actualSeatCount !== null &&
          actualSeatCount !== expectedSeatCount
        ) {
          throw new Error(
            `Seat count mismatch for ${resolvedPlanId ?? "unknown"} plan. Expected ${expectedSeatCount}, received ${actualSeatCount}.`,
          )
        }

        const activated = await activateWorkspaceSubscription({
          tenantId,
          checkoutSessionId: session.id,
          customerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
          subscriptionId:
            typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null,
          priceId: sessionPriceId,
          subscriptionStatus: subscriptionObject?.status ?? null,
          liveMode: session.livemode,
          paidAt: new Date(session.created * 1000).toISOString(),
        })

        console.info("[stripe.webhook] workspace activated from checkout", {
          tenantId: activated.tenant.id,
          sessionId: session.id,
          subscriptionId: activated.tenant.stripeSubscriptionId,
          customerId: activated.tenant.stripeCustomerId,
        })
        break
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as InvoiceWithSubscriptionReference

        console.info("[stripe.webhook] processing invoice payment success", {
          invoiceId: invoice.id,
          customerId: typeof invoice.customer === "string" ? invoice.customer : null,
          subscriptionId: typeof invoice.subscription === "string" ? invoice.subscription : null,
        })

        const activated = await activateWorkspaceSubscription({
          subscriptionId: typeof invoice.subscription === "string" ? invoice.subscription : null,
          customerId: typeof invoice.customer === "string" ? invoice.customer : null,
          priceId: getInvoicePriceId(invoice),
          liveMode: invoice.livemode,
          paidAt: new Date(invoice.created * 1000).toISOString(),
        })

        console.info("[stripe.webhook] workspace confirmed from invoice payment", {
          tenantId: activated.tenant.id,
          subscriptionId: activated.tenant.stripeSubscriptionId,
          invoiceId: invoice.id,
        })
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = getSubscriptionPriceId(subscription)
        const resolvedPlanId =
          getStripeMetadataValue(subscription.metadata, "planId") ?? getPlanIdFromStripePriceId(priceId)
        const expectedSeatCount =
          resolvedPlanId === "solo" || resolvedPlanId === "team" || resolvedPlanId === "business"
            ? getSelfServeSeatCount(resolvedPlanId)
            : null
        const actualSeatCount = getSubscriptionSeatCount(subscription)

        if (
          expectedSeatCount !== null &&
          actualSeatCount !== null &&
          actualSeatCount !== expectedSeatCount
        ) {
          throw new Error(
            `Seat count mismatch for ${resolvedPlanId ?? "unknown"} plan. Expected ${expectedSeatCount}, received ${actualSeatCount}.`,
          )
        }

        const synced = await syncWorkspaceSubscriptionStatus({
          tenantId: getStripeMetadataValue(subscription.metadata, "tenantId"),
          subscriptionId: subscription.id,
          customerId: typeof subscription.customer === "string" ? subscription.customer : null,
          priceId,
          subscriptionStatus: subscription.status,
          liveMode: subscription.livemode,
          paidAt:
            subscription.status === "active" || subscription.status === "trialing"
              ? new Date(subscription.created * 1000).toISOString()
              : null,
        })

        console.info("[stripe.webhook] synced subscription state", {
          tenantId: synced.tenant.id,
          subscriptionId: subscription.id,
          status: subscription.status,
          eventType: event.type,
        })
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as InvoiceWithSubscriptionReference
        const failed = await markWorkspacePaymentFailed({
          subscriptionId: typeof invoice.subscription === "string" ? invoice.subscription : null,
          customerId: typeof invoice.customer === "string" ? invoice.customer : null,
        })

        console.warn("[stripe.webhook] recorded payment failure", {
          tenantId: failed?.tenant.id ?? null,
          invoiceId: invoice.id,
        })
        break
      }
      default:
        console.info("[stripe.webhook] ignored event", { eventType: event.type, eventId: event.id })
        break
    }

    return NextResponse.json({
      received: true,
      eventType: event.type,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process the Stripe webhook event."
    console.error("[stripe.webhook] processing failed", {
      eventType: event.type,
      eventId: event.id,
      error: message,
    })
    return NextResponse.json({ received: false, error: message }, { status: 500 })
  }
}
