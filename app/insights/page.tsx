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
import { getLocalizedRouteLinks } from "@/lib/site"
import { getBlogPosts, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const settings = await getResolvedSiteSettings()

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "الرؤى والتحليلات"
        : locale === "ru"
          ? "Аналитика и материалы"
          : "Insights",
    description:
      locale === "ar"
        ? "تحليلات منظمة تساعد على فهم برامج الجنسية والإقامة، والفروق بين الولايات القضائية، واعتبارات العناية الواجبة والتخطيط الدولي."
        : locale === "ru"
          ? "Структурированная аналитика о программах гражданства и резидентства, различиях между юрисдикциями, due diligence и международном планировании."
          : "Structured analysis to support more informed citizenship and residency decisions.",
    path: localizeHref(locale, "/insights"),
    keywords: [
      "citizenship by investment insights",
      "residency by investment analysis",
      "citizenship and residency editorial analysis",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

export default async function InsightsPage() {
  const locale = getRequestLocale()
  const routeLinks = getLocalizedRouteLinks(locale)
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

  const copy =
    locale === "ar"
      ? {
          heroEyebrow: "الرؤى",
          heroTitle: "الرؤى",
          heroDescription:
            "تحليلات منظمة تساعد على فهم برامج الجنسية والإقامة، والفروق بين الولايات القضائية، واعتبارات العناية الواجبة والتخطيط الدولي.",
          heroPrimary: "استكشف الخيارات",
          heroSecondary: "اطلب استشارة خاصة",
          stats: [
            { value: "مقارنات البرامج", label: "قراءة أكثر هدوءاً للفروق بين المسارات والبرامج" },
            { value: "تحليل الولايات القضائية", label: "فهم أعمق لاختلافات الجهات والبيئات التنظيمية" },
            { value: "اعتبارات استراتيجية", label: "رؤية أوضح للتوقيت، الملاءمة، والتخطيط الأوسع" },
          ],
          categoriesEyebrow: "المجالات التحريرية",
          categoriesTitle: "مكتبة تحريرية تساعد على بناء قرار أكثر وضوحاً.",
          categoriesDescription:
            "تغطي المقالات هنا المقارنات العملية، وقراءة الجهات والبرامج، والأسئلة التي تؤثر فعلاً على القرار النهائي.",
          categories: [
            {
              title: "مقارنات البرامج",
              description: "قراءة أكثر هدوءاً للفروق بين البرامج المتقاربة بدل الاعتماد على الانطباعات السريعة أو التصنيفات العامة.",
            },
            {
              title: "تحليل الولايات القضائية",
              description: "فهم أوسع لاختلاف البيئات القانونية والعملية وكيف ينعكس ذلك على نوع القرار المناسب.",
            },
            {
              title: "اعتبارات استراتيجية",
              description: "مقالات تركز على التوقيت، الكلفة، العناية الواجبة، والملاءمة بعيدة المدى للأسرة أو الفرد.",
            },
          ],
          featuredEyebrow: "مادة مميزة",
          featuredTitle: "قراءة افتتاحية أكثر عمقاً.",
          featuredDescription: "مقال مختار يقدّم زاوية أوضح على سؤال يتكرر كثيراً في القرارات العابرة للحدود.",
          emptyTitle: "لم يتم نشر أي مقالات بعد.",
          emptyDescription: "ستظهر المواد هنا تلقائياً مع نشرها.",
          latestEyebrow: "أحدث المواد",
          latestTitle: "مواد أخرى من المكتبة التحريرية",
          latestDescription: "تحليلات إضافية تغطي المقارنات، الفروق بين المسارات، والعوامل التي تؤثر على القرار العملي.",
          ctaEyebrow: "الخطوة التالية",
          ctaTitle: "إذا أصبحت الصورة أوضح، يمكنك الانتقال إلى الصفحة أو المحادثة الأنسب.",
          ctaDescription: "تساعد هذه المواد على بناء فهم أكثر هدوءاً، ثم يصبح القرار التالي أكثر دقة وملاءمة.",
          ctaPrimary: "استكشف الخيارات",
          ctaSecondary: "اطلب استشارة خاصة",
        }
      : locale === "ru"
        ? {
            heroEyebrow: "Аналитика",
            heroTitle: "Аналитика",
            heroDescription:
              "Структурированная аналитика о программах гражданства и резидентства, различиях между юрисдикциями, due diligence и международном планировании.",
            heroPrimary: "Изучить варианты",
            heroSecondary: "Запросить частную консультацию",
            stats: [
              { value: "Сравнение программ", label: "Более спокойный взгляд на различия между маршрутами и программами" },
              { value: "Анализ юрисдикций", label: "Понимание регуляторной и практической среды разных направлений" },
              { value: "Стратегические соображения", label: "Более ясный взгляд на сроки, пригодность и долгосрочное планирование" },
            ],
            categoriesEyebrow: "Редакционные направления",
            categoriesTitle: "Редакционная библиотека для более взвешенного решения.",
            categoriesDescription:
              "Материалы здесь посвящены практическим сравнениям, анализу юрисдикций и вопросам, которые действительно влияют на конечный выбор.",
            categories: [
              {
                title: "Сравнение программ",
                description: "Более спокойное рассмотрение различий между близкими программами вместо поверхностных рейтингов и быстрых выводов.",
              },
              {
                title: "Анализ юрисдикций",
                description: "Более широкий взгляд на правовую и практическую среду разных направлений и на то, как это влияет на пригодность маршрута.",
              },
              {
                title: "Стратегические соображения",
                description: "Материалы о сроках, стоимости, due diligence и долгосрочной уместности для семьи или индивидуального случая.",
              },
            ],
            featuredEyebrow: "Выделенный материал",
            featuredTitle: "Более глубокое вводное чтение.",
            featuredDescription: "Выбранный материал, который помогает яснее посмотреть на вопрос, часто возникающий в трансграничных решениях.",
            emptyTitle: "Пока ни один материал не опубликован.",
            emptyDescription: "Новые статьи будут появляться здесь по мере публикации.",
            latestEyebrow: "Последние материалы",
            latestTitle: "Другие материалы из редакционной библиотеки",
            latestDescription: "Дополнительные материалы о сравнениях, различиях маршрутов и факторах, влияющих на практическое решение.",
            ctaEyebrow: "Следующий шаг",
            ctaTitle: "Если картина стала яснее, можно перейти к более подходящей странице или разговору.",
            ctaDescription: "Эти материалы помогают сформировать более спокойное понимание, после чего следующий шаг становится точнее.",
            ctaPrimary: "Изучить варианты",
            ctaSecondary: "Запросить частную консультацию",
          }
        : {
            heroEyebrow: "Insights",
            heroTitle: "Insights",
            heroDescription: "Structured analysis to support more informed citizenship and residency decisions, with a quieter editorial emphasis on comparison, suitability, due diligence, and international planning context. The aim is to help visitors understand the subject properly before deciding which route, or which question, deserves closer attention.",
            heroPrimary: "Explore your options",
            heroSecondary: "Request a private consultation",
            stats: [
              { value: "Program comparisons", label: "A calmer reading of differences between routes and programmes" },
              { value: "Jurisdiction analysis", label: "A clearer view of regulatory, practical, and regional differences" },
              { value: "Strategic considerations", label: "Perspective on timing, suitability, due diligence, and planning" },
            ],
            categoriesEyebrow: "Editorial focus",
            categoriesTitle: "An editorial library for more informed decisions.",
            categoriesDescription:
              "The material here is intended to clarify practical comparisons, jurisdiction differences, and the broader considerations that shape a serious decision before any route is treated as obvious. The categories below are designed to make that library easier to navigate.",
            categories: [
              {
                title: "Program comparisons",
                description: "A more measured reading of how similar routes differ in practice, rather than relying on broad rankings, headlines, or noise.",
              },
              {
                title: "Jurisdiction analysis",
                description: "A wider view of the legal, practical, and regional environment surrounding different jurisdictions and programme types.",
              },
              {
                title: "Strategic considerations",
                description: "Articles focused on timing, due diligence, family fit, cost, and the wider planning considerations that shape suitability.",
              },
            ],
            featuredEyebrow: "Featured reading",
            featuredTitle: "A closer editorial look.",
            featuredDescription: "A selected piece that brings more depth to a question that often shapes serious cross-border decisions.",
            emptyTitle: "No articles have been published yet.",
            emptyDescription: "New analysis will appear here as it is published.",
            latestEyebrow: "Latest analysis",
            latestTitle: "Further reading from the editorial library",
            latestDescription: "Additional analysis covering programme comparisons, route differences, and the considerations that usually matter once the enquiry becomes more serious. Readers can use this section to continue into narrower topics after the broader editorial framing above.",
            ctaEyebrow: "Next step",
            ctaTitle: "Once the picture is clearer, move to the page or conversation that best suits your situation.",
      ctaDescription: "The purpose of these articles is to support clearer thinking before you decide how, or whether, to proceed with a more detailed discussion.",
            ctaPrimary: "Explore your options",
            ctaSecondary: "Request a private consultation",
          }

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${settings.siteName} Insights`,
    description:
      locale === "ar"
        ? "مكتبة تحريرية حول برامج الجنسية والإقامة، والفروق بين الجهات، واعتبارات التخطيط الدولي."
        : locale === "ru"
          ? "Редакционная библиотека о программах гражданства и резидентства, различиях между юрисдикциями и международном планировании."
          : "Editorial library on citizenship and residency programmes, jurisdiction differences, and strategic planning considerations.",
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
        primaryAction={{ href: routeLinks.programs, label: copy.heroPrimary }}
        secondaryAction={{ href: routeLinks.bookConsultation, label: copy.heroSecondary }}
        compact
        stats={copy.stats}
        showGuideLink={false}
        secondaryActionStyle="text"
      />

      <section className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy.categoriesEyebrow}
            title={copy.categoriesTitle}
            description={copy.categoriesDescription}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {copy.categories.map((category) => (
              <Card key={category.title} className="section-card h-full">
                <CardContent className="section-stack flex h-full min-h-[210px] justify-center p-7 md:p-8">
                  <h2 className="max-w-[15rem] text-[1.28rem] leading-[1.22] text-foreground md:text-[1.4rem]">
                    {category.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

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
                <p className="fine-print">{copy.emptyDescription}</p>
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
            primaryAction={{ href: routeLinks.programs, label: copy.ctaPrimary }}
            secondaryAction={{ href: routeLinks.bookConsultation, label: copy.ctaSecondary }}
            showGuideLink={false}
          />
        </div>
      </section>
    </SiteShell>
  )
}
