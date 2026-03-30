import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ArticleComparisonGrid } from "@/components/insights/article-comparison-grid"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { CtaPanel } from "@/components/cta-panel"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface CaribbeanVsPortugalArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function CaribbeanVsPortugalArticle({
  locale,
  publishedAt,
  relatedPosts,
}: CaribbeanVsPortugalArticleProps) {
  const backLabel = locale === "ar" ? "العودة إلى المقالات" : locale === "ru" ? "Назад к статьям" : "Back to insights"
  const relatedEyebrow = locale === "ar" ? "قراءة مرتبطة" : locale === "ru" ? "Похожие материалы" : "Related reading"
  const relatedTitle =
    locale === "ar"
      ? "مقالات إضافية من نفس مركز المحتوى."
      : locale === "ru"
        ? "Другие материалы из этого же контент-хаба."
        : "Further reading from the editorial library."

  const internalLinks = {
    citizenship: localizeHref(locale, "/citizenship-by-investment"),
    companies: localizeHref(locale, "/for-companies"),
    contact: localizeHref(locale, "/contact"),
    insights: localizeHref(locale, "/insights"),
  }

  return (
    <>
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <div className="relative space-y-6">
              <Button variant="outline" className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10" asChild>
                <Link href={internalLinks.insights}>
                  <ArrowLeft className="size-4" />
                  {backLabel}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/70">
                <span className="rounded-full border border-white/15 px-3 py-1">Program comparisons</span>
                <span>{format(new Date(publishedAt), "d MMM yyyy")}</span>
                <span>CBI Deal Editorial Team</span>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  Caribbean Passport vs Portugal Golden Visa: Which Is Right for You?
                </h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  If you are comparing citizenship by investment in the Caribbean with the Portugal Golden Visa,
                  you are usually not choosing between a better and worse product. You are choosing between two very
                  different planning outcomes: immediate nationality versus a residency by investment route that can
                  support European optionality over time.
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
                src={siteImages.coimbra.src}
                alt={siteImages.coimbra.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              <p>
                A Caribbean passport and the Portugal Golden Visa both sit inside the broader world of global mobility
                planning, but they serve different priorities. One route is designed around obtaining citizenship by
                investment and a second passport. The other is a residency by investment pathway that can make sense
                for families who want a European base, long-term optionality, and a more gradual decision process.
              </p>
              <p>
                Clients often arrive with the wrong question. They ask which option is faster, cheaper, or stronger
                for visa-free travel. Those are valid questions, but they are rarely the deciding ones. The better
                question is this: which structure matches your timeline, your family planning, your tax and lifestyle
                preferences, and your tolerance for ongoing obligations?
              </p>
              <p>
                If you are still clarifying the broader landscape, our <Link href={internalLinks.citizenship} className="text-primary underline underline-offset-4">citizenship by investment overview</Link> is the right starting point.
                If you already have a profile in mind and want a more tailored conversation, you can also <Link href={internalLinks.contact} className="text-primary underline underline-offset-4">contact our team</Link> for a structured first review.
              </p>
            </div>

            <ArticleHighlight eyebrow="Consultant view" title="These two routes solve different problems.">
              <p>
                A Caribbean passport is usually about immediate nationality, cleaner execution, and a direct mobility
                outcome. Portugal is usually about staying close to Europe, building optionality patiently, and keeping
                lifestyle decisions open while moving through an official residency framework.
              </p>
              <p>
                That is why the right answer is often less emotional than clients expect. It comes down to whether you
                want citizenship now, or a European path that may support citizenship later while asking more of you
                along the way.
              </p>
            </ArticleHighlight>

            <ArticleComparisonGrid
              title="Caribbean vs Portugal: the practical comparison"
              description="This is the framework most experienced advisors use when a client is genuinely deciding between a Caribbean passport and the Portugal Golden Visa."
              rows={[
                {
                  factor: "Speed",
                  caribbean:
                    "A Caribbean passport typically wins on speed. Citizenship by investment programs in the Caribbean are usually chosen by clients who want a more direct outcome and fewer years of waiting before they hold a second passport.",
                  portugal:
                    "Portugal is slower by design. The Golden Visa is a residency by investment route first, and any eventual citizenship question sits later in the process rather than at the beginning.",
                },
                {
                  factor: "Cost",
                  caribbean:
                    "The entry cost can be easier to define, especially when the objective is a single citizenship outcome. Clients often find it easier to model total cost early in the process.",
                  portugal:
                    "Portugal can be more layered. There may be investment, legal, administrative, and holding considerations over time, so the all-in picture needs a longer planning horizon.",
                },
                {
                  factor: "Residency obligations",
                  caribbean:
                    "Caribbean citizenship by investment is often attractive because it usually does not ask for the same kind of ongoing residency relationship. That simplicity matters to globally mobile clients.",
                  portugal:
                    "Portugal is built around legal residence. Even when the physical presence burden is manageable, the route still expects a genuine relationship with the process and official rules over time.",
                },
                {
                  factor: "Citizenship outcome",
                  caribbean:
                    "The central value proposition is clear: the route is designed to lead to citizenship and a Caribbean passport if the case passes government due diligence and is approved.",
                  portugal:
                    "Portugal does not start as a passport route. It starts as residence. That distinction matters because many clients underestimate the time horizon and the policy sensitivity of the long path.",
                },
                {
                  factor: "Lifestyle and planning",
                  caribbean:
                    "This route can suit clients who want mobility and a second passport without materially reordering where they live day to day.",
                  portugal:
                    "Portugal tends to appeal to families and founders who value Europe as a practical anchor, whether for future relocation, education, business presence, or optionality.",
                },
              ]}
            />

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What a Caribbean passport actually gives you</h2>
              <p className="text-base leading-8 text-muted-foreground">
                The phrase <em>Caribbean passport</em> is often used casually, but serious investors are usually buying clarity rather than speed alone. A Caribbean citizenship by investment route can make sense when the client wants a direct legal outcome, cleaner operational handling, and a mobility solution that does not require years of intermediate status.
              </p>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Where it tends to win</h3>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">A more direct path to citizenship rather than residence first.</li>
                <li className="list-disc">A clearer relationship between budget and outcome.</li>
                <li className="list-disc">Useful for clients who prioritize a second passport and visa-free travel flexibility.</li>
                <li className="list-disc">Often better suited to clients who do not want a meaningful residency commitment.</li>
              </ul>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Where clients sometimes misread it</h3>
              <p className="text-base leading-8 text-muted-foreground">
                Some applicants assume any citizenship by investment route is automatically the best strategic answer. It is not. If your real goal is Europe, family relocation, or building a relationship with one specific market, a Caribbean passport may solve the mobility question while leaving your deeper planning question untouched.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.stLuciaAerial.src}
                alt={siteImages.stLuciaAerial.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What the Portugal Golden Visa actually gives you</h2>
              <p className="text-base leading-8 text-muted-foreground">
                The Portugal Golden Visa is better understood as a residency by investment framework with long-horizon value. It tends to appeal to investors who care about keeping a European option open, not just collecting another travel document. In practice, that usually means families, entrepreneurs, and principals who want to preserve flexibility while staying inside a recognized European legal structure.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                Where Portugal becomes attractive is not in the phrase <em>Golden Visa</em> itself, but in what it can support: a future-oriented plan, a credible residency base, and a route that can align with business, education, and family planning in a more integrated way than a pure second passport decision.
              </p>
              <h3 className="text-2xl leading-tight text-foreground md:text-[2rem]">Where Portugal tends to win</h3>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">A stronger fit for clients with real European lifestyle or family interests.</li>
                <li className="list-disc">A residency by investment route that can sit inside longer-term planning.</li>
                <li className="list-disc">Potentially better for clients who want to preserve optionality rather than finalize nationality immediately.</li>
                <li className="list-disc">A more natural fit when business, education, and eventual relocation are part of the same conversation.</li>
              </ul>
            </div>

            <ArticleHighlight eyebrow="Who this is actually for" title="The right answer usually becomes clear when you remove the marketing language.">
              <p>
                A Caribbean passport is usually right for the client who says: I want a direct citizenship outcome, I value simplicity, and I do not need the route to function as a European residence plan.
              </p>
              <p>
                Portugal is usually right for the client who says: I want Europe as part of my long-term planning, I can tolerate a slower and more procedural route, and I care about residency as much as eventual nationality.
              </p>
            </ArticleHighlight>

            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.familyWaterfront.src}
                alt={siteImages.familyWaterfront.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Common mistakes clients make</h2>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">They treat visa-free travel as the only metric, even when family or business planning matters more.</li>
                <li className="list-disc">They compare headline cost but ignore the cost of time, complexity, and ongoing obligations.</li>
                <li className="list-disc">They assume residency by investment is just a slower version of citizenship by investment, when in reality it serves a different strategic purpose.</li>
                <li className="list-disc">They underestimate due diligence and overestimate how much outcomes can be “managed.” Official approval always remains with the relevant authorities.</li>
                <li className="list-disc">They choose a path before clarifying whether they want immediate nationality, lifestyle optionality, or future family positioning.</li>
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">A real decision framework</h2>
              <p className="text-base leading-8 text-muted-foreground">
                When we review this choice with clients, we usually reduce it to five questions:
              </p>
              <ol className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-decimal">Do you want citizenship now, or are you comfortable starting with residence?</li>
                <li className="list-decimal">Is Europe central to the decision, or simply one possible future option?</li>
                <li className="list-decimal">How important is operational simplicity compared with long-term optionality?</li>
                <li className="list-decimal">Is this primarily for you, or for wider family planning over time?</li>
                <li className="list-decimal">Are you choosing for mobility alone, or for a broader private-wealth and lifestyle strategy?</li>
              </ol>
              <p className="text-base leading-8 text-muted-foreground">
                If the first and third questions matter most, a Caribbean passport often becomes the cleaner answer. If the second and fourth questions dominate, the Portugal Golden Visa usually deserves closer attention.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
  And if you run an advisory firm or immigration practice that handles exactly these kinds of comparisons at scale, our <Link href={internalLinks.companies} className="text-primary underline underline-offset-4">professional overview</Link> explains the broader structure in a quieter and more measured way.
              </p>
            </div>

            <div className="space-y-6">
              <SectionHeading
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="These are the questions that usually matter most once an investor has moved past broad marketing claims and is trying to make a serious decision."
              />
              <div className="space-y-4">
                {[
                  {
                    question: "Is a Caribbean passport better than the Portugal Golden Visa for visa-free travel?",
                    answer:
                      "Not automatically. Visa-free travel matters, but it should be read alongside your actual objective. If you want immediate citizenship, a Caribbean route may fit better. If you want European residence and long-term optionality, Portugal may be more relevant.",
                  },
                  {
                    question: "Is the Portugal Golden Visa a second passport program?",
                    answer:
                      "No. It is a residency by investment route first. Some clients confuse future citizenship potential with an immediate second passport outcome, but those are not the same thing.",
                  },
                  {
                    question: "Which route is usually simpler from an execution standpoint?",
                    answer:
                      "For many investors, Caribbean citizenship by investment is operationally simpler because the end objective is clearer and the structure is more direct. Portugal can be strategically stronger for some profiles, but it asks more patience.",
                  },
                  {
                    question: "Do both routes require due diligence?",
                    answer:
                      "Yes. Any serious route in this market involves AML, KYC, and government-led due diligence. No credible advisor should frame these steps as optional or superficial.",
                  },
                  {
                    question: "How should families choose between the two?",
                    answer:
                      "Families usually need to start with purpose. If the priority is a direct mobility outcome, a Caribbean passport may be the cleaner solution. If the priority is Europe, lifestyle optionality, and long-term structure, Portugal often deserves stronger consideration.",
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
              title="Need a more tailored view based on your profile?"
              description="Submit your details and we’ll connect you with a suitable licensed provider based on your profile, planning horizon, and priorities."
              primaryAction={{ href: internalLinks.contact, label: "Submit your details" }}
              secondaryAction={{ href: internalLinks.citizenship, label: "Review investor options" }}
            />
          </article>

          <aside className="space-y-6">
            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quick answer</p>
              <div className="mt-4 space-y-3 text-base leading-8 text-muted-foreground">
                <p>
                  Choose a Caribbean passport if you want a more direct citizenship by investment route and a second passport outcome.
                </p>
                <p>
                  Choose the Portugal Golden Visa if your core objective is a European residency by investment structure with longer-horizon optionality.
                </p>
              </div>
            </div>

            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Internal links</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Citizenship by investment overview", href: internalLinks.citizenship },
    { label: "Arrange a written introduction", href: internalLinks.contact },
                  { label: "Insights hub", href: internalLinks.insights },
                  { label: "For companies", href: internalLinks.companies },
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
