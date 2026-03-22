import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface DominicaVsStLuciaArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function DominicaVsStLuciaArticle({
  locale,
  publishedAt,
  relatedPosts,
}: DominicaVsStLuciaArticleProps) {
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
      title="Dominica vs Saint Lucia Citizenship by Investment: Which Route Makes More Sense?"
      excerpt="Dominica and Saint Lucia often sit close together on shortlists, but they are not the same decision. Dominica tends to lead on practical value, while Saint Lucia often appeals to applicants who want more route flexibility."
      heroImage={siteImages.stLuciaAerial}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Choose Dominica if you want a more direct value-led route. Choose Saint Lucia if flexibility and how the route feels in structure matter more than simply minimizing cost.",
        ],
      }}
      externalSources={[
        { label: "Dominica CBI regulations", href: "https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf" },
        { label: "Saint Lucia CBI programme", href: "https://www.cipsaintlucia.com/" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
        { label: "Book a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Route comparison",
        title: "Need help deciding whether Dominica or Saint Lucia fits your file more cleanly?",
        description: "A close comparison usually becomes clearer once budget, family structure, and document readiness are reviewed together.",
        primaryAction: { href: links.consultation, label: "Request a private consultation" },
        secondaryAction: { href: links.contact, label: "Contact the advisory team" },
      }}
    >
      <ArticleHighlight eyebrow="Short answer" title="Dominica is often the practical route. Saint Lucia is often the more flexible route.">
        <p>
          Both can work well. The better choice depends on whether you care most about direct value or about having a
          route that feels more adaptable once your full profile is on the table.
        </p>
      </ArticleHighlight>

      <ArticleProgramComparisonTable
        title="Dominica vs Saint Lucia"
        columns={["Dominica", "Saint Lucia"]}
        rows={[
          { label: "Typical positioning", values: ["Value-led and direct", "Balanced and flexible"] },
          { label: "Best fit", values: ["Practical buyers", "Applicants comparing several route structures"] },
          { label: "Main strength", values: ["Clear economic logic", "Competitive middle-ground feel"] },
          { label: "Main caution", values: ["Do not choose on price alone", "Do not assume flexibility means weaker scrutiny"] },
        ]}
      />

      <ArticleFaqGrid
        title="Questions investors usually ask in this comparison"
        description="This pair is often closer than it first looks."
        items={[
          {
            question: "Is Dominica cheaper than Saint Lucia?",
            answer: "Dominica often leads the value conversation, but the total answer still depends on the full file and household structure.",
          },
          {
            question: "Why would someone choose Saint Lucia instead?",
            answer: "Because the route can feel more flexible or better balanced for the applicant’s specific profile and planning style.",
          },
          {
            question: "Are the mobility differences large?",
            answer: "Usually not large enough to decide the case by themselves.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
