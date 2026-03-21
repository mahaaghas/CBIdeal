import Link from "next/link"
import { Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import {
  footerCompanyFocus,
  footerLegalLinks,
  footerNavLinks,
} from "@/lib/site"
import { getResolvedSiteSettings } from "@/lib/sanity/content"

export async function SiteFooter() {
  const settings = await getResolvedSiteSettings()
  const socialItems = [
    { href: settings.socialLinks.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: settings.socialLinks.x, label: "X" },
    { href: settings.socialLinks.instagram, label: "Instagram" },
  ]

  return (
    <footer className="mt-10 bg-primary text-primary-foreground">
      <div className="container-shell py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.05fr_0.72fr_0.72fr_0.95fr]">
          <div className="space-y-5">
            <BrandMark muted />
            <p className="max-w-sm text-sm leading-7 text-primary-foreground/75">
              {settings.footerSummary}
            </p>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Follow</p>
              <div className="flex flex-wrap gap-3 text-sm text-primary-foreground/75">
                {socialItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:border-white/20 hover:text-primary-foreground"
                  >
                    {"icon" in item && item.icon ? <item.icon className="size-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Explore</h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Commercial focus</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              {footerCompanyFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">Legal and contact</h3>
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
            <ul className="space-y-4 text-sm text-primary-foreground/75">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4" />
                <Link href={`mailto:${settings.salesEmail}`} className="hover:text-primary-foreground">
                  {settings.salesEmail}
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4" />
                <Link href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-primary-foreground">
                  {settings.phone}
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4" />
                <span>{settings.location}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-sm text-primary-foreground/60 lg:flex-row lg:items-center lg:justify-between">
          <p>{settings.footerBottomPrimary}</p>
          <p>{settings.footerBottomSecondary}</p>
        </div>
      </div>
    </footer>
  )
}
