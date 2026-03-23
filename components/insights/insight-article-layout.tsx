import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { CtaPanel } from "@/components/cta-panel"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

interface InsightLinkItem {
  label: string
  href: string
}

interface InsightArticleLayoutProps {
  locale: Locale
  publishedAt: string
  category: string
  title: string
  excerpt: string
  heroImage: {
    src: string
    alt: string
  }
  backHref: string
  relatedPosts: CmsBlogPostSummary[]
  children: ReactNode
  keyTakeaway: {
    title: string
    paragraphs: string[]
  }
  externalSources?: InsightLinkItem[]
  internalLinks?: InsightLinkItem[]
  cta: {
    eyebrow: string
    title: string
    description: string
    primaryAction: {
      href: string
      label: string
    }
    secondaryAction?: {
      href: string
      label: string
    }
  }
}

export function InsightArticleLayout({
  locale,
  publishedAt,
  category,
  title,
  excerpt,
  heroImage,
  backHref,
  relatedPosts,
  children,
  keyTakeaway,
  externalSources = [],
  internalLinks = [],
  cta,
}: InsightArticleLayoutProps) {
  const isRtl = locale === "ar"
  const backLabel =
    locale === "ar" ? "العودة إلى المقالات" : locale === "ru" ? "Назад к статьям" : "Back to insights"
  const relatedEyebrow =
    locale === "ar" ? "قراءة مرتبطة" : locale === "ru" ? "Похожие материалы" : "Related reading"
  const relatedTitle =
    locale === "ar"
      ? "مقالات إضافية من نفس مركز المحتوى."
      : locale === "ru"
        ? "Другие материалы из этого же контент-хаба."
        : "More articles from the same advisory content hub."
  const keyTakeawayLabel =
    locale === "ar" ? "الخلاصة" : locale === "ru" ? "Ключевой вывод" : "Key takeaway"
  const externalLabel =
    locale === "ar" ? "مصادر خارجية" : locale === "ru" ? "Внешние источники" : "External sources"
  const internalLabel =
    locale === "ar" ? "روابط داخلية" : locale === "ru" ? "Внутренние ссылки" : "Internal links"

  return (
    <>
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className={cn("relative space-y-6", isRtl && "text-right")} dir={isRtl ? "rtl" : "ltr"}>
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href={backHref}>
                  <ArrowLeft className="size-4" />
                  {backLabel}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">
                <span className="rounded-full border border-white/15 px-3 py-1">{category}</span>
                <span>{format(new Date(publishedAt), "d MMM yyyy")}</span>
                <span>CBI Deal Editorial Team</span>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">{title}</h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  {excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div
          className={cn("container-shell grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start", isRtl && "lg:grid-cols-[320px_1fr]")}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <article className={cn("section-card space-y-10 p-6 md:p-10", isRtl && "text-right")}>
            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            {children}

            <CtaPanel
              eyebrow={cta.eyebrow}
              title={cta.title}
              description={cta.description}
              primaryAction={cta.primaryAction}
              secondaryAction={cta.secondaryAction}
            />
          </article>

          <aside className={cn("space-y-6", isRtl && "text-right")}>
            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{keyTakeawayLabel}</p>
              <div className="mt-4 space-y-3 text-base leading-8 text-muted-foreground">
                <p className="text-foreground">{keyTakeaway.title}</p>
                {keyTakeaway.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {externalSources.length ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{externalLabel}</p>
                <div className="mt-4 space-y-3">
                  {externalSources.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground transition-colors hover:border-primary/30 hover:text-primary",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {internalLinks.length ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{internalLabel}</p>
                <div className="mt-4 space-y-3">
                  {internalLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground transition-colors hover:border-primary/30 hover:text-primary",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="size-4" />
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
            <div className={cn("max-w-2xl space-y-3", isRtl && "text-right")}>
              <span className="eyebrow">{relatedEyebrow}</span>
              <h2 className="section-title text-foreground">{relatedTitle}</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {relatedPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
