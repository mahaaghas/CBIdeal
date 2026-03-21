import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { portableTextComponents } from "@/components/cms/portable-text-components"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import { buildPageMetadata } from "@/lib/metadata"
import { getBlogPostBySlug, getBlogPosts, getResolvedSiteSettings } from "@/lib/sanity/content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const [{ slug }, settings] = await Promise.all([params, getResolvedSiteSettings()])
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return buildPageMetadata({
      title: "Article not found",
      description: settings.siteDescription,
      path: `/insights/${slug}`,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/insights/${post.slug}`,
    keywords: post.seo?.keywords ?? post.tags,
    image: post.seo?.openGraphImage?.url || post.featuredImage?.url,
    openGraphTitle: post.seo?.openGraphTitle,
    openGraphDescription: post.seo?.openGraphDescription,
    noIndex: post.seo?.noIndex,
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()])

  if (!post) {
    return (
      <SiteShell>
        <section className="section-padding">
          <div className="container-shell">
            <div className="section-card p-8 md:p-10">
              <h1 className="section-title text-foreground">This article could not be found.</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                The article may have been unpublished, or the slug may not exist in Sanity.
              </p>
              <Button asChild className="mt-6">
                <Link href="/insights">
                  <ArrowLeft className="size-4" />
                  Back to insights
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </SiteShell>
    )
  }

  const relatedPosts = allPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2)

  return (
    <SiteShell>
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className="relative space-y-6">
              <Button variant="outline" className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10" asChild>
                <Link href="/insights">
                  <ArrowLeft className="size-4" />
                  Back to insights
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">
                {post.category ? <span className="rounded-full border border-white/15 px-3 py-1">{post.category.title}</span> : null}
                <span>{format(new Date(post.publishedAt), "d MMM yyyy")}</span>
                {post.author ? <span>By {post.author.name}</span> : null}
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
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          </article>

          <aside className="space-y-6">
            {post.tags.length ? (
              <div className="section-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tags</p>
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Author</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xl text-foreground">{post.author.name}</p>
                  {post.author.role ? <p className="fine-print">{post.author.role}</p> : null}
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
              <span className="eyebrow">Related reading</span>
              <h2 className="section-title text-foreground">More articles from the same content hub.</h2>
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
