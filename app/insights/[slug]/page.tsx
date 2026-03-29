import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { InlineArticleCta } from "@/components/conversion/inline-article-cta"
import { BestCbiPrograms2026Article } from "@/components/insights/best-cbi-programs-2026-article"
import { CanYouLoseCbiArticle } from "@/components/insights/can-you-lose-cbi-article"
import { CaribbeanVsPortugalArticle } from "@/components/insights/caribbean-vs-portugal-article"
import { CbiVsRbiArticle } from "@/components/insights/cbi-vs-rbi-article"
import { CheapestCbiProgramsArticle } from "@/components/insights/cheapest-cbi-programs-article"
import { DominicaVsStLuciaArticle } from "@/components/insights/dominica-vs-st-lucia-article"
import { FastestCbiProgramsArticle } from "@/components/insights/fastest-cbi-programs-article"
import { GccCbiStrategyArticle } from "@/components/insights/gcc-cbi-strategy-article"
import { GccExpatsCaribbeanPassportArticle } from "@/components/insights/gcc-expats-caribbean-passport-article"
import { IsCbiAScamArticle } from "@/components/insights/is-cbi-a-scam-article"
import { IsCbiWorthItArticle } from "@/components/insights/is-cbi-worth-it-article"
import { portableTextComponents } from "@/components/cms/portable-text-components"
import { SafestCbiProgramsArticle } from "@/components/insights/safest-cbi-programs-article"
import { SiteShell } from "@/components/site-shell"
import { StKittsVsAntiguaArticle } from "@/components/insights/st-kitts-vs-antigua-article"
import { WhyCaribbeanPassportsCheapArticle } from "@/components/insights/why-caribbean-passports-cheap-article"
import { Button } from "@/components/ui/button"
import {
  bestCbiPrograms2026Slug,
  canYouLoseCbiSlug,
  caribbeanVsPortugalSlug,
  cbiVsRbiSlug,
  cheapestCbiProgramsSlug,
  dominicaVsStLuciaSlug,
  fallbackInsightPosts,
  fastestCbiProgramsSlug,
  gccCbiStrategySlug,
  gccExpatsCaribbeanPassportSlug,
  getFallbackInsightPostBySlug,
  isCbiScamSlug,
  isCbiWorthItSlug,
  safestCbiProgramsSlug,
  stKittsVsAntiguaSlug,
  whyCaribbeanPassportsCheapSlug,
} from "@/lib/insights/fallback-posts"
import { buildPageMetadata } from "@/lib/metadata"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { getLocalizedRouteLinks } from "@/lib/site"
import { getBlogPostBySlug, getBlogPosts, getResolvedSiteSettings } from "@/lib/sanity/content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

function getFallbackRelatedPages(locale: ReturnType<typeof getRequestLocale>) {
  const routes = getLocalizedRouteLinks(locale)

  return [
    { label: locale === "ar" ? "برامج المستثمرين" : locale === "ru" ? "Страницы для инвесторов" : "Investor programs", href: routes.programs },
    { label: locale === "ar" ? "صفحة الشركات" : locale === "ru" ? "Страница для компаний" : "Company page", href: routes.forCompanies },
    { label: locale === "ar" ? "تواصل معنا" : locale === "ru" ? "Contact" : "Contact", href: routes.contact },
  ]
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const locale = getRequestLocale()
  const [{ slug }, settings] = await Promise.all([params, getResolvedSiteSettings()])
  const post = await getBlogPostBySlug(slug)
  const fallbackPost = !post ? getFallbackInsightPostBySlug(slug) : null

  if (!post && !fallbackPost) {
    return buildPageMetadata({
      title: "Article not found",
      description: settings.siteDescription,
      path: localizeHref(locale, `/insights/${slug}`),
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      noIndex: true,
      locale,
    })
  }

  if (fallbackPost) {
    return buildPageMetadata({
      title: fallbackPost.seo?.title || fallbackPost.title,
      description: fallbackPost.seo?.description || fallbackPost.excerpt,
      path: localizeHref(locale, `/insights/${fallbackPost.slug}`),
      keywords: fallbackPost.seo?.keywords ?? fallbackPost.tags,
      image: fallbackPost.seo?.openGraphImage?.url || fallbackPost.featuredImage?.url,
      openGraphTitle: fallbackPost.seo?.openGraphTitle,
      openGraphDescription: fallbackPost.seo?.openGraphDescription,
      noIndex: fallbackPost.seo?.noIndex,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      locale,
    })
  }

  return buildPageMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: localizeHref(locale, `/insights/${post.slug}`),
    keywords: post.seo?.keywords ?? post.tags,
    image: post.seo?.openGraphImage?.url || post.featuredImage?.url,
    openGraphTitle: post.seo?.openGraphTitle,
    openGraphDescription: post.seo?.openGraphDescription,
    noIndex: post.seo?.noIndex,
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = getRequestLocale()
  const { slug } = await params
  const [post, cmsPosts, settings] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts(), getResolvedSiteSettings()])
  const fallbackPost = !post ? getFallbackInsightPostBySlug(slug) : null
  const allPosts = [...cmsPosts]

  fallbackInsightPosts.forEach((candidate) => {
    if (!allPosts.some((postItem) => postItem.slug === candidate.slug)) {
      allPosts.push(candidate)
    }
  })
  const copy = {
    notFoundTitle: locale === "ar" ? "تعذر العثور على هذا المقال." : locale === "ru" ? "Эта статья не найдена." : "This article could not be found.",
    notFoundBody:
      locale === "ar"
        ? "ربما تم إلغاء نشر المقال أو أن الرابط غير موجود في Sanity."
        : locale === "ru"
          ? "Статья могла быть снята с публикации, либо этот slug не существует в Sanity."
          : "The article may have been unpublished, or the slug may not exist in Sanity.",
    back: locale === "ar" ? "العودة إلى المقالات" : locale === "ru" ? "Назад к статьям" : "Back to insights",
    by: locale === "ar" ? "بقلم" : locale === "ru" ? "Автор" : "By",
    tags: locale === "ar" ? "الوسوم" : locale === "ru" ? "Теги" : "Tags",
    author: locale === "ar" ? "الكاتب" : locale === "ru" ? "Автор" : "Author",
    pages: locale === "ar" ? "صفحات مرتبطة" : locale === "ru" ? "Связанные страницы" : "Related pages",
    pagesTitle:
      locale === "ar"
        ? "روابط داخلية تدعم استكشاف بقية الموقع."
        : locale === "ru"
          ? "Внутренние ссылки на ключевые разделы сайта."
          : "Internal links to key parts of the site.",
    relatedEyebrow: locale === "ar" ? "قراءة مرتبطة" : locale === "ru" ? "Похожие материалы" : "Related reading",
    relatedTitle:
      locale === "ar"
        ? "مقالات أخرى من نفس مركز المحتوى."
        : locale === "ru"
          ? "Другие статьи из этого же контент-хаба."
          : "Further reading from the editorial library.",
  }

  if (!post && !fallbackPost) {
    return (
      <SiteShell>
        <section className="section-padding">
          <div className="container-shell">
            <div className="section-card p-8 md:p-10">
              <h1 className="section-title text-foreground">{copy.notFoundTitle}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                {copy.notFoundBody}
              </p>
              <Button asChild className="mt-6">
                <Link href={localizeHref(locale, "/insights")}>
                  <ArrowLeft className="size-4" />
                  {copy.back}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </SiteShell>
    )
  }

  if (
    fallbackPost?.slug === caribbeanVsPortugalSlug ||
    fallbackPost?.slug === bestCbiPrograms2026Slug ||
    fallbackPost?.slug === gccExpatsCaribbeanPassportSlug ||
    fallbackPost?.slug === gccCbiStrategySlug ||
    fallbackPost?.slug === cheapestCbiProgramsSlug ||
    fallbackPost?.slug === fastestCbiProgramsSlug ||
    fallbackPost?.slug === safestCbiProgramsSlug ||
    fallbackPost?.slug === dominicaVsStLuciaSlug ||
    fallbackPost?.slug === stKittsVsAntiguaSlug ||
    fallbackPost?.slug === cbiVsRbiSlug ||
    fallbackPost?.slug === isCbiWorthItSlug ||
    fallbackPost?.slug === isCbiScamSlug ||
    fallbackPost?.slug === whyCaribbeanPassportsCheapSlug ||
    fallbackPost?.slug === canYouLoseCbiSlug
  ) {
    const relatedPosts = allPosts.filter((candidate) => candidate.slug !== fallbackPost.slug).slice(0, 2)
    const articleUrl = new URL(localizeHref(locale, `/insights/${fallbackPost.slug}`), settings.siteUrl).toString()
    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: fallbackPost.seo?.title || fallbackPost.title,
      description: fallbackPost.seo?.description || fallbackPost.excerpt,
      datePublished: fallbackPost.publishedAt,
      dateModified: fallbackPost.publishedAt,
      mainEntityOfPage: articleUrl,
      image: fallbackPost.featuredImage?.url ? [new URL(fallbackPost.featuredImage.url, settings.siteUrl).toString()] : undefined,
      author: fallbackPost.author
        ? {
            "@type": "Organization",
            name: fallbackPost.author.name,
          }
        : undefined,
      publisher: {
        "@type": "Organization",
        name: settings.siteName,
        url: settings.siteUrl,
      },
      keywords: fallbackPost.seo?.keywords?.length ? fallbackPost.seo.keywords.join(", ") : fallbackPost.tags.join(", "),
    }
    const breadcrumbStructuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "ar" ? "الرئيسية" : locale === "ru" ? "Главная" : "Home",
          item: new URL(localizeHref(locale, "/"), settings.siteUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "ar" ? "المقالات" : locale === "ru" ? "Статьи" : "Insights",
          item: new URL(localizeHref(locale, "/insights"), settings.siteUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: fallbackPost.title,
          item: articleUrl,
        },
      ],
    }

    return (
      <SiteShell>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
        {fallbackPost.slug === caribbeanVsPortugalSlug ? (
          <CaribbeanVsPortugalArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === bestCbiPrograms2026Slug ? (
          <BestCbiPrograms2026Article locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === cheapestCbiProgramsSlug ? (
          <CheapestCbiProgramsArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === fastestCbiProgramsSlug ? (
          <FastestCbiProgramsArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === safestCbiProgramsSlug ? (
          <SafestCbiProgramsArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === dominicaVsStLuciaSlug ? (
          <DominicaVsStLuciaArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === stKittsVsAntiguaSlug ? (
          <StKittsVsAntiguaArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === cbiVsRbiSlug ? (
          <CbiVsRbiArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === isCbiWorthItSlug ? (
          <IsCbiWorthItArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === isCbiScamSlug ? (
          <IsCbiAScamArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === whyCaribbeanPassportsCheapSlug ? (
          <WhyCaribbeanPassportsCheapArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === canYouLoseCbiSlug ? (
          <CanYouLoseCbiArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : fallbackPost.slug === gccExpatsCaribbeanPassportSlug ? (
          <GccExpatsCaribbeanPassportArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        ) : (
          <GccCbiStrategyArticle locale={locale} publishedAt={fallbackPost.publishedAt} relatedPosts={relatedPosts} />
        )}
      </SiteShell>
    )
  }

  const explicitRelatedPosts = post.relatedPosts?.filter((candidate) => candidate.slug !== post.slug) ?? []
  const fallbackRelatedPosts = allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      let score = 0

      if (post.category?.slug && candidate.category?.slug === post.category.slug) score += 3
      if (post.tags.length && candidate.tags.length) {
        const overlap = candidate.tags.filter((tag) => post.tags.includes(tag)).length
        score += overlap * 2
      }

      return { candidate, score }
    })
    .sort((left, right) => right.score - left.score)
    .map((item) => item.candidate)

  const relatedPosts = (explicitRelatedPosts.length ? explicitRelatedPosts : fallbackRelatedPosts).slice(0, 3)
  const relatedPages = post.relatedPages?.length ? post.relatedPages : getFallbackRelatedPages(locale)
  const bodyBlocks = Array.isArray(post.body) ? post.body : []
  const firstBreakIndex = Math.min(2, bodyBlocks.length)
  const middleBreakIndex = bodyBlocks.length > 4 ? Math.ceil(bodyBlocks.length / 2) : bodyBlocks.length
  const firstBlocks = bodyBlocks.slice(0, firstBreakIndex)
  const middleBlocks = bodyBlocks.slice(firstBreakIndex, middleBreakIndex)
  const finalBlocks = bodyBlocks.slice(middleBreakIndex)
  const articleUrl = new URL(localizeHref(locale, `/insights/${post.slug}`), settings.siteUrl).toString()
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: articleUrl,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      url: settings.siteUrl,
    },
    keywords: post.seo?.keywords?.length ? post.seo.keywords.join(", ") : post.tags.join(", "),
  }
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ar" ? "الرئيسية" : locale === "ru" ? "Главная" : "Home",
        item: new URL(localizeHref(locale, "/"), settings.siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ar" ? "المقالات" : locale === "ru" ? "Статьи" : "Insights",
        item: new URL(localizeHref(locale, "/insights"), settings.siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className="relative space-y-6">
              <Button variant="outline" className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10" asChild>
                <Link href={localizeHref(locale, "/insights")}>
                  <ArrowLeft className="size-4" />
                  {copy.back}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">
                {post.category ? <span className="rounded-full border border-white/15 px-3 py-1">{post.category.title}</span> : null}
                <span>{format(new Date(post.publishedAt), "d MMM yyyy")}</span>
                {post.author ? <span>{copy.by} {post.author.name}</span> : null}
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  {post.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="section-card space-y-8 p-6 md:p-10">
            {post.featuredImage ? (
              <div className="relative overflow-hidden rounded-[28px] border border-border/70">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt}
                  width={1600}
                  height={960}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}
            <div className="prose prose-neutral max-w-none space-y-6">
              <PortableText value={firstBlocks} components={portableTextComponents} />
              {bodyBlocks.length > 2 ? <InlineArticleCta locale={locale} /> : null}
              <PortableText value={middleBlocks} components={portableTextComponents} />
              {finalBlocks.length ? <InlineArticleCta locale={locale} /> : null}
              <PortableText value={finalBlocks} components={portableTextComponents} />
            </div>
          </article>

          <aside className="space-y-6">
            {post.tags.length ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.tags}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/70 px-3 py-1 text-sm text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {post.author ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.author}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xl text-foreground">{post.author.name}</p>
                  {post.author.role ? <p className="fine-print">{post.author.role}</p> : null}
                </div>
              </div>
            ) : null}

            {relatedPages.length ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.pages}</p>
                <p className="mt-3 fine-print">{copy.pagesTitle}</p>
                <div className="mt-4 space-y-3">
                  {relatedPages.map((item) => (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={localizeHref(locale, item.href)}
                      className="block rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="section-padding pt-0">
          <div className="container-shell space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="eyebrow">{copy.relatedEyebrow}</span>
              <h2 className="section-title text-foreground">{copy.relatedTitle}</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  )
}
