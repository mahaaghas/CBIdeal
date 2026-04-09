# Supabase Auth Email Setup

Use the branded CBI Deal auth templates from:

- `apps/app/lib/auth-email-templates.ts`

Use the shared auth route map from:

- `apps/app/lib/auth-flow.ts`

## Production site URL

Set the Supabase Auth Site URL to:

- `https://app.cbideal.nl`

## Redirect URLs to add in Supabase

Add each of these redirect URLs in **Authentication -> URL Configuration -> Redirect URLs**:

- `https://app.cbideal.nl/login`
- `https://app.cbideal.nl/signup`
- `https://app.cbideal.nl/forgot-password`
- `https://app.cbideal.nl/reset-password`
- `https://app.cbideal.nl/auth/check-email`
- `https://app.cbideal.nl/auth/confirmed`
- `https://app.cbideal.nl/auth/error`
- `https://app.cbideal.nl/auth/confirm`
- `https://app.cbideal.nl/invite/accept`

## Templates to configure

Update these Supabase templates in **Authentication -> Email Templates**:

1. Confirm signup
2. Reset password
3. Invite user

## Subject lines

- Confirm signup: `Confirm your email to continue`
- Reset password: `Reset your password`
- Invite user: `You've been invited to join a workspace`

## CTA labels

- Confirm signup: `Confirm email`
- Reset password: `Reset password`
- Invite user: `Accept invitation`

## Branded destination routes

- Confirm signup -> `https://app.cbideal.nl/auth/confirm?token_hash={{ .TokenHash }}&type=email`
- Reset password -> `https://app.cbideal.nl/reset-password?token_hash={{ .TokenHash }}&type=recovery`
- Invite user -> `https://app.cbideal.nl/invite/accept?token_hash={{ .TokenHash }}&type=invite`

## Required manual copy

### Confirm signup

- Title: `Confirm your email`
- Intro: `You're almost set.`
- Body: `Please confirm your email to continue setting up your account.`
- Note: `If you didn't create this account, you can ignore this email.`

### Reset password

- Title: `Reset your password`
- Intro: `We received a request to reset your password.`
- Body: `Click below to choose a new one.`
- Note: `If you didn't request this, you can safely ignore this email.`

### Invite user

- Title: `You've been invited`
- Intro: `You've been invited to join a workspace.`
- Body: `Click below to accept the invitation and set up your account.`
- Supporting line: `This invitation may expire after a limited period for security reasons.`
- Note: `If you weren't expecting this, you can ignore this email.`

## SMTP

For production, configure a custom SMTP provider in **Authentication -> SMTP Settings** so auth emails do not rely on Supabase's limited default mailer.

## URL audit guidance

Remove or replace outdated auth URLs such as:

- `https://cbideal-app.vercel.app/...`
- local development URLs used in production

The canonical production auth/app domain is:

- `https://app.cbideal.nl`
