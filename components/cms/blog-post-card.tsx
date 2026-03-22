import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"

interface BlogPostCardProps {
  post: CmsBlogPostSummary
  featured?: boolean
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const locale = getRequestLocale()
  const readLabel = locale === "ar" ? "اقرأ المقال" : locale === "ru" ? "Читать статью" : "Read article"
  const byLabel = locale === "ar" ? "بقلم" : locale === "ru" ? "Автор" : "By"

  return (
    <Card className="section-card overflow-hidden p-0">
      <div className={featured ? "grid gap-0 lg:grid-cols-[1.05fr_0.95fr]" : "grid gap-0"}>
        {post.featuredImage ? (
          <div className={featured ? "relative min-h-[320px]" : "relative h-60"}>
            <Image src={post.featuredImage.url} alt={post.featuredImage.alt} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
          </div>
        ) : null}
        <CardContent className="space-y-5 p-7 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.category ? (
              <span className="rounded-full border border-border/70 px-3 py-1">{post.category.title}</span>
            ) : null}
            <span>{format(new Date(post.publishedAt), "d MMM yyyy")}</span>
          </div>
          <div className="space-y-3">
            <h3 className={featured ? "text-3xl text-foreground md:text-4xl" : "text-2xl text-foreground"}>{post.title}</h3>
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
