import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface WhyCaribbeanPassportsCheapArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function WhyCaribbeanPassportsCheapArticle({
  locale,
  publishedAt,
  relatedPosts,
}: WhyCaribbeanPassportsCheapArticleProps) {
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
      category="Pricing and perception"
      title="Why Are Caribbean Passports So Cheap? The Real Explanation Behind the Pricing"
      excerpt="Caribbean citizenship by investment programs can look inexpensive compared with European planning routes, but the lower entry point reflects program design, scale, and policy positioning rather than a lack of seriousness."
      heroImage={siteImages.petitPiton}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Caribbean passports are not cheap because they are fake. They look cheaper because the programs are designed as direct citizenship routes with different policy goals, market positioning, and scale than many European options.",
        ],
      }}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
    { label: "Arrange a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Pricing clarity",
        title: "Need help understanding whether the lower entry point actually fits your decision?",
        description: "A lower threshold can be a rational advantage, but only if the route still matches your objective, family structure, and risk tolerance.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <ArticleHighlight eyebrow="Short answer" title="The lower price reflects route structure, not a lack of legitimacy.">
        <p>
          Caribbean programs are usually more direct than residency-led Europe routes. They are also often competing
          within the same regional category, which keeps the visible threshold closer together than many investors
          expect.
        </p>
      </ArticleHighlight>

      <ArticleFaqGrid
        title="Questions behind the price-perception query"
        description="These are the issues investors are usually trying to understand."
        items={[
          {
            question: "Are Caribbean passports cheap because they are less credible?",
            answer: "Not necessarily. The lower entry point usually reflects policy design and market structure, not automatic weakness.",
          },
          {
            question: "Does a lower price mean lower value?",
            answer: "Not always. It depends on what the investor needs the route to do and how durable the program feels over time.",
          },
          {
            question: "Why do European routes often feel more expensive?",
            answer: "Because they are often residence-led, slower, and tied to a different planning objective and geography.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
