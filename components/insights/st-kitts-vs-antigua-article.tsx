import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface StKittsVsAntiguaArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function StKittsVsAntiguaArticle({
  locale,
  publishedAt,
  relatedPosts,
}: StKittsVsAntiguaArticleProps) {
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
      category="Program comparison"
      title="St. Kitts vs Antigua Comparison: Which Citizenship by Investment Route Fits Better?"
      excerpt="St. Kitts & Nevis and Antigua & Barbuda appeal to different investors. St. Kitts usually wins on premium positioning, while Antigua often becomes more compelling in family-led and value-balanced cases."
      heroImage={siteImages.businessStreet}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Choose St. Kitts if reputation and program maturity are central. Choose Antigua if the case is more household-led and you want a balanced family-oriented route.",
        ],
      }}
      externalSources={[
        { label: "St. Kitts & Nevis CIU", href: "https://ciu.gov.kn/citizenship-by-investment-unit/" },
        { label: "Antigua & Barbuda citizenship page", href: "https://cip.gov.ag/citizenship" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
        { label: "Book a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Profile fit",
        title: "Need help deciding whether prestige or family fit should carry more weight in your case?",
        description: "This comparison becomes easier once the application is modeled for the actual household instead of a generic applicant.",
        primaryAction: { href: links.consultation, label: "Request a private consultation" },
        secondaryAction: { href: links.contact, label: "Contact the advisory team" },
      }}
    >
      <ArticleHighlight eyebrow="Short answer" title="St. Kitts is often the premium route. Antigua is often the family-value route.">
        <p>
          The better answer depends on whether you are paying for reputation and optics or for balanced total fit
          across a household application.
        </p>
      </ArticleHighlight>

      <ArticleProgramComparisonTable
        title="St. Kitts vs Antigua"
        columns={["St. Kitts & Nevis", "Antigua & Barbuda"]}
        rows={[
          { label: "Typical positioning", values: ["Premium and reputation-led", "Balanced and family-aware"] },
          { label: "Who it often suits", values: ["Reputation-sensitive investors", "Family-led applicants"] },
          { label: "Main value point", values: ["Program maturity and optics", "Household economics"] },
          { label: "Main caution", values: ["Higher threshold needs justification", "Do not reduce the route to family marketing only"] },
        ]}
      />

      <ArticleFaqGrid
        title="Questions behind this comparison"
        description="This is usually a trade-off between premium positioning and household fit."
        items={[
          {
            question: "Is St. Kitts better than Antigua?",
            answer: "Not universally. It can be better for applicants who value program reputation strongly, but not always for families comparing total cost and structure.",
          },
          {
            question: "Why do families often consider Antigua?",
            answer: "Because Antigua can look more balanced once spouse and dependants are part of the real application model.",
          },
          {
            question: "Does St. Kitts justify the higher cost?",
            answer: "For some investors yes, especially where optics and perceived program maturity matter materially.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
