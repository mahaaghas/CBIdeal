import { ArticleFaqGrid } from "@/components/insights/article-faq-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { InsightArticleLayout } from "@/components/insights/insight-article-layout"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface IsCbiAScamArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function IsCbiAScamArticle({
  locale,
  publishedAt,
  relatedPosts,
}: IsCbiAScamArticleProps) {
  const links = {
    insights: localizeHref(locale, "/insights"),
    programs: localizeHref(locale, "/citizenship-by-investment"),
    consultation: localizeHref(locale, "/book-a-cbi-consultation"),
    contact: localizeHref(locale, "/contact"),
    dataProtection: localizeHref(locale, "/data-protection"),
  }

  return (
    <InsightArticleLayout
      locale={locale}
      publishedAt={publishedAt}
      category="Trust and compliance"
      title="Is Citizenship by Investment a Scam? How Serious Investors Should Judge the Market"
      excerpt="Citizenship by investment is not inherently a scam, but parts of the market can sound careless, exaggerated, or unrealistic. The key is to separate official programs and licensed providers from hype-driven marketing."
      heroImage={siteImages.seniorExecutive}
      backHref={links.insights}
      relatedPosts={relatedPosts}
      keyTakeaway={{
        title: "Direct answer",
        paragraphs: [
          "Official citizenship by investment programs are real legal frameworks. What creates scam risk is not the existence of the programs, but misleading intermediaries, exaggerated promises, and weak due diligence narratives.",
        ],
      }}
      internalLinks={[
        { label: "Citizenship by investment overview", href: links.programs },
        { label: "Book a private consultation", href: links.consultation },
        { label: "Data protection and compliance page", href: links.dataProtection },
      ]}
      cta={{
        eyebrow: "Trust check",
        title: "Want a calmer, more credible way to evaluate the market?",
        description: "A serious first review should clarify how official programs work, what a provider actually does, and where expectations need to stay realistic.",
        primaryAction: { href: links.consultation, label: "Request a private consultation" },
        secondaryAction: { href: links.contact, label: "Contact the advisory team" },
      }}
    >
      <ArticleHighlight eyebrow="Short answer" title="The programs are real. The market language is where investors need to be careful.">
        <p>
          If someone promises guaranteed approval, instant passports, or a way around due diligence, that is usually
          the warning sign. Serious programs, governments, and licensed providers do not speak that way.
        </p>
      </ArticleHighlight>

      <ArticleFaqGrid
        title="Questions behind the scam concern"
        description="Most scam concerns are really concerns about bad marketing, not official law."
        items={[
          {
            question: "Is citizenship by investment legal?",
            answer: "Yes, official programs are legal government frameworks. The key issue is whether you are dealing with a credible provider and realistic process.",
          },
          {
            question: "Why do some CBI offers sound suspicious?",
            answer: "Because some intermediaries overpromise speed, certainty, or simplicity in ways that do not reflect how official programs actually work.",
          },
          {
            question: "What is the main warning sign?",
            answer: "Guaranteed outcomes, vague fees, and language that tries to sidestep compliance are usually the clearest warning signs.",
          },
        ]}
      />
    </InsightArticleLayout>
  )
}
