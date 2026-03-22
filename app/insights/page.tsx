import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { fallbackInsightPosts } from "@/lib/insights/fallback-posts"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedCtaLinks } from "@/lib/site"
import { getBlogPosts, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const settings = await getResolvedSiteSettings()

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "مقالات ورؤى سوق الهجرة"
        : locale === "ru"
          ? "Статьи и аналитика рынка иммиграции"
          : "Insights and Immigration Market Articles",
    description:
      locale === "ar"
        ? "اقرأ مقالات مميزة حول الجنسية عن طريق الاستثمار وتخطيط الإقامة وتأهيل المستثمرين واستراتيجية CRM لشركات الهجرة."
        : locale === "ru"
          ? "Читайте премиальные материалы о гражданстве за инвестиции, планировании резидентства, квалификации инвесторов и CRM-стратегии."
          : "Read premium articles on citizenship by investment, residency planning, investor qualification, and CRM strategy for immigration firms.",
    path: localizeHref(locale, "/insights"),
    keywords: [
      "citizenship by investment blog",
      "immigration CRM articles",
      "residency by investment insights",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

export default async function InsightsPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const [cmsPosts, settings] = await Promise.all([getBlogPosts(), getResolvedSiteSettings()])
  const mergedPosts = [...cmsPosts]

  fallbackInsightPosts.forEach((fallbackPost) => {
    if (!mergedPosts.some((post) => post.slug === fallbackPost.slug)) {
      mergedPosts.push(fallbackPost)
    }
  })

  const posts = mergedPosts.sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  })
  const [featuredPost, ...otherPosts] = posts
  const copy = {
    heroEyebrow: locale === "ar" ? "المقالات" : locale === "ru" ? "Статьи" : "Insights",
    heroTitle:
      locale === "ar"
        ? "مقالات عملية للمستثمرين وشركات الهجرة وشركات الجوازات."
        : locale === "ru"
          ? "Практические статьи для инвесторов, иммиграционных фирм и паспортных компаний."
          : "Practical articles for investors, immigration firms, and passport companies.",
    heroDescription:
      locale === "ar"
        ? "استخدم المدونة لنشر محتوى موثوق حول السوق والمقارنات والعمليات دون الإخلال بالطابع الفاخر للموقع."
        : locale === "ru"
          ? "Используйте блог для публикации материалов о рынке, сравнений программ и операционных инсайтов без потери премиального тона сайта."
          : "Use the blog to publish high-trust commentary, program comparisons, and operational insights without compromising the premium feel of the main site.",
    featuredEyebrow: locale === "ar" ? "المقال المميز" : locale === "ru" ? "Главная статья" : "Featured article",
    featuredTitle:
      locale === "ar"
        ? "محتوى تحريري ينسجم مع نفس نظام العلامة الفاخر."
        : locale === "ru"
          ? "Редакционный контент, который вписывается в ту же премиальную бренд-систему."
          : "Editorial content that fits the same premium brand system.",
    featuredDescription:
      locale === "ar"
        ? "تستخدم المدونة نفس الطباعة والمسافات ولغة البطاقات الموجودة في الصفحات التجارية، لذلك يبدو تسويق المحتوى جزءًا من النظام نفسه."
        : locale === "ru"
          ? "Блог использует ту же типографику, ритм и карточную систему, что и коммерческие страницы, поэтому контент-маркетинг ощущается частью одного продукта."
          : "The blog uses the same typography, spacing, and card language as the commercial pages, so content marketing feels like part of the same product ecosystem.",
    emptyTitle:
      locale === "ar"
        ? "لم يتم نشر أي مقالات بعد."
        : locale === "ru"
          ? "Пока не опубликовано ни одной статьи."
          : "No blog posts have been published yet.",
    emptyDescription:
      locale === "ar"
        ? "بعد إعداد Sanity، أنشئ أول مقال في الاستوديو وسيظهر هنا تلقائيًا."
        : locale === "ru"
          ? "После настройки Sanity создайте первую статью в Studio, и она автоматически появится здесь."
          : "Once Sanity is configured, create your first article in the Studio and it will appear here automatically.",
    latestEyebrow: locale === "ar" ? "أحدث المقالات" : locale === "ru" ? "Последние статьи" : "Latest articles",
    latestTitle:
      locale === "ar"
        ? "مقالات منشورة أخرى"
        : locale === "ru"
          ? "Другие опубликованные статьи"
          : "More published articles",
    latestDescription:
      locale === "ar"
        ? "استخدم الفئات والوسوم والمؤلف وحقول SEO في Sanity للحفاظ على تنظيم العمل التحريري مع نمو المحتوى."
        : locale === "ru"
          ? "Используйте категории, теги, автора и SEO-поля в Sanity, чтобы редакционный поток оставался организованным по мере роста контента."
          : "Use category, tags, author, and SEO fields in Sanity to keep the editorial workflow organized as content grows.",
    ctaEyebrow: locale === "ar" ? "الخطوة التالية" : locale === "ru" ? "Следующий шаг" : "Next step",
    ctaTitle:
      locale === "ar"
        ? "استخدم المقالات لدعم ثقة المستثمرين ومحادثات المبيعات مع الشركات."
        : locale === "ru"
          ? "Используйте статьи для укрепления доверия инвесторов и B2B-продаж."
          : "Use articles to support investor trust and B2B sales conversations.",
    ctaDescription:
      locale === "ar"
        ? "يمكن للمحتوى التحريري الآن أن يعيش بجانب مسارات التأهيل وصفحات المنتج وصفحات الهبوط المستقبلية ضمن نفس النظام."
        : locale === "ru"
          ? "Редакционный контент теперь может существовать рядом с qualification funnel, продуктовой страницей CRM и будущими SEO-лендингами в одной системе."
          : "Editorial content can now sit alongside qualification funnels, CRM product pages, and future SEO landing pages under the same content system.",
    heroPrimary: locale === "ar" ? "ابدأ التقييم" : locale === "ru" ? "Проверить соответствие" : "Check eligibility",
    heroSecondary: locale === "ar" ? "اطلب عرضاً توضيحياً" : locale === "ru" ? "Запросить демо" : "Request a demo",
    statInvestor: locale === "ar" ? "للمستثمرين" : locale === "ru" ? "Investor-facing" : "Investor-facing",
    statInvestorLabel:
      locale === "ar"
        ? "محتوى يدعم الاستفسارات عالية القيمة"
        : locale === "ru"
          ? "content for high-value enquiries"
          : "content for high-value enquiries",
    statB2B: locale === "ar" ? "بعد تجاري" : locale === "ru" ? "B2B insight" : "B2B insight",
    statB2BLabel:
      locale === "ar"
        ? "رؤى عملية لفرق الهجرة وCRM"
        : locale === "ru"
          ? "CRM and workflow positioning"
          : "CRM and workflow positioning",
    statSeo: locale === "ar" ? "جاهز لمحركات البحث" : locale === "ru" ? "SEO-ready" : "SEO-ready",
    statSeoLabel:
      locale === "ar"
        ? "بنية قابلة للتوسع لمحتوى وبرامج جديدة"
        : locale === "ru"
          ? "built for scalable landing pages"
          : "built for scalable landing pages",
    investorPages: locale === "ar" ? "استكشف صفحات المستثمرين" : locale === "ru" ? "Смотреть страницы для инвесторов" : "Explore investor pages",
    companyPage: locale === "ar" ? "استكشف صفحة الشركات" : locale === "ru" ? "Смотреть страницу для компаний" : "Explore company page",
  }
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${settings.siteName} Insights`,
    description:
      locale === "ar"
        ? "مركز محتوى حول الجنسية عن طريق الاستثمار، الإقامة عن طريق الاستثمار، وتأهيل المستثمرين."
        : locale === "ru"
          ? "Контент-хаб о гражданстве за инвестиции, резидентстве за инвестиции и квалификации инвесторов."
          : "Content hub for citizenship by investment, residency by investment, and investor qualification.",
    url: new URL(localizeHref(locale, "/insights"), settings.siteUrl).toString(),
    blogPost: posts.slice(0, 12).map((post) => ({
      "@type": "BlogPosting",
      headline: post.seo?.title || post.title,
      url: new URL(localizeHref(locale, `/insights/${post.slug}`), settings.siteUrl).toString(),
      datePublished: post.publishedAt,
      description: post.seo?.description || post.excerpt,
    })),
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionStructuredData) }} />
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryAction={{ href: ctaLinks.checkEligibility, label: copy.heroPrimary }}
        secondaryAction={{ href: ctaLinks.requestDemo, label: copy.heroSecondary }}
        stats={[
          { value: copy.statInvestor, label: copy.statInvestorLabel },
          { value: copy.statB2B, label: copy.statB2BLabel },
          { value: copy.statSeo, label: copy.statSeoLabel },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell space-y-10">
          {featuredPost ? (
            <div className="space-y-6">
              <SectionHeading
                eyebrow={copy.featuredEyebrow}
                title={copy.featuredTitle}
                description={copy.featuredDescription}
              />
              <BlogPostCard post={featuredPost} featured />
            </div>
          ) : (
              <Card className="section-card">
              <CardContent className="space-y-4 p-8">
                <h2 className="text-3xl text-foreground">{copy.emptyTitle}</h2>
                <p className="fine-print">
                  {copy.emptyDescription}
                </p>
              </CardContent>
            </Card>
          )}

          {otherPosts.length ? (
            <div className="space-y-6">
              <SectionHeading
                eyebrow={copy.latestEyebrow}
                title={copy.latestTitle}
                description={copy.latestDescription}
              />
              <div className="grid gap-6 lg:grid-cols-2">
                {otherPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.ctaEyebrow}
            title={copy.ctaTitle}
            description={copy.ctaDescription}
            primaryAction={{ href: ctaLinks.explorePrograms, label: copy.investorPages }}
            secondaryAction={{ href: ctaLinks.exploreCompany, label: copy.companyPage }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
