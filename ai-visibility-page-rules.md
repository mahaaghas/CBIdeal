# AI Visibility Page Rules

This document defines the standard for all future AI visibility pages in the CBIDeal codebase.

It exists to prevent duplicate pages, protect search intent clarity, and ensure every approved page becomes a real, high-quality live asset inside the website.

---

## 1. Duplication Prevention

Before creating any new page:

1. Audit the current repository content first.
2. Check for overlap across:
   - live landing pages
   - live articles under `/insights`
   - draft articles
   - planned pages already documented in the repository
3. Compare overlap on:
   - primary keyword
   - search intent
   - audience segment
   - comparison angle
   - problem being solved

If overlap is high:
- mark as `SKIP` if an existing page already covers the intent strongly
- mark as `EXPAND` if an existing page or draft partially covers the intent but is weak, incomplete, or not yet live

Only mark as `CREATE` when:
- there is no meaningful overlap
- the page has a distinct primary intent
- the page adds new value to the content system

### Duplication rule summary

- Do not create near-duplicate pages with slightly different wording.
- Treat similar query intent as overlap even if the titles differ.
- Prefer strengthening an existing strong route over creating a competing route.

---

## 2. Live Page Requirement

Every approved page must be implemented as a real live route in the site.

Rules:
- no placeholder content documents only
- no strategy-only pages presented as if they are live
- no hidden draft pages unless the repository structure explicitly requires draft mode
- every approved page must resolve to a clear, user-facing route
- every page must fit into the existing frontend design system and internal linking structure

If a page is approved:
- implement it as a real route
- give it real metadata
- connect it to the site navigation or internal-linking graph where appropriate

---

## 3. Slug Rules

Every page must use a clean SEO-friendly slug.

### Slug requirements

- slug must be human-readable
- slug must match the primary search intent
- slug must be short, clean, and descriptive
- slug must use hyphens
- slug must avoid vague wording
- slug must avoid duplicate patterns already used elsewhere
- slug must reflect the actual page topic, not a broad marketing phrase

### Good slug style

- `/best-citizenship-by-investment-programs-2026/`
- `/caribbean-cbi-comparison/`
- `/citizenship-by-investment-for-gcc-residents/`
- `/how-much-does-cbi-cost/`

### Avoid

- `/programs-page/`
- `/best-options/`
- `/caribbean-passport-article-2/`
- multiple slugs targeting the same intent with only tiny wording changes

---

## 4. AI Visibility Content Rules

Each AI visibility page should be useful for:
- direct user reading
- search engines
- AI retrieval and summarization systems

### Required content behavior

- answer the query directly near the top
- use a clear `H1`, `H2`, and `H3` structure
- include concise summary blocks that AI systems can quote or extract cleanly
- include comparison tables, evaluation grids, or decision frameworks when useful
- use a neutral expert tone
- avoid exaggerated claims
- avoid manipulative urgency
- avoid fake certainty
- avoid keyword stuffing
- avoid generic AI phrasing

### Writing standard

The tone should feel like:
- a real consultant
- premium but restrained
- clear and human
- helpful under uncertainty
- realistic about trade-offs, compliance, and fit

Pages should not sound like:
- an immigration mill
- a hype-driven sales funnel
- a generic affiliate comparison site

---

## 5. Page Structure Rules

Every future page should include the following where relevant:

- title
- slug
- meta title
- meta description
- intro
- direct answer section
- detailed explanation
- comparison or evaluation section
- internal linking section
- CTA section
- FAQ section if relevant
- schema recommendation notes if applicable

### Recommended section flow

1. `H1`
2. short intro
3. direct answer or summary block near the top
4. deeper explanation
5. comparison / evaluation / decision framework
6. internal links to related pages
7. soft CTA
8. FAQ

### Direct answer rule

Every page must answer the main query early.

Examples:
- if the page compares routes, state the main difference near the top
- if the page answers a cost question, explain the core cost logic near the top
- if the page targets an audience segment, explain immediately who the page is actually for

---

## 6. Internal Linking Rules

Each page should link to at least:

- one pillar page
- one relevant comparison page
- one relevant conversion page

### Internal-linking behavior

- anchor text should feel natural and descriptive
- links should support the user journey, not just SEO
- links should move users between:
  - broad understanding
  - evaluation
  - consultation

### Typical internal-link targets

- pillar page:
  - `/citizenship-by-investment/`
- comparison page:
  - `/caribbean-cbi-comparison/`
- conversion page:
  - `/book-a-cbi-consultation/`
  - `/contact/`

### Internal-linking rule summary

- every new page must strengthen the site graph
- no orphan pages
- no isolated SEO pages with weak contextual links

---

## 7. Image Rules

Images must support clarity, trust, and premium feel without clutter.

### Image usage rules

- use available repository images where relevant
- prefer images that are not already heavily overused
- match image choice to section meaning
- avoid random decorative image placement
- avoid overloading pages with too many images
- preserve clean spacing and hierarchy

### If no suitable image exists

Clearly note:

`IMAGE NEEDED: [clear description]`

Example:

`IMAGE NEEDED: premium Gulf business travel scene with airport or city context`

### Alt text rules

- alt text must describe the image clearly
- alt text should support topic clarity
- do not stuff keywords unnaturally
- keep alt text useful for accessibility first

---

## 8. Output Rules for Future Page Implementation

When asked to build a new page, always follow this order:

1. check current repository content for overlap
2. classify the request as:
   - `CREATE`
   - `EXPAND`
   - `SKIP`
3. if overlap exists:
   - do not create a duplicate
   - recommend improving the existing asset instead
4. if no overlap exists:
   - create the live page
   - use a clear slug
   - connect it into the internal-linking system
   - implement real metadata and real page structure

### Decision rules

- `CREATE`
  - no meaningful overlap
  - distinct query intent
  - clear role in the content graph

- `EXPAND`
  - existing page or draft is relevant
  - current coverage is weak, fragmented, outdated, or not yet live

- `SKIP`
  - strong existing page already satisfies the query
  - new page would likely cannibalize or duplicate

---

## 9. Page Quality Standard

Every approved page should:

- feel premium and trustworthy
- match the existing CBIDeal design system
- be built as a real, responsive route
- support both SEO and lead generation
- answer real investor questions directly
- stay legally and commercially careful

The goal is not to publish the highest number of pages.

The goal is to publish:
- fewer better pages
- stronger intent coverage
- clearer internal differentiation
- higher trust and higher conversion potential

---

## 10. Practical Rule for All Future Prompts

For every future AI visibility page request:

1. audit first
2. detect overlap
3. mark `CREATE`, `EXPAND`, or `SKIP`
4. only build if the page earns its place in the live site

If there is any doubt between creating a new page and improving an existing one:

- prefer `EXPAND` over duplication

