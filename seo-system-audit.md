# CBI Deal SEO System Audit

Date: March 24, 2026  
Scope: full-site SEO audit, cluster structure, internal linking system, technical SEO gaps, conversion SEO, execution plan, and measurement model.

## Stage 1: Full SEO Audit

### 1. Site Structure

Current live public structure:

- Core commercial pages
  - `/`
  - `/citizenship-by-investment`
  - `/caribbean-cbi-comparison`
  - `/book-a-cbi-consultation`
  - `/for-companies`
- `/pricing`
- `/contact`
- `/demo`
- `/data-protection`
- `/privacy-policy`
- `/partners`
- Insights hub
  - `/insights`
  - `/insights/[slug]`
- Redirect aliases
  - `/crm` -> `/for-companies`
  - `/privacy` -> `/privacy-policy`
- CMS-driven future landing route
  - `/<slug>` via `app/[slug]/page.tsx`

Assessment:

- The broad structure is directionally good for a lead-gen advisory brand.
- There is one clear investor pillar route: `/citizenship-by-investment`.
- There is one strong comparison route: `/caribbean-cbi-comparison`.
- There is one clear conversion route: `/book-a-cbi-consultation`.
- The insights cluster is stronger than the commercial cluster in content depth.
- Program-page coverage is missing entirely from the live route set.
- Decision/support pages are mostly handled inside blog content rather than dedicated landing pages.
- The dynamic CMS landing layer is present, which is good for scale, but the actual cluster rollout is incomplete.

Critical structural gaps:

- No live country program pages such as `st-lucia-cbi`, `dominica-cbi`, `grenada-cbi`, `antigua-barbuda-cbi`, `st-kitts-nevis-cbi`
- No live cost/process decision pages such as `how-much-does-cbi-cost` and `cbi-due-diligence-process`
- No live audience-specific landing pages such as `cbi-for-gcc-residents`, `cbi-for-families`, `cbi-for-business-owners`

### 2. Search Intent

Strong intent matches already present:

- `/citizenship-by-investment`
  - intent: broad commercial / investor research / pre-consultation
- `/caribbean-cbi-comparison`
  - intent: shortlist comparison / high-intent evaluator
- `/book-a-cbi-consultation`
  - intent: conversion / decision-stage contact
- `/insights/best-citizenship-by-investment-programs-2026`
  - intent: high-intent “best” comparison
- `/insights/caribbean-passport-vs-portugal-golden-visa`
  - intent: cross-route comparison
- `/insights/citizenship-by-investment-vs-residency-by-investment`
  - intent: framework / route selection
- GCC-focused insights pages
  - intent: region-specific mobility questions

Intent weaknesses:

- The main pillar page is good, but it still has to do too much work because program and decision pages are missing.
- The investor cluster leans heavily on blog articles for commercial-intent questions that would convert better as dedicated landing pages.
- Several search intents are only partially covered in blog form when they should also exist as conversion-aware decision pages.

Overlap risks:

- GCC intent can become duplicative quickly.
  - Existing GCC article coverage is already substantial.
  - New Gulf pages should be segmented by scenario, not reworded synonyms.
- Caribbean comparison intent is already well covered.
  - New comparison pages should be narrower and more specific.
- Portugal comparison intent is already covered strongly.
  - Do not create another Portugal-vs-Caribbean page with the same search intent.

### 3. Content Quality

Strengths:

- Tone is generally strong: advisory, calmer than typical immigration marketing, and commercially credible.
- The best insight pages are decision-oriented and include trade-offs rather than hype.
- Compliance language is stronger than in most competing lead-gen sites.
- The site does not lean on obvious “buy passport” language.

Weaknesses:

- Content depth is uneven across the site.
  - Insights are strong.
  - Program coverage is missing.
  - Decision-support commercial pages are thinner than the insight layer.
- Some money pages still explain rather than fully answer decision-stage queries.
- The most strategic long-tail intents are concentrated in hardcoded fallback insight components, which is acceptable for launch but not ideal for editorial scale.

### 4. Internal Linking

Current state:

- Core landing pages link into each other reasonably well.
- Insight pages include related posts and related pages.
- Homepage routes users into the main investor and company paths.
- Consultation CTAs exist across key routes.

Current weaknesses:

- No full hub-and-spoke system yet.
- Pillar -> comparison -> program -> consultation flow is only partially built.
- Many insight pages link back to the site, but not yet into a complete commercial cluster because the destination pages do not exist.
- Cost and due diligence intents are not yet reinforced by dedicated commercial pages.

### 5. On-Page SEO

Strengths:

- Metadata helper is in place.
- Titles, descriptions, OG, Twitter, and canonical support exist.
- Locale alternates are implemented in metadata.
- Insights pages include JSON-LD on the hub and article pages.

Weaknesses:

- No consistent schema strategy yet on commercial landing pages.
- Some pages are well optimized, but the site does not yet have a formal on-page standard for every page type.
- The homepage title is broad but could eventually be tightened further around commercial-intent investor language once the cluster is larger.

### 6. Technical SEO

Strengths:

- Canonical and language alternates are implemented via `buildPageMetadata`.
- GA4 is installed globally and custom event tracking exists.
- Next.js image optimization is enabled.
- Locale URLs are clean: `/`, `/ar`, `/ru`, plus localized nested routes.
- Redirect aliases exist for `/crm` and `/privacy`.

Critical technical issues:

- No `app/sitemap.ts`
- No `app/robots.ts`

Medium technical issues:

- Many routes are server-rendered on demand because of request-aware locale handling; this is acceptable, but page speed and crawl efficiency should be watched.
- Commercial landing pages do not yet carry structured data beyond standard metadata.
- Redirect alias pages generate metadata even though they redirect; acceptable, but the sitemap should exclude aliases.

### 7. Conversion Alignment

Strengths:

- The site is lead-oriented rather than traffic-oriented.
- Consultation routes are visible and soft-CTA based.
- Forms are minimal enough for high-intent users.
- Trust, compliance, and discretion are positioned well for high-value leads.

Gaps:

- Several high-intent decision queries still terminate in the insights layer rather than a commercial page designed to convert.
- Program intent has no dedicated conversion destination yet.
- Cost and due diligence questions are strong lead filters, but they are not yet captured as standalone commercial conversion pages.

## Critical Issues

1. Missing live sitemap and robots configuration
2. Missing country program pages
3. Missing decision-support commercial pages for cost and due diligence
4. Internal linking is directionally good but still incomplete as a cluster system
5. Commercial cluster depth lags behind insight/article depth

## Missed Opportunities

- Convert “best / fastest / cheapest / safest” traffic into pillar-supporting comparison pages and program pages
- Own “cost”, “due diligence”, and “what happens after consultation” intents as commercial support pages
- Build scenario pages for GCC residents, families, and business owners
- Add schema coverage to commercial landing pages

## Stage 2: SEO Structure

### Pillar Page

- `/citizenship-by-investment/`
- Purpose:
  - core commercial authority page
  - entry point for investor cluster
- Intent:
  - broad research with commercial intent
- Should link to:
  - `/caribbean-cbi-comparison/`
  - `/book-a-cbi-consultation/`
  - future program pages
  - future decision pages

### Comparison Cluster

Purpose:

- capture shortlist and “which is better” intent
- convert high-intent evaluators into consultation leads

Current:

- `/caribbean-cbi-comparison/`
- `/insights/best-citizenship-by-investment-programs-2026`
- `/insights/cheapest-citizenship-by-investment-programs`
- `/insights/fastest-citizenship-by-investment-programs`
- `/insights/safest-citizenship-by-investment-programs`
- `/insights/dominica-vs-st-lucia-citizenship-by-investment`
- `/insights/st-kitts-vs-antigua-citizenship-by-investment`
- `/insights/caribbean-passport-vs-portugal-golden-visa`
- `/insights/citizenship-by-investment-vs-residency-by-investment`

Recommended structure:

- Commercial comparison hub:
  - `/caribbean-cbi-comparison/`
- Supporting comparisons in insights:
  - keep specific “vs” and framework pages in `/insights`
- Future commercial comparison pages only when intent is meaningfully different

### Program Pages

Purpose:

- capture country-specific commercial intent
- act as the destination pages from comparisons

Priority program pages:

- `/st-lucia-cbi/`
- `/dominica-cbi/`
- `/grenada-cbi/`
- `/antigua-barbuda-cbi/`
- `/st-kitts-nevis-cbi/`

Each should link to:

- `/citizenship-by-investment/`
- `/caribbean-cbi-comparison/`
- `/book-a-cbi-consultation/`
- one relevant insight article

### Decision Pages

Purpose:

- capture legal, cost, timing, diligence, and “is this worth it” queries
- bridge information queries to consultation

Priority decision pages:

- `/how-much-does-cbi-cost/`
- `/cbi-due-diligence-process/`

Supporting insight content already exists for:

- worth it
- scam
- cheapest
- fastest
- safest
- can you lose it

### Insights / Blog

Purpose:

- capture question-led and framework-led demand
- build authority
- support internal linking into commercial pages

Role in the system:

- Insights should support the cluster, not replace commercial landing pages.
- Use insights for:
  - comparisons too narrow for landing pages
  - myth-busting
  - risk, compliance, and framework queries
  - audience-specific advisory content

## Stage 3: Content Strategy

### Funnel by page type

- Awareness
  - myth-busting and framework insights
  - scenario explainers
- Comparison
  - Caribbean comparison
  - program-vs-program insights
  - citizenship vs residency
- Decision
  - pillar page
  - program pages
  - cost page
  - due diligence page
  - consultation page

### Existing pages by decision stage

- Awareness / early-mid:
  - `/insights/is-citizenship-by-investment-a-scam`
  - `/insights/why-are-caribbean-passports-so-cheap`
  - `/insights/can-you-lose-citizenship-by-investment`
- Comparison:
  - `/caribbean-cbi-comparison`
  - `/insights/best-citizenship-by-investment-programs-2026`
  - `/insights/dominica-vs-st-lucia-citizenship-by-investment`
  - `/insights/st-kitts-vs-antigua-citizenship-by-investment`
  - `/insights/caribbean-passport-vs-portugal-golden-visa`
  - `/insights/citizenship-by-investment-vs-residency-by-investment`
- Decision:
  - `/citizenship-by-investment`
  - `/book-a-cbi-consultation`
  - `/contact`

### Content rules

Every future page should:

- answer the query directly near the top
- state trade-offs honestly
- explain what the route does and does not solve
- include a soft advisory CTA
- link toward the next logical step

## Stage 4: Internal Linking System

### Mandatory linking pattern

Every investor-facing page should link to:

- the pillar page: `/citizenship-by-investment`
- one relevant comparison page
- the consultation page: `/book-a-cbi-consultation`

### Linking map

- Pillar page links to:
  - Caribbean comparison
  - consultation
  - insights hub
  - all future program pages
  - cost page
  - due diligence page

- Comparison pages link to:
  - pillar page
  - most relevant program pages
  - consultation page

- Program pages link to:
  - pillar page
  - Caribbean comparison
  - due diligence page
  - consultation page

- Decision pages link to:
  - pillar page
  - consultation page
  - relevant comparison pages

- Insight pages link to:
  - pillar page
  - one relevant comparison/program page
  - consultation page

### Anchor text examples

- `citizenship by investment programs`
- `compare the main Caribbean routes`
- `review the due diligence process`
- `request a private consultation`
- `see how total CBI costs compare`

## Stage 5: On-Page Optimization Rules

Each page should have:

- one clear primary intent
- one clean H1 matching that intent
- a summary/direct-answer block near the top
- H2s aligned to user questions
- readable paragraphs and strong subheadings
- an FAQ section when intent is question-led

Title tag rule:

- clear
- commercially relevant
- no vague branding-only titles

Meta description rule:

- describe the value of the page
- reflect the decision question
- support click-through from high-intent users

## Stage 6: Technical Setup

Already present:

- GA4 integrated
- canonical and hreflang logic
- clean localized URLs
- image optimization

Must be present:

- sitemap
- robots
- indexable route set with redirect aliases excluded from sitemap

Technical implementation priorities:

1. add `app/sitemap.ts`
2. add `app/robots.ts`
3. add landing-page schema and FAQ schema to key commercial routes
4. monitor dynamic route performance

Execution status:

- `app/sitemap.ts` is now implemented
  - includes the core commercial routes
  - includes `/insights` article URLs from both fallback and CMS sources
  - includes CMS landing-page slugs
  - excludes redirect aliases and studio paths
  - adds locale alternates for `en`, `ar`, and `ru`
- `app/robots.ts` is now implemented
  - points crawlers to `/sitemap.xml`
  - disallows `/studio/` and `/api/`

## Stage 7: Conversion SEO

Rule:

- no page should end in information only
- every page should naturally suggest the next step

Current best conversion pages:

- `/book-a-cbi-consultation`
- `/citizenship-by-investment`
- `/caribbean-cbi-comparison`

Needed improvements:

- build program pages with above-the-fold route-fit framing and soft consultation CTAs
- build decision pages that absorb objections and transition into consultation
- ensure all insights routes link to the consultation path without becoming overly salesy

## Stage 8: Execution Plan

### Week 1

- strengthen the core investor conversion spine
- finalize technical crawl layer

Actions:

- keep `/citizenship-by-investment/` as the main pillar
- keep `/caribbean-cbi-comparison/` as the comparison hub
- keep `/book-a-cbi-consultation/` as the decision CTA page
- add sitemap and robots
- add schema to the pillar and consultation routes

### Week 2

- build country intent and scenario depth

Actions:

- launch 2 to 3 program pages first
  - `st-lucia-cbi`
  - `dominica-cbi`
  - `st-kitts-nevis-cbi`
- launch 2 scenario pages
  - `cbi-for-gcc-residents`
  - `cbi-for-families`

### Week 3

- deepen internal linking and supporting authority

Actions:

- connect insight pages to the new program pages
- add the two commercial decision pages
  - `how-much-does-cbi-cost`
  - `cbi-due-diligence-process`
- refresh homepage and pillar internal linking to point into the full cluster

## Stage 9: Measurement

### GA4 events to monitor

Already tracked:

- `form_submit`
- `consultation_cta_click`
- `calendly_open`
- `booking_cta_click`

Recommended reporting views:

- landing page -> consultation CTA click rate
- landing page -> form submit rate
- insight page -> assisted consultation click rate
- localized page -> form submit by language

### Pages to judge by lead quality, not traffic

- `/citizenship-by-investment`
- `/caribbean-cbi-comparison`
- `/book-a-cbi-consultation`
- all future program pages
- all future cost/process decision pages

### Most valuable traffic segments

- comparison intent
- program intent
- cost / due diligence / worth-it intent
- GCC and family scenario traffic with consultation follow-through

## Final Recommendations

Priority order:

1. fix technical crawl essentials
2. complete the commercial investor cluster
3. make insights support the cluster more deliberately
4. measure conversion by page type and decision stage, not raw sessions

The site is already beyond brochure stage. The main SEO risk now is not quality, but incompleteness:

- the intent map is promising
- the tone is strong
- the conversion layer exists
- but the cluster is only partially built

The right move is not more random content.  
The right move is to finish the investor cluster with program pages, decision pages, and a tighter link system.
