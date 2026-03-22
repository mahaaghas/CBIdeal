import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ArticleHighlight } from "@/components/insights/article-highlight"
import { ArticleProgramComparisonTable } from "@/components/insights/article-program-comparison-table"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { CtaPanel } from "@/components/cta-panel"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import type { CmsBlogPostSummary } from "@/lib/sanity/types"
import { siteImages } from "@/lib/site-images"

interface GccExpatsCaribbeanPassportArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

export function GccExpatsCaribbeanPassportArticle({
  locale,
  publishedAt,
  relatedPosts,
}: GccExpatsCaribbeanPassportArticleProps) {
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
    companies: localizeHref(locale, "/for-companies"),
    contact: localizeHref(locale, "/contact"),
    insights: localizeHref(locale, "/insights"),
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
                <span className="rounded-full border border-white/15 px-3 py-1">Mobility planning</span>
                <span>{format(new Date(publishedAt), "d MMM yyyy")}</span>
                <span>CBI Deal Editorial Team</span>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  Best Second Passport for GCC Residents: A Caribbean Citizenship Comparison
                </h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  For Gulf-based professionals and families, a Caribbean passport is usually a mobility hedge rather
                  than a relocation solution. The best second passport for GCC residents is usually the route that fits
                  travel patterns, family structure, and long-term flexibility without confusing passport ownership
                  with GCC residency rights.
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
                src={siteImages.seniorExecutive.src}
                alt={siteImages.seniorExecutive.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              <p>
                For expats living in the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, or Oman, the logic behind second
                citizenship is usually different from the logic you see in generic ranking articles. Most GCC-based
                applicants are not looking for a dramatic exit story. They are looking for resilience: easier travel,
                cleaner contingency planning, better family flexibility, and one less dependency in a life that is
                often structured around employer-sponsored residence.
              </p>
              <p>
                That is why any honest citizenship by investment GCC conversation needs to start with realism. A
                Caribbean passport may improve how you move, how you plan, and how you diversify long-term options. It
                does not replace your current Gulf residence status, your work permit, or your local sponsorship
                framework. If you ignore that distinction, you are likely to choose the wrong program for the wrong
                reason.
              </p>
              <p>
                If you want the broader program landscape first, our{" "}
                <Link href={internalLinks.citizenship} className="text-primary underline underline-offset-4">
                  citizenship by investment overview
                </Link>{" "}
                and{" "}
                <Link href={internalLinks.insights} className="text-primary underline underline-offset-4">
                  insights hub
                </Link>{" "}
                are the best starting points. If you already have a profile to review, you can{" "}
                <Link href={internalLinks.contact} className="text-primary underline underline-offset-4">
                  contact the advisory team
                </Link>{" "}
                for a more structured first discussion.
              </p>
            </div>

            <ArticleHighlight eyebrow="Important distinction" title="A Caribbean passport does not replace GCC residency or work permits.">
              <p>
                In much of the Gulf, residency remains tied to sponsorship, employment, family status, or a separate
                local permit structure. A second passport can improve global mobility and long-term optionality, but it
                does not automatically change the rules that allow you to live and work in the GCC today.
              </p>
              <p>
                That matters because many buyers accidentally treat a citizenship by investment decision as if it were a
                substitute for local residence rights. It is not. It is a mobility and planning tool.
              </p>
            </ArticleHighlight>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Why GCC expats consider a second passport</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Most serious applicants from the Gulf are not chasing a label. They are trying to reduce friction in
                specific parts of life.
              </p>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">Travel becomes easier when business, family, and school decisions cross multiple jurisdictions.</li>
                <li className="list-disc">A second passport can reduce dependence on one nationality for visas and consular exposure.</li>
                <li className="list-disc">Families often want a cleaner long-term planning option for children and future relocation choices.</li>
                <li className="list-disc">Entrepreneurs and executives sometimes want an additional mobility layer without fully changing their tax or residence base.</li>
              </ul>
              <p className="text-base leading-8 text-muted-foreground">
                That is why the right question is rarely "what is the best passport for Middle East expats?" A better
                question is: what type of mobility pressure do you actually have, and how much value does a second
                citizenship create once those constraints are named honestly?
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.businessStreet.src}
                alt={siteImages.businessStreet.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What mobility actually means if you live in the Gulf</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Mobility for a GCC expat is often misunderstood. It usually does not mean immediate relocation. It more
                often means easier business travel, easier family movement, fewer visa bottlenecks, and more credible
                optionality if your employment or residence setup changes.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                The UAE government&apos;s own residency guidance is a useful illustration of how dependent residence can
                be on a sponsoring status. That is why a{" "}
                <a
                  href="https://u.ae/en/arachived-content/residence-visa/sponsoring-family-residency-visa-by-expatriates"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Gulf residence framework
                </a>{" "}
                should be viewed separately from your passport strategy. The two can support each other, but they do
                not solve the same problem.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                This is also why visa-free travel GCC expats care about should be read pragmatically. The goal is not a
                fantasy of unrestricted relocation. The goal is to make life easier where mobility frictions are real:
                family visits, banking, schooling, business travel, and contingency planning.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Overview of the main Caribbean citizenship by investment programs</h2>
              <div className="space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  <strong className="text-foreground">St. Kitts & Nevis.</strong> Usually the premium brand in the
                  category. The{" "}
                  <a
                    href="https://ciu.gov.kn/citizenship-by-investment-unit/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official CIU materials
                  </a>{" "}
                  support that positioning. It tends to suit GCC-based executives who care about program maturity,
                  optics, and cleaner institutional presentation more than headline price.
                </p>
                <p>
                  <strong className="text-foreground">Dominica.</strong> Often the practical benchmark. The{" "}
                  <a
                    href="https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official regulations
                  </a>{" "}
                  make it clear that Dominica is not trying to win on marketing theatre. It tends to fit applicants who
                  want a rational, value-led answer.
                </p>
                <p>
                  <strong className="text-foreground">Antigua & Barbuda.</strong> Often a strong family case. The{" "}
                  <a
                    href="https://cip.gov.ag/citizenship"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official citizenship page
                  </a>{" "}
                  is useful because it highlights both due diligence standards and the five-day physical presence
                  requirement over five years, which some Gulf-based families actually find manageable.
                </p>
                <p>
                  <strong className="text-foreground">Saint Lucia.</strong> Often the middle-ground option for
                  applicants who want route flexibility and are comparing structures carefully rather than buying the
                  loudest brand.
                </p>
                <p>
                  <strong className="text-foreground">Grenada.</strong> Often the strategic planner&apos;s option. It can
                  appeal to applicants who view citizenship as part of a wider global flexibility plan, not just a
                  travel document.
                </p>
              </div>
            </div>

            <ArticleProgramComparisonTable
              title="Caribbean passport comparison for GCC-based applicants"
              description="The real differences are often smaller than people think. What matters is where each program feels stronger once you factor in family structure, profile fit, and strategic use."
              columns={["St. Kitts", "Dominica", "Antigua", "Saint Lucia", "Grenada"]}
              rows={[
                {
                  label: "Visa-free access profile",
                  values: [
                    "Strong and premium-positioned",
                    "Strong and practical",
                    "Strong, broadly similar tier",
                    "Strong, broadly similar tier",
                    "Strong, broadly similar tier",
                  ],
                },
                {
                  label: "Cost range",
                  values: [
                    "Highest among the five",
                    "Usually the value benchmark",
                    "Balanced, often attractive for families",
                    "Competitive middle ground",
                    "Mid-to-upper range depending on route",
                  ],
                },
                {
                  label: "Processing time",
                  values: [
                    "Measured in months, not weeks",
                    "Often viewed as efficient",
                    "Generally balanced",
                    "Generally balanced",
                    "Generally balanced",
                  ],
                },
                {
                  label: "Family inclusion",
                  values: [
                    "Good, but not always cheapest",
                    "Straightforward for simple families",
                    "Often one of the better family conversations",
                    "Case-by-case depending on route",
                    "Useful when strategy matters more than price",
                  ],
                },
                {
                  label: "Strategic advantage",
                  values: [
                    "Program reputation",
                    "Value and simplicity",
                    "Family planning fit",
                    "Flexibility and balance",
                    "Longer-horizon planning angle",
                  ],
                },
              ]}
            />

            <ArticleHighlight eyebrow="Passport mobility comparison" title="The mobility gap between the five programs is real, but usually not life-changing.">
              <p>
                The{" "}
                <a
                  href="https://www.henleyglobal.com/passport-index"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Henley Passport Index
                </a>{" "}
                is useful for orientation, but it should not make the decision for you. For GCC residents, the
                difference between one Caribbean passport and another is often less important than people think.
              </p>
              <p>
                If your day-to-day life remains anchored in Dubai, Riyadh, Doha, Kuwait City, Manama, or Muscat, then
                a small ranking difference rarely changes your actual life more than family cost, application
                simplicity, or long-term fit.
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
              <h2 className="section-title text-foreground">Which passport is best depending on your situation</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: "Frequent traveler",
                    text: "If your life is built around frequent cross-border movement, focus on operational ease, provider quality, and a strong overall mobility profile rather than chasing the smallest ranking difference.",
                  },
                  {
                    title: "Family planning",
                    text: "If you are applying with a spouse and children, family economics and administrative simplicity matter more than marketing. Antigua often deserves closer attention here.",
                  },
                  {
                    title: "Budget-focused applicant",
                    text: "If you want the most rational price-to-outcome conversation, Dominica usually belongs on the shortlist first.",
                  },
                  {
                    title: "Long-term global strategy",
                    text: "If the passport is part of a wider planning framework around optionality, Grenada and St. Kitts often become more interesting than headline rankings suggest.",
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
              <p className="text-base leading-8 text-muted-foreground">
                If you want a wider program-by-program lens before narrowing around the Gulf-specific use case, the{" "}
                <Link href={internalLinks.bestPrograms} className="text-primary underline underline-offset-4">
                  2026 CBI comparison
                </Link>{" "}
                is the best companion article.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Citizenship options for Egyptians working in the Gulf</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Egyptian professionals based in the Gulf often ask a more specific version of the GCC question: does a
                second passport materially improve mobility without changing local residence reality? In many cases, the
                answer is yes on travel flexibility, but no on Gulf work rights. That distinction matters.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                For Egyptian nationals working in the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, or Oman, the decision
                is usually not about replacing local residence. It is about reducing future mobility friction, creating
                optionality for family planning, and lowering dependence on one passport in a cross-border life. In
                practice, Dominica often enters the conversation first for value-led cases, while Antigua and Saint
                Lucia become more relevant where family fit and route balance matter.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Do UAE residents need a second passport?</h2>
              <p className="text-base leading-8 text-muted-foreground">
                Not always. Many UAE residents do not need one. The route becomes worth discussing only when there is a
                real mobility, family, or long-term planning reason behind it.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                If life in the UAE already works smoothly, travel friction is low, and there is no broader contingency
                planning objective, second citizenship may not be necessary. But where schooling plans, multi-country
                family movement, or higher travel dependency are part of the picture, a second passport can become a
                rational planning tool.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What most people misunderstand</h2>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">
                  They assume a second passport for expats UAE automatically solves residence dependency in the Gulf. It
                  does not.
                </li>
                <li className="list-disc">
                  They over-focus on mobility rankings and under-focus on family inclusion, file quality, and provider
                  execution.
                </li>
                <li className="list-disc">
                  They assume the best passport for Middle East expats is the same for every nationality and work
                  profile. It is not.
                </li>
                <li className="list-disc">
                  They treat citizenship by investment GCC planning like a travel hack rather than a compliance-heavy
                  legal process.
                </li>
                <li className="list-disc">
                  They underestimate how similar the five Caribbean programs can feel once viewed through a real-life
                  GCC lens.
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Compliance, due diligence, and real risks</h2>
              <p className="text-base leading-8 text-muted-foreground">
                For GCC-based professionals, this part is often more important than the marketing. Source of funds,
                banking history, business activity, and documentary consistency all matter. Any credible provider will
                stress anti-money laundering standards, know-your-client procedures, and government due diligence from
                the outset.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                The real risk is usually not that the process is impossible. It is that applicants approach it too
                casually, rely on poor intermediaries, or buy on price before checking whether their profile is cleanly
                presentable. That is one reason we frame the website as a structured advisory platform rather than a
                transaction page.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                If you run an immigration practice or family office desk and need to manage these comparisons in a more
                organized way, the{" "}
                <Link href={internalLinks.companies} className="text-primary underline underline-offset-4">
                  company page
                </Link>{" "}
                explains how the CRM and lead workflow are positioned on the B2B side.
              </p>
            </div>

            <ArticleHighlight
              eyebrow="Final recommendation"
              title="Choose the passport that solves your real mobility problem, not the one that wins the loudest ranking battle."
            >
              <p>
                For most Gulf-based expats, the right answer is the program that matches your actual profile, family
                structure, and tolerance for cost, not the one a ranking article calls number one.
              </p>
              <p>
                If you want brand strength and maturity, start with St. Kitts. If you want practical value, start with
                Dominica. If family inclusion is central, look carefully at Antigua. If you want a balanced middle
                ground, Saint Lucia deserves a serious look. If your planning is broader and more strategic, Grenada
                often rises on the shortlist.
              </p>
            </ArticleHighlight>

            <div className="space-y-6">
              <SectionHeading
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="These are the questions GCC-based applicants usually need answered before a short list becomes a real decision."
              />
              <div className="space-y-4">
                {[
                  {
                    question: "Does a Caribbean passport let me live and work freely in the GCC?",
                    answer:
                      "No. A Caribbean passport does not replace GCC residency, work permits, or sponsor-based residence rules. It supports mobility and long-term optionality, not local employment rights.",
                  },
                  {
                    question: "What is the best second passport for GCC residents?",
                    answer:
                      "There is no universal answer. The better route depends on whether you prioritize value, family fit, reputation, or broader strategic flexibility within a Gulf-based lifestyle.",
                  },
                  {
                    question: "What is the best passport for Middle East expats?",
                    answer:
                      "There is no universal answer. The best fit depends on whether you prioritize family planning, cost, reputation, or broader strategic flexibility.",
                  },
                  {
                    question: "Do UAE residents need a second passport?",
                    answer:
                      "Not necessarily. A second passport is most useful where mobility friction, family planning, or long-term optionality create a real planning need.",
                  },
                  {
                    question: "Which routes are often discussed by Egyptians working in the Gulf?",
                    answer:
                      "Many Egyptian professionals start with value and family-fit comparisons across Dominica, Antigua, and Saint Lucia, then review whether the route still makes sense for their specific travel pattern and household goals.",
                  },
                  {
                    question: "Is a second passport for expats UAE mainly about relocation?",
                    answer:
                      "Usually not. For many UAE-based applicants, it is more about travel flexibility, contingency planning, and reducing dependence on one nationality for cross-border life.",
                  },
                  {
                    question: "Are the Caribbean programs very different from each other?",
                    answer:
                      "They are different, but often less dramatically than marketing suggests. The gap in usefulness is usually smaller than the gap in branding.",
                  },
                  {
                    question: "What should I do before choosing a program?",
                    answer:
                      "Clarify your family structure, current GCC residence status, travel pattern, budget, and documentation profile. That produces a far better decision than ranking lists alone.",
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
              title="Need a shortlist built around your GCC residency setup and travel goals?"
              description="Submit your details and we'll connect you with a licensed provider suited to your profile."
              primaryAction={{ href: internalLinks.contact, label: "Submit your details" }}
              secondaryAction={{ href: internalLinks.citizenship, label: "Review investor options" }}
            />
          </article>

          <aside className="space-y-6">
            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Key takeaway</p>
              <div className="mt-4 space-y-3 text-base leading-8 text-muted-foreground">
                <p>
                  For GCC expats, mobility usually means easier travel and stronger contingency planning, not a
                  substitute for Gulf residence rights.
                </p>
                <p>
                  The best program is usually the one that fits your strategy cleanly after family, compliance, and
                  long-term use are considered.
                </p>
              </div>
            </div>

            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">External sources</p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    label: "UAE residency sponsorship guidance",
                    href: "https://u.ae/en/arachived-content/residence-visa/sponsoring-family-residency-visa-by-expatriates",
                  },
                  {
                    label: "Henley Passport Index",
                    href: "https://www.henleyglobal.com/passport-index",
                  },
                  {
                    label: "St. Kitts & Nevis CIU",
                    href: "https://ciu.gov.kn/citizenship-by-investment-unit/",
                  },
                  {
                    label: "Dominica CBI regulations",
                    href: "https://dominica.gov.dm/laws/2024/dominica_citizenship_by_investment_regulations_2024_sro_1_of_2024.pdf",
                  },
                  {
                    label: "Antigua & Barbuda citizenship page",
                    href: "https://cip.gov.ag/citizenship",
                  },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Internal links</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Citizenship by investment overview", href: internalLinks.citizenship },
                  { label: "Best CBI programs in 2026", href: internalLinks.bestPrograms },
                  { label: "Contact the advisory team", href: internalLinks.contact },
                  { label: "Insights hub", href: internalLinks.insights },
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
