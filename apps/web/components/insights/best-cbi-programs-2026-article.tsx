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

interface BestCbiPrograms2026ArticleProps {
  locale: Locale
  publishedAt: string
  relatedPosts: CmsBlogPostSummary[]
}

const programCards = [
  {
    title: "St. Kitts & Nevis",
    summary:
      "Still the most brand-conscious option in the category. It is rarely the cheapest answer, but it often appeals to investors who value program reputation, process discipline, and a more premium positioning.",
    fit: "Best for investors who are willing to pay more for program maturity and cleaner optics.",
  },
  {
    title: "Dominica",
    summary:
      "Usually the value reference point. The government materials remain straightforward, the contribution threshold is comparatively accessible, and the program tends to suit applicants who want efficiency rather than story-driven branding.",
    fit: "Best for practical investors who want a direct second citizenship option without paying for perceived prestige.",
  },
  {
    title: "Antigua & Barbuda",
    summary:
      "Often the family conversation. Antigua tends to become relevant when the case involves dependants and a client wants a well-known Caribbean passport route with balanced pricing rather than the highest-status label.",
    fit: "Best for families who want a familiar structure and sensible family economics.",
  },
  {
    title: "Saint Lucia",
    summary:
      "One of the more flexible programs in market perception, and often a serious contender for investors who want optionality across routes rather than just a headline donation number.",
    fit: "Best for investors who want flexibility and are comparing multiple structures carefully.",
  },
  {
    title: "Grenada",
    summary:
      "Grenada tends to attract investors who are thinking beyond the passport itself and want a wider strategic conversation. It is not just about mobility, but about what the citizenship may enable in a broader planning context.",
    fit: "Best for investors with a more strategic, multi-jurisdiction decision process.",
  },
]

export function BestCbiPrograms2026Article({
  locale,
  publishedAt,
  relatedPosts,
}: BestCbiPrograms2026ArticleProps) {
  const backLabel =
    locale === "ar" ? "العودة إلى المقالات" : locale === "ru" ? "Назад к статьям" : "Back to insights"
  const relatedEyebrow =
    locale === "ar" ? "قراءة مرتبطة" : locale === "ru" ? "Похожие материалы" : "Related reading"
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
    comparison: localizeHref(locale, "/insights/caribbean-passport-vs-portugal-golden-visa"),
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
                <span className="rounded-full border border-white/15 px-3 py-1">Program comparisons</span>
                <span>{format(new Date(publishedAt), "d MMM yyyy")}</span>
                <span>CBI Deal Editorial Team</span>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  Best Citizenship by Investment Programs in 2026: A Realistic Comparison for Investors
                </h1>
                <p className="max-w-3xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  The citizenship by investment market in 2026 is less about finding the cheapest Caribbean passport
                  and more about choosing the program that still makes strategic sense after pricing resets, tighter
                  scrutiny, and a more compliance-led operating environment.
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
                src={siteImages.stLuciaAerial.src}
                alt={siteImages.stLuciaAerial.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              <p>
                In 2026, the market for citizenship by investment is more mature and less forgiving than it looked a
                few years ago. The old pitch was simple: choose a Caribbean passport, make a contribution, and secure a
                useful second passport with strong visa-free travel. That pitch is no longer wrong, but it is no longer
                complete either.
              </p>
              <p>
                Pricing has moved upward, donation thresholds have converged, due diligence has become more central to
                program credibility, and European scrutiny matters more because the long-term value of any visa-free
                travel passport depends on how stable those access arrangements remain. That means investors now need a
                more realistic question than “which is the best second passport?” The real question is: which program
                is still worth doing for your profile, your family, and your risk tolerance?
              </p>
              <p>
                If you are still orienting yourself around the wider landscape, our{" "}
                <Link href={internalLinks.insights} className="text-primary underline underline-offset-4">
                  insights hub
                </Link>{" "}
                and{" "}
                <Link href={internalLinks.citizenship} className="text-primary underline underline-offset-4">
                  citizenship by investment overview
                </Link>{" "}
                gives the broader context. If you already know you want a more tailored assessment, you can{" "}
                <Link href={internalLinks.contact} className="text-primary underline underline-offset-4">
                  contact our advisory team
                </Link>{" "}
                for a structured first review.
              </p>
            </div>

            <ArticleHighlight eyebrow="What changed in 2026" title="The cheap-arbitrage era is largely over.">
              <p>
                The Caribbean passport programs still matter, but the market now punishes superficial decision-making.
                After pricing adjustments and stronger intergovernmental coordination, the headline donation gap between
                programs is narrower than many investors assume. In practice, the question is no longer who is
                nominally cheapest. It is who remains credible, efficient, and suitable once family size, processing
                fees, compliance exposure, and long-term mobility value are factored in.
              </p>
              <p>
                That is why citizenship by investment 2026 should be approached as a risk-weighted planning decision,
                not a product shelf comparison.
              </p>
            </ArticleHighlight>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">What actually defines a good CBI program</h2>
              <p className="text-base leading-8 text-muted-foreground">
                A good program is not simply the one with the lowest advertised donation. Serious investors usually
                evaluate five things at once.
              </p>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">
                  <strong className="text-foreground">Program credibility:</strong> how the market, counterparties, and
                  governments perceive the program matters almost as much as the passport itself.
                </li>
                <li className="list-disc">
                  <strong className="text-foreground">Cost clarity:</strong> some programs look similar on paper, but
                  family fees, due diligence charges, and approved-route economics change the real total quickly.
                </li>
                <li className="list-disc">
                  <strong className="text-foreground">Operational predictability:</strong> investors do not want to be
                  surprised by ambiguous documentation standards, inconsistent intermediary behavior, or unstable
                  pricing.
                </li>
                <li className="list-disc">
                  <strong className="text-foreground">Mobility durability:</strong> visa-free travel is relevant, but
                  investors should care even more about whether that mobility profile is likely to remain politically
                  sustainable.
                </li>
                <li className="list-disc">
                  <strong className="text-foreground">Profile fit:</strong> the right answer differs for a single
                  entrepreneur, a multi-generational family, and a founder planning broader cross-border structuring.
                </li>
              </ul>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {programCards.map((program) => (
                <Card key={program.title} className="section-card">
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl leading-tight text-foreground">{program.title}</h2>
                      <p className="text-base leading-8 text-muted-foreground">{program.summary}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Who it suits
                      </p>
                      <p className="mt-3 text-sm leading-7 text-foreground">{program.fit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">A realistic view of the top Caribbean passport programs</h2>
              <div className="space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  <strong className="text-foreground">St. Kitts & Nevis.</strong> Still the most premium-positioned of
                  the group. The{" "}
                  <a
                    href="https://ciu.gov.kn/wp-content/uploads/2024/09/SKN_CIU-Brochure_180924.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official Citizenship by Investment Unit materials
                  </a>{" "}
                  point to a higher minimum contribution than most peers, which is part of the point rather than a
                  flaw. St. Kitts tends to appeal to investors who want the oldest citizenship by investment program, a
                  more disciplined brand, and less sensitivity to headline price.
                </p>
                <p>
                  <strong className="text-foreground">Dominica.</strong> Dominica remains the practical benchmark for
                  value-conscious applicants. The{" "}
                  <a
                    href="https://dominica.gov.dm/images/documents/2024/ACTS_AND_REGULATIONS/SROs/SRO_08_2024.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    2024 regulations
                  </a>{" "}
                  make the current threshold structure clearer than many investors expect. It is often not the
                  flashiest answer, but it can still be one of the most rational second citizenship options for
                  investors who want a direct outcome and do not need a more premium-label narrative around the
                  program.
                </p>
                <p>
                  <strong className="text-foreground">Antigua & Barbuda.</strong> Antigua is often where the family
                  economics conversation starts. The{" "}
                  <a
                    href="https://cip.gov.ag/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official program site
                  </a>{" "}
                  is still one of the cleaner starting points for investors reviewing route options and government fee
                  structures. For clients applying with dependants, the structure can be more attractive than it first
                  appears, especially when the decision is not about prestige but about balancing budget, family
                  inclusion, and a reputable Caribbean passport route.
                </p>
                <p>
                  <strong className="text-foreground">Saint Lucia.</strong> Saint Lucia often enters the shortlist when
                  investors want flexibility and a program that still feels adaptable within a more regulated
                  environment. The{" "}
                  <a
                    href="https://www.cipsaintlucia.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    official Saint Lucia programme materials
                  </a>{" "}
                  are useful because they show the structure clearly rather than forcing investors to rely on marketing
                  summaries. It suits applicants who are comparing routes carefully rather than selecting purely on
                  brand history.
                </p>
                <p>
                  <strong className="text-foreground">Grenada.</strong> Grenada is often the strategic investor’s
                  program. The{" "}
                  <a
                    href="https://imagrenada.gd/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    Investment Migration Agency
                  </a>{" "}
                  has also been more vocal than some peers about enforcement and market discipline, which matters in a
                  maturing sector. It may not always be the first choice for a simple, price-led application, but it
                  becomes interesting when the investor is thinking about broader mobility and long-term structuring
                  rather than only a travel document.
                </p>
              </div>
            </div>

            <ArticleProgramComparisonTable
              title="Caribbean passport programs: 2026 comparison"
              description="These are the points that matter most once you look past the headline brochures. Thresholds are based on current official materials and still need to be checked against family composition, route, and intermediary fees."
              columns={["St. Kitts", "Dominica", "Antigua", "Saint Lucia", "Grenada"]}
              rows={[
                {
                  label: "Indicative minimum contribution",
                  values: ["USD 250,000", "USD 200,000", "USD 230,000", "USD 240,000", "USD 235,000"],
                },
                {
                  label: "Core positioning",
                  values: [
                    "Premium, mature, reputation-led",
                    "Value-focused and direct",
                    "Family-oriented and balanced",
                    "Flexible and competitive",
                    "Strategic and broader-planning led",
                  ],
                },
                {
                  label: "Best fit",
                  values: [
                    "Investors prioritizing program brand and discipline",
                    "Single applicants or practical buyers",
                    "Families comparing total economics",
                    "Applicants who want route flexibility",
                    "Investors thinking beyond a simple passport outcome",
                  ],
                },
                {
                  label: "Potential drawback",
                  values: [
                    "Highest entry threshold",
                    "Less prestige differentiation",
                    "Can be misunderstood as only a family route",
                    "Needs careful route comparison, not just brochure reading",
                    "Usually not the cheapest or simplest headline option",
                  ],
                },
                {
                  label: "Advisor comment",
                  values: [
                    "Often chosen for optics as much as mobility",
                    "Still one of the most rational CBI decisions on price-to-outcome",
                    "Worth a serious look when family size matters",
                    "Competitive, but should be reviewed with a fine-tooth comb",
                    "Best when the investor has a wider strategic use case",
                  ],
                },
              ]}
            />

            <div className="relative overflow-hidden rounded-[28px] border border-border/70">
              <Image
                src={siteImages.petitPiton.src}
                alt={siteImages.petitPiton.alt}
                width={1600}
                height={960}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Why Caribbean programs are under pressure from Europe</h2>
              <p className="text-base leading-8 text-muted-foreground">
                This is the part many investors underestimate. The value of a second passport is not only what it gives
                you today. It is also whether counterpart countries continue to treat that passport as credible,
                controlled, and politically acceptable. The{" "}
                <a
                  href="https://home-affairs.ec.europa.eu/system/files/2020-05/regulation-2018-1806.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  European Commission’s visa-suspension framework
                </a>{" "}
                matters because it shapes how sustainable visa-free travel access remains over time.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                For that reason, the better programs in 2026 are not simply selling a travel document. They are trying
                to demonstrate stronger due diligence, better file discipline, and less tolerance for discount-driven
                behavior. From an investor perspective, that is actually positive. A stricter market is often a safer
                market, even if it is more expensive.
              </p>
            </div>

            <ArticleHighlight eyebrow="Real decision framework" title="Choose by profile, not by brochure.">
              <p>
                If your priority is the most polished program reputation and you are not especially fee-sensitive,
                St. Kitts & Nevis usually deserves the first look.
              </p>
              <p>
                If your objective is a direct, sensible citizenship by investment route with relatively efficient
                pricing, Dominica often remains one of the strongest answers.
              </p>
              <p>
                If the application is family-led, Antigua & Barbuda often becomes more attractive than investors
                expect. If you want flexibility and a competitive middle ground, Saint Lucia deserves serious review.
                If your planning is broader and more strategic, Grenada often stands out.
              </p>
            </ArticleHighlight>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Common mistakes investors make</h2>
              <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">
                <li className="list-disc">
                  Choosing the nominally lowest price without understanding the real total cost for a spouse, children,
                  due diligence, and route-specific fees.
                </li>
                <li className="list-disc">
                  Over-valuing a visa-free travel passport count while ignoring whether the program itself is under
                  greater geopolitical pressure.
                </li>
                <li className="list-disc">
                  Treating all Caribbean passport programs as interchangeable when in reality their reputational
                  positioning and family economics differ meaningfully.
                </li>
                <li className="list-disc">
                  Assuming due diligence is a box-ticking exercise. It is not. Any serious provider will stress AML,
                  KYC, source-of-funds clarity, and file consistency from the beginning.
                </li>
                <li className="list-disc">
                  Confusing “best second passport” content with actual decision-making. The right answer is always
                  profile-specific.
                </li>
              </ul>
            </div>

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
              <h2 className="section-title text-foreground">Compliance and due diligence reality</h2>
              <p className="text-base leading-8 text-muted-foreground">
                No credible 2026 conversation about citizenship by investment can ignore compliance. The path from
                initial enquiry to approval depends on anti-money laundering checks, know-your-client standards,
                document consistency, and government-led due diligence. That is not simply legal background noise; it
                is part of the asset you are buying. A program that appears easy because intermediaries are too casual
                is usually not the safer choice.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
This is also why we position the site as a structured advisory platform, not a
                “passport seller.” The right next step is matching a qualified investor to a licensed provider who can
                assess eligibility properly. If you want to see how this logic compares with European residence routes,
                the{" "}
                <Link href={internalLinks.comparison} className="text-primary underline underline-offset-4">
                  Caribbean vs Portugal comparison
                </Link>{" "}
                is a useful companion read. And if you operate an immigration practice that handles these enquiries at
                scale, the{" "}
                <Link href={internalLinks.companies} className="text-primary underline underline-offset-4">
                  company page
                </Link>{" "}
                gives a quieter view of the professional side of the platform.
              </p>
            </div>

            <div className="space-y-5">
              <h2 className="section-title text-foreground">Final recommendation by investor profile</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: "For the reputation-sensitive investor",
                    text: "Start with St. Kitts & Nevis if you want maturity, stronger branding, and a less price-led program story.",
                  },
                  {
                    title: "For the pragmatic single applicant",
                    text: "Start with Dominica if you want a direct route and care more about efficiency than narrative prestige.",
                  },
                  {
                    title: "For the family planner",
                    text: "Review Antigua & Barbuda carefully if family composition is central to the decision.",
                  },
                  {
                    title: "For the flexible comparator",
                    text: "Look closely at Saint Lucia if you want a competitive middle ground and are willing to compare route structure carefully.",
                  },
                  {
                    title: "For the strategic cross-border investor",
                    text: "Put Grenada on the shortlist if the passport is part of a wider planning conversation rather than the only objective.",
                  },
                  {
                    title: "For everyone else",
                    text: "Do not choose on articles alone. Submit a profile, clarify your objectives, and then compare licensed-provider advice against your real planning horizon.",
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

            <div className="space-y-6">
              <SectionHeading
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="The strongest citizenship by investment decisions usually come from clarifying these points early."
              />
              <div className="space-y-4">
                {[
                  {
                    question: "What is the best citizenship by investment program in 2026?",
                    answer:
                      "There is no single best answer for every investor. St. Kitts & Nevis often leads on program reputation, Dominica on practical value, Antigua & Barbuda on family economics, Saint Lucia on flexibility, and Grenada on broader strategic fit.",
                  },
                  {
                    question: "Which Caribbean passport program is cheapest in 2026?",
                    answer:
                      "The better question is which program has the best total economics for your case. Donation thresholds have moved closer together, so family size, government fees, and route structure matter as much as the headline minimum.",
                  },
                  {
                    question: "Are Caribbean passport programs still viable under European pressure?",
                    answer:
                      "Yes, but investors should care more about program discipline and long-term credibility than they did in the past. The value of a second passport depends on sustainable international confidence, not only current access.",
                  },
                  {
                    question: "Is visa-free travel enough reason to apply for second citizenship?",
                    answer:
                      "Usually not on its own. A serious decision should also weigh family planning, asset protection logic, operational simplicity, and how much geopolitical risk you are comfortable carrying.",
                  },
                  {
                    question: "What should I do before choosing a program?",
                    answer:
                      "Clarify your profile, family composition, timeline, source-of-funds documentation, and actual objective. That makes the comparison between Caribbean passport programs much more reliable and helps a licensed provider give you useful guidance.",
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
              title="Need a program shortlist that reflects your actual profile?"
              description="Submit your details and we’ll connect you with a licensed provider suited to your profile."
              primaryAction={{ href: internalLinks.contact, label: "Submit your details" }}
              secondaryAction={{ href: internalLinks.citizenship, label: "Review investor options" }}
            />
          </article>

          <aside className="space-y-6">
            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Key takeaway</p>
              <div className="mt-4 space-y-3 text-base leading-8 text-muted-foreground">
                <p>
                  In 2026, the strongest citizenship by investment choice is usually the program that fits your profile
                  cleanly after pricing, due diligence, and geopolitical durability are taken seriously.
                </p>
                <p>
                  That means investors should compare profile fit, not just brochures promising the best second
                  passport.
                </p>
              </div>
            </div>

            <div className="section-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Official references
              </p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    label: "St. Kitts & Nevis Citizenship by Investment Unit",
                    href: "https://ciu.gov.kn/wp-content/uploads/2024/09/SKN_CIU-Brochure_180924.pdf",
                  },
                  {
                    label: "Dominica Citizenship by Investment Regulations 2024",
                    href: "https://dominica.gov.dm/images/documents/2024/ACTS_AND_REGULATIONS/SROs/SRO_08_2024.pdf",
                  },
                  {
                    label: "Antigua & Barbuda Citizenship by Investment Programme",
                    href: "https://cip.gov.ag/",
                  },
                  {
                    label: "Saint Lucia Citizenship by Investment Programme",
                    href: "https://www.cipsaintlucia.com/",
                  },
                  {
                    label: "Investment Migration Agency Grenada",
                    href: "https://imagrenada.gd/",
                  },
                  {
                    label: "European Commission visa-suspension reporting framework",
                    href: "https://home-affairs.ec.europa.eu/system/files/2020-05/regulation-2018-1806.pdf",
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
                  { label: "Caribbean vs Portugal comparison", href: internalLinks.comparison },
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
