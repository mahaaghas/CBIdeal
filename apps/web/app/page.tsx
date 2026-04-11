import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Globe2, ShieldCheck } from "lucide-react"
import { BlogPostCard } from "@/components/cms/blog-post-card"
import { CalendlyInlineEmbed } from "@/components/calendly-inline-embed"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProgramGrid } from "@/components/program-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Button } from "@/components/ui/button"
import { fallbackInsightPosts } from "@/lib/insights/fallback-posts"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { getLocalizedRouteLinks } from "@/lib/site"
import { getBlogPosts, getHomepageLandingPage, getResolvedSiteSettings } from "@/lib/sanity/content"

type HomeCopy = ReturnType<typeof getHomeCopy>
const HOMEPAGE_CALENDLY_URL =
  "https://calendly.com/va-agency-hirings/crm-lead-partnership-call?hide_event_type_details=1&hide_gdpr_banner=1"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const [cmsPage, settings] = await Promise.all([getHomepageLandingPage(), getResolvedSiteSettings()])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: localizeHref(locale, "/"),
      keywords: cmsPage.seo.keywords ?? [
        "citizenship by investment advisory",
        "residency by investment planning",
        "second citizenship guidance",
      ],
      image: cmsPage.seo.openGraphImage?.url,
      openGraphTitle: cmsPage.seo.openGraphTitle,
      openGraphDescription: cmsPage.seo.openGraphDescription,
      noIndex: cmsPage.seo.noIndex,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      locale,
    })
  }

  const localized = {
    en: {
      title: "Structured Guidance for Citizenship and Residency Decisions",
      description:
        "CBI Deal supports investors and internationally mobile families in navigating citizenship and residency pathways with clarity, discretion, and structured judgment.",
      keywords: [
        "citizenship by investment advisory",
        "residency by investment planning",
        "second citizenship guidance",
      ],
    },
    ar: {
      title: "توجيه منظم لقرارات الجنسية والإقامة",
      description:
        "تساعد CBI Deal المستثمرين والعائلات الدولية على فهم مسارات الجنسية والإقامة بوضوح وهدوء ومنهجية مدروسة.",
      keywords: [
        "الجنسية عن طريق الاستثمار",
        "الإقامة عن طريق الاستثمار",
        "تخطيط التنقل الدولي",
      ],
    },
    ru: {
      title: "Структурированный подход к решениям о гражданстве и резидентстве",
      description:
        "CBI Deal помогает инвесторам и международно мобильным семьям разбираться в программах гражданства и резидентства спокойно, ясно и структурированно.",
      keywords: [
        "гражданство за инвестиции",
        "резидентство за инвестиции",
        "международное планирование",
      ],
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/"),
    keywords: localized.keywords,
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

function getHomeCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      hero: {
        eyebrow: "منصة استشارية خاصة",
        title: "توجيه منظم لقرارات الجنسية والإقامة",
        description:
          "تدعم CBI Deal المستثمرين والعائلات الدولية في فهم الخيارات المعقدة بوضوح وخصوصية ومنهجية مدروسة.",
        primary: "استكشف خياراتك",
        secondary: "اطلب استشارة خاصة",
        stats: [
          { value: "وضوح أولاً", label: "الهدف هو فهم المسار المناسب قبل أي خطوة رسمية." },
          { value: "منظور دولي", label: "نقارن بين برامج وجغرافيات مختلفة وفق وضعك الفعلي." },
          { value: "نهج متزن", label: "القرار يبنى على الملاءمة، لا على الوعود السريعة." },
        ],
        asideEyebrow: "لمن صممت هذه البداية",
        asideTitle: "للأفراد الذين يريدون قراراً أدق قبل الالتزام بأي مسار.",
        asideDescription:
          "هذه البداية مناسبة للمستثمرين والعائلات التي تحتاج إلى قراءة هادئة للخيارات قبل الانتقال إلى خطوة أكثر تحديداً.",
        asidePoints: [
          "اعتبارات عائلية وتخطيط طويل المدى.",
          "مقارنة بين أكثر من دولة أو برنامج.",
          "حاجة إلى وضوح أكبر حول التوقيت والكلفة والنتيجة.",
        ],
        noteTitle: "الخصوصية جزء من التجربة",
        noteDescription:
          "القرارات المتعلقة بالتنقل الدولي تتطلب قدراً أكبر من الهدوء والانضباط والسرية من البداية.",
      },
      positioning: {
        eyebrow: "الموقع والدور",
        title: "مقاربة أكثر وعياً للتخطيط الدولي",
        description:
          "قرارات الجنسية أو الإقامة لا تتعلق بمقارنة البرامج وحدها، بل بفهم الهدف والسياق والنتائج طويلة المدى.",
        items: [
          {
            title: "منظور مستقل",
            description: "التركيز هنا على ما يلائم وضعك، لا على دفعك إلى برنامج واحد بشكل مسبق.",
          },
          {
            title: "قراءة أوسع للقرار",
            description: "نربط بين الميزانية والتوقيت والعائلة ونوع الوصول الذي تبحث عنه فعلاً.",
          },
          {
            title: "نبرة هادئة وواضحة",
            description: "المطلوب هو فهم أفضل، لا استعجال غير مبرر ولا لغة مبيعات مباشرة.",
          },
        ],
      },
      approach: {
        eyebrow: "المنهج",
        title: "كيف تبدو البداية المنظمة",
        description:
          "نقدم إطاراً يساعد على توضيح المسار المناسب من دون كشف تفاصيل تشغيلية لا تخص الزائر.",
        steps: [
          {
            icon: Globe2,
            title: "السياق الأولي",
            description: "نبدأ بالأولوية الأساسية، وضع العائلة، الإطار الزمني، وما الذي تحاول حله فعلياً.",
          },
          {
            icon: Compass,
            title: "الاتجاه الاستراتيجي",
            description: "ننظر في الولايات القضائية والهياكل التي تبدو منطقية لحالتك قبل أي التزام أعمق.",
          },
          {
            icon: ShieldCheck,
            title: "الوصول المناسب",
            description: "عند الحاجة، يتم الانتقال إلى جهات مرخصة أو معتمدة بطريقة أكثر دقة وملاءمة.",
          },
        ],
      },
      pathways: {
        eyebrow: "المسارات الرئيسية",
        title: "الطرق التي تبدأ منها أغلب المقارنات الجادة",
        description:
          "ليست كل الحالات تبحث عن النتيجة نفسها. بعض القرارات تتجه مباشرة إلى الجنسية، وبعضها إلى إقامة استراتيجية أو انتقال أوسع.",
        items: [
          {
            title: "الجنسية عن طريق الاستثمار",
            description: "لمن يبحث عن جنسية ثانية مباشرة ضمن برامج رسمية واضحة المعايير.",
            image: siteImages.stLuciaAerial.src,
            alt: siteImages.stLuciaAerial.alt,
          },
          {
            title: "الإقامة عن طريق الاستثمار",
            description: "لمن يحتاج إلى وجود أوروبي أو مسار إقامة ينسجم مع التخطيط طويل المدى.",
            image: siteImages.coimbra.src,
            alt: siteImages.coimbra.alt,
          },
          {
            title: "الانتقال الاستراتيجي",
            description: "للحالات التي تجمع بين التنقل، هيكلة الحياة العائلية، وإعادة التموضع الدولي.",
            image: siteImages.budapest.src,
            alt: siteImages.budapest.alt,
          },
        ],
      },
      insights: {
        eyebrow: "المقالات",
        title: "رؤى تساعد على اتخاذ قرار أكثر وعياً",
        description: "تحليلات حول البرامج والولايات القضائية والاعتبارات العملية في التخطيط الدولي.",
        cta: "عرض المقالات",
      },
      consultation: {
        eyebrow: "الخطوة التالية",
        title: "اطلب استشارة خاصة",
        description:
          "تستخدم المحادثات الأولية لفهم حالتك وتحديد ما إذا كان بإمكاننا دعم الملف بشكل مناسب.",
        primary: "اطلب استشارة",
        secondary: "استكشف خياراتك",
      },
    }
  }

  if (locale === "ru") {
    return {
      hero: {
        eyebrow: "Частная консультативная платформа",
        title: "Структурированный подход к решениям о гражданстве и резидентстве",
        description:
          "CBI Deal помогает инвесторам и международно мобильным семьям разбираться в сложных программах ясно, дискретно и в более структурированном формате.",
        primary: "Изучить варианты",
        secondary: "Запросить консультацию",
        stats: [
          { value: "Ясность в начале", label: "Сначала определяется правильное направление, а не навязывается готовый ответ." },
          { value: "Международный взгляд", label: "Сравнение строится вокруг юрисдикций, сроков и реального профиля семьи." },
          { value: "Сдержанный подход", label: "Речь идёт о пригодности маршрута, а не о рекламной подаче." },
        ],
        asideEyebrow: "Для кого это начало",
        asideTitle: "Для инвесторов и семей, которым нужен более выверенный первый шаг.",
        asideDescription:
          "Эта отправная точка подходит тем, кто сравнивает несколько маршрутов и хочет понять картину до более формального движения дальше.",
        asidePoints: [
          "Семейное и долгосрочное планирование.",
          "Выбор между несколькими странами или структурами.",
          "Потребность в большей ясности по срокам, стоимости и результату.",
        ],
        noteTitle: "Дискретность не является дополнением",
        noteDescription:
          "Для международно чувствительных решений спокойный и контролируемый первый этап имеет такое же значение, как и сама программа.",
      },
      positioning: {
        eyebrow: "Позиционирование",
        title: "Более вдумчивый подход к международной мобильности",
        description:
          "Решения о гражданстве и резидентстве требуют не только сравнения программ, но и контекста, структуры и понимания долгосрочных последствий.",
        items: [
          {
            title: "Независимый взгляд",
            description: "Фокус на том, что действительно подходит профилю, а не на заранее выбранной стране.",
          },
          {
            title: "Более широкая рамка решения",
            description: "Во внимание принимаются бюджет, сроки, семья и практическая цель запроса.",
          },
          {
            title: "Спокойный и точный тон",
            description: "Здесь важнее ясность и дисциплина мышления, чем давление или шумный маркетинг.",
          },
        ],
      },
      approach: {
        eyebrow: "Подход",
        title: "Как выглядит структурированное начало",
        description:
          "Мы показываем понятную рамку работы без того, чтобы выносить на первый план внутреннюю механику процесса.",
        steps: [
          {
            icon: Globe2,
            title: "Первичный контекст",
            description: "Уточняются приоритеты, семейная ситуация, сроки и то, какую задачу запрос должен решить.",
          },
          {
            icon: Compass,
            title: "Стратегическое направление",
            description: "Рассматриваются юрисдикции и структуры маршрутов, которые выглядят уместно для конкретного случая.",
          },
          {
            icon: ShieldCheck,
            title: "Релевантный доступ",
            description: "При необходимости следующий шаг выстраивается через лицензированных и надлежащим образом авторизованных участников.",
          },
        ],
      },
      pathways: {
        eyebrow: "Ключевые маршруты",
        title: "Основные направления, с которых обычно начинается сравнение",
        description:
          "Не каждый случай требует одного и того же исхода. Для одних важна вторая гражданская принадлежность, для других — резидентская структура или стратегическое перемещение.",
        items: [
          {
            title: "Citizenship by Investment",
            description: "Для тех, кто рассматривает прямой маршрут ко второму гражданству через официальные программы.",
            image: siteImages.stLuciaAerial.src,
            alt: siteImages.stLuciaAerial.alt,
          },
          {
            title: "Residency by Investment",
            description: "Для семей и инвесторов, которым нужен европейский или долгосрочный резидентский маршрут.",
            image: siteImages.coimbra.src,
            alt: siteImages.coimbra.alt,
          },
          {
            title: "Strategic Relocation",
            description: "Для случаев, где мобильность, семейная структура и международное переустройство рассматриваются вместе.",
            image: siteImages.budapest.src,
            alt: siteImages.budapest.alt,
          },
        ],
      },
      insights: {
        eyebrow: "Insights",
        title: "Материалы для более информированных решений",
        description: "Аналитика по программам, юрисдикциям и международному планированию.",
        cta: "Перейти к статьям",
      },
      consultation: {
        eyebrow: "Следующий шаг",
        title: "Запросить частную консультацию",
        description:
          "Первичные беседы используются для понимания вашей ситуации и оценки того, можем ли мы уместно сопровождать такой запрос.",
        primary: "Запросить консультацию",
        secondary: "Изучить варианты",
      },
    }
  }

  return {
    hero: {
      eyebrow: "Private advisory platform",
      title: "Structured guidance for citizenship and residency decisions",
      description:
        "CBI Deal supports investors and internationally mobile families in approaching citizenship and residency pathways with greater clarity, discretion, and structure.",
      primary: "Explore your options",
      secondary: "Request a consultation",
      stats: [
        { value: "Clearer first steps", label: "The emphasis is on understanding suitability before any more committed step is taken." },
        { value: "International perspective", label: "Jurisdictions, timing, family context, and planning horizon are considered together rather than in isolation." },
        { value: "Measured access", label: "Further introductions are only useful once the direction itself appears genuinely coherent." },
      ],
      asideEyebrow: "Who this gateway is for",
      asideTitle: "For investors and internationally mobile families seeking a more considered starting point.",
      asideDescription:
        "This gateway is intended for people who want to understand the landscape properly before committing themselves to a programme, a jurisdiction, or a more detailed discussion.",
      asidePoints: [
        "Family-led and long-horizon planning.",
        "Cross-jurisdiction comparisons rather than single-country promotion.",
        "A need for clarity on timing, cost, and strategic outcome.",
      ],
      noteTitle: "Discretion matters",
      noteDescription:
        "Citizenship and residency planning often sits alongside sensitive family, business, and mobility questions. The first step should feel measured, private, and proportionate to that reality.",
    },
    positioning: {
      eyebrow: "Positioning",
      title: "A more considered approach to international mobility",
      description:
        "Citizenship and residency decisions require more than programme comparisons. They require context, structure, and a clear understanding of the legal, practical, and longer-term implications that different routes create. This section explains the perspective behind the platform and the lens through which those decisions are approached.",
      items: [
        {
          title: "Independent perspective",
          description: "The purpose is to understand what genuinely suits the case, rather than treating every visitor as though the same destination should fit everyone.",
        },
        {
          title: "Decision-making in context",
          description: "Budget, timing, family structure, mobility aims, and practical constraints all shape what the right route actually looks like once the case is examined properly.",
        },
        {
          title: "Calm and exacting tone",
          description: "The experience should feel disciplined, discreet, and internationally minded rather than promotional or over-explained.",
        },
      ],
    },
    approach: {
      eyebrow: "Approach",
      title: "How the process is framed",
      description:
        "The structure is intended to clarify the right direction without exposing the visitor to unnecessary internal mechanics or making the process feel transactional. It shows what the first stage is meant to achieve before any route is treated as settled, and how the broader decision becomes easier to read.",
      steps: [
        {
          icon: Globe2,
          title: "Initial context",
          description: "The starting point is a clear view of priorities, family situation, timing, and what the decision is truly meant to solve.",
        },
        {
          icon: Compass,
          title: "Strategic direction",
          description: "Suitable jurisdictions and pathway structures are explored before any route is treated as the answer by default or reduced to a single headline feature.",
        },
        {
          icon: ShieldCheck,
          title: "Relevant access",
          description: "Where appropriate, the next step can move towards licensed providers in a way that remains measured, proportionate, and privacy-aware.",
        },
      ],
    },
    pathways: {
      eyebrow: "Investor pathways",
      title: "The main routes clients usually compare",
      description:
        "Different objectives call for different structures. Some cases point towards direct citizenship, others towards residency planning or wider international repositioning. The routes below are intended to help visitors orient themselves before narrowing into a specific programme, jurisdiction, or next step.",
      items: [
        {
          title: "Citizenship by Investment",
          description: "For those considering direct citizenship routes through established investment-led programmes where mobility, contingency planning, or family optionality matter.",
          image: siteImages.stLuciaAerial.src,
          alt: siteImages.stLuciaAerial.alt,
        },
        {
          title: "Residency by Investment",
          description: "For families and investors looking at residence-led structures with a longer planning horizon and a more gradual route into international optionality.",
          image: siteImages.coimbra.src,
          alt: siteImages.coimbra.alt,
        },
        {
          title: "Strategic Relocation",
          description: "For cases where mobility, residence, family planning, and international repositioning need to be considered together rather than treated as separate decisions.",
          image: siteImages.budapest.src,
          alt: siteImages.budapest.alt,
        },
      ],
    },
    insights: {
      eyebrow: "Insights",
      title: "Insights for more informed decisions",
      description: "Editorial analysis on programmes, jurisdictions, due diligence, and the planning considerations that shape serious cross-border decisions. It is intended to help visitors understand the landscape more fully and decide which questions deserve closer attention.",
      cta: "View insights",
    },
    consultation: {
      eyebrow: "Private consultation",
      title: "Request a consultation",
      description:
        "Initial conversations are intended to understand your situation, priorities, and timing, and to determine whether a more detailed discussion would be appropriate. For many visitors, this is the point at which general research gives way to case-specific judgement.",
      primary: "Request a consultation",
      secondary: "Explore your options",
    },
  }
}

function getMergedInsightPosts() {
  return fallbackInsightPosts
}

export default async function HomePage() {
  const locale = getRequestLocale()
  const routeLinks = getLocalizedRouteLinks(locale)
  const copy = getHomeCopy(locale)
  const cmsPosts = await getBlogPosts()

  const mergedPosts = [...cmsPosts]

  getMergedInsightPosts().forEach((fallbackPost) => {
    if (!mergedPosts.some((post) => post.slug === fallbackPost.slug)) {
      mergedPosts.push(fallbackPost)
    }
  })

  const featuredInsights = mergedPosts
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, 3)

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
        primaryAction={{ href: routeLinks.programs, label: copy.hero.primary }}
        secondaryAction={{ href: routeLinks.bookConsultation, label: copy.hero.secondary }}
        showGuideLink={false}
        surface="panel"
      />

      <section className="section-flow">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.pathways.eyebrow}
            title={copy.pathways.title}
            description={copy.pathways.description}
          />
          <ProgramGrid items={copy.pathways.items} />
        </div>
      </section>

      <section className="section-flow">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.consultation.eyebrow}
            title={copy.consultation.title}
            description={copy.consultation.description}
            primaryAction={{ href: routeLinks.bookConsultation, label: copy.consultation.primary }}
            secondaryAction={{ href: routeLinks.programs, label: copy.consultation.secondary }}
            showGuideLink={false}
          />
        </div>
      </section>

      <section className="section-flow">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.positioning.eyebrow}
            title={copy.positioning.title}
            description={copy.positioning.description}
          />
          <TrustGrid items={copy.positioning.items} />
        </div>
      </section>

      <section className="section-flow bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.approach.eyebrow}
            title={copy.approach.title}
            description={copy.approach.description}
          />
          <ProcessSteps steps={copy.approach.steps} />
        </div>
      </section>

      <section className="section-flow bg-muted/30">
        <div className="container-shell space-y-8">
          <SectionHeading
            eyebrow={copy.insights.eyebrow}
            title={copy.insights.title}
            description={copy.insights.description}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredInsights.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="flex justify-start pt-1">
            <Button asChild>
              <Link href={routeLinks.insights}>
                {copy.insights.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-flow">
        <div className="container-shell">
          <div className="hero-panel overflow-hidden px-6 py-8 sm:px-8 md:px-10 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
              <div className="section-stack">
                <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">Final step</span>
                <h2 className="section-title max-w-[16ch] text-primary-foreground">Contact us or schedule a call</h2>
                <p className="max-w-[34rem] text-base leading-7 text-primary-foreground/74 md:text-[1.02rem] md:leading-8">
                  Choose the route that fits your pace. You can send a private enquiry first, or book a call directly
                  using the live calendar below.
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                  <Button asChild size="lg" variant="secondary" className="conversion-primary-button w-full sm:w-auto">
                    <Link href={HOMEPAGE_CALENDLY_URL}>
                      Schedule a call
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Link href={routeLinks.contact} className="conversion-secondary-button w-full sm:w-auto">
                    Contact us
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/14 bg-[#f8f7f4] p-2 shadow-[0_20px_55px_rgba(9,15,24,0.16)]">
                <CalendlyInlineEmbed url={HOMEPAGE_CALENDLY_URL} height={760} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
