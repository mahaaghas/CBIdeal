import Link from "next/link"
import { Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import {
  getLocalizedFooterCompanyFocus,
  getLocalizedFooterLegalLinks,
  getLocalizedFooterNavLinks,
} from "@/lib/site"
import { getRequestLocale } from "@/lib/i18n/request"
import { getRequestDirection } from "@/lib/i18n/request"
import { getMessages } from "@/lib/i18n/messages"
import { getResolvedSiteSettings } from "@/lib/sanity/content"
import { cn } from "@/lib/utils"

export async function SiteFooter() {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const messages = getMessages(locale)
  const settings = await getResolvedSiteSettings()
  const footerNavLinks = getLocalizedFooterNavLinks(locale)
  const footerLegalLinks = getLocalizedFooterLegalLinks(locale)
  const footerCompanyFocus = getLocalizedFooterCompanyFocus(locale)
  const socialItems = [
    { href: settings.socialLinks.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: settings.socialLinks.x, label: "X" },
    { href: settings.socialLinks.instagram, label: "Instagram" },
  ]

  return (
    <footer className="mt-10 bg-primary text-primary-foreground">
      <div className="container-shell py-12 md:py-14">
        <div
          className={cn(
            "grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.05fr_0.72fr_0.72fr_0.95fr]",
            isRtl && "text-right",
          )}
        >
          <div className="space-y-4">
            <BrandMark muted />
            <p className="max-w-sm text-sm leading-7 text-primary-foreground/75">
              {settings.footerSummary}
            </p>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{messages.footer.follow}</p>
              <div className={cn("flex flex-wrap gap-3 text-sm text-primary-foreground/75", isRtl && "flex-row-reverse justify-end")}>
                {socialItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:border-white/20 hover:text-primary-foreground",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    {"icon" in item && item.icon ? <item.icon className="size-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{messages.footer.explore}</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{messages.footer.commercialFocus}</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              {footerCompanyFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{messages.footer.legalAndContact}</h3>
              <ul className="space-y-3 text-sm text-primary-foreground/75">
                {footerLegalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="space-y-3.5 text-sm text-primary-foreground/75">
              <li className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                <Mail className="mt-0.5 size-4" />
                <Link href={`mailto:${settings.salesEmail}`} className="hover:text-primary-foreground">
                  {settings.salesEmail}
                </Link>
              </li>
              <li className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                <Phone className="mt-0.5 size-4" />
                <Link href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-primary-foreground">
                  {settings.phone}
                </Link>
              </li>
              <li className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                <MapPin className="mt-0.5 size-4" />
                <span>{settings.location}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-b border-white/10 py-5">
          <p className="max-w-5xl text-sm leading-7 text-primary-foreground/70">
            We comply with EU regulations, AML/KYC standards, and international sanctions. Services are not offered to sanctioned individuals or entities.
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col gap-3 pt-6 text-sm text-primary-foreground/60 lg:flex-row lg:items-center lg:justify-between",
            isRtl && "lg:flex-row-reverse lg:text-right",
          )}
        >
          <p>{settings.footerBottomPrimary}</p>
          <p>{settings.footerBottomSecondary}</p>
        </div>
      </div>
    </footer>
  )
}
