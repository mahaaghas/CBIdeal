# CBI Deal

Premium Next.js marketing site for:

- citizenship-by-investment and residency-by-investment lead generation
- a niche CRM SaaS for passport companies and immigration firms
- qualified lead partnerships, demos, pricing, and editorial content

The project now includes:

- a Sanity Studio admin panel at `/studio`
- a structured landing-page CMS layer
- a blog system at `/insights` and `/insights/[slug]`
- Supabase-backed investor and company lead capture

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives
- Sanity Studio + Sanity Content Lake
- `next-sanity` for CMS queries
- `@portabletext/react` for blog body rendering
- React Hook Form + Zod for forms
- Supabase for lead storage

## Public routes

- `/`
- `/citizenship-by-investment`
- `/for-companies`
- `/pricing`
- `/contact`
- `/demo`
- `/data-protection`
- `/partners`
- `/insights`
- `/insights/[slug]`
- `/crm` redirect
- `/privacy` redirect

## Admin route

- `/studio`

This is the embedded Sanity Studio. It gives you a WordPress-like admin workflow for:

- landing pages
- blog posts
- SEO fields
- image alt text
- site settings
- contact details
- FAQs
- categories and authors

## CMS architecture

### Document types

- `siteSettings`
- `landingPage`
- `blogPost`
- `faqEntry`
- `author`
- `category`

### Landing page sections

Landing pages are modeled as reusable sections:

- `heroSection`
- `trustSection`
- `featureSection`
- `processSection`
- `qualificationFormSection`
- `faqSection`
- `ctaBannerSection`

### How landing pages map to routes

- Homepage: create a `landingPage` document and enable `Homepage`
- Existing route override: create a `landingPage` with slug `for-companies` or `citizenship-by-investment`
- Future SEO pages: create a `landingPage` with a slug like `turkey-citizenship-by-investment` and it will resolve automatically at `/<slug>`

If a CMS page does not exist yet for the homepage, `/for-companies`, or `/citizenship-by-investment`, the site falls back to the current hardcoded premium frontend so nothing breaks.

## Local development

```bash
npm install
npm run dev
```

This repo includes a local `.npmrc` with `legacy-peer-deps=true` because one existing UI dependency still declares older React peer ranges while the app itself runs on React 19.

Optional CMS command:

```bash
npm run sanity
```

## Production build

```bash
npm run build
```

## Environment variables

Create `.env.local` in the project root with exactly these values:

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2026-03-19
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only
- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are required for both Studio and frontend reads
- `SANITY_API_VERSION` can stay pinned to the current date string used in this repo
- `.env.example` is included as a copyable starting point
- restart the Next.js dev server after adding or changing variables

## Sanity setup

### 1. Create a Sanity project

Use either option:

1. Create a project in [manage.sanity.io](https://manage.sanity.io)
2. Or run `npx sanity init` and follow the prompts

When the project is created, note:

- Project ID
- Dataset name, usually `production`

### 2. Add env vars

Paste the values into `.env.local` using the keys above.

### 3. Start the app

```bash
npm run dev
```

Then open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

### 4. First content to create

Create these in Sanity:

1. `Site settings`
2. At least one `Author`
3. At least one `Category`
4. A `landingPage` for the homepage if you want the homepage editable in CMS
5. A `blogPost` to populate `/insights`

### 6. Blog SEO workflow

For each `blogPost`, fill in:

- `SEO title`
- `Meta description`
- `Featured image` with required alt text
- inline article images with required alt text
- `Related main pages` to link the article to key investor or company pages
- `Related articles` if you want to hand-pick contextual internal links

If `Related articles` is left empty, the frontend falls back to related posts based on category and tag overlap.

### 5. Image alt text

Every structured image field includes an `alt` field. Fill it in for:

- landing-page feature images
- blog featured images
- Open Graph images
- inline article images
- author images when used

## Supabase setup

Lead forms submit to `app/api/leads/route.ts`.

- Investor submissions are written to `investor_leads`
- Company submissions are written to `company_inquiries`
- Partner submissions also write to `company_inquiries`, with metadata preserving enquiry type

Run the SQL below in the Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.investor_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone_whatsapp text not null,
  nationality text not null,
  residence_country text not null,
  preferred_destination text not null,
  budget_range text not null,
  timeline text not null,
  applicant_type text not null,
  program_type text not null,
  notes text,
  source_page text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists investor_leads_created_at_idx
  on public.investor_leads (created_at desc);

create index if not exists investor_leads_email_idx
  on public.investor_leads (email);

alter table public.investor_leads enable row level security;

create table if not exists public.company_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  work_email text not null,
  phone_whatsapp text not null,
  region_served text not null,
  team_size text not null,
  interest_type text not null,
  message text,
  source_page text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists company_inquiries_created_at_idx
  on public.company_inquiries (created_at desc);

create index if not exists company_inquiries_work_email_idx
  on public.company_inquiries (work_email);

alter table public.company_inquiries enable row level security;
```

### Lead column mapping

`investor_leads`

- `full_name` <- full name
- `email` <- email
- `phone_whatsapp` <- phone / WhatsApp
- `nationality` <- country of citizenship
- `residence_country` <- current residence
- `preferred_destination` <- preferred destination or region
- `budget_range` <- budget range
- `timeline` <- timeframe
- `applicant_type` <- applicant scope
- `program_type` <- citizenship / residency / open to both
- `notes` <- additional notes
- `source_page` <- route-specific source key

`company_inquiries`

- `company_name` <- company name
- `contact_person` <- contact person
- `work_email` <- work email
- `phone_whatsapp` <- phone / WhatsApp
- `region_served` <- region served
- `team_size` <- selected team size
- `interest_type` <- CRM / leads / both / white-label
- `message` <- submitted message
- `source_page` <- route-specific source key

## Important implementation notes

- The static premium frontend is still preserved
- Landing pages can now be overridden by Sanity content without redesigning the site
- New SEO landing pages can be added through Sanity and served from `app/[slug]/page.tsx`
- Blog metadata is generated from CMS fields
- Layout metadata and footer contact details can be overridden from `siteSettings`
- If Sanity env vars are missing, the public frontend still works and the Studio route shows a setup notice instead of crashing

## Netlify deployment

This repo already includes `netlify.toml`.

### Exact deployment steps

1. Push the project to GitHub.
2. In Netlify, choose `Add new site` -> `Import an existing project`.
3. Connect the GitHub repository.
4. Let Netlify detect Next.js automatically.
5. Confirm:
   - Build command: `npm run build`
   - Publish directory: leave blank
   - Node version: `20`
6. Add these environment variables in Netlify:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_VERSION`
7. Deploy once.
8. In Supabase, run the SQL schema above.
9. In Sanity, create your first `siteSettings`, `landingPage`, and `blogPost`.
10. Submit one investor form and one company form on production to confirm Supabase writes are working.

## Launch checklist

1. Replace placeholder business details in `lib/site-config.ts`.
2. Configure the same business details in Sanity `siteSettings` if you want the CMS to override footer and metadata defaults.
3. Add your Sanity project env vars.
4. Add your Supabase env vars.
5. Run `npm run build`.
6. Confirm `/studio`, `/insights`, and at least one blog post work.
7. Confirm the booking URL, footer contact details, and Open Graph images are correct.
8. Review the `data-protection` page with legal counsel if you need jurisdiction-specific wording.
