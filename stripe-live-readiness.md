# Stripe Live Readiness

## Changed files

- `apps/app/app/api/billing/checkout/route.ts`
- `apps/app/app/api/stripe/webhook/route.ts`
- `apps/app/app/billing/success/page.tsx`
- `apps/app/lib/customer-safe-errors.ts`
- `apps/app/lib/workspace-billing.ts`
- `stripe-live-readiness.md`

## Required environment variables

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRICE_ID_SOLO`
- `STRIPE_PRICE_ID_TEAM`
- `STRIPE_PRICE_ID_BUSINESS`

## Expected webhook events

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Where seat assignment is enforced

- `apps/app/app/api/billing/checkout/route.ts`
  - Checkout metadata now stores `seatCount` for the selected plan.
- `apps/app/app/api/stripe/webhook/route.ts`
  - Checkout completion and subscription lifecycle handlers validate the subscription item quantity against the configured plan seat count.
- `apps/app/lib/workspace-billing.ts`
  - Stripe price IDs are mapped back to `solo`, `team`, and `business`.
  - Subscription activation/sync rejects any Stripe price that does not match the workspace plan.
- `packages/config/src/saas.ts`
  - Seat limits remain defined as `Solo = 1`, `Team = 3`, `Business = 8`.

## Workspace/account billing updates

- Successful checkout and successful invoice payment mark the workspace as `Active` and `Paid`.
- Subscription lifecycle webhooks now keep workspace state aligned for `created`, `updated`, and `deleted`.
- Failed invoices mark payment as failed and block paid workspace access.
- Cancelled subscriptions move the workspace to `Cancelled`, which prevents access because paid access requires `Active` plus `Paid`.

## Manual Stripe dashboard setup still required

- Create or verify live recurring prices for:
  - `Solo` mapped to `STRIPE_PRICE_ID_SOLO`
  - `Team` mapped to `STRIPE_PRICE_ID_TEAM`
  - `Business` mapped to `STRIPE_PRICE_ID_BUSINESS`
- Make sure each live Stripe price is configured for a single subscription item whose quantity will be:
  - `Solo = 1`
  - `Team = 3`
  - `Business = 8`
- Configure the live webhook endpoint to point to:
  - `https://app.cbideal.nl/api/stripe/webhook`
- Subscribe that live webhook endpoint to all expected events listed above.
- Set live values for all required Stripe environment variables in the production deployment environment.
- Confirm `NEXT_PUBLIC_APP_URL` is set to `https://app.cbideal.nl` in production so checkout success and cancel URLs resolve to the live app domain.
- Verify the Stripe Dashboard customer portal, tax, invoices, and email settings separately if those features are intended to be live, because this codebase does not configure them automatically.
