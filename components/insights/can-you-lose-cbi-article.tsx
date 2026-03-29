import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface CanYouLoseCbiArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function CanYouLoseCbiArticle({
  locale,
  publishedAt,
  relatedPosts,
}: CanYouLoseCbiArticleProps) {
  const links = {
    insights: localizeHref(locale, "/insights"),
    programs: localizeHref(locale, "/citizenship-by-investment"),
    consultation: localizeHref(locale, "/book-a-cbi-consultation"),
    contact: localizeHref(locale, "/contact"),
  }

  return (
    <InsightArticleLayout
      locale={locale}
      publishedAt={publishedAt}
      category="Compliance and status"
      title="Can You Lose Citizenship by Investment? What Investors Should Know"
      excerpt="Citizenship by investment is not usually something investors expect to lose, but official programs can revoke citizenship in some circumstances. The key issue is whether the original grant was honest, lawful, and compliant."
      heroImage={siteImages.passportHandoff}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Yes, citizenship by investment can be lost in some cases, especially where fraud, misrepresentation, or serious compliance problems are involved. Serious investors should treat the application stage as the best protection against future problems.",
        ],
      }}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
    { label: "Arrange a private consultation", href: links.consultation },
    { label: "Arrange a written introduction", href: links.contact },
      ]}
      cta={{
        eyebrow: "Compliance review",
        title: "Need help making sure the route is approached cleanly from the start?",
        description: "A well-structured file and a realistic provider process reduce the chance of avoidable future problems materially.",
    primaryAction: { href: links.consultation, label: "Request a consultation" },
    secondaryAction: { href: links.contact, label: "Arrange a written introduction" },
      }}
    >
      <ArticleHighlight eyebrow="Short answer" title="The best protection is a clean file, honest disclosure, and a serious provider.">
        <p>
          Investors usually worry about losing citizenship only after approval. In reality, the stronger protection is
          in how the citizenship is obtained: truthfully, fully disclosed, and without trying to minimize compliance.
        </p>
      </ArticleHighlight>

      <ArticleFaqGrid
        title="Questions behind revocation concerns"
        description="These are usually the issues investors care about most."
        items={[
          {
            question: "Can a government revoke citizenship by investment?",
            answer: "Yes, in some circumstances, especially where fraud, misrepresentation, or serious compliance breaches are involved.",
          },
          {
            question: "Is revocation common for honest applicants?",
            answer: "It is not the normal expectation for applicants whose cases were cleanly documented and truthfully presented.",
          },
          {
            question: "What is the biggest risk factor?",
            answer: "Trying to hide information or presenting an inconsistent file at the application stage is usually the biggest long-term risk.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
