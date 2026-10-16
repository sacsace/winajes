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

  const links = ['about', 'team', 'services', 'projects', 'gallery', 'performance', 'clients', 'news', 'contact'] as const;

  return (
    <footer className="relative border-t border-border bg-surface text-foreground">
      <Container className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo variant="onLight" showTagline className="mb-6" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t('description')}</p>
            <a
              href="/downloads/winajes-company-profile.pdf"
              className="mt-6 inline-flex items-center gap-2 border border-primary/20 bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <Download className="h-4 w-4" />
              {t('downloadProfile')}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="mb-5 text-[13px] font-semibold text-primary/70">
                {t('quickLinks')}
              </h3>
              <ul className="space-y-3">
                {links.map((key) => (
                  <li key={key}>
                    <Link
                      href={`/${key}`}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {tNav(key)}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-[13px] font-semibold text-primary/70">
                {t('services')}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Mechanical / Piping</li>
                <li>HVAC & Utility</li>
                <li>Electrical Engineering</li>
                <li>Fire Protection</li>
                <li>IT & Network</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-[13px] font-semibold text-primary/70">
                {t('contact')}
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
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
              <Button href="/contact" variant="primary" size="sm" className="mt-6">
                {tNav('contact')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
            <span>{t('copyright', { year })}</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <a href="/admin" className="transition-colors hover:text-primary">
              {t('admin')}
            </a>
          </p>
          <p className="text-center sm:text-right">
            Developed by{' '}
            <a
              href="https://www.msventures.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-colors hover:text-secondary"
            >
              Minsub Ventures
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
