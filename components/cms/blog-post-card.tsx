import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

interface BlogPostCardProps {
  post: CmsBlogPostSummary
  featured?: boolean
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const readLabel = locale === "ar" ? "اقرأ التحليل" : locale === "ru" ? "Открыть материал" : "Read the analysis"
  const byLabel = locale === "ar" ? "بقلم" : locale === "ru" ? "Автор" : "By"

  return (
    <Card className="section-card overflow-hidden p-0">
      <div
        dir={direction}
        className={cn(
          featured ? "grid gap-0 lg:grid-cols-[1.05fr_0.95fr]" : "grid gap-0",
          isRtl && "text-right",
        )}
      >
        {post.featuredImage ? (
          <div className={featured ? "relative min-h-[320px]" : "relative h-60"}>
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              fill
              sizes={featured ? "(min-width: 1024px) 52vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
          </div>
        ) : null}
        <CardContent className="card-stack justify-center p-7 md:p-8">
          <div
            className={cn(
              "flex flex-wrap items-center gap-3 text-sm text-muted-foreground",
              isRtl && "flex-row-reverse justify-end",
            )}
          >
            {post.category ? (
              <span className="rounded-full border border-border/70 px-3 py-1">{post.category.title}</span>
            ) : null}
            <span>{format(new Date(post.publishedAt), "d MMM yyyy")}</span>
          </div>
          <div className="section-stack">
            <h3
              className={
                featured
                  ? "max-w-[16ch] text-[2rem] leading-[1.1] text-foreground md:text-[2.55rem]"
                  : "max-w-[18ch] text-[1.75rem] leading-[1.15] text-foreground"
              }
            >
              {post.title}
            </h3>
            <p className="fine-print">{post.excerpt}</p>
          </div>
          {post.author ? (
            <p className="text-sm text-muted-foreground">
              {byLabel} <span className="font-medium text-foreground">{post.author.name}</span>
              {post.author.role ? `, ${post.author.role}` : ""}
            </p>
          ) : null}
          <Button variant={featured ? "default" : "outline"} asChild>
            <Link href={localizeHref(locale, `/insights/${post.slug}`)}>
              {readLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
