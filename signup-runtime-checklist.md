# Signup Runtime Checklist

## Exact env vars required for production signup

The current production signup path requires these environment variables to be configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRICE_ID_SOLO`
- `STRIPE_PRICE_ID_TEAM`
- `STRIPE_PRICE_ID_BUSINESS`

These variables are also used by adjacent billing runtime checks and the end-to-end billing experience:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Legacy compatibility still exists for these aliases, but they should not be treated as the canonical production names:

- `SUPABASE_SECRET_KEY`
- `SUPABASE_URL`

## Server-only env vars

These values must remain server-only and must never be exposed to the client bundle:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

These values are safe for client/runtime exposure because the current app reads them in browser code or public redirects:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## File dependencies

- `apps/app/lib/supabase/config.ts`
  - Resolves browser and server Supabase credentials.
- `apps/app/lib/supabase/server.ts`
  - Creates the server-side Supabase client from the server config.
- `apps/app/lib/workspace-billing.ts`
  - Creates the workspace signup record and stores billing state in `workspace_signups`.
- `apps/app/app/api/workspace/register/route.ts`
  - Blocks signup safely when runtime prerequisites are missing, then calls `createWorkspaceSignup()`.
- `apps/app/lib/platform-access-store.tsx`
  - Posts signup data to `/api/workspace/register` and only advances on success.
- `apps/app/app/signup/page.tsx`
  - Collects workspace signup details, then redirects to the checkout step after registration succeeds.
- `apps/app/app/api/billing/checkout/route.ts`
  - Creates the Stripe Checkout Session after the workspace signup record already exists.
- `apps/app/app/api/stripe/webhook/route.ts`
  - Finalizes and syncs billing state after Stripe events arrive.

## Expected signup flow sequence

1. The user submits the signup form on `/signup`.
2. `POST /api/workspace/register` validates input and checks runtime prerequisites.
3. `createWorkspaceSignup()` writes the `workspace_signups` record through the server-side Supabase client.
4. The client receives the new `tenantId` and navigates to `/signup/checkout`.
5. `POST /api/billing/checkout` loads the existing workspace signup state.
6. The server creates the Stripe Checkout Session.
7. The client redirects to Stripe Checkout.
8. Stripe webhook events update the workspace billing state after payment events occur.

The codepath does not attempt Stripe Checkout before workspace signup creation succeeds.

## Manual dashboard and platform setup still required

- Set `SUPABASE_SERVICE_ROLE_KEY` in the production deployment environment.
- Set `NEXT_PUBLIC_SUPABASE_URL` in the production deployment environment.
- Set the live Stripe keys and live price IDs in the production deployment environment.
- Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` so client-side Stripe checkout initialization works in production.
- Set `STRIPE_WEBHOOK_SECRET` for the live webhook endpoint.
- In Stripe, create or confirm the live recurring prices referenced by:
  - `STRIPE_PRICE_ID_SOLO`
  - `STRIPE_PRICE_ID_TEAM`
  - `STRIPE_PRICE_ID_BUSINESS`
- In Stripe, point the live webhook endpoint at:
  - `https://app.cbideal.nl/api/stripe/webhook`
- In Stripe, subscribe the webhook endpoint to the billing events already handled by the app:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
