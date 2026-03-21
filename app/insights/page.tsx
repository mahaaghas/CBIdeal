import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/metadata"
import { ctaLinks } from "@/lib/site"
import { getBlogPosts, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResolvedSiteSettings()

  return buildPageMetadata({
    title: "Insights and Immigration Market Articles",
    description:
      "Read premium articles on citizenship by investment, residency planning, investor qualification, and CRM strategy for immigration firms.",
    path: "/insights",
    keywords: [
      "citizenship by investment blog",
      "immigration CRM articles",
      "residency by investment insights",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
  })
}

export default async function InsightsPage() {
  const posts = await getBlogPosts()
  const [featuredPost, ...otherPosts] = posts

  return (
    <SiteShell>
      <PageHero
        eyebrow="Insights"
        title="Practical articles for investors, immigration firms, and passport companies."
        description="Use the blog to publish high-trust commentary, program comparisons, and operational insights without compromising the premium feel of the main site."
        primaryAction={{ href: ctaLinks.checkEligibility, label: "Check eligibility" }}
        secondaryAction={{ href: ctaLinks.requestDemo, label: "Request a demo" }}
        stats={[
          { value: "Investor-facing", label: "content for high-value enquiries" },
          { value: "B2B insight", label: "CRM and workflow positioning" },
          { value: "SEO-ready", label: "built for scalable landing pages" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell space-y-10">
          {featuredPost ? (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Featured article"
                title="Editorial content that fits the same premium brand system."
                description="The blog uses the same typography, spacing, and card language as the commercial pages, so content marketing feels like part of the same product ecosystem."
              />
              <BlogPostCard post={featuredPost} featured />
            </div>
          ) : (
            <Card className="section-card">
              <CardContent className="space-y-4 p-8">
                <h2 className="text-3xl text-foreground">No blog posts have been published yet.</h2>
                <p className="fine-print">
                  Once Sanity is configured, create your first article in the Studio and it will appear here automatically.
                </p>
              </CardContent>
            </Card>
          )}

          {otherPosts.length ? (
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Latest articles"
                title="More published articles"
                description="Use category, tags, author, and SEO fields in Sanity to keep the editorial workflow organized as content grows."
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
            eyebrow="Next step"
            title="Use articles to support investor trust and B2B sales conversations."
            description="Editorial content can now sit alongside qualification funnels, CRM product pages, and future SEO landing pages under the same content system."
            primaryAction={{ href: ctaLinks.explorePrograms, label: "Explore investor pages" }}
            secondaryAction={{ href: ctaLinks.exploreCompany, label: "Explore company page" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
