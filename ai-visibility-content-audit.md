# AI Visibility Content Audit

## Scope and method

This audit is based only on content that exists in the repository on 2026-03-22.

Sources reviewed:
- `app/**/page.tsx` live routes
- `lib/insights/fallback-posts.ts` published insight article registry
- `content-registry/topics.json` published and draft topic registry
- `content-registry/drafts/*.md` draft article files
- `content-registry/landing-page-system.md` planned landing-page blueprint

Not counted as existing content pages:
- Dynamic page infrastructure with no repository-authored instances, such as `app/[slug]/page.tsx`
- Sanity CMS schemas without actual repository content entries
- B2B CRM/pricing/privacy pages unless directly relevant to citizenship-by-investment search intent

---

## 1. Live content inventory

### Live investor-facing pages and articles

| Title | Slug | Page type | Primary topic | Secondary topics | Search intent | Current strength |
|---|---|---|---|---|---|---|
| International Citizenship and Residency Solutions | `/` | Homepage / broad authority page | Citizenship and residency by investment advisory | Global mobility, licensed providers, qualification, compliance, investor lead gen | Broad informational + commercial investigation | Medium |
| Citizenship by Investment: A Structured Advisory Route for Global Investors | `/citizenship-by-investment` | Pillar landing page | Citizenship by investment overview | Program selection, route fit, process, provider handoff, due diligence | Broad commercial investigation | Strong |
| Caribbean CBI Comparison: What Actually Separates the Main Programs | `/caribbean-cbi-comparison` | Comparison landing page | Caribbean citizenship by investment comparison | Cost logic, family fit, reputation, strategy | High-intent comparison | Strong |
| Book a CBI Consultation: Private, Structured, and Realistic | `/book-a-cbi-consultation` | Conversion landing page | Private CBI consultation | Route fit, family planning, documentation readiness, next steps | Transactional / lead generation | Strong |
| Insights and Immigration Market Articles | `/insights` | Content hub | CBI / RBI / immigration insights hub | Investor planning, comparisons, advisory content | Informational hub | Medium |
| Best Citizenship by Investment Programs in 2026: A Realistic Comparison for Investors | `/insights/best-citizenship-by-investment-programs-2026` | SEO article / comparison guide | Best CBI programs in 2026 | Caribbean passport programs, second citizenship options, visa-free travel | Comparison / commercial investigation | Strong |
| Caribbean Passport vs Portugal Golden Visa: Which Is Right for You? | `/insights/caribbean-passport-vs-portugal-golden-visa` | SEO article / route comparison | Caribbean passport vs Portugal Golden Visa | CBI vs RBI, second passport vs European residency, long-term fit | Comparison / decision support | Strong |
| Caribbean Passport Comparison for GCC Expats: Which Citizenship by Investment Program Is Best for Mobility? | `/insights/caribbean-passport-comparison-gcc-expats` | SEO article / region-specific comparison | Caribbean passport comparison for GCC expats | Mobility, GCC residence limits, family planning, Caribbean program fit | Region-specific comparison | Strong |
| Citizenship by Investment for GCC-Based Expats: What Actually Matters Before You Apply | `/insights/citizenship-by-investment-gcc-expats-what-actually-matters` | SEO article / decision framework | Citizenship by investment for GCC-based expats | Mobility strategy, residence constraints, trade-offs, long-term planning | Decision framework / region-specific | Strong |

### Repository draft content that exists but is not live

| Title | Intended slug | Page type | Primary topic | Secondary topics | Search intent | Status |
|---|---|---|---|---|---|---|
| Why Some Citizenship by Investment Applications Fail: What Due Diligence Actually Looks For | `/insights/why-citizenship-by-investment-applications-fail-due-diligence` | Draft SEO article | CBI due diligence | AML, KYC, source of funds, application failure risk | Compliance / problem-solving | Draft only |
| What You Are Really Paying For in Citizenship by Investment Programs | `/insights/what-you-are-really-paying-for-citizenship-by-investment-programs` | Draft SEO article | CBI cost | Hidden costs, family fees, value analysis, donation thresholds | Cost / value analysis | Draft only |

### Planned pages present in repository as strategy only, not implemented

The following exist only in `content-registry/landing-page-system.md` as plans:

- `/st-lucia-cbi/`
- `/dominica-cbi/`
- `/grenada-cbi/`
- `/antigua-barbuda-cbi/`
- `/st-kitts-nevis-cbi/`
- `/cbi-for-gcc-residents/`
- `/cbi-for-families/`
- `/cbi-for-business-owners/`
- `/caribbean-passport-vs-portugal-residency/`
- `/best-cbi-for-gcc-workers/`
- `/how-much-does-cbi-cost/`
- `/cbi-due-diligence-process/`

These are not live pages yet.

---

## 2. Overlap analysis

### Cluster A: broad citizenship-by-investment authority

Pages involved:
- `/`
- `/citizenship-by-investment`
- `/insights/best-citizenship-by-investment-programs-2026`

Risk level:
- Medium to high

Why overlap exists:
- All three help users understand the CBI market at a high level.
- The homepage and the pillar page both speak to broad route qualification.
- The 2026 article also answers "which CBI program should I choose?" which sits close to pillar-page commercial intent.

How to keep them distinct:
- `/` should remain brand-led and broad across citizenship + residency.
- `/citizenship-by-investment` should stay evergreen and process-led.
- `/insights/best-citizenship-by-investment-programs-2026` should remain year-specific and comparison-heavy.

### Cluster B: Caribbean comparison intent

Pages involved:
- `/caribbean-cbi-comparison`
- `/insights/best-citizenship-by-investment-programs-2026`
- `/insights/caribbean-passport-comparison-gcc-expats`

Risk level:
- High

Why overlap exists:
- All three compare the main Caribbean routes.
- The only real differentiators are audience, framing, and how narrow the use case is.

How to keep them distinct:
- `/caribbean-cbi-comparison` should be the evergreen main comparison hub.
- `/insights/best-citizenship-by-investment-programs-2026` should stay annual and editorial.
- `/insights/caribbean-passport-comparison-gcc-expats` should stay clearly GCC-specific.

### Cluster C: GCC / Middle East intent

Pages involved:
- `/insights/caribbean-passport-comparison-gcc-expats`
- `/insights/citizenship-by-investment-gcc-expats-what-actually-matters`
- planned `/cbi-for-gcc-residents/`
- planned `/best-cbi-for-gcc-workers/`

Risk level:
- Very high

Why overlap exists:
- All four target Gulf-based expats and second-passport decision-making.
- The difference between "GCC residents" and "GCC workers" is narrow unless one page becomes sharply employment-led.

Recommendation:
- Build one strong GCC landing page first.
- Do not create a second GCC landing page until the first has a clearly different angle and internal-linking role.

### Cluster D: Caribbean passport vs Portugal

Pages involved:
- `/insights/caribbean-passport-vs-portugal-golden-visa`
- planned `/caribbean-passport-vs-portugal-residency/`

Risk level:
- Very high

Why overlap exists:
- Same core question, same user intent, slightly different wording only.

Recommendation:
- Do not create a second route.
- If this topic needs more conversion strength, expand the existing article or route it into the existing slug strategy.

### Cluster E: support / bottom-funnel intent

Pages involved:
- `/book-a-cbi-consultation`
- draft due diligence article
- draft cost article

Risk level:
- Low to medium

Why overlap exists:
- These pages all support bottom-funnel users, but they answer different questions.

Recommendation:
- Safe to expand into separate live pages because the search intent is distinct:
  - consultation
  - cost
  - due diligence

---

## 3. Content-gap map

### What already exists and is meaningfully covered

- Broad CBI authority page
  - Covered by `/citizenship-by-investment`
- Caribbean comparison hub
  - Covered by `/caribbean-cbi-comparison`
- Consultation conversion page
  - Covered by `/book-a-cbi-consultation`
- Annual best-program comparison
  - Covered by `/insights/best-citizenship-by-investment-programs-2026`
- Cross-category comparison: Caribbean citizenship vs Portugal residency path
  - Covered by `/insights/caribbean-passport-vs-portugal-golden-visa`
- GCC expat decision support
  - Covered by two live articles:
    - `/insights/caribbean-passport-comparison-gcc-expats`
    - `/insights/citizenship-by-investment-gcc-expats-what-actually-matters`

### What partially exists but is weak, fragmented, or not live yet

- Citizenship by investment cost
  - Exists as a draft article only
  - No live landing or guide route yet
  - Action: `EXPAND`

- Citizenship by investment due diligence
  - Exists as a draft article only
  - No live support page yet
  - Action: `EXPAND`

- GCC audience landing intent
  - Covered editorially, but not yet consolidated into a dedicated landing page with form-first structure
  - Action: `EXPAND`

- Broad citizenship + residency overview
  - The homepage covers this, but it is mixed with brand and company-navigation responsibilities
  - A future dedicated residency-by-investment pillar is still missing
  - Action: `CREATE` for RBI-specific pillar, not for another CBI broad page

### What does not exist yet

- Program-specific pages
  - St. Kitts & Nevis
  - Dominica
  - Antigua & Barbuda
  - Grenada
  - Saint Lucia

- Family-led use-case page
  - `/cbi-for-families/`

- Business-owner use-case page
  - `/cbi-for-business-owners/`

- Dedicated residency-by-investment / golden-visa pillar
  - No real live page yet

- Dedicated country / program cluster for Caribbean routes
  - Strong gap for AI visibility, comparison support, and internal linking

---

## 4. CREATE / EXPAND / SKIP map for future pages

### Highest-priority actionable pages

| Priority | Proposed page | Label | Why |
|---|---|---|---|
| 1 | `/how-much-does-cbi-cost/` | EXPAND | Strong draft already exists, clear intent, low overlap risk, high commercial value |
| 2 | `/cbi-due-diligence-process/` | EXPAND | Strong draft already exists, high-trust intent, supports conversion and compliance positioning |
| 3 | `/cbi-for-families/` | CREATE | No strong live page on family-specific CBI decision-making |
| 4 | `/cbi-for-business-owners/` | CREATE | No strong live page on founder / entrepreneur / continuity planning intent |
| 5 | `/cbi-for-gcc-residents/` | EXPAND | Core topic already exists across 2 strong GCC articles; should become a consolidated landing page, not a fresh duplicate angle |
| 6 | `/dominica-cbi/` | CREATE | No program page exists; clear route-specific query intent |
| 7 | `/st-kitts-nevis-cbi/` | CREATE | No program page exists; strong premium / reputation query intent |
| 8 | `/antigua-barbuda-cbi/` | CREATE | No program page exists; strong family-led route intent |
| 9 | `/grenada-cbi/` | CREATE | No program page exists; strong strategic / founder-fit angle |
| 10 | `/st-lucia-cbi/` | CREATE | No program page exists; useful balancing route in Caribbean cluster |

### Lower-priority but still valid opportunities

| Proposed page | Label | Why |
|---|---|---|
| Dedicated residency-by-investment pillar, such as `/residency-by-investment/` | CREATE | Homepage mentions RBI, but there is no real live authority page on this intent |
| Dedicated Europe / golden visa pillar, such as `/golden-visa-europe/` | CREATE | High-value gap on the residency side of the brand |

### Pages that should not be created as separate new routes right now

| Proposed page | Label | Reason |
|---|---|---|
| `/caribbean-passport-vs-portugal-residency/` | SKIP | Strong live page already exists at `/insights/caribbean-passport-vs-portugal-golden-visa`; same intent |
| `/best-cbi-for-gcc-workers/` | SKIP | Too close to existing GCC comparison and GCC strategy articles; likely cannibalizes `/cbi-for-gcc-residents/` if built now |
| Another broad CBI explainer page separate from `/citizenship-by-investment/` | SKIP | Existing pillar is already strong on this intent |
| Another Caribbean comparison page separate from `/caribbean-cbi-comparison/` | SKIP | Existing comparison landing is already strong |
| Another consultation booking route separate from `/book-a-cbi-consultation/` | SKIP | Existing conversion page is already live and strong |

---

## 5. Recommended next-page roadmap in priority order

### Phase 1: strengthen bottom-funnel trust and qualification

1. `/how-much-does-cbi-cost/` — `EXPAND`
2. `/cbi-due-diligence-process/` — `EXPAND`
3. `/cbi-for-families/` — `CREATE`

Why this phase first:
- Strong user intent
- Supports conversion
- Adds clear FAQ-style AI visibility coverage
- Creates better internal linking around cost, risk, and family fit

### Phase 2: cover the highest-value audience gaps

4. `/cbi-for-business-owners/` — `CREATE`
5. `/cbi-for-gcc-residents/` — `EXPAND`

Why:
- Business-owner intent is not covered well yet
- GCC intent already exists editorially but needs one stronger landing-page consolidation point

### Phase 3: build the Caribbean program cluster

6. `/dominica-cbi/` — `CREATE`
7. `/st-kitts-nevis-cbi/` — `CREATE`
8. `/antigua-barbuda-cbi/` — `CREATE`
9. `/grenada-cbi/` — `CREATE`
10. `/st-lucia-cbi/` — `CREATE`

Why:
- These pages give the pillar and comparison pages a proper supporting cluster
- They answer route-specific questions AI systems and search users ask directly
- They reduce the need for generic comparison pages to do all the work

---

## 6. Summary decisions

### Best current live assets

- `/citizenship-by-investment`
- `/caribbean-cbi-comparison`
- `/book-a-cbi-consultation`
- `/insights/best-citizenship-by-investment-programs-2026`
- `/insights/caribbean-passport-vs-portugal-golden-visa`
- `/insights/caribbean-passport-comparison-gcc-expats`
- `/insights/citizenship-by-investment-gcc-expats-what-actually-matters`

### Most important non-live assets worth expanding

- Draft cost article
- Draft due diligence article
- GCC audience intent into a single consolidated landing page

### Highest overlap risks to avoid

- Building a new Portugal comparison page
- Building both `/cbi-for-gcc-residents/` and `/best-cbi-for-gcc-workers/` at the same time
- Creating another broad CBI explainer outside the existing pillar

### Recommended immediate rule for future page creation

Before creating any new investor-facing page:
- `CREATE` only if the page has clearly distinct audience, query intent, and internal-linking role
- `EXPAND` if the topic already exists as a weak live page, article, or draft
- `SKIP` if a strong page already answers the same decision or comparison query
