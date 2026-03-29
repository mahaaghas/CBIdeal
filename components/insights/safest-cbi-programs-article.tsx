import Link from "next/link"
import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface SafestCbiProgramsArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function SafestCbiProgramsArticle({
  locale,
  publishedAt,
  relatedPosts,
}: SafestCbiProgramsArticleProps) {
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
      category="Risk and program quality"
      title="Safest Citizenship by Investment Programs: How Investors Should Think About Program Risk"
      excerpt="The safest citizenship by investment program is not simply the one with the highest ranking. Investors should compare program discipline, reputation, due diligence culture, and long-term political durability."
      heroImage={siteImages.stockholmNight}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Safety in CBI usually means program credibility, strong due diligence, and lower long-term reputational risk, not just speed or price.",
          "Investors who ask for the safest route are usually really asking which program looks most durable over time.",
        ],
      }}
      externalSources={[
        { label: "European Commission visa-suspension framework", href: "https://home-affairs.ec.europa.eu/system/files/2020-05/regulation-2018-1806.pdf" },
        { label: "St. Kitts & Nevis CIU", href: "https://ciu.gov.kn/citizenship-by-investment-unit/" },
        { label: "Investment Migration Agency Grenada", href: "https://imagrenada.gd/" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
    { label: "Arrange a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Risk-led review",
        title: "Need help choosing the route that feels safest for your profile and planning horizon?",
        description: "A safer route is usually the one that remains credible after cost, compliance, and long-term use are weighed together.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <div className="space-y-6 text-base leading-8 text-muted-foreground">
        <p>
          When investors ask for the safest citizenship by investment program, they rarely mean physical safety or a
          simple visa count. They usually mean something more strategic: which program feels most credible, most stable,
          and least likely to create regret later.
        </p>
        <p>
          The long-term value of a second passport depends not only on current access, but also on how counterpart
          governments, banks, and institutions view the program itself.
        </p>
      </div>

      <ArticleHighlight eyebrow="Risk lens" title="The safest CBI route is usually the one with the strongest mix of discipline, credibility, and durability.">
        <p>
          Investors often look first at reputation-led routes like St. Kitts & Nevis, but “safe” can also mean a
          government and provider environment that treats due diligence seriously and does not rely on discount-led
          marketing.
        </p>
      </ArticleHighlight>

      <ArticleProgramComparisonTable
        title="How to compare safety across Caribbean programs"
        description="Safety is less about slogans and more about institutional behavior."
        columns={["St. Kitts & Nevis", "Grenada", "Dominica", "Antigua & Barbuda", "Saint Lucia"]}
        rows={[
          {
            label: "Perceived strength",
            values: ["Program maturity and brand discipline", "Strategic seriousness", "Practical, rule-led route", "Balanced but family-led", "Competitive middle-ground route"],
          },
          {
            label: "What makes it feel safer",
            values: ["Longer reputation history", "Broader strategic framing", "Clarity and efficiency", "Structured mainstream route", "Balanced positioning"],
          },
          {
            label: "What still needs caution",
            values: ["Higher cost does not remove risk", "May be more route than some applicants need", "Price-led applications can still be fragile", "Family fit must be modeled properly", "Do not confuse flexibility with lower scrutiny"],
          },
        ]}
      />

      <div className="space-y-5 text-base leading-8 text-muted-foreground">
        <h2 className="section-title text-foreground">What “safe” should mean in a CBI decision</h2>
        <p>
          A safe route usually means the program is taken seriously by counterparties, the government appears willing to
          enforce standards, and the application process is not being sold in a way that feels careless. That does not
          remove all uncertainty, but it reduces avoidable risk.
        </p>
        <p>
          A stricter due diligence environment can feel slower or less convenient, but it often protects the long-term
          value of the citizenship itself. If you want the whole market framed more broadly, start with the{" "}
          <Link href={links.comparison} className="text-primary underline underline-offset-4">
            Caribbean comparison page
          </Link>{" "}
          and then narrow from there.
        </p>
      </div>

      <ArticleFaqGrid
        title="Questions behind the safest-program query"
        description="These questions usually matter more than a simple ranking list."
        items={[
          {
            question: "What is the safest citizenship by investment program?",
            answer: "There is no universal answer, but investors often begin with the routes that feel most disciplined and credible over time, not just cheapest or fastest.",
          },
          {
            question: "Does a higher price make a program safer?",
            answer: "Not automatically. Price can reflect positioning, but the real question is institutional discipline and long-term durability.",
          },
          {
            question: "Does strong due diligence make a program better?",
            answer: "Usually yes, because it helps protect the program’s reputation and the long-term value of the citizenship outcome.",
          },
          {
            question: "Should safety matter more than cost?",
            answer: "For many investors, yes. The lower-risk route can be more valuable than the nominally cheaper one if the decision horizon is long.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
