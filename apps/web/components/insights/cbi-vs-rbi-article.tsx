import Link from "next/link"
import { ArticleComparisonGrid } from "@/components/insights/article-comparison-grid"
import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface CbiVsRbiArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function CbiVsRbiArticle({
  locale,
  publishedAt,
  relatedPosts,
}: CbiVsRbiArticleProps) {
  const links = {
    insights: localizeHref(locale, "/insights"),
    programs: localizeHref(locale, "/citizenship-by-investment"),
    consultation: localizeHref(locale, "/book-a-cbi-consultation"),
    contact: localizeHref(locale, "/contact"),
    portugal: localizeHref(locale, "/insights/caribbean-passport-vs-portugal-golden-visa"),
  }

  return (
    <InsightArticleLayout
      locale={locale}
      publishedAt={publishedAt}
      category="Decision framework"
      title="Citizenship by Investment vs Residency by Investment: Which Route Fits Better?"
      excerpt="Citizenship by investment and residency by investment solve different problems. One offers a direct nationality outcome, while the other usually offers a slower route built around residence, optionality, and long-term planning."
      heroImage={siteImages.coimbra}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Choose citizenship by investment if you want a direct second citizenship route. Choose residency by investment if your priority is a longer-term residence-led strategy, often tied to European planning.",
        ],
      }}
      externalSources={[
        { label: "Henley Passport Index", href: "https://www.henleyglobal.com/passport-index" },
      ]}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean vs Portugal comparison", href: links.portugal },
    { label: "Arrange a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Route selection",
        title: "Need to decide whether direct citizenship or residence-led planning makes more sense?",
        description: "The right answer usually depends on time horizon, geography, family goals, and how much optionality you actually need.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <div className="space-y-6 text-base leading-8 text-muted-foreground">
        <p>
          This is one of the most important structural questions in the investment migration space because many
          investors compare citizenship by investment and residency by investment as if they were close substitutes.
          They are not.
        </p>
        <p>
          If you are deciding between a Caribbean citizenship route and a European residence-led route, the question is
          not which is better in the abstract. The question is which route solves your actual planning objective more
          directly and with less mismatch.
        </p>
      </div>

      <ArticleHighlight eyebrow="Structural difference" title="Citizenship gives you nationality. Residency gives you status and optionality, sometimes before citizenship is even on the table.">
        <p>
          That difference shapes everything else: speed, obligations, mobility profile, and what you should expect from
          the process itself.
        </p>
      </ArticleHighlight>

      <ArticleComparisonGrid
        title="Citizenship vs residency by investment"
        description="These are the main decision variables most investors need to compare early."
        rows={[
          {
            factor: "Core outcome",
            caribbean: "Direct second citizenship if approved.",
            portugal: "Residence status first, with a longer-term planning horizon.",
          },
          {
            factor: "Best fit",
            caribbean: "Applicants who want a direct nationality route and clearer speed.",
            portugal: "Applicants who want Europe-focused residence and slower optionality.",
          },
          {
            factor: "Decision style",
            caribbean: "Often more immediate and outcome-focused.",
            portugal: "Often longer-term and geography-led.",
          },
        ]}
      />

      <p className="text-base leading-8 text-muted-foreground">
        For investors already comparing a Caribbean route with Portugal specifically, the{" "}
        <Link href={links.portugal} className="text-primary underline underline-offset-4">
          dedicated Portugal comparison
        </Link>{" "}
        goes deeper into that decision.
      </p>

      <ArticleFaqGrid
        title="Questions behind this route-type comparison"
        description="These usually matter before the country-level comparison even begins."
        items={[
          {
            question: "Is citizenship by investment better than residency by investment?",
            answer: "Not universally. It depends on whether your goal is direct citizenship or residence-led optionality.",
          },
          {
            question: "Which route is faster?",
            answer: "Citizenship by investment is usually faster as a direct nationality route. Residency by investment usually works on a longer time horizon.",
          },
          {
            question: "Which route is more European in orientation?",
            answer: "Residency by investment is usually the better fit if Europe is the core planning objective.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
