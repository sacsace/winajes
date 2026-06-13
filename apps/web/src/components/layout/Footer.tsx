'use client';

import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Link } from '@/i18n/navigation';
import { MapPin, Phone, Mail, Download, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  const links = ['about', 'team', 'services', 'projects', 'performance', 'clients', 'news', 'contact'] as const;

  return (
    <footer className="relative bg-primary text-white">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />

      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo variant="onDark" showTagline className="mb-6" />
            <p className="max-w-sm text-sm leading-relaxed text-white/65">{t('description')}</p>
            <a
              href="/downloads/winajes-company-profile.pdf"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              {t('downloadProfile')}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="mb-5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
                {t('quickLinks')}
              </h3>
              <ul className="space-y-3">
                {links.map((key) => (
                  <li key={key}>
                    <Link
                      href={`/${key}`}
                      className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {tNav(key)}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
                {t('services')}
              </h3>
              <ul className="space-y-3 text-sm text-white/65">
                <li>Mechanical / Piping</li>
                <li>HVAC & Utility</li>
                <li>Electrical Engineering</li>
                <li>Fire Protection</li>
                <li>IT & Network</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
                {t('contact')}
              </h3>
              <ul className="space-y-4 text-sm text-white/65">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  Sriperumbudur, Tamil Nadu, India
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  +91-8939011222
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  info@winajes.com
                </li>
              </ul>
              <Button href="/contact" variant="outline" size="sm" className="mt-6 border-white/25">
                {tNav('contact')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t('copyright', { year })}</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <a
              href="/admin"
              className="text-white/35 transition-colors hover:text-white/65"
            >
              {t('admin')}
            </a>
          </p>
          <p className="tracking-wide uppercase">MEP · HVAC · Industrial Construction</p>
        </div>
      </Container>
    </footer>
  );
}
