import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface FastestCbiProgramsArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function FastestCbiProgramsArticle({
  locale,
  publishedAt,
  relatedPosts,
}: FastestCbiProgramsArticleProps) {
  const links = {
    insights: localizeHref(locale, "/insights"),
    programs: localizeHref(locale, "/citizenship-by-investment"),
    comparison: localizeHref(locale, "/caribbean-cbi-comparison"),
    consultation: localizeHref(locale, "/book-a-cbi-consultation"),
    contact: localizeHref(locale, "/contact"),
  }

  return (
    <InsightArticleLayout
      locale={locale}
      publishedAt={publishedAt}
      category="Speed and timing"
      title="Fastest Citizenship by Investment Programs: What Speed Really Means Before You Apply"
      excerpt="The fastest citizenship by investment route is usually the one with a clean file, realistic expectations, and a disciplined provider. Speed depends on documentation quality as much as program choice."
      heroImage={siteImages.passportHandoff}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "There is no credible instant route. The fastest citizenship by investment programs still take months, not days, and a weak file will slow any program down.",
          "For most investors, speed comes from preparation, not just from the program brochure.",
        ],
      }}
      externalSources={[
        { label: "St. Kitts & Nevis application process", href: "https://ciu.gov.kn/application-process/" },
        { label: "Dominica CBI regulations", href: "https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
        { label: "Book a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Timing review",
        title: "Need to understand which route can move fastest for your profile?",
        description: "A realistic timing answer starts with the program, but it depends even more on how prepared your file is from day one.",
        primaryAction: { href: links.consultation, label: "Request a private consultation" },
        secondaryAction: { href: links.contact, label: "Contact the advisory team" },
      }}
    >
      <div className="space-y-6 text-base leading-8 text-muted-foreground">
        <p>
          “Fastest citizenship by investment programs” is one of the most common high-intent search phrases in the
          market, but it often hides a more practical question: what is the fastest way to get a second passport
          without relying on unrealistic promises?
        </p>
        <p>
          The honest answer is that speed depends on both the program and the file. Even where a government route is
          known for relatively efficient processing, a messy source-of-funds story, incomplete family documents, or a
          weak intermediary can slow the case quickly.
        </p>
      </div>

      <ArticleHighlight eyebrow="Speed reality" title="The fastest way to get a second passport is usually a well-prepared CBI file, not a magical shortcut.">
        <p>
          If an investor is eligible, document-ready, and comparing the main Caribbean routes intelligently, citizenship
          by investment can still be one of the fastest legal paths to second citizenship. But the word “fast” should
          be read as relatively fast within a compliance-led process, not as guaranteed or immediate.
        </p>
      </ArticleHighlight>

      <ArticleProgramComparisonTable
        title="Fastest programs: how investors should compare them"
        description="This is a practical timing framework rather than a marketing promise."
        columns={["Dominica", "Saint Lucia", "Antigua & Barbuda", "Grenada", "St. Kitts & Nevis"]}
        rows={[
          {
            label: "General timing perception",
            values: ["Often seen as efficient", "Generally competitive", "Balanced, file-dependent", "Balanced, strategic route", "Often disciplined rather than rushed"],
          },
          {
            label: "What usually affects speed most",
            values: ["Document readiness", "Route and file quality", "Family file complexity", "Strategic file structure", "Provider and compliance discipline"],
          },
          {
            label: "Biggest mistake",
            values: ["Assuming cost automatically means speed", "Ignoring due diligence", "Underestimating family paperwork", "Buying a strategic route when speed is the only goal", "Expecting premium pricing to guarantee pace"],
          },
        ]}
      />

      <ArticleFaqGrid
        title="Questions behind the speed query"
        description="These are the issues serious applicants usually need answered before they rely on timing claims."
        items={[
          {
            question: "What is the fastest citizenship by investment program?",
            answer: "There is no universal answer. Dominica and Saint Lucia often appear in efficiency-led conversations, but the file quality matters as much as the route.",
          },
          {
            question: "What is the fastest way to get a second passport legally?",
            answer: "For many investors, a well-prepared citizenship by investment file is one of the fastest legal routes, provided expectations stay realistic and the provider is credible.",
          },
          {
            question: "Can a provider guarantee a timeline?",
            answer: "No. A serious provider can give an indicative range and improve preparation, but final timing still depends on official review and due diligence.",
          },
          {
            question: "Does paying more always make the process faster?",
            answer: "No. Premium pricing may reflect program positioning, not guaranteed speed.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
