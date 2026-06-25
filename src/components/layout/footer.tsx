import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { InstagramIcon, FacebookIcon, XIcon, YoutubeIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { siteConfig } from "@/config/site";
import { footerNav, routes } from "@/config/navigation";

const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon, href: siteConfig.social.instagram },
  { key: "facebook", label: "Facebook", icon: FacebookIcon, href: siteConfig.social.facebook },
  { key: "x", label: "X", icon: XIcon, href: siteConfig.social.x },
  { key: "youtube", label: "YouTube", icon: YoutubeIcon, href: siteConfig.social.youtube },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinIcon, href: siteConfig.social.linkedin },
] as const;

function SocialLinks() {
  return (
    <div className="mt-6 flex items-center gap-2.5">
      {SOCIALS.map(({ key, label, icon: Icon, href }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-gold-600 hover:text-charcoal-950"
          >
            <Icon size={17} />
          </a>
        ) : (
          <span
            key={key}
            aria-disabled="true"
            title={`${label} — Yakında`}
            className="grid h-9 w-9 cursor-not-allowed place-items-center rounded-full bg-white/5 text-white/25"
          >
            <Icon size={17} />
          </span>
        ),
      )}
    </div>
  );
}
import { featuredServices } from "@/config/services";
import { featuredCities } from "@/config/cities";
import { Logo } from "./logo";
import { DevCredit } from "./dev-credit";
import { CookiePreferencesButton } from "@/components/consent/cookie-preferences-button";

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/65 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getPublicSettings();
  return (
    <footer className="bg-charcoal-950 text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo brandName={settings.brandName} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Hasarlı, kazalı, pert, arızalı, yanmış, sel hasarlı ve hurda
            araçlarınızı bulunduğunuz yerden değerlendiriyor; güvenli ve şeffaf
            bir süreç sunuyoruz.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <a href={telHref(settings)} data-track="phone_click" data-track-location="footer" className="flex items-center gap-3 text-white/80 hover:text-white">
              <Phone size={18} className="text-gold-600" />
              {settings.phoneDisplay}
            </a>
            <a
              href={whatsappHref(settings)}
              data-track="whatsapp_click"
              data-track-location="footer"
              className="flex items-center gap-3 text-white/80 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={18} className="text-whatsapp" />
              WhatsApp ile yazın
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/80 hover:text-white">
              <Mail size={18} className="text-gold-600" />
              {settings.email}
            </a>
            <p className="flex items-center gap-3 text-white/60">
              <Clock size={18} className="text-gold-600" />
              {settings.workingHours}
            </p>
          </div>
          <SocialLinks />
        </div>

        <div className="lg:col-span-2">
          <FooterCol title="Hızlı Bağlantılar">
            {footerNav.quickLinks.map((l) => (
              <FLink key={l.href} href={l.href}>
                {l.label}
              </FLink>
            ))}
          </FooterCol>
        </div>

        <div className="lg:col-span-3">
          <FooterCol title="Hizmetlerimiz">
            {featuredServices.slice(0, 7).map((s) => (
              <FLink key={s.slug} href={routes.service(s.slug)}>
                {s.title}
              </FLink>
            ))}
          </FooterCol>
        </div>

        <div className="lg:col-span-3">
          <FooterCol title="Hizmet Bölgeleri">
            {featuredCities.slice(0, 8).map((c) => (
              <FLink key={c.slug} href={routes.city(c.slug)}>
                {c.name}
              </FLink>
            ))}
            <FLink href={routes.serviceAreas}>Tüm Hizmet Bölgeleri</FLink>
          </FooterCol>
        </div>
      </div>

      {/* Deep-burgundy lower band */}
      <div className="bg-burgundy-900">
        <div className="container-page flex flex-col gap-5 pt-5 pb-24 text-sm text-white/70 lg:pb-5">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>
              © {year} {settings.brandName}. Tüm hakları saklıdır.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>
          <div className="flex justify-center border-t border-white/10 pt-5">
            <DevCredit />
          </div>
        </div>
      </div>
    </footer>
  );
}
