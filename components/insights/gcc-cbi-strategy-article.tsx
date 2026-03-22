import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { CtaPanel } from "@/components/cta-panel"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface GccCbiStrategyArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function GccCbiStrategyArticle({
  locale,
  publishedAt,
  relatedPosts,
}: GccCbiStrategyArticleProps) {
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

  const internalLinks = {
    citizenship: localizeHref(locale, "/citizenship-by-investment"),
    contact: localizeHref(locale, "/contact"),
    insights: localizeHref(locale, "/insights"),
    gccComparison: localizeHref(locale, "/insights/caribbean-passport-comparison-gcc-expats"),
    bestPrograms: localizeHref(locale, "/insights/best-citizenship-by-investment-programs-2026"),
  }

  return (
    <>
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className="relative space-y-6">
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href={internalLinks.insights}>
                  <ArrowLeft className="size-4" />
                  {backLabel}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">
                <span className="rounded-full border border-white/15 px-3 py-1">Investor planning</span>
                <span>{format(new Date(publishedAt), "d MMM yyyy")}</span>
                <span>CBI Deal Editorial Team</span>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  Citizenship by Investment for GCC-Based Expats: What Actually Matters Before You Apply
                </h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  For GCC-based expats and internationally mobile investors, the best citizenship by investment
                  decision is usually not the one with the loudest ranking. It is the one that fits your mobility
                  needs, family structure, and documentation profile without pretending to solve problems it cannot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="section-card space-y-10 p-6 md:p-10">
            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.passportHandoff.src}
                alt={siteImages.passportHandoff.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              <p>
                Many international investors first approach citizenship by investment as a product search. They want to
                know which passport ranks highest, which process is fastest, or which program appears cheapest. In real
                advisory work, that is almost never where the decision starts. The more useful question is what
                problem the client is actually trying to solve.
              </p>
              <p>
                For GCC-based expats in particular, the problem is usually not relocation in the immediate sense. It is
                travel flexibility, long-term contingency planning, family optionality, and reducing dependence on one
                nationality or one residence framework. That is why the market needs calmer, more strategic guidance
                than generic “best passport” content tends to provide.
              </p>
              <p>
                If you want a broad foundation first, our{" "}
                <Link href={internalLinks.citizenship} className="text-primary underline underline-offset-4">
                  citizenship by investment overview
                </Link>{" "}
                is the right starting point. If you are already narrowing your options, the{" "}
                <Link href={internalLinks.gccComparison} className="text-primary underline underline-offset-4">
                  GCC Caribbean passport comparison
                </Link>{" "}
                and{" "}
                <Link href={internalLinks.bestPrograms} className="text-primary underline underline-offset-4">
                  2026 program comparison
                </Link>{" "}
                take the next step.
              </p>
            </div>

            <ArticleHighlight eyebrow="First principle" title="Citizenship by investment can improve optionality, but it should never be framed as a shortcut to everything.">
              <p>
                A second passport can improve how an investor moves, plans, and structures the next decade. What it
                does not do is automatically replace local residence rights, business licensing realities, or the
                documentation burden that comes with any serious due diligence process.
              </p>
              <p>
                That distinction is especially important for expats in the Gulf, where local residence can remain tied
                to sponsorship, employment, or separate legal status frameworks.
              </p>
            </ArticleHighlight>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Why expats and international investors consider a second passport</h2>
              <p className="text-base leading-8 text-muted-foreground">
                The motivations are usually more disciplined than the internet suggests.
              </p>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">They want smoother global movement for business, family, and banking-related travel.</li>
                <li className="list-disc">They want a longer-term contingency option if residence rules, employer status, or regional plans change.</li>
                <li className="list-disc">They want family planning flexibility, especially where children’s future education or relocation is part of the discussion.</li>
                <li className="list-disc">They want to reduce reliance on one nationality for all cross-border decisions.</li>
              </ul>
              <p className="text-base leading-8 text-muted-foreground">
                For some applicants, citizenship by investment GCC planning is really about resilience rather than
                acquisition. That framing usually leads to better decisions.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What actually matters before you apply</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: "Your real objective",
                    text: "Are you trying to improve travel, build a family backup plan, or broaden long-term personal optionality? Those are different use cases.",
                  },
                  {
                    title: "Your document profile",
                    text: "Source of funds, banking history, business ownership, and file consistency often matter more than people expect.",
                  },
                  {
                    title: "Your family structure",
                    text: "A single applicant and a multi-dependent family will often arrive at different program priorities even with the same budget.",
                  },
                  {
                    title: "Your tolerance for trade-offs",
                    text: "Some investors prefer program reputation. Others prefer cost efficiency. Others value simpler execution over branding.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="section-card">
                    <CardContent className="space-y-3 p-6">
                      <h3 className="text-xl leading-tight text-foreground">{item.title}</h3>
                      <p className="text-base leading-8 text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.coastalCafe.src}
                alt={siteImages.coastalCafe.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">The real trade-offs investors underestimate</h2>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Mobility versus residence</h3>
              <p className="text-base leading-8 text-muted-foreground">
                This is the most common misunderstanding. A mobility document helps with travel and long-term
                flexibility. It does not automatically give you new residence rights in the Gulf or elsewhere. The{" "}
                <a
                  href="https://u.ae/en/arachived-content/residence-visa/sponsoring-family-residency-visa-by-expatriates"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  UAE government’s own residency guidance
                </a>{" "}
                is a good reminder that Gulf residence is still governed by its own legal framework.
              </p>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Rankings versus actual use</h3>
              <p className="text-base leading-8 text-muted-foreground">
                The{" "}
                <a
                  href="https://www.henleyglobal.com/passport-index"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Henley Passport Index
                </a>{" "}
                is helpful, but it is not a substitute for thinking. For many investors, small mobility differences
                matter less than application economics, family inclusion, and execution quality.
              </p>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Price versus certainty</h3>
              <p className="text-base leading-8 text-muted-foreground">
                Lower headline cost can look attractive until family fees, due diligence charges, and intermediary
                quality are factored in. In practice, many expensive mistakes start with over-weighting the brochure
                number.
              </p>
            </div>

            <ArticleHighlight eyebrow="Consultant view" title="Most strong decisions come from eliminating the wrong reasons first.">
              <p>
                If a client is applying out of panic, copying a friend’s program choice, or treating the process as a
                simple travel hack, the risk of disappointment rises immediately.
              </p>
              <p>
                The stronger pattern is slower and more deliberate: define the objective, stress-test the file, compare
                trade-offs honestly, and then speak with a licensed provider who can review the case properly.
              </p>
            </ArticleHighlight>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Where the strongest programs still stand out</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Even though the differences between Caribbean programs are often smaller than articles imply, there are
                still meaningful distinctions. St. Kitts & Nevis continues to emphasize governance and institutional
                confidence through its{" "}
                <a
                  href="https://ciu.gov.kn/citizenship-by-investment-unit/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  official Citizenship by Investment Unit
                </a>
                . Dominica remains one of the clearest examples of a value-led route, and its{" "}
                <a
                  href="https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  formal regulations
                </a>{" "}
                make the structure unusually transparent.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                That does not mean one program is universally best. It means the comparison should be grounded in what
                the applicant values: reputation, efficiency, family fit, or longer-horizon planning.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">FAQ</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "Is citizenship by investment mainly for relocation?",
                    answer:
                      "Not usually. For many expats and global investors, it is more about mobility, contingency planning, and family optionality than immediate relocation.",
                  },
                  {
                    question: "Does a second passport solve Gulf residence dependence?",
                    answer:
                      "No. It can reduce dependence on one nationality for travel and planning, but it does not replace local GCC residence or work-permit rules.",
                  },
                  {
                    question: "Should I choose a program purely on passport rankings?",
                    answer:
                      "Usually not. Rankings are useful reference points, but profile fit, family economics, provider quality, and due diligence readiness often matter more.",
                  },
                  {
                    question: "What is the biggest mistake applicants make?",
                    answer:
                      "Treating the process like a simple purchase rather than a structured legal and compliance review. The best outcomes usually come from patient preparation.",
                  },
                ].map((item) => (
                  <Card key={item.question} className="section-card">
                    <CardContent className="space-y-3 p-6">
                      <h3 className="text-xl leading-tight text-foreground">{item.question}</h3>
                      <p className="text-base leading-8 text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <CtaPanel
              eyebrow="Advisory next step"
              title="Need a more realistic view of what citizenship by investment can do for your profile?"
              description="Submit your details and we'll connect you with a licensed provider suited to your profile."
              primaryAction={{ href: internalLinks.contact, label: "Submit your details" }}
              secondaryAction={{ href: internalLinks.citizenship, label: "Review investor options" }}
            />
          </article>

          <aside className="space-y-6">
            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Related reads</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Citizenship by investment overview", href: internalLinks.citizenship },
                  { label: "GCC passport comparison", href: internalLinks.gccComparison },
                  { label: "Best CBI programs in 2026", href: internalLinks.bestPrograms },
                  { label: "Contact the advisory team", href: internalLinks.contact },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="section-padding pt-0">
          <div className="container-shell space-y-6">
            <div className="max-w-2xl space-y-3">
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
