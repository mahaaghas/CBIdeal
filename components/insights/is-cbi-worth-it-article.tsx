import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { Card, CardContent } from "@/components/ui/card"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface IsCbiWorthItArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function IsCbiWorthItArticle({
  locale,
  publishedAt,
  relatedPosts,
}: IsCbiWorthItArticleProps) {
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
      category="Decision framework"
      title="Is Citizenship by Investment Worth It? A Realistic Investor View"
      excerpt="Citizenship by investment is worth it for some investors and completely unnecessary for others. The right answer depends on mobility pressure, family planning, long-term optionality, and whether the route solves a real problem."
      heroImage={siteImages.budapest}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Citizenship by investment is worth it when it solves a real mobility, family, or planning problem. It is not worth it when the decision is based only on rankings or generalized fear.",
        ],
      }}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Caribbean comparison page", href: links.comparison },
    { label: "Arrange a private consultation", href: links.consultation },
      ]}
      cta={{
        eyebrow: "Suitability review",
        title: "Need to decide whether a second citizenship is actually worth doing in your case?",
        description: "The right answer usually becomes clearer once the objective, timeline, and household context are stated honestly.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <ArticleHighlight eyebrow="Worth it or not?" title="The route becomes valuable only when the use case is real.">
        <p>
          For some clients, a second citizenship improves travel, family optionality, and long-term contingency
          planning meaningfully. For others, it is expensive noise that does not change enough in day-to-day life to
          justify the cost and compliance burden.
        </p>
      </ArticleHighlight>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          {
            title: "When it is often worth it",
            text: "When international travel friction is real, when family planning needs more optionality, or when long-term diversification matters enough to justify the cost and process.",
          },
          {
            title: "When it may not be worth it",
            text: "When the investor has no meaningful mobility problem, no broader planning objective, and is reacting mainly to marketing or rankings.",
          },
          {
            title: "What makes the value stronger",
            text: "A clear objective, a realistic route fit, and an understanding of what the citizenship will actually change in practical life.",
          },
          {
            title: "What weakens the decision",
            text: "Buying for status, panic, or abstraction rather than for a concrete use case that still matters years later.",
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

      <ArticleFaqGrid
        title="Questions behind the value decision"
        description="These are usually the real decision points."
        items={[
          {
            question: "Is citizenship by investment worth it for frequent travelers?",
            answer: "Often yes, if travel friction is meaningful and the citizenship improves mobility enough to matter in real life.",
          },
          {
            question: "Is it worth it just for passport ranking?",
            answer: "Usually no. Ranking alone is rarely a strong enough reason for a serious investor decision.",
          },
          {
            question: "Does family planning make the route more worthwhile?",
            answer: "It can, especially where children, spouse mobility, or future relocation flexibility are part of the broader plan.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
