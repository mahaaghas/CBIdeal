import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSaasPlan, isSelfServePlan, normalizeSaasAppUrl, type SaasPlanId } from "@cbideal/config"
import { customerSafeMessages, getCustomerSafeMessage } from "@/lib/customer-safe-errors"
import {
  getBillingRuntimeDiagnostics,
  getSelfServeSeatCount,
  getStripeBillingConfigIssues,
  getStripePriceIdForPlan,
  getWorkspaceStatus,
  isStripeBillingConfigured,
  logBillingRuntimeState,
  markWorkspaceCheckoutPending,
} from "@/lib/workspace-billing"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export async function POST(request: Request) {
  const body = (await request.json()) as { tenantId?: string; planId?: SaasPlanId }
  const tenantId = body.tenantId?.trim()
  const planId = body.planId

  if (!tenantId || !planId || !isSelfServePlan(planId)) {
    return NextResponse.json({ error: "A valid self-serve tenant and plan are required." }, { status: 400 })
  }

  const plan = getSaasPlan(planId)
  const baseUrl = normalizeSaasAppUrl(process.env.NEXT_PUBLIC_APP_URL)
  const successUrl = `${baseUrl}/billing/success?tenant=${tenantId}&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${baseUrl}/billing/cancel?tenant=${tenantId}&plan=${planId}`
  const priceId = getStripePriceIdForPlan(planId)
  const seatCount = getSelfServeSeatCount(planId)
  const runtimeDiagnostics = getBillingRuntimeDiagnostics()

  if (!stripe || !isStripeBillingConfigured() || !priceId || !runtimeDiagnostics.supabaseConfigured) {
    const diagnostics = logBillingRuntimeState("checkout-blocked")
    const issues = getStripeBillingConfigIssues()
    if (!diagnostics.supabaseConfigured) {
      issues.push(
        "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY. Legacy SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY aliases are also supported during migration.",
      )
    }
    console.error("[billing.checkout] blocked because Stripe billing is not configured", {
      tenantId,
      planId,
      issues,
    })
    return NextResponse.json(
      {
        error: customerSafeMessages.billingUnavailable,
      },
      { status: 503 },
    )
  }

  try {
    const workspace = await getWorkspaceStatus(tenantId)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace billing record not found." }, { status: 404 })
    }

    if (workspace.tenant.planId !== planId) {
      return NextResponse.json(
        { error: "The requested plan does not match the workspace billing record." },
        { status: 400 },
      )
    }

    if (workspace.tenant.subscriptionStatus === "Active") {
      return NextResponse.json({ error: "This workspace is already active." }, { status: 409 })
    }

    console.info("[billing.checkout] creating Stripe checkout session", {
      tenantId,
      planId,
      liveMode: stripeSecretKey?.startsWith("sk_live_") ?? false,
    })

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: tenantId,
      customer_email: workspace.user.email,
      metadata: {
        tenantId,
        planId,
        seatCount: String(seatCount),
      },
      subscription_data: {
        metadata: {
          tenantId,
          planId,
          seatCount: String(seatCount),
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    })

    await markWorkspaceCheckoutPending({
      tenantId,
      checkoutSessionId: session.id,
      priceId,
      liveMode: session.livemode,
    })

    return NextResponse.json({
      url: session.url,
      checkoutSessionId: session.id,
      mode: "stripe",
      plan: plan.name,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the Stripe checkout session."
    console.error("[billing.checkout] failed to create Stripe checkout session", {
      tenantId,
      planId,
      error: message,
    })
    const status = message.includes("missing") ? 503 : 500
    return NextResponse.json({ error: getCustomerSafeMessage("checkout", message) }, { status })
  }
}
