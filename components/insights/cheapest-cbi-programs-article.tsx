import Link from "next/link"
import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { Card, CardContent } from "@/components/ui/card"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface CheapestCbiProgramsArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function CheapestCbiProgramsArticle({
  locale,
  publishedAt,
  relatedPosts,
}: CheapestCbiProgramsArticleProps) {
  const links = {
    insights: localizeHref(locale, "/insights"),
    programs: localizeHref(locale, "/citizenship-by-investment"),
    comparison: localizeHref(locale, "/caribbean-cbi-comparison"),
    consultation: localizeHref(locale, "/book-a-cbi-consultation"),
    contact: localizeHref(locale, "/contact"),
    best2026: localizeHref(locale, "/insights/best-citizenship-by-investment-programs-2026"),
  }

  return (
    <InsightArticleLayout
      locale={locale}
      publishedAt={publishedAt}
      category="Cost analysis"
      title="Cheapest Citizenship by Investment Programs: What Investors Should Compare Before Choosing on Price"
      excerpt="The cheapest citizenship by investment program is not always the smartest one. Investors should compare total cost, family inclusion, due diligence burden, and long-term fit before focusing on the lowest headline number."
      heroImage={siteImages.madridMetropolis}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Dominica usually appears first in price-led discussions, but the right low-cost route depends on family size, fees, and how cleanly the case will move through due diligence.",
          "The cheapest visible number is rarely the whole economic picture.",
        ],
      }}
      externalSources={[
        { label: "Dominica Citizenship by Investment Regulations", href: "https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf" },
        { label: "Antigua & Barbuda citizenship page", href: "https://cip.gov.ag/citizenship" },
        { label: "St. Kitts & Nevis CIU", href: "https://ciu.gov.kn/citizenship-by-investment-unit/" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
    { label: "Arrange a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Private review",
        title: "Need the cheapest realistic route for your actual household, not just the brochure headline?",
    description: "Share your profile and we will help you understand where the overall economics look strongest before any more formal next step is considered.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <div className="space-y-6 text-base leading-8 text-muted-foreground">
        <p>
          Price-led searches usually start with the wrong question. Investors type “cheapest citizenship by investment
          programs” because they want to narrow the shortlist quickly, but the route with the lowest headline figure is
          not always the route with the best all-in economics.
        </p>
        <p>
          If you are comparing programs seriously, the better lens is total household cost, not just minimum donation.
          That means looking at dependants, due diligence fees, local government charges, and whether the route still
          feels sensible after the full compliance and document burden is factored in. For a wider market context, the{" "}
          <Link href={links.best2026} className="text-primary underline underline-offset-4">
            2026 program comparison
          </Link>{" "}
          is a useful companion read.
        </p>
      </div>

      <ArticleHighlight eyebrow="Direct answer" title="The lowest-cost route is usually Dominica, but that does not settle the decision.">
        <p>
          Dominica often leads on visible value. Antigua & Barbuda can become more competitive in family-led files.
          Saint Lucia sometimes makes sense where route flexibility matters more than the absolute minimum. St. Kitts
          and Grenada are rarely chosen because they are cheapest.
        </p>
      </ArticleHighlight>

      <ArticleProgramComparisonTable
        title="Cheapest Caribbean CBI routes: realistic comparison"
        description="This table is designed to answer the cost query directly while keeping the trade-offs visible."
        columns={["Dominica", "Antigua & Barbuda", "Saint Lucia", "Grenada", "St. Kitts & Nevis"]}
        rows={[
          {
            label: "Typical price positioning",
            values: ["Usually the price benchmark", "Often competitive for families", "Competitive middle ground", "Higher strategic route", "Premium-priced route"],
          },
          {
            label: "Who it often suits",
            values: ["Single applicants and value-led buyers", "Families comparing total fees", "Applicants who want flexibility", "Strategic planners", "Reputation-sensitive investors"],
          },
          {
            label: "Main risk of choosing only on price",
            values: ["Ignoring long-term fit", "Overlooking obligations and structure", "Assuming it is the cheapest in every case", "Paying for strategy you may not need", "Paying for prestige rather than economics"],
          },
        ]}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Donation is not the total cost",
            text: "The visible threshold is only one part of the file. Government charges, due diligence, dependants, and provider fees change the real number quickly.",
          },
          {
            title: "Family size changes the answer",
            text: "A route that looks cheapest for one person may stop looking cheapest once spouse and children are included.",
          },
          {
            title: "Value is not only price",
            text: "If the cheaper route creates more friction or less strategic fit, it may still be the weaker decision.",
          },
        ].map((item) => (
          <Card key={item.title} className="section-card">
            <CardContent className="space-y-3 p-6">
              <h2 className="text-xl leading-tight text-foreground">{item.title}</h2>
              <p className="text-base leading-8 text-muted-foreground">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-5 text-base leading-8 text-muted-foreground">
        <h2 className="section-title text-foreground">What investors usually miss when they search for the cheapest route</h2>
        <p>
          The lowest number is helpful only if the route still matches the investor’s real objective. For some
          applicants, price is the main variable. For others, the more important issue is whether the route works for a
          family, whether the file is likely to move smoothly, and whether the program still looks credible enough to
          justify the decision over a longer horizon.
        </p>
        <p>
          That is why the most disciplined cost-led process is to start with price, then test family structure, then
          test documentation readiness, then compare the route against the objective.
        </p>
      </div>

      <ArticleFaqGrid
        title="Questions behind the cheapest-program query"
        description="These are usually the real questions underneath a cost-led search."
        items={[
          {
            question: "What is the cheapest citizenship by investment program right now?",
            answer: "Dominica usually appears first in cost-led comparisons, but the answer changes once family size, fees, and route fit are included.",
          },
          {
            question: "Is the cheapest route usually the best route?",
            answer: "No. It may be the right route for some investors, but not for all. The best route depends on profile fit, household structure, and long-term planning.",
          },
          {
            question: "Why do family applications change the cost comparison?",
            answer: "Because dependant fees and route structure can move the total cost significantly, especially for larger households.",
          },
          {
            question: "Should I compare only Caribbean options on price?",
            answer: "For a direct citizenship outcome, Caribbean routes are usually the main comparison set, but they should still be evaluated against wider mobility and planning goals.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
