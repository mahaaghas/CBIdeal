# CBI Deal Monorepo

Single repository for the public CBI Deal website and the CBI Deal SaaS workspace.

## Repository structure

```text
apps/
  web/        Public website, editorial content, forms, CMS routes
  app/        SaaS CRM, internal workspace, and client portal
packages/
  ui/         Shared UI components and reusable product primitives
  config/     Shared global styles, branding tokens, and pricing/config
content-registry/   Content planning, audits, and editorial system files
scripts/            Local helper scripts
```

## App responsibilities

### `apps/web`

Use this app for:

- the public marketing site
- citizenship and residency pathway pages
- insights / editorial content
- consultation and contact flows
- Sanity-backed content and Studio routes

### `apps/app`

Use this app for:

- the internal CRM workspace
- quotations, payments, document review, and case workflows
- internal team dashboards
- the external client portal

### `packages/ui`

Shared design system and reusable components used by both apps:

- buttons
- cards
- form controls
- tables
- app shell pieces
- shared brand mark and layout primitives

### `packages/config`

Shared design and configuration layer:

- global CSS and design tokens
- shared branding values
- pricing model helpers

## Local development

Install once from the repo root:

```bash
npm install
```

Run the public site:

```bash
npm run dev:web
```

Run the SaaS app:

```bash
npm run dev:app
```

## Production builds

Build both apps:

```bash
npm run build
```

On Vercel, the root build script automatically resolves the correct deploy target and mirrors the selected app output to the root `.next` directory when needed.

Build only the public site:

```bash
npm run build:web
```

Build only the SaaS app:

```bash
npm run build:app
```

## Vercel setup

Keep one GitHub repository and create two separate Vercel projects.

### Public website project

- Project name: `cbideal-web` or similar
- Root directory: `apps/web`
- Build command: leave default or use `npm run build`
- Install command: leave default (`npm install`)
- Output: Next.js default
- Domain example: `cbideal.nl` / `www.cbideal.nl`

### SaaS / CRM project

- Project name: `cbideal-app` or similar
- Root directory: `apps/app`
- Build command: leave default or use `npm run build`
- Install command: leave default (`npm install`)
- Output: Next.js default
- Domain example: `app.cbideal.nl`

## Workspace notes

- The repo root is now orchestration-only, not a deployable Next.js app.
- Shared branding should live in `packages/ui` and `packages/config`, not in app-specific one-off copies.
- New public routes belong in `apps/web/app`.
- New CRM and portal routes belong in `apps/app/app`.

## Environment variables

Add env vars at the Vercel project level for each app as needed.

Typical public-site envs include:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_VERSION`

The SaaS app can have its own app-specific environment variables separately inside the `apps/app` Vercel project.
