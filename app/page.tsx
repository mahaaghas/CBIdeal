import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Globe2, HandCoins, ShieldCheck } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProgramGrid } from "@/components/program-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageRenderer } from "@/components/cms/landing-page-renderer"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"
import { getHomepageLandingPage, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const [cmsPage, settings] = await Promise.all([getHomepageLandingPage(), getResolvedSiteSettings()])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: localizeHref(locale, "/"),
      keywords: cmsPage.seo.keywords ?? [
        "citizenship by investment offers",
        "residency by investment options",
        "second passport advisory",
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
      title: "International Citizenship and Residency Solutions",
      description:
        "Explore official citizenship-by-investment and residency-by-investment programs through a structured advisory and lead qualification process with licensed partners.",
      keywords: [
        "citizenship by investment offers",
        "residency by investment options",
        "second passport advisory",
      ],
    },
    ar: {
      title: "حلول الجنسية والإقامة الدولية",
      description:
        "استكشف برامج الجنسية عن طريق الاستثمار والإقامة عن طريق الاستثمار من خلال مسار استشاري منظم وبالتعاون مع جهات مرخصة ومعتمدة.",
      keywords: [
        "الجنسية عن طريق الاستثمار",
        "الإقامة عن طريق الاستثمار",
        "حرية التنقل الدولية",
      ],
    },
    ru: {
      title: "Международные решения в области гражданства и резидентства",
      description:
        "Изучайте официальные программы гражданства за инвестиции и резидентства за инвестиции через структурированный консультационный процесс и лицензированных партнеров.",
      keywords: [
        "гражданство за инвестиции",
        "резидентство за инвестиции",
        "международная мобильность",
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

const trustItems = [
  {
    title: "We compare trusted providers",
    description: "We help filter the market so you are not spending time with firms that do not match your profile, budget, or destination goals.",
  },
  {
    title: "We qualify before we connect",
    description: "The intake flow captures your citizenship, residence, family scope, timeframe, and budget before a provider reaches out.",
  },
  {
    title: "We focus on relevant provider matches",
    description: "The goal is not generic brochure advice. It is to connect you with a licensed provider or authorized partner suited to your profile and goals.",
  },
  {
    title: "We keep the process clear",
    description: "You get a cleaner, more selective first step that feels discreet, premium, and easier to trust for a high-value decision.",
  },
]

const howItWorks = [
  {
    icon: Globe2,
    title: "Submit your profile",
    description: "Share your citizenship, current residence, budget, timeline, and whether the enquiry is for you alone or your family.",
  },
  {
    icon: ShieldCheck,
    title: "We review your fit",
    description: "We screen your requirements and remove bad-fit options before passing your enquiry to a suitable provider.",
  },
  {
    icon: HandCoins,
    title: "A provider contacts you",
    description: "A matched provider comes back with the best-fit offer and next-step guidance for your case.",
  },
]

const programs = [
  {
    title: "Caribbean citizenship by investment",
    description: "For applicants prioritizing speed, mobility, and efficient family inclusion through established CBI programs.",
    image: siteImages.stLuciaAerial.src,
    alt: siteImages.stLuciaAerial.alt,
  },
  {
    title: "European residency by investment",
    description: "For families seeking long-term flexibility, optional relocation, and structured access into European markets.",
    image: siteImages.coimbra.src,
    alt: siteImages.coimbra.alt,
  },
  {
    title: "Family and timing-sensitive cases",
    description: "For cases where timing, dependants, or multi-jurisdiction planning matter as much as the underlying program itself.",
    image: siteImages.ghent.src,
    alt: siteImages.ghent.alt,
  },
]

export default async function HomePage() {
  const locale = getRequestLocale()
  const routeLinks = getLocalizedRouteLinks(locale)
  const ctaLinks = getLocalizedCtaLinks(locale)
  const cmsPage = await getHomepageLandingPage()

  const copy = {
    en: {
      heroEyebrow: "Structured advisory platform",
      heroTitle: "International citizenship and residency solutions for global mobility and long-term planning.",
      heroDescription:
        "We help qualified individuals explore official programs through licensed partners, ensuring a structured, discreet, and compliant process from first qualification to provider introduction.",
      primaryCta: "Start qualification",
      secondaryCta: "Explore programs",
      heroStats: [
        { value: "Qualified profile", label: "reviewed before licensed provider matching" },
        { value: "Structured process", label: "built for discretion and long-term planning" },
        { value: "Licensed partners", label: "selected for relevance and compliance" },
      ],
      nextLabel: "What happens next",
      nextItems: [
        "You submit a structured qualification profile.",
        "We review the case against budget, timing, destination preferences, and provider fit.",
        "A licensed provider or authorized partner follows up with the relevant next step.",
      ],
      companyLabel: "Are you a company?",
      companyTitle: "Passport company or immigration firm?",
      companyDescription: "Explore the CRM, pricing, guided demo, and qualified lead partnership offer.",
      companyCta: "Explore CRM and lead partnerships",
      qualificationEyebrow: "Qualification form",
      qualificationTitle: "Tell us what you need and let the right licensed provider come back to you.",
      qualificationDescription:
        "Share your profile, budget, and goals in a format that supports structured lead qualification and a more relevant first review.",
      qualificationPoints: [
        "Country of citizenship and current residence help filter realistic official pathways.",
        "Budget and timeframe help licensed providers return a relevant next step more efficiently.",
        "Family scope and program preference help avoid bad-fit conversations from the start.",
      ],
      formTitle: "Start your qualification",
      formDescription: "Complete the qualification form and we will route your enquiry through the appropriate licensed partner path.",
      finalEyebrow: "Final step",
      finalTitle: "Ready to begin a structured review of the right program options for your case?",
      finalDescription:
        "Submit your qualification details and we will connect qualified enquiries with licensed providers aligned with your profile, budget, and long-term goals.",
      finalPrimary: "Start qualification",
      finalSecondary: "Company? Start here",
      whyEyebrow: "Why work with us",
      whyTitle: "We act as a structured lead qualification and advisory platform.",
      whyDescription:
        "The experience stays focused on qualification, provider matching, and compliant process clarity rather than exaggerated promises. That is what makes it feel trustworthy.",
      howEyebrow: "Trust structure",
      howTitle: "How the process works",
      howDescription: "Each enquiry moves through a clear, compliant path designed to reinforce legitimacy and keep expectations grounded.",
      programsEyebrow: "Programs and opportunities",
      programsTitle: "Programs we regularly help clients compare.",
      programsDescription: "The current mix covers the most common routes while leaving room for dedicated destination pages as the domain grows.",
    },
    ar: {
      heroEyebrow: "منصة استشارية مستقلة",
      heroTitle: "حلول الجنسية والإقامة الدولية لتعزيز حرية التنقل والتخطيط طويل المدى.",
      heroDescription:
        "نساعد الأفراد المؤهلين على استكشاف البرامج الرسمية عبر شركاء مرخصين ومعتمدين، ضمن مسار منظم وملتزم بالامتثال من مرحلة التقييم الأولي حتى المتابعة مع الجهة المناسبة.",
      primaryCta: "احصل على عرض مخصص",
      secondaryCta: "استكشف البرامج",
      heroStats: [
        { value: "حرية تنقل دولية", label: "في إطار منظم يدعم التخطيط الشخصي والعائلي" },
        { value: "مسار منظم", label: "يراعي الامتثال والخصوصية منذ البداية" },
        { value: "شركاء مرخصون", label: "للتعامل مع البرامج الرسمية وإجراءات التحقق" },
      ],
      nextLabel: "موقعنا ودورنا",
      nextItems: [
        "نعمل كمنصة استشارية مستقلة تربط العملاء بجهات مرخصة ومعتمدة وفقاً للملف والأهداف.",
        "لا نصدر جوازات سفر ولا نتخذ قرارات قانونية أو سيادية، فجميع الطلبات تتم حصراً عبر البرامج الحكومية الرسمية.",
        "يتم التعامل مع كل حالة من خلال مسار مهني واضح يراعي التقييم الأولي والامتثال ومتطلبات العناية الواجبة.",
      ],
      companyLabel: "هل تمثل شركة؟",
      companyTitle: "شركة جوازات أو مكتب هجرة؟",
      companyDescription: "اطلع على نظام الـ CRM والأسعار والعرض التوضيحي والشراكات الخاصة بالعملاء المحتملين.",
      companyCta: "استكشف الـ CRM وشراكات العملاء المحتملين",
      qualificationEyebrow: "التقييم الأولي",
      qualificationTitle: "اترك بياناتك وسيقوم أحد شركائنا بالتواصل معك لتقديم أفضل الخيارات المناسبة لك",
      qualificationDescription:
        "نستخدم هذه الاستمارة لفهم ملفك بشكل منظم حتى يتمكن الشريك المناسب من العودة إليك بخيارات أكثر ملاءمة ووضوحاً.",
      qualificationPoints: [
        "تساعد الجنسية الحالية وبلد الإقامة على تحديد المسارات الرسمية الواقعية منذ البداية.",
        "تسهم الميزانية والإطار الزمني في توجيه الحالة إلى الجهة المرخصة الأكثر ملاءمة.",
        "يساعد نطاق العائلة ونوع البرنامج المطلوب على جعل التواصل الأول أكثر دقة وفائدة.",
      ],
      formTitle: "احصل على عرض مخصص",
      formDescription: "اترك بياناتك وسيقوم أحد شركائنا بالتواصل معك لتقديم أفضل الخيارات المناسبة لك.",
      finalEyebrow: "الخطوة الأخيرة",
      finalTitle: "هل أنتم مستعدون لبدء مراجعة منظمة لخيارات الجنسية عن طريق الاستثمار أو الإقامة عن طريق الاستثمار؟",
      finalDescription: "أرسلوا بياناتكم الأساسية وسنوجه الاستفسار إلى شركاء مرخصين ومعتمدين بما يتوافق مع الملف والأهداف والتخطيط طويل المدى.",
      finalPrimary: "احصل على عرض مخصص",
      finalSecondary: "هل تمثل شركة؟",
      whyEyebrow: "التموضع المهني",
      whyTitle: "نجمع بين النهج الاستشاري والخصوصية والتأهيل المنظم.",
      whyDescription: "نركز على تقييم الحالة وربطها بالجهة المناسبة وشرح المسار بوضوح، بدلاً من الخطاب التسويقي المبالغ فيه أو الوعود غير الواقعية.",
      howEyebrow: "هيكل العملية",
      howTitle: "كيف تتم العملية",
      howDescription: "تمر كل حالة بمسار واضح ومنظم يراعي الامتثال والمتطلبات الرسمية في كل مرحلة.",
      programsEyebrow: "البرامج والمسارات",
      programsTitle: "مسارات يدرسها كثير من المستثمرين الدوليين ضمن تخطيط طويل المدى.",
      programsDescription: "نحافظ على عرض منظم لأهم الخيارات دون إثقال المرحلة الأولى بتفاصيل غير ضرورية.",
    },
    ru: {
      heroEyebrow: "Структурированная консультационная платформа",
      heroTitle: "Международные решения в области гражданства и резидентства для глобальной мобильности и долгосрочного планирования.",
      heroDescription:
        "Мы помогаем квалифицированным заявителям изучать официальные программы через лицензированных партнеров, сохраняя структурированный, сдержанный и комплаенс-ориентированный процесс на каждом этапе.",
      primaryCta: "Получить индивидуальное предложение",
      secondaryCta: "Смотреть программы",
      heroStats: [
        { value: "Глобальная мобильность", label: "для личного, семейного и делового планирования" },
        { value: "Структурированный процесс", label: "с фокусом на комплаенс и конфиденциальность" },
        { value: "Лицензированные партнеры", label: "для официальных программ и надлежащей проверки" },
      ],
      nextLabel: "Независимая консультационная платформа",
      nextItems: [
        "Мы работаем как независимая advisory-платформа и координируем первичную квалификацию заявок.",
        "Мы соединяем клиентов с лицензированными провайдерами и авторизованными партнерами, подходящими под профиль и цели.",
        "Мы не оформляем паспорта и не принимаем решений о гражданстве: все заявки проходят официальный государственный процесс.",
      ],
      companyLabel: "Вы представляете компанию?",
      companyTitle: "Паспортная компания или иммиграционная фирма?",
      companyDescription: "Изучите CRM, тарифы, персональную демонстрацию и партнерскую модель по квалифицированным лидам.",
      companyCta: "Посмотреть CRM и партнерство по лидам",
      qualificationEyebrow: "Первичная квалификация",
      qualificationTitle: "Оставьте ваши данные, и один из наших партнеров свяжется с вами с индивидуальным предложением.",
      qualificationDescription:
        "Мы используем форму для структурированной первичной квалификации, чтобы лицензированный партнер мог вернуться с релевантным и персонализированным следующим шагом.",
      qualificationPoints: [
        "Гражданство и текущее резидентство помогают определить реалистичные официальные маршруты.",
        "Бюджет и сроки позволяют подобрать релевантных лицензированных партнеров без лишнего шума.",
        "Состав семьи и тип программы помогают сделать первый разговор более предметным и полезным.",
      ],
      formTitle: "Получить индивидуальное предложение",
      formDescription: "Оставьте ваши данные, и один из наших партнеров свяжется с вами с индивидуальным предложением.",
      finalEyebrow: "Следующий шаг",
      finalTitle: "Готовы обсудить официальные программы гражданства за инвестиции и резидентства за инвестиции в более структурированном формате?",
      finalDescription:
        "Оставьте квалификационные данные, и мы направим ваш запрос лицензированным партнерам, которые соответствуют вашему профилю, целям и долгосрочному планированию.",
      finalPrimary: "Получить индивидуальное предложение",
      finalSecondary: "Вы представляете компанию?",
      whyEyebrow: "Позиционирование",
      whyTitle: "Мы объединяем консультационный подход, конфиденциальность и структурированную квалификацию.",
      whyDescription:
        "Мы работаем как независимая консультационная платформа: квалифицируем запросы, подбираем лицензированных партнеров и сохраняем ясную, профессиональную логику процесса без агрессивных обещаний.",
      howEyebrow: "Структура процесса",
      howTitle: "Как проходит процесс",
      howDescription: "Каждый кейс проходит через понятную и комплаенс-ориентированную последовательность действий.",
      programsEyebrow: "Программы и направления",
      programsTitle: "Направления, которые чаще всего рассматривают международные инвесторы.",
      programsDescription: "Мы сохраняем обзор на ключевые программы гражданства за инвестиции и резидентства за инвестиции, не перегружая первый этап лишними деталями.",
    },
  }[locale]
  const localizedTrustItems =
    locale === "ar"
      ? [
          {
            title: "حرية تنقل دولية أوسع",
            description: "تساعدك البرامج الرسمية المختارة بعناية على بناء مرونة أكبر في الحركة والتخطيط عبر الحدود ضمن إطار قانوني واضح.",
          },
          {
            title: "استقرار طويل المدى لك ولعائلتك",
            description: "ننظر إلى الحالة من زاوية شخصية وعائلية معاً حتى يكون المسار مناسباً للتخطيط طويل المدى وليس للقرار القصير فقط.",
          },
          {
            title: "تنويع الخيارات الاستثمارية",
            description: "يتم تناول البرنامج كجزء من رؤية أوسع لإدارة الخيارات الاستثمارية والتنقل الدولي بصورة أكثر توازناً.",
          },
          {
            title: "الوصول إلى فرص عالمية",
            description: "قد تدعم البرامج المناسبة مرونة الأعمال والحضور الدولي والتخطيط العائلي ضمن مسار منظم وموثوق.",
          },
        ]
      : locale === "ru"
        ? [
            {
              title: "Международная мобильность",
              description: "Структурированный доступ к официальным программам помогает выстраивать личную, семейную и деловую мобильность в долгосрочной перспективе.",
            },
            {
              title: "Долгосрочное планирование для семьи",
              description: "Профиль, сроки и семейный контекст оцениваются вместе, чтобы маршрут был реалистичным, устойчивым и понятным с первого шага.",
            },
            {
              title: "Диверсификация активов",
              description: "Инвестиционный маршрут рассматривается как часть более широкого долгосрочного планирования, а не как изолированное решение.",
            },
            {
              title: "Доступ к глобальным возможностям",
              description: "Подходящие программы могут поддерживать международную мобильность, деловое присутствие и трансграничное планирование в законной структуре.",
            },
          ]
        : trustItems
  const localizedHowItWorks =
    locale === "ar"
      ? [
          {
            icon: ShieldCheck,
            title: "1. التقييم الأولي للحالة",
            description: "نراجع الملف والميزانية والإطار الزمني والاحتياجات العائلية قبل أي إحالة إلى جهة خارجية.",
          },
          {
            icon: Globe2,
            title: "2. ربطك بجهات مرخصة ومعتمدة",
            description: "يتم توجيه الحالات المؤهلة إلى جهات مرخصة أو شركاء معتمدين بما يتناسب مع الملف والأهداف.",
          },
          {
            icon: HandCoins,
            title: "3. إجراءات التدقيق الحكومي (Due Diligence)",
            description: "تخضع كل حالة لمتطلبات البرنامج الرسمية وإجراءات التحقق والعناية الواجبة لدى الجهات المختصة.",
          },
          {
            icon: BadgeCheck,
            title: "4. تقديم الطلب ومتابعته",
            description: "يتم تقديم الطلب ومتابعته حصرياً من خلال البرامج الحكومية الرسمية والوكلاء أو الشركاء المعتمدين.",
          },
        ]
      : locale === "ru"
        ? [
            {
              icon: ShieldCheck,
              title: "1. Первичная квалификация",
              description: "Мы оцениваем профиль, бюджет, сроки и семейный контекст до любого внешнего представления кейса.",
            },
            {
              icon: Globe2,
              title: "2. Подбор лицензированных партнеров",
              description: "Квалифицированные запросы направляются лицензированным провайдерам или авторизованным партнерам, релевантным профилю и целям.",
            },
            {
              icon: HandCoins,
              title: "3. Государственная проверка (Due Diligence)",
              description: "Каждый кейс проходит официальные требования программы и строгие процедуры due diligence со стороны соответствующих органов и лицензированных участников.",
            },
            {
              icon: BadgeCheck,
              title: "4. Подача и рассмотрение заявки",
              description: "Подача и окончательное решение осуществляются только через официальные государственные программы и авторизованных агентов.",
            },
          ]
        : [
            {
              icon: ShieldCheck,
              title: "1. Initial qualification",
              description: "We review your profile, budget, timing, and family context before any external introduction is made.",
            },
            {
              icon: Globe2,
              title: "2. Matching with licensed providers",
              description: "Qualified enquiries are directed to licensed providers or authorized partners suited to the case.",
            },
            {
              icon: HandCoins,
              title: "3. Government due diligence",
              description: "Every case remains subject to the official due diligence requirements of the relevant government program.",
            },
            {
              icon: BadgeCheck,
              title: "4. Application and approval",
              description: "Applications and final approvals are handled solely through official government programs and authorized agents.",
            },
          ]
  const localizedPrograms =
    locale === "ar"
      ? [
          {
            title: "برامج الجنسية عن طريق الاستثمار في الكاريبي",
            description: "للراغبين في مسارات رسمية معروفة تدعم المرونة الدولية والتخطيط العائلي ضمن أطر واضحة.",
            image: siteImages.stLuciaAerial.src,
            alt: siteImages.stLuciaAerial.alt,
          },
          {
            title: "الإقامة الأوروبية عن طريق الاستثمار",
            description: "للعائلات وأصحاب الأعمال الذين يبحثون عن مرونة طويلة الأجل وحضور منظم في بيئات أوروبية.",
            image: siteImages.coimbra.src,
            alt: siteImages.coimbra.alt,
          },
          {
            title: "الحالات العائلية والمتعددة الاعتبارات",
            description: "للحالات التي تتداخل فيها اعتبارات الأسرة والتوقيت والتخطيط متعدد الولايات القضائية ضمن قرار واحد.",
            image: siteImages.ghent.src,
            alt: siteImages.ghent.alt,
          },
        ]
      : locale === "ru"
        ? [
            {
              title: "Карибские программы гражданства за инвестиции",
              description: "Для заявителей, которым важны мобильность, гибкость структуры и семейное планирование в рамках официальных программ.",
              image: siteImages.stLuciaAerial.src,
              alt: siteImages.stLuciaAerial.alt,
            },
            {
              title: "Европейское резидентство за инвестиции",
              description: "Для семей и собственников бизнеса, которым нужна долгосрочная гибкость, структурированное присутствие и опциональность на будущее.",
              image: siteImages.coimbra.src,
              alt: siteImages.coimbra.alt,
            },
            {
              title: "Семейные и многофакторные кейсы",
              description: "Для ситуаций, где состав семьи, сроки и многопрофильное планирование так же важны, как и сама программа.",
              image: siteImages.ghent.src,
              alt: siteImages.ghent.alt,
            },
          ]
        : programs
  const lowerCopy = {
    trustEyebrow: locale === "ar" ? "الامتثال والثقة" : locale === "ru" ? "Доверие и конфиденциальность" : "Trust and discretion",
    trustTitle:
      locale === "ar"
        ? "الامتثال، ومكافحة غسيل الأموال، ومعرفة العميل جزء أساسي من العملية."
        : locale === "ru"
          ? "Комплаенс, AML, KYC и due diligence встроены в процесс с самого начала."
          : "A cleaner way to approach citizenship and residency planning.",
    trustDescription:
      locale === "ar"
        ? "نلتزم بالمتطلبات المعمول بها في الاتحاد الأوروبي، ومعايير مكافحة غسيل الأموال (AML)، وإجراءات معرفة العميل (KYC)، إلى جانب متطلبات التدقيق الإلزامي لكل حالة. الهدف هو الحفاظ على مسار مهني منظم وواضح يبعث على الثقة."
        : locale === "ru"
          ? "Мы придерживаемся применимых требований ЕС, стандартов AML/KYC и обязательной процедуры due diligence. Это не формальность, а неотъемлемая часть корректной и устойчивой структуры работы с заявками."
          : "High-value immigration decisions require discretion, clear qualification, and a serious tone. The restrained visual language helps the experience feel credible to both investors and partner firms.",
    speakToTeam: locale === "ar" ? "اطلع على حماية البيانات" : locale === "ru" ? "Подробнее о защите данных" : "Speak to our team",
    companiesEyebrow: locale === "ar" ? "للشركات" : locale === "ru" ? "Для компаний" : "For companies",
    companiesTitle:
      locale === "ar"
        ? "نساعد أيضًا شركات الجوازات ومكاتب الهجرة على النمو."
        : locale === "ru"
          ? "Мы также помогаем расти паспортным компаниям и иммиграционным фирмам."
          : "We also help passport companies and immigration firms grow.",
    companiesDescription:
      locale === "ar"
        ? "إذا كنت تدير شركة جوازات أو مكتب هجرة أو مكتب استشاري، فنحن نوفر تجربة CRM مخصصة ومسار عرض توضيحي وأسعارًا وشراكات للعملاء المحتملين تحت نفس النطاق."
        : locale === "ru"
          ? "Если вы управляете паспортной компанией, иммиграционной фирмой или консультационной практикой, мы предлагаем CRM, демо, тарифы и партнерство по квалифицированным лидам на том же домене."
          : "If you run a passport company, immigration firm, or advisory desk, we offer a dedicated CRM experience, guided demo path, pricing, and qualified lead partnership flow under the same domain.",
    visitCompany: locale === "ar" ? "انتقل إلى صفحة الشركات" : locale === "ru" ? "Перейти на страницу для компаний" : "Visit the company overview",
  }

  if (cmsPage) {
    return (
      <SiteShell>
        <LandingPageRenderer page={cmsPage} />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryAction={{ href: ctaLinks.checkEligibility, label: copy.primaryCta }}
        secondaryAction={{ href: routeLinks.programs, label: copy.secondaryCta }}
        stats={copy.heroStats}
      >
        <div className="space-y-5 md:space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 md:p-7 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">{copy.nextLabel}</p>
            <div className="mt-4 space-y-4 md:mt-5">
              {copy.nextItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-5 text-secondary" />
                  <p className="text-sm leading-7 text-primary-foreground/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-secondary/30 bg-background/95 p-5 text-foreground shadow-[0_20px_60px_rgba(19,24,38,0.16)] md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.companyLabel}</p>
            <h3 className="card-title mt-3 max-w-[24rem] text-foreground">{copy.companyTitle}</h3>
            <p className="mt-3 max-w-[30rem] text-sm leading-7 text-muted-foreground">
              {copy.companyDescription}
            </p>
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link href={routeLinks.forCompanies}>
                {copy.companyCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </PageHero>

      <section id="eligibility" className="section-padding pt-0">
        <div className="container-shell grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] lg:items-start">
          <div className="content-measure space-y-6 md:space-y-8">
            <span className="eyebrow">{copy.qualificationEyebrow}</span>
            <h2 className="section-title content-measure-tight text-foreground">{copy.qualificationTitle}</h2>
            <p className="content-measure-tight text-lg leading-8 text-muted-foreground">
              {copy.qualificationDescription}
            </p>
            <div className="space-y-3 md:space-y-4">
              {copy.qualificationPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 size-5 text-primary" />
                  <p className="fine-print">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="investor"
            title={copy.formTitle}
            description={copy.formDescription}
            source="homepage-investor"
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.whyEyebrow}
            title={copy.whyTitle}
            description={copy.whyDescription}
          />
          <TrustGrid items={localizedTrustItems} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.howEyebrow}
            title={copy.howTitle}
            description={copy.howDescription}
          />
          <ProcessSteps steps={localizedHowItWorks} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.programsEyebrow}
            title={copy.programsTitle}
            description={copy.programsDescription}
          />
          <ProgramGrid items={localizedPrograms} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card className="section-card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative min-h-[320px]">
                <Image src={siteImages.familyWaterfront.src} alt={siteImages.familyWaterfront.alt} fill className="object-cover" />
              </div>
              <CardContent className="space-y-5 p-7 md:p-8">
                <span className="eyebrow">{lowerCopy.trustEyebrow}</span>
                <h3 className="card-title content-measure-tight text-foreground">{lowerCopy.trustTitle}</h3>
                <p className="content-measure-tight text-base leading-8 text-muted-foreground">
                  {lowerCopy.trustDescription}
                </p>
                <Button variant="outline" asChild>
                  <Link href={locale === "ar" || locale === "ru" ? routeLinks.dataProtection : ctaLinks.speakToTeam}>{lowerCopy.speakToTeam}</Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          <Card className="section-card overflow-hidden p-0">
            <div className="relative min-h-[320px]">
              <Image src={siteImages.budapest.src} alt={siteImages.budapest.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-7 md:p-8">
              <span className="eyebrow">{lowerCopy.companiesEyebrow}</span>
              <h3 className="card-title max-w-[24rem] text-foreground">{lowerCopy.companiesTitle}</h3>
              <p className="max-w-[30rem] text-sm leading-7 text-muted-foreground">
                {lowerCopy.companiesDescription}
              </p>
              <Button asChild>
                <Link href={routeLinks.forCompanies}>
                  {lowerCopy.visitCompany}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.finalEyebrow ?? "Final step"}
            title={copy.finalTitle}
            description={copy.finalDescription}
            primaryAction={{ href: ctaLinks.checkEligibility, label: copy.finalPrimary }}
            secondaryAction={{ href: routeLinks.forCompanies, label: copy.finalSecondary }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
