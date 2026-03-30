import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Building2, FileCheck2, MessagesSquare, ShieldCheck } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { MeetingSchedulerCard } from "@/components/meeting-scheduler-card"
import { PageHero } from "@/components/page-hero"
import { PricingSection } from "@/components/pricing-section"
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
import { getLandingPageBySlug, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const [cmsPage, settings] = await Promise.all([
    getLandingPageBySlug("for-companies"),
    getResolvedSiteSettings(),
  ])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: localizeHref(locale, "/for-companies"),
      keywords: cmsPage.seo.keywords ?? [
        "licensed firms",
        "professional immigration enquiries",
        "advisory practice overview",
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

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "Ù„Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…Ø±Ø®ØµØ© ÙˆØ§Ù„Ù…Ù…Ø§Ø±Ø³Ø§Øª Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±ÙŠØ©"
        : locale === "ru"
          ? "Ð”Ð»Ñ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ„Ð¸Ñ€Ð¼ Ð¸ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº"
          : "For firms",
    description:
      locale === "ar"
        ? "Ù…Ø¯Ø®Ù„ Ù…Ù‡Ù†ÙŠ Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹ Ù„Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…Ø±Ø®ØµØ© ÙˆØ§Ù„Ù…Ù…Ø§Ø±Ø³Ø§Øª Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±ÙŠØ© Ø§Ù„ØªÙŠ ØªØ±ØºØ¨ ÙÙŠ Ù…Ù†Ø§Ù‚Ø´Ø© Ù…Ù†Ø§Ø³Ø¨Ø© ÙˆÙ…Ø­Ø¯Ø¯Ø©."
        : locale === "ru"
          ? "Ð‘Ð¾Ð»ÐµÐµ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ð°Ñ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ Ñ‚Ð¾Ñ‡ÐºÐ° Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ„Ð¸Ñ€Ð¼ Ð¸ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº."
          : "A clearer starting point for licensed firms and advisory practices interested in a more thoughtful professional conversation.",
    path: localizeHref(locale, "/for-companies"),
    keywords: [
        "licensed firms",
        "advisory practices",
        "professional immigration enquiries",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

const trustItems = [
  {
    title: "Structured for specialist firms",
    description: "Designed for licensed practices and specialist teams that value clarity, order, and a more considered professional tone.",
  },
  {
    title: "Private professional discussions",
    description: "The page is designed for serious conversations around working methods, institutional fit, and longer-term relationships.",
  },
  {
    title: "Credible and well positioned",
    description: "The presentation remains premium, specific, and credible for firms making careful decisions.",
  },
  {
    title: "Privacy-aware by design",
    description: "The structure explicitly reassures firms about confidentiality, internal access, and responsible data handling.",
  },
]

const features = [
  {
    icon: Building2,
    title: "Structured enquiry oversight",
    description: "Maintain a clearer view of incoming enquiries, ownership, and internal continuity across the team.",
  },
  {
    icon: FileCheck2,
    title: "Client records and case continuity",
    description: "Keep client notes, jurisdictional context, and case status visible in a way that supports calmer internal coordination.",
  },
  {
    icon: MessagesSquare,
    title: "Internal coordination",
    description: "Keep responsibilities, reminders, and next actions organised across a process that often develops over time.",
  },
  {
    icon: BarChart3,
    title: "Management clarity",
    description: "Give leadership a clearer view of activity, ownership, and continuity without letting reporting become the centre of the experience.",
  },
]

const proofBlocks = [
  "Built around the working rhythm of specialist immigration teams, not generic off-the-shelf structures.",
  "Designed for continuity, discretion, and a more orderly internal process.",
  "Suitable for firms seeking a calmer and more structured way to organise professional discussions.",
]

export default async function ForCompaniesPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const cmsPage = await getLandingPageBySlug("for-companies")
  const copy = {
    heroEyebrow: locale === "ar" ? "Ù„Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…ØªØ®ØµØµØ©" : locale === "ru" ? "Ð”Ð»Ñ Ñ„Ð¸Ñ€Ð¼ Ð¸ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº" : "For licensed firms and advisory practices",
    heroTitle:
      locale === "ar"
        ? "Ù…Ø¯Ø®Ù„ Ù…Ù‡Ù†ÙŠ Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹ Ù„Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…Ø±Ø®ØµØ© ÙˆØ§Ù„Ù…Ù…Ø§Ø±Ø³Ø§Øª Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±ÙŠØ©."
        : locale === "ru"
          ? "Ð‘Ð¾Ð»ÐµÐµ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ð°Ñ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ Ñ‚Ð¾Ñ‡ÐºÐ° Ð²Ñ…Ð¾Ð´Ð° Ð´Ð»Ñ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ñ„Ð¸Ñ€Ð¼ Ð¸ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº."
          : "Start a more focused conversation",
    heroDescription:
      locale === "ar"
        ? "Ø§Ø³ØªØ®Ø¯Ù… Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø© Ø¥Ø°Ø§ ÙƒÙ†Øª ØªÙ…Ø«Ù„ Ø¬Ù‡Ø© Ù…Ù‡Ù†ÙŠØ© ÙˆØªØ¨Ø­Ø« Ø¹Ù† Ù†Ù‚Ø§Ø´ Ø®Ø§Øµ ÙˆØ£ÙƒØ«Ø± ØªÙ†Ø¸ÙŠÙ…Ø§Ù‹ Ø­ÙˆÙ„ Ø§Ù„Ù…Ù„Ø§Ø¡Ù…Ø© ÙˆØ·Ø¨ÙŠØ¹Ø© Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ù…Ø­ØªÙ…Ù„Ø©."
        : locale === "ru"
          ? "Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ ÑÑ‚Ñƒ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñƒ, ÐµÑÐ»Ð¸ Ð²Ñ‹ Ð¿Ñ€ÐµÐ´ÑÑ‚Ð°Ð²Ð»ÑÐµÑ‚Ðµ Ñ„Ð¸Ñ€Ð¼Ñƒ Ð¸ Ñ…Ð¾Ñ‚Ð¸Ñ‚Ðµ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒ Ð±Ð¾Ð»ÐµÐµ Ñ‡Ð°ÑÑ‚Ð½Ñ‹Ð¹ Ð¸ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€ Ð¾ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ñ€Ð¸Ð³Ð¾Ð´Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾Ð³Ð¾ Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ."
          : "We work with a small number of licensed firms and advisory practices looking for a more structured and thoughtful way to engage.\n\nIf you're exploring whether this could fit into your current work, this is a good place to start.",
    bookMeeting: locale === "ar" ? "Ø±ØªÙ‘Ø¨ Ù…Ø­Ø§Ø¯Ø«Ø© Ø®Ø§ØµØ©" : locale === "ru" ? "Ð”Ð¾Ð³Ð¾Ð²Ð¾Ñ€Ð¸Ñ‚ÑŒÑÑ Ð¾ Ñ‡Ð°ÑÑ‚Ð½Ð¾Ð¼ Ð¾Ð±ÑÑƒÐ¶Ð´ÐµÐ½Ð¸Ð¸" : "Start a conversation",
    requestDemo: locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ø¹Ø±Ø¶Ù‹Ø§ Ø®Ø§ØµÙ‹Ø§" : locale === "ru" ? "Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ñ‡Ð°ÑÑ‚Ð½Ñ‹Ð¹ Ð¾Ð±Ð·Ð¾Ñ€" : "Request an overview",
    whatFirms: locale === "ar" ? "ÙƒÙŠÙ ÙŠÙØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù…" : locale === "ru" ? "ÐšÐ°Ðº Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ ÑÑ‚Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð°" : "What this is for",
    crmSaas: locale === "ar" ? "Ù†Ø¸Ø±Ø© Ù…Ù‡Ù†ÙŠØ© Ù…Ù†Ø¸Ù…Ø©" : locale === "ru" ? "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð¾Ð±Ð·Ð¾Ñ€" : "Clarity first",
    crmSaasDesc:
      locale === "ar"
        ? "Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø© ØªÙ…Ù†Ø­Ùƒ Ù‚Ø±Ø§Ø¡Ø© Ø£ÙˆØ¶Ø­ Ù„Ø·Ø¨ÙŠØ¹Ø© Ø§Ù„Ù…Ù†ØµØ©ØŒ ÙˆØ§Ù„Ù†Ø¨Ø±Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ©ØŒ ÙˆÙƒÙŠÙ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠØ¨Ø¯Ø£ Ø§Ù„Ù†Ù‚Ø§Ø´ Ø¨Ø´ÙƒÙ„ Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹."
        : locale === "ru"
          ? "Ð­Ñ‚Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð¿Ð¾Ð¼Ð¾Ð³Ð°ÐµÑ‚ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ð¾ Ð¿Ð¾Ð½ÑÑ‚ÑŒ Ñ…Ð°Ñ€Ð°ÐºÑ‚ÐµÑ€ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹, Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ‚Ð¾Ð½ Ð¸ Ñ‚Ð¾, ÐºÐ°Ðº Ð¼Ð¾Ð¶ÐµÑ‚ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒÑÑ Ð´Ð°Ð»ÑŒÐ½ÐµÐ¹ÑˆÐ¸Ð¹ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€."
          : "Get a clear sense of how this fits into your current workflow before taking anything further.",
    qualifiedLeads: locale === "ar" ? "Ù…Ø­Ø§Ø¯Ø«Ø© Ù…Ù‡Ù†ÙŠØ© Ø£ÙˆØ³Ø¹" : locale === "ru" ? "Ð‘Ð¾Ð»ÐµÐµ ÑˆÐ¸Ñ€Ð¾ÐºÐ¾Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾Ð±ÑÑƒÐ¶Ð´ÐµÐ½Ð¸Ðµ" : "Professional fit",
    qualifiedLeadsDesc:
      locale === "ar"
        ? "Ù‚Ø¯ ØªØ³ØªØ®Ø¯Ù… Ø¨Ø¹Ø¶ Ø§Ù„Ø¬Ù‡Ø§Øª Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù… Ù„ÙÙ‡Ù… Ù…Ø§ Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ù‡Ù†Ø§Ùƒ Ø£Ø±Ø¶ÙŠØ© Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù†Ù‚Ø§Ø´ Ù…Ù‡Ù†ÙŠ Ø£ÙˆØ³Ø¹ Ø¶Ù…Ù† Ø¥Ø·Ø§Ø± Ø£ÙƒØ«Ø± ØªØ­ÙØ¸Ø§Ù‹."
        : locale === "ru"
          ? "ÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ„Ð¸Ñ€Ð¼Ñ‹ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÑŽÑ‚ ÑÑ‚Ñƒ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñƒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÐµÑÑ‚ÑŒ Ð»Ð¸ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ð°Ñ Ð¸ ÑƒÐ¼ÐµÑÑ‚Ð½Ð°Ñ Ð¾ÑÐ½Ð¾Ð²Ð° Ð´Ð»Ñ Ð±Ð¾Ð»ÐµÐµ ÑˆÐ¸Ñ€Ð¾ÐºÐ¾Ð³Ð¾ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€Ð°."
          : "See whether there's a natural alignment in how work is handled and presented.",
    productEyebrow: locale === "ar" ? "Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø©" : locale === "ru" ? "ÐžÐ±Ð·Ð¾Ñ€" : "Overview",
    productTitle:
      locale === "ar"
        ? "Ø¹Ø±Ø¶ Ø£Ù‚Ø±Ø¨ Ø¥Ù„Ù‰ ÙˆØ§Ù‚Ø¹ Ø§Ù„ÙØ±Ù‚ Ø§Ù„Ù…ØªØ®ØµØµØ©."
        : locale === "ru"
          ? "Ð‘Ð¾Ð»ÐµÐµ ÑÑ„Ð¾ÐºÑƒÑÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð¾Ð±Ð·Ð¾Ñ€ Ð´Ð»Ñ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… ÐºÐ¾Ð¼Ð°Ð½Ð´."
          : "A clearer professional view for specialist firms.",
    productDescription:
      locale === "ar"
        ? "ÙŠØ±ÙƒØ² Ø§Ù„Ø¹Ø±Ø¶ Ø¹Ù„Ù‰ Ù…Ø§ ÙŠÙ‡Ù… Ø§Ù„ÙØ±Ù‚ Ø§Ù„Ù…Ù‡Ù†ÙŠØ© ÙØ¹Ù„Ø§Ù‹: ÙˆØ¶ÙˆØ­ Ø§Ù„Ø­Ø§Ù„Ø©ØŒ ÙˆØ³ÙŠØ§Ù‚ Ø§Ù„Ø¹Ù…ÙŠÙ„ØŒ ÙˆØªÙ…Ø§Ø³Ùƒ Ø§Ù„Ø¹Ù…Ù„ Ø¯Ø§Ø®Ù„ Ø§Ù„ÙØ±ÙŠÙ‚."
        : locale === "ru"
          ? "ÐžÐ±Ð·Ð¾Ñ€ Ð¾ÑÑ‚Ð°Ñ‘Ñ‚ÑÑ Ð±Ð»Ð¸Ð·ÐºÐ¸Ð¼ Ðº Ñ‚Ð¾Ð¼Ñƒ, Ñ‡Ñ‚Ð¾ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð²Ð°Ð¶Ð½Ð¾ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¼ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð°Ð¼: ÑÑÐ½Ð¾ÑÑ‚ÑŒ Ð¿Ð¾ ÑÑ‚Ð°Ñ‚ÑƒÑÑƒ, ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð° Ð¸ ÑÐ¾Ð³Ð»Ð°ÑÐ¾Ð²Ð°Ð½Ð½Ð¾ÑÑ‚ÑŒ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÐµÐ¹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹."
          : "This section gives a practical view of what the platform is designed to help a specialist team keep in order. The emphasis stays close to day-to-day realities: client context, adviser responsibility, and continuity of follow-up.",
    partnershipEyebrow: locale === "ar" ? "Ø³ÙŠØ§Ù‚ Ù…Ù‡Ù†ÙŠ" : locale === "ru" ? "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚" : "Professional context",
    partnershipTitle:
      locale === "ar"
        ? "ØªØ¨Ø¯Ø£ Ø¨Ø¹Ø¶ Ø§Ù„Ø¬Ù‡Ø§Øª Ù…Ù† Ù‡Ù†Ø§ Ù„ÙÙ‡Ù… Ù…Ø§ Ø¥Ø°Ø§ ÙƒØ§Ù† Ù‡Ù†Ø§Ùƒ Ø£Ø³Ø§Ø³ Ù…Ù†Ø§Ø³Ø¨ Ù„Ø¹Ù„Ø§Ù‚Ø© Ù…Ù‡Ù†ÙŠØ© Ø£ÙˆØ³Ø¹."
        : locale === "ru"
          ? "ÐÐµÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ñ„Ð¸Ñ€Ð¼Ñ‹ Ð½Ð°Ñ‡Ð¸Ð½Ð°ÑŽÑ‚ Ð·Ð´ÐµÑÑŒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, ÑƒÐ¼ÐµÑÑ‚ÐµÐ½ Ð»Ð¸ Ð±Ð¾Ð»ÐµÐµ ÑˆÐ¸Ñ€Ð¾ÐºÐ¸Ð¹ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚."
          : "Some firms begin here when exploring whether a wider professional collaboration is worth discussing.",
    partnershipDescription:
      locale === "ar"
        ? "Ø§Ù„Ù…Ù‚ØµÙˆØ¯ Ù„ÙŠØ³ ÙØªØ­ Ù…Ø³Ø§Ø± ØªØ¬Ø§Ø±ÙŠ ØµØ±ÙŠØ­ØŒ Ø¨Ù„ Ù…Ø¹Ø±ÙØ© Ù…Ø§ Ø¥Ø°Ø§ ÙƒØ§Ù†Øª Ù‡Ù†Ø§Ùƒ Ù…Ù†Ø§Ø³Ø¨Ø© Ù…Ù‡Ù†ÙŠØ© Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù„Ù†Ù‚Ø§Ø´ Ø£ÙƒØ«Ø± ØªØ­Ø¯ÙŠØ¯Ø§Ù‹."
        : locale === "ru"
          ? "Ð ÐµÑ‡ÑŒ Ð½Ðµ Ð¾ Ð¿Ñ€ÑÐ¼Ð¾Ð¹ ÐºÐ¾Ð¼Ð¼ÐµÑ€Ñ‡ÐµÑÐºÐ¾Ð¹ Ð¿Ð¾Ð´Ð°Ñ‡Ðµ, Ð° Ð¾ Ð¿Ð¾Ð½Ð¸Ð¼Ð°Ð½Ð¸Ð¸ Ñ‚Ð¾Ð³Ð¾, ÐµÑÑ‚ÑŒ Ð»Ð¸ Ñ€ÐµÐ°Ð»ÑŒÐ½Ð°Ñ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ ÑƒÐ¼ÐµÑÑ‚Ð½Ð¾ÑÑ‚ÑŒ Ð´Ð»Ñ Ð±Ð¾Ð»ÐµÐµ Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚Ð½Ð¾Ð³Ð¾ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€Ð°."
          : "The wider platform can support a more structured conversation around presentation, working methods, and how introductions may be handled where appropriate. Read this section as context for the type of professional discussion that may follow, rather than as a direct commercial pitch.",
    companyFormEyebrow: locale === "ar" ? "Ù†Ù…ÙˆØ°Ø¬ Ù„Ù„Ø´Ø±ÙƒØ§Øª" : locale === "ru" ? "Ð¤Ð¾Ñ€Ð¼Ð° Ð´Ð»Ñ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾Ð±ÑÑƒÐ¶Ð´ÐµÐ½Ð¸Ñ" : "Professional discussion form",
    companyFormTitle:
      locale === "ar" ? "Ø´Ø§Ø±ÙƒÙ†Ø§ Ø¨Ù…Ø§ ØªÙ†Ø¸Ø± ÙÙŠÙ‡ Ø´Ø±ÙƒØªÙƒ Ø§Ù„Ø¢Ù†." : locale === "ru" ? "ÐŸÐ¾Ð´ÐµÐ»Ð¸Ñ‚ÐµÑÑŒ Ñ‚ÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð²Ð°ÑˆÐ° Ñ„Ð¸Ñ€Ð¼Ð° Ñ€Ð°ÑÑÐ¼Ð°Ñ‚Ñ€Ð¸Ð²Ð°ÐµÑ‚ ÑÐµÐ¹Ñ‡Ð°Ñ." : "Outline what your firm is considering.",
    companyFormDescription:
      locale === "ar"
        ? "Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ Ø¥Ø°Ø§ ÙƒÙ†Øª ØªØ±ØºØ¨ ÙÙŠ Ù…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ø³ÙŠØ§Ù‚ Ø§Ù„Ø­Ø§Ù„ÙŠ Ù„ÙØ±ÙŠÙ‚Ùƒ ÙˆØ¨Ø¯Ø¡ Ù†Ù‚Ø§Ø´ Ù…Ù‡Ù†ÙŠ Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹."
        : locale === "ru"
          ? "Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ Ñ„Ð¾Ñ€Ð¼Ñƒ, ÐµÑÐ»Ð¸ Ñ…Ð¾Ñ‚Ð¸Ñ‚Ðµ Ð¾Ð¿Ð¸ÑÐ°Ñ‚ÑŒ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚ ÑÐ²Ð¾ÐµÐ¹ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹ Ð¸ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒ Ð±Ð¾Ð»ÐµÐµ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€."
          : "Use the form if your firm would like to outline the context before a private discussion begins. It is designed to help you describe what you would like to review, and why it matters, in a more orderly way.",
    formTitle: locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ù…Ù†Ø§Ù‚Ø´Ø© Ø®Ø§ØµØ©" : locale === "ru" ? "Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ñ‡Ð°ÑÑ‚Ð½Ð¾Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾Ð±ÑÑƒÐ¶Ð´ÐµÐ½Ð¸Ðµ" : "Request a private discussion",
    formDescription:
      locale === "ar"
        ? "Ø´Ø§Ø±Ùƒ ÙˆØ¶Ø¹ ÙØ±ÙŠÙ‚Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ ÙˆØ³Ù†Ø¹ÙˆØ¯ Ø¥Ù„ÙŠÙƒ Ø¨Ø§Ù„ØµÙˆØ±Ø© Ø£Ùˆ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø£Ù‚Ø±Ø¨ Ù„Ø§Ø­ØªÙŠØ§Ø¬Ùƒ."
        : locale === "ru"
          ? "ÐŸÐ¾Ð´ÐµÐ»Ð¸Ñ‚ÐµÑÑŒ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÐµÐ¼ ÑÐ²Ð¾ÐµÐ¹ ÐºÐ¾Ð¼Ð°Ð½Ð´Ñ‹, Ð¸ Ð¼Ñ‹ Ð²ÐµÑ€Ð½ÐµÐ¼ÑÑ Ñ Ð½Ð°Ð¸Ð±Ð¾Ð»ÐµÐµ Ñ€ÐµÐ»ÐµÐ²Ð°Ð½Ñ‚Ð½Ð¾Ð¹ ÐºÐ¾Ð½Ñ„Ð¸Ð³ÑƒÑ€Ð°Ñ†Ð¸ÐµÐ¹."
          : "Share a little context so the first reply can be shaped around the right professional frame. The aim is to make the opening exchange more relevant, more measured, and easier to continue.",
    submit: locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ù…Ù†Ø§Ù‚Ø´Ø© Ø®Ø§ØµØ©" : locale === "ru" ? "Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ð¾Ð±ÑÑƒÐ¶Ð´ÐµÐ½Ð¸Ðµ" : "Request a discussion",
  }
  const localizedTrustItems =
    locale === "ar"
      ? [
          { title: "Ù…ØµÙ…Ù… Ù„Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…ØªØ®ØµØµØ©", description: "Ù…Ù‡ÙŠØ£ Ù„Ù„Ø¬Ù‡Ø§Øª Ø§Ù„Ù…Ø±Ø®ØµØ© ÙˆØ§Ù„ÙØ±Ù‚ Ø§Ù„Ù…ØªØ®ØµØµØ© Ø§Ù„ØªÙŠ ØªÙØ¶Ù„ Ø§Ù„ÙˆØ¶ÙˆØ­ ÙˆØ§Ù„Ù†Ø¸Ø§Ù… ÙˆÙ†Ø¨Ø±Ø© Ù…Ù‡Ù†ÙŠØ© Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹." },
          { title: "Ù†Ù‚Ø§Ø´Ø§Øª Ù…Ù‡Ù†ÙŠØ© Ø®Ø§ØµØ©", description: "ØªÙ…Ù†Ø­ Ø§Ù„ØµÙØ­Ø© Ù…Ø³Ø§Ø­Ø© Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª Ø¬Ø§Ø¯Ø© Ø­ÙˆÙ„ Ø§Ù„Ù…Ù„Ø§Ø¡Ù…Ø© Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠØ© ÙˆØ·Ø¨ÙŠØ¹Ø© Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ©." },
          { title: "Ø¹Ø±Ø¶ Ù…ÙˆØ«ÙˆÙ‚ ÙˆÙ…ØªÙ…Ø§Ø³Ùƒ", description: "ÙŠØ¨Ù‚Ù‰ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ù…Ø­Ø¯Ø¯Ø§Ù‹ ÙˆÙ‡Ø§Ø¯Ø¦Ø§Ù‹ ÙˆÙ…Ù„Ø§Ø¦Ù…Ø§Ù‹ Ù„Ù„Ø¬Ù‡Ø§Øª Ø§Ù„ØªÙŠ ØªØªØ®Ø° Ù‚Ø±Ø§Ø±Ø§ØªÙ‡Ø§ Ø¨Ø¹Ù†Ø§ÙŠØ©." },
          { title: "ÙŠØ±Ø§Ø¹ÙŠ Ø§Ù„Ø®ØµÙˆØµÙŠØ© Ù…Ù† Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©", description: "ØªÙ… ØªØµÙ…ÙŠÙ… Ø§Ù„Ø¨Ù†ÙŠØ© Ø¨Ù…Ø§ ÙŠØ·Ù…Ø¦Ù† Ø§Ù„ÙØ±Ù‚ Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø¨Ø´Ø£Ù† Ø§Ù„Ø³Ø±ÙŠØ© ÙˆØ§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ù…Ù†Ø¸Ù… ÙˆØ§Ù„ØªØ¹Ø§Ù…Ù„ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ù…Ø¹ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª." },
        ]
      : locale === "ru"
        ? [
            { title: "Ð”Ð»Ñ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº", description: "ÐŸÐ¾Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ Ð»Ð¸Ñ†ÐµÐ½Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¼ Ñ„Ð¸Ñ€Ð¼Ð°Ð¼ Ð¸ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¼ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð°Ð¼, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ Ð²Ð°Ð¶Ð½Ñ‹ ÑÑÐ½Ð¾ÑÑ‚ÑŒ, Ð¿Ð¾Ñ€ÑÐ´Ð¾Ðº Ð¸ Ð±Ð¾Ð»ÐµÐµ ÑÐ´ÐµÑ€Ð¶Ð°Ð½Ð½Ñ‹Ð¹ Ñ‚Ð¾Ð½." },
            { title: "Ð§Ð°ÑÑ‚Ð½Ñ‹Ðµ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€Ñ‹", description: "Ð¡Ñ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° ÑÐ¾Ð·Ð´Ð°Ñ‘Ñ‚ Ð¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÑÑ‚Ð²Ð¾ Ð´Ð»Ñ ÑÐµÑ€ÑŒÑ‘Ð·Ð½Ñ‹Ñ… Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€Ð¾Ð² Ð¾Ð± Ð¸Ð½ÑÑ‚Ð¸Ñ‚ÑƒÑ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ñ€Ð¸Ð³Ð¾Ð´Ð½Ð¾ÑÑ‚Ð¸ Ð¸ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ðµ Ð²Ð·Ð°Ð¸Ð¼Ð¾Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸Ñ." },
            { title: "Ð£Ð±ÐµÐ´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð¸ ÑÐ´ÐµÑ€Ð¶Ð°Ð½Ð½Ð¾", description: "ÐŸÐ¾Ð´Ð°Ñ‡Ð° Ð¾ÑÑ‚Ð°Ñ‘Ñ‚ÑÑ Ð¿Ñ€ÐµÐ¼Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð¹, ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð¾Ð¹ Ð¸ ÑƒÐ¼ÐµÑÑ‚Ð½Ð¾Ð¹ Ð´Ð»Ñ Ñ„Ð¸Ñ€Ð¼, Ð¿Ñ€Ð¸Ð½Ð¸Ð¼Ð°ÑŽÑ‰Ð¸Ñ… Ð²Ð·Ð²ÐµÑˆÐµÐ½Ð½Ñ‹Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ñ." },
            { title: "ÐŸÑ€Ð¸Ð²Ð°Ñ‚Ð½Ð¾ÑÑ‚ÑŒ Ñ ÑÐ°Ð¼Ð¾Ð³Ð¾ Ð½Ð°Ñ‡Ð°Ð»Ð°", description: "Ð¡Ñ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð° Ð¸Ð·Ð½Ð°Ñ‡Ð°Ð»ÑŒÐ½Ð¾ Ð¿Ð¾Ð´Ñ‡Ñ‘Ñ€ÐºÐ¸Ð²Ð°ÐµÑ‚ ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ, Ð¾Ñ€Ð³Ð°Ð½Ð¸Ð·Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ð¸ Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ðµ Ð¾Ð±Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ñ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸." },
          ]
        : trustItems
  const localizedProofBlocks =
    locale === "ar"
      ? [
          "ÙŠØ¹Ø±Ø¶ Ø§Ù„Ù…Ù†ØµØ© Ø¨ØµÙŠØºØ© Ø£Ù‚Ø±Ø¨ Ø¥Ù„Ù‰ ÙˆØ§Ù‚Ø¹ Ø§Ù„Ø¬Ù‡Ø§Øª Ø§Ù„Ù…ØªØ®ØµØµØ©ØŒ Ù„Ø§ Ø¥Ù„Ù‰ Ù‚ÙˆØ§Ù„Ø¨ Ø¹Ø§Ù…Ø© Ø£Ùˆ Ù…Ø¨Ø§Ù„Øº ÙÙŠÙ‡Ø§.",
          "ÙŠØ¹Ø·ÙŠ Ø§Ù†Ø·Ø¨Ø§Ø¹Ø§Ù‹ Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ø§Ù‹ ÙˆØªÙ†Ø¸ÙŠÙ…Ø§Ù‹ Ø­ÙˆÙ„ Ø§Ù„Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªÙŠ ÙŠÙ…ÙƒÙ† Ø£Ù† ØªØ¨Ø¯Ø£ Ø¨Ù‡Ø§ Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© Ø§Ù„Ù…Ù‡Ù†ÙŠØ©.",
          "ÙŠÙÙŠØ¯ Ø§Ù„Ø¬Ù‡Ø§Øª Ø§Ù„ØªÙŠ ØªÙØ¶Ù„ Ø§Ù„ÙˆØ¶ÙˆØ­ ÙˆØ§Ù„Ø®ØµÙˆØµÙŠØ© Ù‚Ø¨Ù„ Ø£ÙŠ Ø®Ø·ÙˆØ© Ø£ÙƒØ«Ø± ØªØ­Ø¯ÙŠØ¯Ø§Ù‹.",
        ]
      : locale === "ru"
        ? [
            "ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñƒ Ð±Ð»Ð¸Ð¶Ðµ Ðº Ñ€ÐµÐ°Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ðº, Ð° Ð½Ðµ Ðº ÑˆÐ°Ð±Ð»Ð¾Ð½Ð½Ñ‹Ð¼ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð²Ñ‹Ð¼ Ð¾Ð±ÐµÑ‰Ð°Ð½Ð¸ÑÐ¼.",
            "Ð¡Ð¾Ð·Ð´Ð°Ñ‘Ñ‚ Ð±Ð¾Ð»ÐµÐµ ÑÐ¿Ð¾ÐºÐ¾Ð¹Ð½Ð¾Ðµ Ð¸ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ðµ Ð²Ð¿ÐµÑ‡Ð°Ñ‚Ð»ÐµÐ½Ð¸Ðµ Ð¾ Ñ‚Ð¾Ð¼, ÐºÐ°Ðº Ð¼Ð¾Ð¶ÐµÑ‚ Ð½Ð°Ñ‡Ð°Ñ‚ÑŒÑÑ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð´Ð¸Ð°Ð»Ð¾Ð³.",
            "ÐŸÐ¾Ð»ÐµÐ·Ð½Ð¾ Ð´Ð»Ñ Ñ„Ð¸Ñ€Ð¼, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼ Ð²Ð°Ð¶Ð½Ñ‹ ÑÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ð¿Ñ€Ð¸Ð²Ð°Ñ‚Ð½Ð¾ÑÑ‚ÑŒ Ð´Ð¾ Ð±Ð¾Ð»ÐµÐµ Ð¿Ñ€ÐµÐ´Ð¼ÐµÑ‚Ð½Ð¾Ð³Ð¾ ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ³Ð¾ ÑˆÐ°Ð³Ð°.",
          ]
        : proofBlocks

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
        primaryAction={{ href: "#meeting", label: copy.bookMeeting }}
        secondaryAction={{ href: ctaLinks.requestDemo, label: copy.requestDemo }}
        stats={[
          { value: "Structure", label: locale === "ar" ? "Ù„Ø¹Ø±Ø¶ ØªØ´ØºÙŠÙ„ÙŠ Ø£ÙƒØ«Ø± ÙˆØ¶ÙˆØ­Ù‹Ø§" : "A clearer way to approach and organise cases" },
          { value: "Discretion", label: locale === "ar" ? "Ù„Ù„Ù†Ù‚Ø§Ø´Ø§Øª Ø§Ù„Ù…Ù‡Ù†ÙŠØ© Ø§Ù„Ù…Ø¯Ø±ÙˆØ³Ø©" : "Conversations that remain measured and controlled" },
          { value: "Fit", label: locale === "ar" ? "Ù„ØªÙ‚Ø¯ÙŠØ± Ø§Ù„Ù…Ù„Ø§Ø¡Ù…Ø© Ø¨Ø´ÙƒÙ„ Ø£Ù‡Ø¯Ø£" : "A better sense of whether working together makes sense" },
        ]}
      >
        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">{copy.whatFirms}</p>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-primary-foreground/70">{copy.crmSaas}</p>
              <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
                {copy.crmSaasDesc}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-primary-foreground/70">{copy.qualifiedLeads}</p>
              <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
                {copy.qualifiedLeadsDesc}
              </p>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container-shell">
          <TrustGrid items={localizedTrustItems} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.productEyebrow}
            title={copy.productTitle}
            description={copy.productDescription}
          />
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="section-card">
                  <CardContent className="space-y-4 p-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="card-title text-foreground">{feature.title}</h3>
                    <p className="fine-print">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="section-card overflow-hidden">
              <CardContent className="space-y-6 p-8">
                <span className="eyebrow">{locale === "ar" ? "Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø©" : "Overview"}</span>
                <h3 className="card-title text-foreground">{locale === "ar" ? "Ø±Ø¤ÙŠØ© Ø£ÙˆØ¶Ø­ Ù„Ø¨ÙŠØ¦Ø© Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„ØªÙŠ ÙŠØ¹ØªÙ…Ø¯ Ø¹Ù„ÙŠÙ‡Ø§ ÙØ±ÙŠÙ‚Ùƒ ÙŠÙˆÙ…ÙŠÙ‹Ø§." : "A clearer view of the environment your team would work within day to day."}</h3>
                <p className="fine-print">
                  {locale === "ar"
                    ? "ÙŠØ±ÙƒØ² Ù‡Ø°Ø§ Ø§Ù„Ø¹Ø±Ø¶ Ø¹Ù„Ù‰ Ù…Ø§ ÙŠÙ‡Ù… Ø§Ù„Ù…Ø´ØªØ±ÙŠ Ø£ÙˆÙ„Ù‹Ø§: Ù…Ù„ÙƒÙŠØ© Ø§Ù„Ø·Ù„Ø¨ØŒ ÙˆØ­Ø§Ù„Ø© Ø§Ù„Ù…Ù„ÙØŒ ÙˆØ§Ù†Ø¶Ø¨Ø§Ø· Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©ØŒ ÙˆÙˆØ¶ÙˆØ­ Ø§Ù„Ø¹Ù…Ù„ Ø¯Ø§Ø®Ù„ Ø§Ù„ÙØ±ÙŠÙ‚."
                    : "The overview focuses on the areas teams usually care about first: ownership, status clarity, internal continuity, and visibility."}
                </p>
                <div className="rounded-[28px] border border-border/70 bg-primary p-6 text-primary-foreground shadow-[0_24px_60px_rgba(20,26,42,0.22)]">
                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/70">
                        <span>{locale === "ar" ? "Ø§Ù„Ù…Ø´Ù‡Ø¯ Ø§Ù„Ø¹Ø§Ù…" : "General overview"}</span>
                        <span>{locale === "ar" ? "12 Ù…Ù„ÙØ§Ù‹ Ù†Ø´Ø·Ø§Ù‹" : "12 active matters"}</span>
                      </div>
                      <div className="space-y-3">
                        {locale === "ar"
                          ? ["Ù…Ø±Ø§Ø¬Ø¹Ø© Ø­Ø§Ù„Ø© Ø¬Ø¯ÙŠØ¯Ø©", "Ù…Ø±Ø§Ø¬Ø¹Ø© Ù…Ø§Ù„Ø·Ø§", "Ù…Ù„Ù Ø¹Ø§Ø¦Ù„ÙŠ Ù„Ù„Ø¨Ø±ØªØºØ§Ù„"].map((row) => (
                              <div key={row} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm">
                                {row}
                              </div>
                            ))
                          : ["New enquiry note", "Malta review", "Portugal family case"].map((row) => (
                          <div key={row} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm">
                            {row}
                          </div>
                            ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">{locale === "ar" ? "Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„ØŒ ÙˆØ§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©ØŒ ÙˆÙ…Ù„ÙƒÙŠØ© Ø§Ù„Ù…Ø³ØªØ´Ø§Ø±" : "Client notes, status, and adviser ownership"}</div>
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">{locale === "ar" ? "Ø±Ø¤ÙŠØ© Ø£ÙˆØ¶Ø­ Ù„Ù„ÙØ±ÙŠÙ‚ ÙˆØªØ°ÙƒÙŠØ±Ø§Øª Ø¨Ø§Ù„Ø®Ø·ÙˆØ§Øª Ø§Ù„ØªØ§Ù„ÙŠØ©" : "Team visibility and next-step reminders"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30" id="lead-partnership">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">{copy.partnershipEyebrow}</span>
            <h2 className="section-title max-w-xl text-foreground">{copy.partnershipTitle}</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {copy.partnershipDescription}
            </p>
            <div className="space-y-4">
              {[ 
                locale === "ar"
                  ? "ØªØ¨Ø¯Ø£ Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø© Ù…Ù† Ù†Ù‚Ø§Ø´ Ù…Ù‡Ù†ÙŠ Ù…Ù†Ø¸Ù… Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† Ø§Ù†ØªÙ‚Ø§Ù„ Ø³Ø±ÙŠØ¹ Ø¥Ù„Ù‰ Ø®Ø·ÙˆØ§Øª ØºÙŠØ± Ù…Ù†Ø§Ø³Ø¨Ø©."
                  : "We begin with a structured professional discussion rather than a rushed introduction.",
                locale === "ar"
                  ? "Ù†Ù†Ø¸Ø± Ø£ÙˆÙ„Ø§Ù‹ Ø¥Ù„Ù‰ Ø§Ù„Ø³ÙŠØ§Ù‚ Ø§Ù„Ø¹Ø§Ù… ÙˆØ§Ù„ØªÙˆÙ‚ÙŠØª ÙˆØ§Ù„Ø£Ù‡Ø¯Ø§Ù Ù‚Ø¨Ù„ Ø§Ù‚ØªØ±Ø§Ø­ Ø£ÙŠ Ø®Ø·ÙˆØ© Ù„Ø§Ø­Ù‚Ø©."
                  : "We consider context, timing, and objectives before suggesting any next step.",
                locale === "ar"
                  ? "Ø¥Ø°Ø§ Ø¨Ø¯Øª Ø§Ù„Ù…Ù„Ø§Ø¡Ù…Ø© Ø­Ù‚ÙŠÙ‚ÙŠØ©ØŒ ÙŠÙ…ÙƒÙ† Ø¹Ù†Ø¯Ù‡Ø§ Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ø¥Ù„Ù‰ Ù†Ù‚Ø§Ø´ Ø£ÙƒØ«Ø± ØªØ­Ø¯ÙŠØ¯Ø§Ù‹."
                  : "If the fit appears genuine, the discussion can then move into a more defined format.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 size-5 text-primary" />
                  <p className="fine-print">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "Ù„Ù…Ø§Ø°Ø§ ØªØ¯Ø®Ù„ Ø§Ù„Ø´Ø±ÙƒØ§Øª Ù‡Ø°Ø§ Ø§Ù„Ù…Ø³Ø§Ø±" : "Why firms begin here"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ù…Ø¨Ù†ÙŠØ© Ø­ÙˆÙ„ Ø§Ù„Ø¬Ø¯ÙŠØ© ÙˆØ§Ù„ØªÙ†Ø¸ÙŠÙ…." : "The experience is built around seriousness, structure, and fit."}</h3>
              <div className="space-y-3">
                {localizedProofBlocks.map((block) => (
                  <div key={block} className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {block}
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                  <Link href={routeLinks.partners}>{locale === "ar" ? "Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ø³ÙŠØ§Ù‚ Ø§Ù„Ù…Ù‡Ù†ÙŠ" : "Explore professional context"}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="meeting" className="section-padding">
        <div className="container-shell">
          <MeetingSchedulerCard
            title="Arrange a private discussion"
            description="Use this section if you would like to arrange an introductory private discussion."
          />
        </div>
      </section>

      <section id="company-form" className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">{copy.companyFormEyebrow}</span>
            <h2 className="section-title max-w-xl text-foreground">{copy.companyFormTitle}</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {copy.companyFormDescription}
            </p>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="company"
            title={copy.formTitle}
            description={copy.formDescription}
            submitLabel={copy.submit}
            source="for-companies"
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Solutions"
            title={locale === "ar" ? "ØªØ³Ø¹ÙŠØ± ÙˆØ§Ø¶Ø­ ÙˆÙ…ÙˆØ«ÙˆÙ‚ Ù„Ù‡ÙŠÙƒÙ„ Ø§Ù„ØªØ¹Ø§Ù…Ù„." : "Clear, credible solutions for a structured working relationship."}
            description={locale === "ar" ? "Ø§Ù„Ø£Ø³Ø¹Ø§Ø± Ù…ØµØ§ØºØ© Ø¨Ø´ÙƒÙ„ ÙˆØ§Ø¶Ø­ØŒ Ù…Ø¹ Ù…Ø±ÙˆÙ†Ø© Ù„Ù„Ù†Ø·Ø§Ù‚ Ø§Ù„Ø£ÙˆØ³Ø¹ Ø¹Ù†Ø¯Ù…Ø§ ÙŠÙƒÙˆÙ† Ø°Ù„Ùƒ Ù…Ù†Ø·Ù‚ÙŠÙ‹Ø§." : "The solutions are presented clearly, with room for broader arrangements where that proves sensible."}
          />
          <PricingSection locale={locale} preview />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª" : "Data protection"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "Ù…ØµÙ…Ù… Ù„Ø¯Ø¹Ù… Ø§Ù„ØªØ¹Ø§Ù…Ù„ Ø§Ù„Ø³Ø±ÙŠ Ù…Ø¹ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡." : "Designed to support confidential client handling."}</h3>
              <p className="fine-print">
                {locale === "ar"
                  ? "ØªÙ… ØªØ£Ø·ÙŠØ± Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ø¨Ù…Ø§ ÙŠØ­ØªØ±Ù… Ø®ØµÙˆØµÙŠØ© Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³ØªØ«Ù…Ø±ÙŠÙ† ÙˆØ§Ù„Ø´Ø±ÙƒØ§ØªØŒ ÙˆÙŠØ¹ØªÙ…Ø¯ Ø¹Ù„Ù‰ ÙˆØµÙˆÙ„ Ù…Ù†Ø¸Ù… ÙˆØªØ¹Ø§Ù…Ù„ Ø¯Ø§Ø®Ù„ÙŠ Ù…Ø³Ø¤ÙˆÙ„."
                  : "The wider structure is framed around responsible handling of investor and company information, restricted access, and a privacy-aware way of working."}
              </p>
              <Button variant="outline" asChild>
                <Link href={routeLinks.dataProtection}>{locale === "ar" ? "Ø§Ù‚Ø±Ø£ Ø³ÙŠØ§Ø³Ø© Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª" : "Read data protection"}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="section-card overflow-hidden p-0">
            <div className="relative h-52">
              <Image
                src={siteImages.businessStreet.src}
                alt={siteImages.businessStreet.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "Ø¹Ø±Ø¶ Ø®Ø§Øµ" : "Private overview"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "Ø¥Ø°Ø§ Ù„Ù… ØªÙƒÙ† ØªØ±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø¹Ø¯ØŒ Ø§Ø¨Ø¯Ø£ Ø¨Ø¹Ø±Ø¶ Ø®Ø§Øµ." : "If you would prefer a calmer first step, begin with a private overview."}</h3>
              <p className="fine-print">
                {locale === "ar"
                  ? "Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„Ø¥Ø±Ø´Ø§Ø¯ÙŠ ÙŠÙ…Ù†Ø­ Ø§Ù„ÙØ±ÙŠÙ‚ ØªØ¬Ø±Ø¨Ø© Ø´Ø±Ø§Ø¡ Ø£ÙˆØ¶Ø­ Ø¹Ù†Ø¯Ù…Ø§ Ù„Ø§ ØªÙƒÙˆÙ† Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ø§Ù„Ø°Ø§ØªÙŠØ© Ù‡ÙŠ Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„Ø£ÙˆÙ„Ù‰ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©."
                  : "A private overview often gives firms a clearer first impression when a direct introduction would feel too abrupt."}
              </p>
              <Button asChild>
                <Link href={ctaLinks.requestDemo}>
                  {locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ø¹Ø±Ø¶Ù‹Ø§ Ø®Ø§ØµÙ‹Ø§" : "Request a private overview"}
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
            eyebrow={locale === "ar" ? "Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„ØªØ§Ù„ÙŠØ©" : "Next step"}
            title={locale === "ar" ? "Ù‡Ù„ ØªØ±ÙŠØ¯ Ø§Ù„Ø§Ø·Ù„Ø§Ø¹ Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø³Ø¹Ø§Ø± Ø£Ùˆ Ø·Ù„Ø¨ Ø¹Ø±Ø¶ Ø®Ø§Øµ Ø£Ùˆ Ù‚Ø±Ø§Ø¡Ø© Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§ØªØŸ" : "Would you prefer to review the solutions, request a private overview, or read about data protection?"}
            description={locale === "ar" ? "ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ø¥Ù„Ù‰ Ø§Ù„Ø£Ø³Ø¹Ø§Ø± Ø£Ùˆ Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„Ø®Ø§Øµ Ø£Ùˆ ØªÙØ§ØµÙŠÙ„ Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ù† Ø¯ÙˆÙ† Ù…ØºØ§Ø¯Ø±Ø© Ù†ÙØ³ Ø§Ù„ØªØ¬Ø±Ø¨Ø© Ø§Ù„Ù…ØªÙ…Ø§Ø³ÙƒØ©." : "You can move into the solutions, a private overview, or data protection detail without leaving the same coherent experience."}
            primaryAction={{ href: ctaLinks.viewPricing, label: locale === "ar" ? "Ø§Ø·Ù„Ø¹ Ø¹Ù„Ù‰ Ø§Ù„Ø®ÙŠØ§Ø±Ø§Øª" : "View solutions" }}
            secondaryAction={{ href: ctaLinks.requestDemo, label: locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ø¹Ø±Ø¶Ù‹Ø§ Ø®Ø§ØµÙ‹Ø§" : "Request a private overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}

